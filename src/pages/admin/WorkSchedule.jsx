import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MainNav from "../../components/layout/MainNav";
import AddShift from "../../components/layout/AddShift";
import AddStaffToSchedule from "../../components/layout/AddStaffToSchedule";
import ApiTester from "../../components/debug/ApiTester";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Calendar, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
import TokenUtils from "../../utils/TokenUtils";
import { apiService } from "../../api";

function WorkSchedule() {
	const token = TokenUtils.getToken();

	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(currentMonth);
	const [daysInMonth, setDaysInMonth] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [staffList, setStaffList] = useState([]);
	const [staffSchedules, setStaffSchedules] = useState({});
	const [fetchingStatus, setFetchingStatus] = useState({});

	const [openAddSchedule, setOpenAddSchedule] = useState(false);
	const [openAddStaffToSchedule, setOpenAddStaffToSchedule] = useState(false);

	const handleMonthChange = (event) => {
		const month = parseInt(event.target.value);
		setSelectedMonth(month);
		updateDaysInMonth(month, selectedYear);
		
		// Fetch lịch khi thay đổi tháng
		console.log("Tháng đã thay đổi thành:", month);
		fetchAllSchedules();
	};

	const handleYearChange = (event) => {
		const year = parseInt(event.target.value);
		setSelectedYear(year);
		updateDaysInMonth(selectedMonth, year);
		
		// Fetch lịch khi thay đổi năm
		console.log("Năm đã thay đổi thành:", year);
		fetchAllSchedules();
	};

	const updateDaysInMonth = (month, year) => {
		const lastDay = new Date(year, month + 1, 0).getDate();
		const days = Array.from({ length: lastDay }, (_, i) => i + 1);
		setDaysInMonth(days);
	};

	// Khi tháng hoặc năm thay đổi, cập nhật số ngày trong tháng
	useEffect(() => {
		updateDaysInMonth(selectedMonth, selectedYear);
	}, [selectedMonth, selectedYear]);

	// Khi tháng hoặc năm thay đổi, tải lại lịch làm việc
	useEffect(() => {
		console.log("Month/year/staffList changed - current staffList length:", staffList.length);
		// Fetch schedules when month or year changes
		if (staffList.length > 0) {
			fetchAllSchedules();
		}
	}, [selectedMonth, selectedYear]);

	// Tải danh sách nhân viên khi component mount
	useEffect(() => {
		console.log("WorkSchedule component mounted - loading staff data");
		fetchStaff();
	}, []);

	// Component mount logging
	useEffect(() => {
		console.log("WorkSchedule component mounted");
		return () => {
			console.log("WorkSchedule component unmounted");
		};
	}, []);

	// Log when staffSchedules change
	useEffect(() => {
		console.log("staffSchedules state changed:", Object.keys(staffSchedules).length);
		console.log("staffSchedules keys:", Object.keys(staffSchedules).join(", "));
		if (Object.keys(staffSchedules).length > 0) {
			const sampleStaffId = Object.keys(staffSchedules)[0];
			console.log(`Lịch mẫu cho nhân viên ${sampleStaffId}:`, staffSchedules[sampleStaffId]);
		}
	}, [staffSchedules]);

	const generateYearOptions = () => {
		const currentYear = new Date().getFullYear();
		const years = [];
		for (let i = currentYear - 5; i <= currentYear + 5; i++) {
			years.push(
				<option key={i} value={i}>
					{i}
				</option>
			);
		}
		return years;
	};

	// Fetch danh sách nhân viên
	const fetchStaff = async () => {
		try {
			setLoading(true);
			console.log("WorkSchedule: Fetching staff using apiService...");
			
			// Use apiService instead of direct fetch
			const response = await apiService.users.getAll();
			console.log("WorkSchedule: API Response from apiService:", response);
			
			if (response && response.data) {
				// Lấy staff từ API response
				let staffList = [];
				if (response.data.result) {
					staffList = response.data.result.filter(
						(user) => user.roleName === "DOCTOR" || user.roleName === "NURSE"
					);
				} else if (Array.isArray(response.data)) {
					staffList = response.data.filter(
						(user) => user.roleName === "DOCTOR" || user.roleName === "NURSE"
					);
				}
				
				console.log("WorkSchedule: Filtered Staff from apiService:", staffList);
				setStaffList(staffList);
				
				// Sau khi lấy được danh sách nhân viên, fetch lịch làm việc
				fetchAllSchedules();
			} else {
				console.log("WorkSchedule: Invalid response structure");
				setError("Failed to fetch staff");
			}
		} catch (err) {
			console.error("Error fetching staff:", err);
			setError(`Failed to load staff list: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};

	const fetchAllSchedules = async () => {
		try {
			setLoading(true);
			
			console.log("Đang tải tất cả lịch làm việc...");
			
			// Format dates for API request
			const formattedStartDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
			const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
			const formattedEndDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${lastDay}`;
			
			// Sử dụng API getAll để lấy tất cả lịch làm việc
			const response = await apiService.working.getAllWorkingDates();
			console.log("Kết quả lấy tất cả lịch làm việc:", response);
			
			if (response && response.data) {
				// Lấy dữ liệu từ response
				let workDates = [];
				
				if (response.data.result) {
					workDates = response.data.result;
				} else if (Array.isArray(response.data)) {
					workDates = response.data;
				}
				
				console.log("Số lượng ngày làm việc tìm thấy:", workDates.length);
				
				// Lọc chỉ lấy các ngày trong tháng đã chọn
				const filteredDates = workDates.filter(date => {
					const dayWork = date.dayWork || date.day_work;
					if (!dayWork) return false;
					
					// Kiểm tra xem ngày có thuộc tháng/năm đã chọn không
					return dayWork.startsWith(`${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`);
				});
				
				console.log("Số lượng ngày làm việc trong tháng đã chọn:", filteredDates.length);
				
				// Lấy tất cả các account và schedules từ API
				const accountResponse = await apiService.users.getAll();
				const scheduleResponse = await apiService.working.getSchedules(formattedStartDate, formattedEndDate);
				
				let accounts = [];
				let schedules = [];
				
				if (accountResponse && accountResponse.data && accountResponse.data.result) {
					accounts = accountResponse.data.result.filter(
						account => account.roleName === "DOCTOR" || account.roleName === "NURSE"
					);
				}
				
				if (scheduleResponse && scheduleResponse.data) {
					if (scheduleResponse.data.result) {
						schedules = scheduleResponse.data.result;
					} else if (scheduleResponse.data.data && scheduleResponse.data.data.schedules) {
						schedules = scheduleResponse.data.data.schedules;
					} else if (Array.isArray(scheduleResponse.data)) {
						schedules = scheduleResponse.data;
					}
				}
				
				console.log("Số lượng nhân viên:", accounts.length);
				console.log("Số lượng lịch làm việc:", schedules.length);
				
				// Tạo map lịch làm việc theo staff
				const staffSchedulesMap = {};
				
				accounts.forEach(account => {
					staffSchedulesMap[account.accountId] = [];
				});
				
				// Nếu có dữ liệu lịch làm việc, phân tích và xây dựng map
				if (schedules.length > 0) {
					schedules.forEach(schedule => {
						const staffId = schedule.accountId || schedule.staff_id || schedule.account_id;
						const dateId = schedule.dateId || schedule.date_id;
						
						if (staffId && dateId) {
							// Tìm thông tin ngày làm việc tương ứng với dateId
							const workDate = workDates.find(date => date.dateId === dateId || date.date_id === dateId);
							
							if (workDate) {
								const dayWork = workDate.dayWork || workDate.day_work;
								const shiftType = workDate.shiftType || workDate.shift_type || "Regular";
								
								// Thêm lịch làm việc vào map
								if (!staffSchedulesMap[staffId]) {
									staffSchedulesMap[staffId] = [];
								}
								
								staffSchedulesMap[staffId].push({
									id: schedule.id || schedule.scheduleId || schedule.schedule_id,
									dayWork: dayWork,
									shiftType: shiftType,
									status: schedule.status || "ACTIVE"
								});
							}
						}
					});
				} else {
					// Nếu không có dữ liệu từ API schedules, thử sử dụng thông tin từ API workdates
					filteredDates.forEach(workDate => {
						const dayWork = workDate.dayWork || workDate.day_work;
						const shiftType = workDate.shiftType || workDate.shift_type || "Regular";
						const staffIds = workDate.staffIds || [];
						
						// Nếu có thông tin staffIds trong workDate
						if (Array.isArray(staffIds) && staffIds.length > 0) {
							staffIds.forEach(staffId => {
								if (!staffSchedulesMap[staffId]) {
									staffSchedulesMap[staffId] = [];
								}
								
								staffSchedulesMap[staffId].push({
									id: workDate.dateId || workDate.date_id,
									dayWork: dayWork,
									shiftType: shiftType,
									status: "ACTIVE"
								});
							});
						} else {
							// Nếu không có thông tin staffIds rõ ràng, thử cách khác để lấy thông tin
							// Đây là một cách tiếp cận dự phòng, có thể không chính xác hoàn toàn
							schedules.forEach(schedule => {
								const staffId = schedule.accountId || schedule.staff_id || schedule.account_id;
								
								if (staffId && schedule.dateId === workDate.dateId) {
									if (!staffSchedulesMap[staffId]) {
										staffSchedulesMap[staffId] = [];
									}
									
									staffSchedulesMap[staffId].push({
										id: workDate.dateId || workDate.date_id,
										dayWork: dayWork,
										shiftType: shiftType,
										status: schedule.status || "ACTIVE"
									});
								}
							});
						}
					});
				}
				
				console.log("Staff schedules map:", staffSchedulesMap);
				setStaffSchedules(staffSchedulesMap);
			}
		} catch (err) {
			console.error("Error fetching schedules:", err);
			setError(`Failed to load schedules: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};

	//Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentStaffs = staffList && staffList.length > 0 ? staffList.slice(indexOfFirstItems, indexOfLastItems) : [];
	const totalPages = Math.ceil(staffList.length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	// Render a shift for a specific day and staff
	const renderShiftForDay = (staffId, day) => {
		// Kiểm tra xem có dữ liệu lịch cho nhân viên này không
		if (!staffSchedules[staffId] || staffSchedules[staffId].length === 0) {
			return null;
		}
		
		// Format ngày cho tháng hiện tại để so sánh
		const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		
		// Tìm lịch làm việc cho ngày này
		const schedule = staffSchedules[staffId].find(schedule => {
			// Lấy ngày từ đối tượng schedule
			const scheduleDate = schedule.dayWork || schedule.day_work || '';
			
			// Kiểm tra xem ngày trong lịch có khớp với ngày đang render không
			return scheduleDate.includes(formattedDate);
		});
		
		if (schedule) {
			// Xác định loại ca làm việc
			const shiftType = schedule.shiftType || schedule.shift_type || "Ca làm việc";
			
			// Xác định trạng thái ca làm việc
			const status = schedule.status || "ACTIVE";
			
			// Chọn màu sắc dựa trên trạng thái
			let bgColor = "bg-green-100";
			let textColor = "text-green-800";
			
			if (status === "OFF_DUTY" || status === "OFF-DUTY") {
				bgColor = "bg-gray-100";
				textColor = "text-gray-800";
			} else if (status === "ON_DUTY" || status === "ON-DUTY") {
				bgColor = "bg-blue-100";
				textColor = "text-blue-800";
			}
			
			return (
				<div className={`p-2 text-center ${bgColor} ${textColor} rounded-md text-xs`}>
					<p className="font-medium">{shiftType}</p>
					<p>{status}</p>
				</div>
			);
		}
		
		return null;
	};

	// Thêm useEffect để tự động refresh khi thêm lịch mới
	useEffect(() => {
		if (openAddSchedule === false) {
			console.log("Modal closed, refreshing schedules...");
			fetchAllSchedules();
		}
	}, [openAddSchedule]);

	// Handler for the refresh button
	const handleRefreshSchedule = () => {
		console.log("Refresh button clicked");
		fetchAllSchedules();
	};

	// Handler for when a new schedule is added successfully
	const handleScheduleAdded = useCallback((scheduleData) => {
		console.log("New schedule added:", scheduleData);
		// Force refresh of schedules
		fetchAllSchedules();
	}, []);

	// Callback khi thêm nhân viên vào lịch làm việc thành công
	const handleStaffAddedToSchedule = useCallback(() => {
		console.log("Staff added to schedule successfully");
		fetchAllSchedules();
	}, []);

	// CSS Style cho container có thanh cuộn
	const tableContainerStyle = {
		overflowX: 'auto',
		maxWidth: '100%',
		position: 'relative'
	};

	// CSS Style cho cột tên nhân viên cố định
	const stickyColumnStyle = {
		position: 'sticky',
		left: 0,
		zIndex: 10,
		background: 'white',
		borderRight: '1px solid #e5e7eb'
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<MainNav isAdmin={true} />
			<div className="flex">
				<Sidebar />
				<main className="flex-1 p-8 ml-64">
					<div className="max-w-7xl mx-auto">
						<div className="flex justify-between items-center mb-8">
							<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
								<Calendar className="h-8 w-8 text-blue-600" />
								Lịch Làm Việc Nhân Viên
							</h1>
							<div className="flex gap-2">
								<Button
									onClick={() => setOpenAddSchedule(true)}
									className="flex items-center gap-1"
								>
									<span className="h-5 w-5">+</span> Tạo Lịch Mới
								</Button>
								<Button
									onClick={() => setOpenAddStaffToSchedule(true)}
									className="flex items-center gap-1"
									variant="outline"
								>
									<span className="h-5 w-5">+</span> Thêm Nhân Viên Vào Lịch
								</Button>
							</div>
						</div>
						
						{/* Component dialog để tạo lịch mới */}
						<AddShift
							setIsOpen={setOpenAddSchedule}
							open={openAddSchedule}
							onScheduleAdded={handleScheduleAdded}
						/>
						
						{/* Component dialog để thêm nhân viên vào lịch hiện có */}
						<AddStaffToSchedule
							setIsOpen={setOpenAddStaffToSchedule}
							open={openAddStaffToSchedule}
							onStaffAdded={handleStaffAddedToSchedule}
						/>
						
						{error && (
							<Alert variant="destructive" className="mb-6">
								<AlertCircle className="h-5 w-5" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Chọn Tháng</label>
									<select 
										value={selectedMonth} 
										onChange={handleMonthChange}
										className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									>
										{Array.from({ length: 12 }, (_, i) => (
											<option key={i} value={i}>
												{new Date(0, i).toLocaleString("vi-VN", { month: "long" })}
											</option>
										))}
									</select>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Chọn Năm</label>
									<select 
										value={selectedYear} 
										onChange={handleYearChange}
										className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									>
										{generateYearOptions()}
									</select>
								</div>
								
								<div className="flex items-end">
									<Button 
										variant="outline"
										onClick={handleRefreshSchedule}
										disabled={loading}
										className="w-full h-10 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
									>
										<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
										{loading ? "Đang tải..." : "Làm mới lịch"}
									</Button>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<h3 className="text-lg font-medium mb-4">API Testing Panel</h3>
							<ApiTester />
						</div>

						{loading ? (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
								<div className="flex flex-col items-center justify-center">
									<div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
									<p className="mt-4 text-gray-600">Đang tải lịch làm việc...</p>
								</div>
							</div>
						) : (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
								{/* Debug info */}
								<div className="p-4 bg-gray-50 border-b border-gray-200 text-sm">
									<div><strong>Debug Info:</strong></div>
									<div>Staff List Length: {staffList.length}</div>
									<div>Staff Schedules Object Keys: {Object.keys(staffSchedules).length}</div>
									<div>Staff Schedules Object Keys: {Object.keys(staffSchedules).join(', ') || 'none'}</div>
									<div>Current Month: {new Date(0, selectedMonth).toLocaleString("vi-VN", { month: "long" })}</div>
									<div>Current Year: {selectedYear}</div>
									<div>Current Page: {currentPage}</div>
									<div>Items Per Page: {itemsPerPage}</div>
									<div>Total Pages: {totalPages}</div>
								</div>
								
								{staffList.length === 0 ? (
									<div className="p-8 text-center">
										<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
											<Calendar className="h-8 w-8 text-blue-600" />
										</div>
										<h3 className="text-lg font-medium text-gray-900 mb-2">Không có nhân viên</h3>
										<p className="text-gray-500 mb-4">
											Không tìm thấy nhân viên nào trong hệ thống. Vui lòng thêm nhân viên trước khi tạo lịch.
										</p>
										<Button variant="outline" onClick={fetchStaff}>
											Làm mới danh sách nhân viên
										</Button>
									</div>
								) : (
									<div style={tableContainerStyle}>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead style={stickyColumnStyle} className="bg-gray-50 min-w-[200px]">Nhân viên</TableHead>
													{daysInMonth.map((day) => (
														<TableHead key={day} className="text-center min-w-[80px]">{day}</TableHead>
													))}
												</TableRow>
											</TableHeader>
											<TableBody>
												{currentStaffs.map((staff) => (
													<TableRow key={staff.accountId}>
														<TableCell style={stickyColumnStyle} className="font-medium min-w-[200px]">
															{`${staff.firstName} ${staff.lastName}`}
															{fetchingStatus[staff.accountId] === 'loading' && (
																<span className="ml-2 inline-block w-4 h-4 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></span>
															)}
														</TableCell>
														{daysInMonth.map((day) => (
															<TableCell key={`${staff.accountId}-${day}`} className="p-2 text-center min-w-[80px]">
																{renderShiftForDay(staff.accountId, day)}
															</TableCell>
														))}
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)}
								
								{/* Pagination */}
								{totalPages > 0 && (
									<div className="flex items-center justify-center py-4 border-t border-gray-200">
										<nav className="flex items-center gap-2">
											<Button 
												variant="outline"
												size="sm"
												disabled={currentPage === 1}
												onClick={() => handlePageChange(1)}
												className="px-3 py-1"
											>
												Đầu
											</Button>
											<Button 
												variant="outline"
												size="sm"
												disabled={currentPage === 1}
												onClick={() => handlePageChange(currentPage - 1)}
												className="px-3 py-1"
											>
												Trước
											</Button>
											
											<div className="flex items-center gap-1">
												{[...Array(totalPages)].map((_, index) => {
													const pageNum = index + 1;
													if (
														pageNum === 1 ||
														pageNum === totalPages ||
														(pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
													) {
														return (
															<Button
																key={pageNum}
																variant={pageNum === currentPage ? "default" : "outline"}
																size="sm"
																onClick={() => handlePageChange(pageNum)}
																className="px-3 py-1"
															>
																{pageNum}
															</Button>
														);
													} else if (
														pageNum === currentPage - 2 ||
														pageNum === currentPage + 2
													) {
														return <span key={pageNum} className="px-1">...</span>;
													}
													return null;
												})}
											</div>
											
											<Button 
												variant="outline"
												size="sm"
												disabled={currentPage === totalPages}
												onClick={() => handlePageChange(currentPage + 1)}
												className="px-3 py-1"
											>
												Tiếp
											</Button>
											<Button 
												variant="outline"
												size="sm"
												disabled={currentPage === totalPages}
												onClick={() => handlePageChange(totalPages)}
												className="px-3 py-1"
											>
												Cuối
											</Button>
										</nav>
									</div>
								)}
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

export default WorkSchedule;
