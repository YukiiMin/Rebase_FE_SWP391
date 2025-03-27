import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { TokenUtils } from "../utils/TokenUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";

function AddShift({ setIsOpen, open, onScheduleAdded }) {
	const navigate = useNavigate();
	const token = TokenUtils.getToken();
	const api = "http://localhost:8080";

	const [staffs, setStaffs] = useState([]);
	const [chosenStaff, setChosenStaff] = useState([]);
	const [staffError, setStaffError] = useState();
	const [apiError, setApiError] = useState("");

	const [repeat, setRepeat] = useState(false);

	const validation = Yup.object({
		scheduleName: Yup.string().required("Schedule name is required"),
		shiftType: Yup.string().required("Choose a shift type"),
		//Bat buoc co startDate, khong duoc chon ngay trong qua khu
		startDate: Yup.date()
			.transform((currentValue, originalValue) => {
				return originalValue ? new Date(originalValue) : null;
			})
			.nullable()
			.required("Start date is required")
			.min(new Date(new Date().setDate(new Date().getDate())), "Start date cannot be today or before"),
		//Bat buoc co endDate, phai sau startDate, cach startDate khong qua 1 nam (tranh viec fetching qua dai)
		endDate: Yup.date()
			.transform((currentValue, originalValue) => {
				return originalValue ? new Date(originalValue) : null;
			})
			.nullable()
			.required("End date is required")
			.when("startDate", (startDate, schema) => {
				return schema
					.test("endDate-after-startDate", "End date cannot be sooner than start date", function (endDate) {
						const { startDate: startDateValue } = this.parent;
						if (!startDateValue || !endDate) {
							return true;
						}
						return new Date(endDate) >= new Date(startDateValue);
					})
					.test("endDate-within-one-year", "End date must be within one year of start date", function (endDate) {
						const { startDate: startDateValue } = this.parent;
						if (!startDateValue || !endDate) {
							return true;
						}
						const oneYearLater = new Date(startDateValue);
						oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

						return new Date(endDate) <= oneYearLater;
					});
			}),
	});

	const formik = useFormik({
		initialValues: {
			scheduleName: "",
			shiftType: "",
			startDate: "",
			endDate: "",
			repeat: false,
			repeatDays: [],
		},
		onSubmit: (values) => {
			if (chosenStaff.length == 0) {
				setStaffError("Choose at least 1 staff!!!");
				return;
			}
			
			setApiError("");
			handleAddShift(values);
		},
		validationSchema: validation,
	});

	const handleClose = () => setIsOpen(false); //Close modal

	const handleRepeat = (checked) => {
		setRepeat(checked);
		formik.setFieldValue("repeat", checked);
	};

	//Handle format date error
	const handleStartDateChange = (e) => {
		formik.setFieldValue("startDate", e.target.value);
	};
	const handleEndDateChange = (e) => {
		formik.setFieldValue("endDate", e.target.value);
	};

	//Function handle changing repeat day for formik
	const handleDayChange = (day, checked) => {
		const repeatDays = [...formik.values.repeatDays];
		const index = repeatDays.indexOf(day);
		if (checked && index === -1) {
			repeatDays.push(day);
		} else if (!checked && index !== -1) {
			repeatDays.splice(index, 1);
		}
		formik.setFieldValue("repeatDays", repeatDays);
	};

	//Creating work shift
	const handleAddShift = async (values) => {
		try {
			console.log("Creating schedule with values:", values);
			const startDate = new Date(values.startDate);
			const endDate = new Date(values.endDate);
			
			const response = await fetch(`${api}/working/schedule/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify(values),
			});
			
			if (response.ok) {
				const data = await response.json();
				const schedule = data.result;
				console.log("Schedule created successfully:", schedule);
				alert("Adding shift successful! Now adding staffs to shift");
				await handleAddStaff(schedule);
				
				// Gọi callback để thông báo đã thêm lịch thành công
				if (onScheduleAdded) {
					onScheduleAdded();
				}
				
				handleClose();
			} else {
				const errorData = await response.json().catch(() => ({}));
				console.error("Adding shift error:", response.status, errorData);
				setApiError(`Failed to create schedule: ${errorData.message || response.statusText || "Unknown error"}`);
			}
		} catch (err) {
			console.error("Error creating schedule:", err);
			setApiError(`An error occurred: ${err.message || "Unknown error"}`);
		}
	};

	const handleAddStaff = async (schedule) => {
		try {
			let success = true;
			setApiError("");
			
			if (!schedule || !schedule.workDates) {
				setApiError("No work dates found in schedule");
				return false;
			}
			
			const shift = schedule.workDates;
			console.log("Adding staff to workdates:", shift);
			
			// Sử dụng Promise.all để xử lý tất cả các request cùng lúc
			const promises = [];
			
			for (const day of shift) {
				for (const man of chosenStaff) {
					console.log(`Adding staff ${man.accountId} to work day ${day.id}`);
					
					try {
						const response = await fetch(`${api}/working/detail/${day.id}/${man.accountId}`, {
							method: "POST",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-type": "application/json",
							},
						});
						
						if (response.ok) {
							console.log(`Successfully added staff ${man.accountId} to day ${day.id}`);
						} else {
							const data = await response.json().catch(() => ({}));
							console.error(`Failed to add staff ${man.accountId} to day ${day.id}:`, data);
							success = false;
							setApiError(`Failed to add staff to workday: ${data.message || response.statusText || "Unknown error"}`);
						}
					} catch (error) {
						console.error("Error adding staff to workday:", error);
						success = false;
						setApiError(`Error adding staff to workday: ${error.message || "Unknown error"}`);
					}
				}
			}
			
			if (success) {
				alert("Adding all staffs to schedule success");
				handleClose();
				return true;
			}
			
			return false;
		} catch (err) {
			console.error("Something went wrong when adding staffs to schedule:", err);
			setApiError(`Error adding staff to schedule: ${err.message || "Unknown error"}`);
			return false;
		}
	};

	//Get all account which have role == STAFF
	const fetchStaff = async () => {
		try {
			const response = await fetch(`${api}/users/getAllUser`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				const staffList = data.result.filter(user => user.roleName === "DOCTOR" || user.roleName === "NURSE");
				setStaffs(staffList);
			} else {
				console.error("Fetching account failed: ", response.status);
				setApiError("Failed to fetch staff list");
			}
		} catch (err) {
			console.error("Something went wrong when fetching:", err);
			setApiError(`Error fetching staff list: ${err.message || "Unknown error"}`);
		}
	};

	//Xử lý check/uncheck nhân viên
	const handleStaffSelection = (staff) => {
		const isSelected = chosenStaff.find(s => s.accountId === staff.accountId);
		
		if (isSelected) {
			setChosenStaff(chosenStaff.filter(s => s.accountId !== staff.accountId));
		} else {
			setChosenStaff([...chosenStaff, staff]);
		}
		
		// Clear staff error when a staff is selected
		if (staffError && !isSelected) {
			setStaffError("");
		}
	};

	//On load component
	useEffect(() => {
		fetchStaff();
	}, []);

	//For debug
	useEffect(() => {
		console.log("Selected staff:", chosenStaff);
	}, [chosenStaff]);

	const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Add Work Schedule</DialogTitle>
				</DialogHeader>
				
				{apiError && (
					<Alert variant="destructive" className="mb-4">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{apiError}</AlertDescription>
					</Alert>
				)}
				
				<form onSubmit={formik.handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="scheduleName">Schedule Name</Label>
							<Input
								id="scheduleName"
								name="scheduleName"
								value={formik.values.scheduleName}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder="Enter schedule name"
							/>
							{formik.touched.scheduleName && formik.errors.scheduleName && (
								<p className="text-sm text-red-500">{formik.errors.scheduleName}</p>
							)}
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="shiftType">Shift Type</Label>
							<Select 
								name="shiftType" 
								onValueChange={(value) => formik.setFieldValue("shiftType", value)}
								value={formik.values.shiftType}
							>
								<SelectTrigger id="shiftType">
									<SelectValue placeholder="Select shift type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="MORNING">Morning Shift (7:00 - 12:00)</SelectItem>
									<SelectItem value="AFTERNOON">Afternoon Shift (13:00 - 17:00)</SelectItem>
									<SelectItem value="EVENING">Evening Shift (18:00 - 23:00)</SelectItem>
								</SelectContent>
							</Select>
							{formik.touched.shiftType && formik.errors.shiftType && (
								<p className="text-sm text-red-500">{formik.errors.shiftType}</p>
							)}
						</div>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="startDate">Start Date</Label>
							<Input
								id="startDate"
								name="startDate"
								type="date"
								value={formik.values.startDate}
								onChange={handleStartDateChange}
								onBlur={formik.handleBlur}
							/>
							{formik.touched.startDate && formik.errors.startDate && (
								<p className="text-sm text-red-500">{formik.errors.startDate}</p>
							)}
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="endDate">End Date</Label>
							<Input
								id="endDate"
								name="endDate"
								type="date"
								value={formik.values.endDate}
								onChange={handleEndDateChange}
								onBlur={formik.handleBlur}
							/>
							{formik.touched.endDate && formik.errors.endDate && (
								<p className="text-sm text-red-500">{formik.errors.endDate}</p>
							)}
						</div>
					</div>
					
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Switch
								id="repeat"
								checked={repeat}
								onCheckedChange={handleRepeat}
							/>
							<Label htmlFor="repeat">Repeat on specific days of the week</Label>
						</div>
						
						{repeat && (
							<div className="mt-4 grid grid-cols-3 md:grid-cols-7 gap-2">
								{days.map((day) => (
									<div key={day} className="flex items-center space-x-2">
										<Checkbox
											id={day}
											checked={formik.values.repeatDays.includes(day)}
											onCheckedChange={(checked) => handleDayChange(day, checked)}
										/>
										<Label htmlFor={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</Label>
									</div>
								))}
							</div>
						)}
					</div>
					
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-medium">Select Staff for Schedule</h3>
							{staffError && <p className="text-sm text-red-500">{staffError}</p>}
						</div>
						
						<div className="border rounded-lg">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-12">
											<span className="sr-only">Select</span>
										</TableHead>
										<TableHead>Staff ID</TableHead>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Phone</TableHead>
										<TableHead>Role</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{staffs.map((staff) => (
										<TableRow key={staff.accountId} className="cursor-pointer hover:bg-gray-50" onClick={() => handleStaffSelection(staff)}>
											<TableCell>
												<Checkbox
													checked={chosenStaff.some(s => s.accountId === staff.accountId)}
													onCheckedChange={(checked) => {
														if (checked) {
															handleStaffSelection(staff);
														} else {
															handleStaffSelection(staff);
														}
													}}
												/>
											</TableCell>
											<TableCell>{staff.accountId}</TableCell>
											<TableCell>{staff.firstName} {staff.lastName}</TableCell>
											<TableCell>{staff.email}</TableCell>
											<TableCell>{staff.phone}</TableCell>
											<TableCell>{staff.roleName}</TableCell>
										</TableRow>
									))}
									{staffs.length === 0 && (
										<TableRow>
											<TableCell colSpan={6} className="text-center py-4 text-gray-500">
												No staff available or failed to load staff list
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
					
					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose} className="mr-2">
							Cancel
						</Button>
						<Button type="submit">
							Create Schedule
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddShift;
