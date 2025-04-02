import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MainNav from "../../components/layout/MainNav";
import AddShift from "../../components/layout/AddShift";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Calendar, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
import TokenUtils from "../../utils/TokenUtils";

function WorkSchedule() {
	const api = "http://localhost:8080";
	const token = TokenUtils.getToken();

	const [isOpen, setIsOpen] = useState(false);
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-based month index
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [daysInMonth, setDaysInMonth] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [schedules, setSchedules] = useState([]);
	const [staffList, setStaffList] = useState([]);
	const [staffSchedules, setStaffSchedules] = useState({});

	const handleMonthChange = (event) => {
		const month = parseInt(event.target.value);
		setSelectedMonth(month);
		updateDaysInMonth(month, selectedYear);
	};

	const handleYearChange = (event) => {
		const year = parseInt(event.target.value);
		setSelectedYear(year);
		updateDaysInMonth(selectedMonth, year);
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
		if (staffList.length > 0) {
			fetchAllSchedules();
		}
	}, [selectedMonth, selectedYear, staffList]);

	// Tải danh sách nhân viên khi component mount
	useEffect(() => {
		fetchStaff();
	}, []);

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
			setError("");
			const response = await fetch(`${api}/users/getAllUser`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				const staffs = data.result.filter(user => user.roleName === "DOCTOR" || user.roleName === "NURSE");
				setStaffList(staffs);
				console.log("Staff loaded:", staffs.length);
			} else {
				console.error("Getting staffs data failed: ", response.status);
				setError("Failed to fetch staff list");
			}
		} catch (err) {
			console.error("Something went wrong when getting staffs: ", err);
			setError("Error loading staff data");
		} finally {
			setLoading(false);
		}
	};

	// Fetch tất cả lịch làm việc và lịch của từng nhân viên
	const fetchAllSchedules = async () => {
		try {
			setLoading(true);
			setError("");
			console.log(`Fetching schedules for month ${selectedMonth + 1} and year ${selectedYear}`);
			
			// Tải danh sách lịch làm việc cho từng nhân viên
			const staffSchedulesMap = {};
			
			for (const staff of staffList) {
				try {
					console.log(`Fetching schedule for staff ${staff.accountId}`);
					const staffResponse = await fetch(`${api}/working/allworkdate/${staff.accountId}`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					
					if (!staffResponse.ok) {
						console.warn(`Failed to fetch schedule for staff ${staff.accountId}: ${staffResponse.status}`);
						continue;
					}
					
					const staffData = await staffResponse.json();
					console.log(`Raw data for staff ${staff.accountId}:`, staffData);
					
					if (!staffData || !staffData.result || !Array.isArray(staffData.result)) {
						console.warn(`Invalid data format for staff ${staff.accountId}`);
						continue;
					}
					
					// Lọc lịch làm việc theo tháng và năm được chọn
					const filtered = staffData.result.filter(workDetail => {
						if (!workDetail.date || !workDetail.date.dayWork) {
							console.log("Invalid work detail:", workDetail);
							return false;
						}
						
						// Chuyển đổi chuỗi ngày thành đối tượng Date
						const workDate = new Date(workDetail.date.dayWork);
						const workMonth = workDate.getMonth();
						const workYear = workDate.getFullYear();
						
						console.log(`Checking date: ${workDate}, Month: ${workMonth}, Year: ${workYear}, Selected: ${selectedMonth}/${selectedYear}`);
						
						return workMonth === selectedMonth && workYear === selectedYear;
					});
					
					if (filtered.length > 0) {
						console.log(`Found ${filtered.length} work dates for staff ${staff.accountId}`);
						staffSchedulesMap[staff.accountId] = filtered;
					}
				} catch (error) {
					console.error(`Error processing schedule for staff ${staff.accountId}:`, error);
				}
			}
			
			setStaffSchedules(staffSchedulesMap);
			console.log("Final staff schedules:", staffSchedulesMap);
			
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

	const renderShiftForDay = (staff, day) => {
		// Kiểm tra xem nhân viên có lịch làm việc không
		if (!staffSchedules[staff.accountId]) return null;
		
		const staffSchedule = staffSchedules[staff.accountId];
		console.log(`Rendering shift for staff ${staff.accountId} on day ${day}:`, staffSchedule);
		
		// Tìm lịch làm việc cho ngày cụ thể
		const daySchedule = staffSchedule.find(work => {
			if (!work.date || !work.date.dayWork) {
				console.log("Invalid work schedule:", work);
				return false;
			}
			
			const workDate = new Date(work.date.dayWork);
			const matchesDay = workDate.getDate() === day;
			console.log(`Comparing dates: ${workDate.getDate()} with ${day}, matches: ${matchesDay}`);
			return matchesDay;
		});

		if (daySchedule) {
			console.log(`Found schedule for day ${day}:`, daySchedule);
			return (
				<span className={`
					inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-full text-center
					${daySchedule.status === "ACTIVE" 
						? "bg-green-100 text-green-800" 
						: "bg-gray-100 text-gray-800"}
				`}>
					{daySchedule.date.shiftType || "Regular Shift"}
				</span>
			);
		}
		return null;
	};

	// Thêm useEffect để tự động refresh khi thêm lịch mới
	useEffect(() => {
		if (isOpen === false) {
			console.log("Modal closed, refreshing schedules...");
			fetchAllSchedules();
		}
	}, [isOpen]);

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
								Staff Work Schedule
							</h1>
							<Button 
								onClick={() => setIsOpen(true)}
								className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
							>
								<Plus className="h-5 w-5" />
								Add Work Schedule
							</Button>
						</div>
						
						{isOpen && <AddShift 
							setIsOpen={setIsOpen} 
							open={isOpen} 
							onScheduleAdded={fetchAllSchedules} 
						/>}
						
						{error && (
							<Alert variant="destructive" className="mb-6">
								<AlertCircle className="h-5 w-5" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
									<select 
										value={selectedMonth} 
										onChange={handleMonthChange}
										className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									>
										{Array.from({ length: 12 }, (_, i) => (
											<option key={i} value={i}>
												{new Date(0, i).toLocaleString("default", { month: "long" })}
											</option>
										))}
									</select>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
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
										onClick={fetchAllSchedules}
										disabled={loading}
										className="w-full h-10 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
									>
										<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
										{loading ? "Loading..." : "Refresh Schedule"}
									</Button>
								</div>
							</div>
						</div>

						{loading ? (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
								<div className="flex flex-col items-center justify-center">
									<div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
									<p className="mt-4 text-gray-600">Loading schedules...</p>
								</div>
							</div>
						) : (
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
								{Object.keys(staffSchedules).length === 0 ? (
									<div className="p-8 text-center">
										<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
											<Calendar className="h-8 w-8 text-blue-600" />
										</div>
										<h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Found</h3>
										<p className="text-gray-500">
											No schedules found for {new Date(0, selectedMonth).toLocaleString("default", { month: "long" })} {selectedYear}
										</p>
									</div>
								) : (
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="bg-gray-50 sticky left-0 z-10 min-w-[200px]">Staff</TableHead>
													{daysInMonth.map((day) => (
														<TableHead key={day} className="text-center min-w-[80px]">{day}</TableHead>
													))}
												</TableRow>
											</TableHeader>
											<TableBody>
												{currentStaffs.map((staff) => (
													<TableRow key={staff.accountId}>
														<TableCell className="font-medium sticky left-0 bg-white z-10 min-w-[200px]">
															{`${staff.firstName} ${staff.lastName}`}
														</TableCell>
														{daysInMonth.map((day) => (
															<TableCell key={`${staff.accountId}-${day}`} className="p-2 text-center min-w-[80px]">
																{renderShiftForDay(staff, day)}
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
												First
											</Button>
											<Button 
												variant="outline"
												size="sm"
												disabled={currentPage === 1}
												onClick={() => handlePageChange(currentPage - 1)}
												className="px-3 py-1"
											>
												Previous
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
												Next
											</Button>
											<Button 
												variant="outline"
												size="sm"
												disabled={currentPage === totalPages}
												onClick={() => handlePageChange(totalPages)}
												className="px-3 py-1"
											>
												Last
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
