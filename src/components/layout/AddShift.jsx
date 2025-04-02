import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import TokenUtils from "../../utils/TokenUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";

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
		//Bat buoc co startDate, khong duoc chon ngay trong qua khu
		startDate: Yup.date()
			.transform((currentValue, originalValue) => {
				return originalValue ? new Date(originalValue) : null;
			})
			.nullable()
			.required("Start date is required")
			.min(new Date(new Date().setHours(0,0,0,0)), "Start date must be today or after today"),
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
			shiftType: "Regular", // Mặc định là "Regular"
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
			
			// Convert repeatDays to format expected by backend (MON, TUE, etc.)
			const dayMapping = {
				"MONDAY": "MON",
				"TUESDAY": "TUE",
				"WEDNESDAY": "WED",
				"THURSDAY": "THU",
				"FRIDAY": "FRI",
				"SATURDAY": "SAT",
				"SUNDAY": "SUN"
			};
			
			const formattedRepeatDays = values.repeatDays.map(day => dayMapping[day] || day);
			
			// Format request to match backend expectations
			const scheduleRequest = {
				scheduleName: values.scheduleName,
				startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
				endDate: endDate.toISOString().split('T')[0],     // Format as YYYY-MM-DD
				shiftType: "Regular", // Gán cứng shiftType là "Regular"
				repeat: values.repeat,
				repeatDays: values.repeat ? formattedRepeatDays : []
			};
			
			console.log("Sending schedule request:", scheduleRequest);

			const response = await fetch(`${api}/working/schedule/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify(scheduleRequest),
			});

			const data = await response.json();
			console.log("Schedule response:", data);
			
			if (response.ok) {
				const schedule = data.result;
				console.log("Schedule created successfully:", schedule);
				alert("Adding shift successful! Now adding staffs to shift");
				
				if (schedule && schedule.workDates && schedule.workDates.length > 0) {
					await handleAddStaff(schedule);
				} else {
					console.error("No work dates found in schedule response");
					setApiError("No work dates found in schedule response");
				}
				
				// Gọi callback để thông báo đã thêm lịch thành công
				if (onScheduleAdded) {
					onScheduleAdded();
				}
				
				handleClose();
			} else {
				console.error("Adding shift error:", response.status, data);
				setApiError(`Failed to create schedule: ${data.message || response.statusText || "Unknown error"}`);
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
			
			const workDates = schedule.workDates;
			console.log("Adding staff to workdates:", workDates);
			
			// Xử lý tuần tự để tránh lỗi race condition
			for (const workDate of workDates) {
				// Kiểm tra xem workDate có id không
				const dateId = workDate.id;
				if (!dateId) {
					console.error("WorkDate missing id:", workDate);
					continue;
				}
				
				for (const staff of chosenStaff) {
					console.log(`Adding staff ${staff.accountId} to work day ${dateId}`);
					
					try {
						const response = await fetch(`${api}/working/detail/${dateId}/${staff.accountId}`, {
							method: "POST",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-type": "application/json",
							},
						});
						
						if (response.ok) {
							console.log(`Successfully added staff ${staff.accountId} to day ${dateId}`);
						} else {
							const errorData = await response.json().catch(() => ({}));
							console.error(`Failed to add staff ${staff.accountId} to day ${dateId}:`, errorData);
							success = false;
							setApiError(`Failed to add staff to workday: ${errorData.message || response.statusText || "Unknown error"}`);
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
							<div className="text-sm text-gray-600 border rounded-md p-2 bg-gray-50">
								Regular Shift (09:00 - 17:00)
							</div>
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
										<TableRow 
											key={staff.accountId} 
											className="hover:bg-gray-50"
										>
											<TableCell className="w-12">
												<Checkbox
													checked={chosenStaff.some(s => s.accountId === staff.accountId)}
													onCheckedChange={() => handleStaffSelection(staff)}
													onClick={(e) => e.stopPropagation()}
												/>
											</TableCell>
											<TableCell>{staff.accountId}</TableCell>
											<TableCell>
												<div className="font-medium">
													{staff.firstName} {staff.lastName}
												</div>
											</TableCell>
											<TableCell>{staff.email}</TableCell>
											<TableCell>{staff.phone}</TableCell>
											<TableCell>
												<Badge variant="outline" className={`
													${staff.roleName === "DOCTOR" ? "bg-green-100 text-green-800 border-green-200" : ""}
													${staff.roleName === "NURSE" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""}
												`}>
													{staff.roleName}
												</Badge>
											</TableCell>
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
