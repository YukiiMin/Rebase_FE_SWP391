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
import { apiService } from "../../api";

function AddShift({ setIsOpen, open, onScheduleAdded }) {
	const navigate = useNavigate();
	const token = TokenUtils.getToken();

	const [staffs, setStaffs] = useState([]);
	const [chosenStaff, setChosenStaff] = useState([]);
	const [staffError, setStaffError] = useState();
	const [apiError, setApiError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const [repeat, setRepeat] = useState(false);

	// Add debugging state
	const [debugInfo, setDebugInfo] = useState(null);
	const isDevelopment = process.env.NODE_ENV === 'development';

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
		setSubmitting(true);
		setError(null);
		setSuccess(false); // Reset success state
		setDebugInfo(null);
		
		try {
			// Format days of week to match API expectations
			const weekdays = formik.values.repeatDays.map((day) => {
				switch (day) {
					case "MONDAY": return 1;
					case "TUESDAY": return 2;
					case "WEDNESDAY": return 3;
					case "THURSDAY": return 4;
					case "FRIDAY": return 5;
					case "SATURDAY": return 6;
					case "SUNDAY": return 0;
					default: return 0;
				}
			});
			
			// Format dates as ISO strings instead of Date objects
			const startDate = new Date(values.startDate);
			const endDate = new Date(values.endDate);
			
			// Create schedule request object
			const scheduleRequest = {
				scheduleName: values.scheduleName,
				shiftType: values.shiftType,
				startDate: startDate.toISOString().split('T')[0],
				endDate: endDate.toISOString().split('T')[0],
				repeatPattern: values.repeat,
				weekdays: values.repeat ? weekdays : [],
				staffIds: chosenStaff.map(staff => staff.accountId)  // Include staff IDs directly here
			};
			
			console.log("Sending schedule request:", scheduleRequest);
			
			// Create schedule
			const response = await apiService.working.createSchedule(scheduleRequest);
			console.log("Schedule creation response:", response);
			
			// Store debug info
			if (isDevelopment) {
				setDebugInfo({
					statusCode: response.status,
					response: response.data,
					requestData: scheduleRequest
				});
			}
			
			// Check if the response might be a misinterpreted error message
			if (response.data && typeof response.data === 'string' && response.data.toLowerCase().includes('error')) {
				setError(response.data);
				return;
			}
			
			if (response.status === 200 && response.data) {
				// Check if there's an error message in the response despite the 200 status
				if (response.data.error || (response.data.code && response.data.code !== 200 && response.data.code !== 201)) {
					setError(response.data.message || "An error occurred during schedule creation");
					return;
				}
				
				// Show success message
				setSuccess(true);
				
				// Call onScheduleAdded callback if provided
				if (onScheduleAdded) {
					onScheduleAdded(response.data.data || response.data.result);
				}
				
				setTimeout(() => {
					handleClose();
				}, 2000);
			} else {
				setError((response.data && response.data.message) || "Failed to create schedule. Please try again.");
			}
		} catch (err) {
			console.error("Error creating schedule:", err);
			console.error("Error details:", {
				message: err.message,
				stack: err.stack,
				response: err.response?.data
			});
			
			// Store debug info for error case
			if (isDevelopment) {
				setDebugInfo({
					error: true,
					message: err.message,
					responseData: err.response?.data,
					requestData: scheduleRequest
				});
			}
			
			setError(err.response?.data?.message || "An error occurred while creating the schedule.");
		} finally {
			setSubmitting(false);
		}
	};

	//Get all account which have role == STAFF
	const fetchStaff = async () => {
		setLoading(true);
		try {
			console.log("AddShift: Fetching staff using apiService...");
			
			// Use apiService instead of direct fetch
			const response = await apiService.users.getAll();
			console.log("AddShift: API Response from apiService:", response);
			
			// Log the full response structure to help debug
			if (response) {
				console.log("Response structure:", {
					status: response.status,
					statusText: response.statusText,
					hasData: !!response.data,
					dataKeys: response.data ? Object.keys(response.data) : [],
				});
				
				if (response.data && response.data.result) {
					const staffList = response.data.result.filter(
						(user) => user.roleName === "DOCTOR" || user.roleName === "NURSE"
					);
					console.log("AddShift: Filtered Staff from apiService:", staffList);
					console.log("Staff count:", staffList.length);
					setStaffs(staffList);
				} else {
					console.log("AddShift: Invalid response structure");
					setApiError("Failed to fetch staff list - invalid response format");
				}
			} else {
				console.log("AddShift: Empty response received");
				setApiError("Failed to fetch staff list - empty response");
			}
		} catch (err) {
			console.error("Error fetching staff:", err);
			console.error("Error details:", {
				message: err.message,
				stack: err.stack,
				response: err.response
			});
			setApiError(`Failed to load staff list: ${err.message}`);
		} finally {
			setLoading(false);
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

				{error && (
					<Alert variant="destructive" className="mb-4">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{success && (
					<Alert variant="default" className="mb-4 bg-green-50 border-green-500 text-green-800">
						<AlertTitle className="text-green-800">Success</AlertTitle>
						<AlertDescription>Đã tạo lịch làm việc thành công</AlertDescription>
					</Alert>
				)}

				{isDevelopment && debugInfo && (
					<div className="mb-4 p-4 border border-gray-300 bg-gray-50 rounded-md">
						<div className="flex justify-between items-center mb-2">
							<h3 className="font-medium">Debug Information</h3>
							<Button 
								type="button" 
								variant="outline" 
								size="sm"
								onClick={() => setDebugInfo(null)}
							>
								Close
							</Button>
						</div>
						<div className="text-xs font-mono overflow-auto max-h-40">
							<pre>{JSON.stringify(debugInfo, null, 2)}</pre>
						</div>
					</div>
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
						<Button type="button" variant="outline" onClick={handleClose} className="mr-2" disabled={submitting}>
							Cancel
						</Button>
						<Button type="submit" disabled={submitting}>
							{submitting ? (
								<>
									<span className="animate-spin mr-2">⏳</span>
									Creating...
								</>
							) : "Create Schedule"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddShift;
