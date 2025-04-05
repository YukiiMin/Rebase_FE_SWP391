import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
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

function AddStaffToSchedule({ setIsOpen, open, onStaffAdded }) {
	const token = TokenUtils.getToken();

	const [staffs, setStaffs] = useState([]);
	const [chosenStaff, setChosenStaff] = useState([]);
	const [staffError, setStaffError] = useState();
	const [apiError, setApiError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
    
    // Lưu trữ thông tin các lịch làm việc hiện có
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [searchedSchedules, setSearchedSchedules] = useState(false);
    
    // State cho hiển thị lịch
    const [calendarDays, setCalendarDays] = useState([]);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth());
    const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear());
    const [workdateDays, setWorkdateDays] = useState(new Set());
    const [loadingCalendar, setLoadingCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

	const [repeat, setRepeat] = useState(false);

	// Add debugging state
	const [debugInfo, setDebugInfo] = useState(null);
	const isDevelopment = process.env.NODE_ENV === 'development';

	// CSS Style cho container có thanh cuộn
	const scrollableContainerStyle = {
		maxHeight: '400px',
		overflowY: 'auto',
		overflowX: 'auto'
	};

	// CSS Style cho bảng có thanh cuộn
	const tableContainerStyle = {
		maxHeight: '350px',
		overflowY: 'auto',
		overflowX: 'auto'
	};

	// CSS Style cho lịch có thanh cuộn
	const calendarContainerStyle = {
		maxHeight: '400px',
		overflowY: 'auto'
	};

	const validation = Yup.object({
		startDate: Yup.date()
			.transform((currentValue, originalValue) => {
				return originalValue ? new Date(originalValue) : null;
			})
			.nullable()
			.required("Start date is required")
			.min(new Date(new Date().setHours(0,0,0,0)), "Start date must be today or after today"),
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
			startDate: "",
			endDate: "",
			repeat: false,
			repeatDays: [],
		},
		onSubmit: (values) => {
			if (chosenStaff.length === 0) {
				setStaffError("Choose at least 1 staff!");
				return;
			}
			
			setApiError("");
			handleAddStaffToSchedule(values);
		},
		validationSchema: validation,
	});

	const handleClose = () => setIsOpen(false);

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

	//Add staff to existing schedule
	const handleAddStaffToSchedule = async (values) => {
		setSubmitting(true);
		setError(null);
		setSuccess(false);
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
			
			// Format dates as ISO strings
			const startDate = new Date(values.startDate);
			const endDate = new Date(values.endDate);
			
			// Create staff assignment request
			const staffRequest = {
				startDate: startDate.toISOString().split('T')[0],
				endDate: endDate.toISOString().split('T')[0],
				repeatPattern: values.repeat,
				weekdays: values.repeat ? weekdays : [],
				staffIds: chosenStaff.map(staff => staff.accountId)
			};
			
			console.log("Sending staff assignment request:", staffRequest);
			
			// Add staff to schedule
			const response = await apiService.working.addStaff(staffRequest);
			console.log("Staff assignment response:", response);
			
			// Lưu debug info
			if (isDevelopment) {
				setDebugInfo({
					statusCode: response.status,
					response: response.data,
					requestData: staffRequest
				});
			}
			
			// Kiểm tra response
			if (response.data && typeof response.data === 'string' && response.data.toLowerCase().includes('error')) {
				setError(response.data);
				return;
			}
			
			if (response.status === 200 && response.data) {
				// Kiểm tra lỗi trong response
				if (response.data.error || (response.data.code && response.data.code !== 200 && response.data.code !== 201)) {
					setError(response.data.message || "An error occurred while adding staff to schedule");
					return;
				}
				
				// Hiển thị thông báo thành công
				setSuccess(true);
				
				// Gọi callback nếu có
				if (onStaffAdded) {
					onStaffAdded(response.data.data || response.data.result);
				}
				
				setTimeout(() => {
					handleClose();
				}, 2000);
			} else {
				setError((response.data && response.data.message) || "Failed to add staff to schedule. Please try again.");
			}
		} catch (err) {
			console.error("Error adding staff to schedule:", err);
			console.error("Error details:", {
				message: err.message,
				stack: err.stack,
				response: err.response?.data
			});
			
			// Lưu debug info cho trường hợp lỗi
			if (isDevelopment) {
				setDebugInfo({
					error: true,
					message: err.message,
					responseData: err.response?.data,
					requestData: staffRequest
				});
			}
			
			setError(err.response?.data?.message || "An error occurred while adding staff to the schedule.");
		} finally {
			setSubmitting(false);
		}
	};

	// Tạo các ngày cho lịch tháng
	const generateCalendarDays = (month, year) => {
		const firstDay = new Date(year, month, 1).getDay(); // 0 = Chủ Nhật, 1 = Thứ Hai,...
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		
		// Điều chỉnh firstDay để thứ Hai là ngày đầu tuần
		const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
		
		// Mảng lưu trữ tất cả các ngày cần hiển thị
		const days = [];
		
		// Thêm các ngày của tháng trước
		const prevMonthDays = new Date(year, month, 0).getDate();
		for (let i = adjustedFirstDay - 1; i >= 0; i--) {
			days.push({
				day: prevMonthDays - i,
				month: month === 0 ? 11 : month - 1,
				year: month === 0 ? year - 1 : year,
				isCurrentMonth: false
			});
		}
		
		// Thêm các ngày của tháng hiện tại
		for (let i = 1; i <= daysInMonth; i++) {
			days.push({
				day: i,
				month: month,
				year: year,
				isCurrentMonth: true
			});
		}
		
		// Thêm các ngày của tháng sau để điền đủ 6 hàng lịch (42 ngày)
		const remainingDays = 42 - days.length;
		for (let i = 1; i <= remainingDays; i++) {
			days.push({
				day: i,
				month: month === 11 ? 0 : month + 1,
				year: month === 11 ? year + 1 : year,
				isCurrentMonth: false
			});
		}
		
		return days;
	};

	// Xử lý thay đổi tháng trên lịch
	const handleCalendarMonthChange = (increment) => {
		let newMonth = currentCalendarMonth;
		let newYear = currentCalendarYear;
		
		if (increment) {
			newMonth = newMonth + 1;
			if (newMonth > 11) {
				newMonth = 0;
				newYear = newYear + 1;
			}
		} else {
			newMonth = newMonth - 1;
			if (newMonth < 0) {
				newMonth = 11;
				newYear = newYear - 1;
			}
		}
		
		setCurrentCalendarMonth(newMonth);
		setCurrentCalendarYear(newYear);
		
		const days = generateCalendarDays(newMonth, newYear);
		setCalendarDays(days);
		
		// Không cần gọi API lại vì đã có tất cả các ngày làm việc
	};

	// Lấy thông tin các ngày làm việc cho lịch
	const fetchWorkdatesForCalendar = async () => {
		setLoadingCalendar(true);
		try {
			// Sử dụng API mới để lấy tất cả các ngày làm việc trong hệ thống
			const response = await apiService.working.getAllWorkingDates();
			console.log("All working dates:", response);
			
			if (response && response.data) {
				// Xử lý dữ liệu ngày làm việc từ response
				let workDatesData = [];
				
				// Trường hợp 1: Cấu trúc chuẩn với data.result
				if (response.data?.result) {
					workDatesData = response.data.result;
				}
				// Trường hợp 2: Dữ liệu nằm trong data trực tiếp
				else if (Array.isArray(response.data)) {
					workDatesData = response.data;
				}
				
				setAvailableSchedules(workDatesData);
				
				// Lưu lại tất cả các ngày làm việc
				const workdates = new Set();
				
				console.log("Processing work dates data:", workDatesData);
				
				// In ra một số mẫu dữ liệu để debug
				if (workDatesData.length > 0) {
					console.log("Sample work date item:", workDatesData[0]);
					
					// Kiểm tra các trường có sẵn
					const fields = new Set();
					Object.keys(workDatesData[0]).forEach(key => fields.add(key));
					console.log("Available fields:", Array.from(fields));
				}
				
				workDatesData.forEach(workDateItem => {
					// Xử lý các định dạng khác nhau của ngày làm việc
					let workDate = null;
					
					// Cấu trúc từ WorkDateDTO: { dateId, dayWork }
					if (workDateItem.dayWork) {
						workDate = workDateItem.dayWork;
						console.log("Found work date:", workDate);
					}
					// Định dạng camelCase
					else if (workDateItem.day_work) {
						workDate = workDateItem.day_work;
						console.log("Found work date (snake_case):", workDate);
					}
					
					if (workDate) {
						// Đảm bảo định dạng yyyy-mm-dd
						if (workDate.includes('T')) {
							workDate = workDate.split('T')[0];
						}
						workdates.add(workDate);
					}
				});
				
				console.log("Final workdates:", Array.from(workdates));
				setWorkdateDays(workdates);
				setSearchedSchedules(true);
			}
		} catch (err) {
			console.error("Error fetching all working dates:", err);
		} finally {
			setLoadingCalendar(false);
		}
	};

	// Check if a day is a workdate
	const isWorkdate = (day, month, year) => {
		const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		const result = workdateDays.has(date);
		return result;
	};

	//Get all account which have role == STAFF
	const fetchStaff = async () => {
		setLoading(true);
		try {
			console.log("AddStaffToSchedule: Fetching staff using apiService...");
			
			const response = await apiService.users.getAll();
			console.log("API Response from apiService:", response);
			
			if (response && response.data && response.data.result) {
				const staffList = response.data.result.filter(
					(user) => user.roleName === "DOCTOR" || user.roleName === "NURSE"
				);
				console.log("Filtered Staff:", staffList);
				console.log("Staff count:", staffList.length);
				setStaffs(staffList);
			} else {
				console.log("Invalid response structure");
				setApiError("Failed to fetch staff list - invalid response format");
			}
		} catch (err) {
			console.error("Error fetching staff:", err);
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

	// Add useEffect to initialize calendar when component mounts
	useEffect(() => {
		// Fetch staff list
		fetchStaff();
		
		// Thiết lập giá trị ngày mặc định
		const today = new Date();
		const formattedToday = today.toISOString().split('T')[0];
		
		const endOfYear = new Date(today.getFullYear(), 11, 31);
		const formattedEndOfYear = endOfYear.toISOString().split('T')[0];
		
		setSearchStartDate(formattedToday);
		setSearchEndDate(formattedEndOfYear);
		
		// Initialize calendar
		const days = generateCalendarDays(today.getMonth(), today.getFullYear());
		setCalendarDays(days);
		
		// Lấy tất cả các ngày làm việc
		fetchWorkdatesForCalendar();
	}, []);

	const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
	
	// Khi chọn một ngày trên lịch, cập nhật giá trị vào form
	const handleDateClick = (day, month, year) => {
		// Tạo chuỗi ngày ở định dạng yyyy-mm-dd
		const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		
		// Nếu đang chọn ngày kết thúc
		if (isSelectingEndDate) {
			// Kiểm tra xem ngày kết thúc có sau ngày bắt đầu không
			const startDateObj = new Date(selectedDate);
			const endDateObj = new Date(date);
			
			if (endDateObj < startDateObj) {
				// Nếu ngày kết thúc trước ngày bắt đầu, đổi vị trí
				setSelectedEndDate(selectedDate);
				setSelectedDate(date);
				formik.setFieldValue("endDate", selectedDate);
				formik.setFieldValue("startDate", date);
			} else {
				// Ngày kết thúc sau ngày bắt đầu
				setSelectedEndDate(date);
				formik.setFieldValue("endDate", date);
			}
			
			// Đã chọn xong ngày kết thúc
			setIsSelectingEndDate(false);
		} else {
			// Đang chọn ngày bắt đầu
			setSelectedDate(date);
			formik.setFieldValue("startDate", date);
			
			// Sau khi chọn ngày bắt đầu, chuyển sang chọn ngày kết thúc
			setIsSelectingEndDate(true);
		}
	};

	// Kiểm tra xem một ngày có phải là ngày được chọn không
	const isSelectedDate = (day, month, year) => {
		if (!selectedDate) return false;
		
		const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return date === selectedDate;
	};
	
	// Kiểm tra xem một ngày có phải là ngày kết thúc được chọn không
	const isSelectedEndDate = (day, month, year) => {
		if (!selectedEndDate) return false;
		
		const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return date === selectedEndDate;
	};
	
	// Kiểm tra xem một ngày có nằm trong khoảng được chọn không
	const isInSelectedRange = (day, month, year) => {
		if (!selectedDate || !selectedEndDate) return false;
		
		const date = new Date(year, month, day);
		const start = new Date(selectedDate);
		const end = new Date(selectedEndDate);
		
		return date > start && date < end;
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Thêm Nhân Viên Vào Lịch Làm Việc</DialogTitle>
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
						<AlertDescription>Đã thêm nhân viên vào lịch làm việc thành công</AlertDescription>
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

                {/* Hiển thị lịch làm việc hiện có */}
                <div className="mb-6 border rounded-md p-4 bg-gray-50">
                    <h3 className="text-md font-medium mb-3">Lịch Làm Việc Hiện Có</h3>
                    
                    <div className="mb-3 flex justify-between items-center">
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCalendarMonthChange(false)}
                        >
                            Tháng trước
                        </Button>
                        
                        <div className="text-lg font-medium">
                            {new Date(currentCalendarYear, currentCalendarMonth).toLocaleString('vi', { 
                                month: 'long', 
                                year: 'numeric' 
                            })}
                        </div>
                        
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCalendarMonthChange(true)}
                        >
                            Tháng sau
                        </Button>
                    </div>
                    
                    {loadingCalendar ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
                        </div>
                    ) : (
                        <div style={calendarContainerStyle} className="bg-white border rounded-md shadow-sm">
                            <div className="grid grid-cols-7 border-b">
                                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, i) => (
                                    <div key={i} className="p-2 text-center font-medium bg-gray-50">{day}</div>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-7 min-w-[500px]">
                                {calendarDays.map((dateInfo, i) => {
                                    const isWorkDay = isWorkdate(dateInfo.day, dateInfo.month, dateInfo.year);
                                    const isToday = dateInfo.day === new Date().getDate() && 
                                                    dateInfo.month === new Date().getMonth() && 
                                                    dateInfo.year === new Date().getFullYear();
                                    return (
                                        <div 
                                            key={i} 
                                            className={`
                                                p-1 h-12 md:h-14 flex items-center justify-center relative
                                                ${!dateInfo.isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'text-gray-800'}
                                                ${isWorkDay ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-gray-100'}
                                                ${isSelectedDate(dateInfo.day, dateInfo.month, dateInfo.year) ? 'ring-2 ring-blue-500 font-bold' : ''}
                                                ${isSelectedEndDate(dateInfo.day, dateInfo.month, dateInfo.year) ? 'ring-2 ring-indigo-500 font-bold' : ''}
                                                ${isInSelectedRange(dateInfo.day, dateInfo.month, dateInfo.year) ? 'bg-blue-50' : ''}
                                                ${isToday ? 'font-bold border border-blue-500' : ''}
                                                cursor-pointer
                                            `}
                                            title={
                                                isSelectedDate(dateInfo.day, dateInfo.month, dateInfo.year) ? "Ngày bắt đầu" :
                                                isSelectedEndDate(dateInfo.day, dateInfo.month, dateInfo.year) ? "Ngày kết thúc" :
                                                isWorkDay ? "Ngày làm việc đã có lịch" : "Chọn ngày"
                                            }
                                            onClick={() => handleDateClick(dateInfo.day, dateInfo.month, dateInfo.year)}
                                        >
                                            <span className="text-sm font-medium">{dateInfo.day}</span>
                                            {isWorkDay && (
                                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-3 flex flex-wrap items-center justify-end gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 bg-green-100 rounded"></div>
                            <span>Ngày làm việc hiện có</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 bg-white border rounded"></div>
                            <span>Ngày trống</span>
                        </div>
                        {selectedDate && (
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 border-2 border-blue-500 rounded"></div>
                                <span>Ngày bắt đầu</span>
                            </div>
                        )}
                        {selectedEndDate && (
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 border-2 border-indigo-500 rounded"></div>
                                <span>Ngày kết thúc</span>
                            </div>
                        )}
                    </div>
                    
                    {workdateDays.size > 0 ? (
                        <div className="mt-4 text-sm">
                            <p className="text-gray-700">
                                <strong>Lưu ý:</strong> Đã tìm thấy {workdateDays.size} ngày làm việc trong hệ thống. 
                                Các ngày có lịch làm việc được đánh dấu màu xanh.
                            </p>
                            {Array.from(workdateDays).length > 0 && (
                                <div className="mt-2 bg-gray-50 p-2 rounded-md" style={{maxHeight: '80px', overflowY: 'auto'}}>
                                    <p className="text-sm font-medium mb-1">Các ngày làm việc ({workdateDays.size}):</p>
                                    <div className="flex flex-wrap gap-1 text-xs">
                                        {Array.from(workdateDays).slice(0, 10).map((date, index) => (
                                            <span key={index} className="px-2 py-1 rounded bg-green-50 border border-green-100">
                                                {new Date(date).toLocaleDateString('vi-VN')}
                                            </span>
                                        ))}
                                        {workdateDays.size > 10 && (
                                            <span className="px-2 py-1 rounded bg-gray-100 border border-gray-200">
                                                +{workdateDays.size - 10} ngày khác
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            <p className="text-gray-700 mt-2">
                                {isSelectingEndDate ? 
                                    "Nhấp vào lịch để chọn ngày kết thúc." : 
                                    "Nhấp vào lịch để chọn ngày bắt đầu và kết thúc."}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 text-sm">
                            <p className="text-gray-700">
                                <strong>Không tìm thấy ngày làm việc nào trong hệ thống.</strong> 
                                Vui lòng tạo lịch làm việc trước khi thêm nhân viên.
                            </p>
                        </div>
                    )}
                </div>

				<form onSubmit={formik.handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label htmlFor="startDate">Ngày Bắt Đầu</Label>
							<Input
								id="startDate"
								name="startDate"
								type="date"
								value={formik.values.startDate}
								onChange={handleStartDateChange}
								onBlur={formik.handleBlur}
							/>
							{formik.touched.startDate && formik.errors.startDate && (
								<p className="text-sm text-red-500">{
									formik.errors.startDate === "Start date is required" ? "Ngày bắt đầu là bắt buộc" :
									formik.errors.startDate === "Start date must be today or after today" ? "Ngày bắt đầu phải từ hôm nay trở đi" :
									formik.errors.startDate
								}</p>
							)}
							</div>
						
						<div className="space-y-2">
							<Label htmlFor="endDate">Ngày Kết Thúc</Label>
							<Input
								id="endDate"
								name="endDate"
								type="date"
								value={formik.values.endDate}
								onChange={handleEndDateChange}
								onBlur={formik.handleBlur}
							/>
							{formik.touched.endDate && formik.errors.endDate && (
								<p className="text-sm text-red-500">{
									formik.errors.endDate === "End date is required" ? "Ngày kết thúc là bắt buộc" :
									formik.errors.endDate === "End date cannot be sooner than start date" ? "Ngày kết thúc không thể sớm hơn ngày bắt đầu" :
									formik.errors.endDate === "End date must be within one year of start date" ? "Ngày kết thúc phải trong vòng một năm kể từ ngày bắt đầu" :
									formik.errors.endDate
								}</p>
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
							<Label htmlFor="repeat">Lặp lại vào các ngày cụ thể trong tuần</Label>
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
										<Label htmlFor={day}>{
											day === "MONDAY" ? "Thứ 2" :
											day === "TUESDAY" ? "Thứ 3" :
											day === "WEDNESDAY" ? "Thứ 4" :
											day === "THURSDAY" ? "Thứ 5" :
											day === "FRIDAY" ? "Thứ 6" :
											day === "SATURDAY" ? "Thứ 7" :
											"Chủ nhật"
										}</Label>
										</div>
									))}
							</div>
						)}
					</div>

					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-medium">Chọn Nhân Viên Thêm Vào Lịch</h3>
							{staffError && <p className="text-sm text-red-500">{
								staffError === "Choose at least 1 staff!" ? "Chọn ít nhất 1 nhân viên!" : staffError
							}</p>}
						</div>
						
						<div className="border rounded-lg" style={tableContainerStyle}>
							<Table>
								<TableHeader className="sticky top-0 bg-white z-10">
									<TableRow>
										<TableHead className="w-12">
											<span className="sr-only">Chọn</span>
										</TableHead>
										<TableHead>ID Nhân Viên</TableHead>
										<TableHead>Tên</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Điện thoại</TableHead>
										<TableHead>Vai trò</TableHead>
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
													{staff.roleName === "DOCTOR" ? "Bác sĩ" : staff.roleName === "NURSE" ? "Điều dưỡng" : staff.roleName}
												</Badge>
											</TableCell>
										</TableRow>
									))}
									{staffs.length === 0 && (
										<TableRow>
											<TableCell colSpan={6} className="text-center py-4 text-gray-500">
												Không có nhân viên hoặc không thể tải danh sách nhân viên
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
					
					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose} className="mr-2" disabled={submitting}>
							Hủy
						</Button>
						<Button type="submit" disabled={submitting}>
							{submitting ? (
								<>
									<span className="animate-spin mr-2">⏳</span>
									Đang Thêm Nhân Viên...
								</>
							) : "Thêm Nhân Viên Vào Lịch"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddStaffToSchedule; 