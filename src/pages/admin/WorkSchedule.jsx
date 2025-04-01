import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import AddShift from "../../components/layout/AddShift";
import Navigation from "../../components/layout/Navbar";
import TokenUtils from "../../utils/TokenUtils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";

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
					
					// Kiểm tra dữ liệu hợp lệ
					if (!staffData || !staffData.result || !Array.isArray(staffData.result)) {
						console.warn(`Invalid data format for staff ${staff.accountId}`);
						continue;
					}
					
					// Lọc lịch làm việc theo tháng và năm được chọn
					const filtered = staffData.result.filter(workDetail => {
						if (!workDetail.date || !workDetail.date.dayWork) {
							return false;
						}
						
						// Chuyển đổi chuỗi ngày thành đối tượng Date
						const workDate = new Date(workDetail.date.dayWork);
						const workMonth = workDate.getMonth(); // JavaScript month is 0-based
						const workYear = workDate.getFullYear();
						
						console.log(`Work date: ${workDate}, Month: ${workMonth}, Year: ${workYear}, Selected: ${selectedMonth}/${selectedYear}`);
						
						// So sánh tháng và năm của lịch làm việc với tháng và năm được chọn
						return workMonth === selectedMonth && workYear === selectedYear;
					});
					
					if (filtered.length > 0) {
						console.log(`Found ${filtered.length} work dates for staff ${staff.accountId} in ${selectedMonth + 1}/${selectedYear}`);
						staffSchedulesMap[staff.accountId] = filtered;
					}
				} catch (error) {
					console.error(`Error processing schedule for staff ${staff.accountId}:`, error);
				}
			}
			
			// Cập nhật state với dữ liệu lịch làm việc của nhân viên
			setStaffSchedules(staffSchedulesMap);
			console.log("Updated staff schedules:", staffSchedulesMap);
			
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
		
		// Tìm lịch làm việc cho ngày cụ thể
		const daySchedule = staffSchedule.find(work => {
			if (!work.date || !work.date.dayWork) return false;
			
			// Chuyển đổi chuỗi ngày thành đối tượng Date và kiểm tra ngày
			const workDate = new Date(work.date.dayWork);
			return workDate.getDate() === day;
		});

		// Nếu có lịch làm việc cho ngày đó, hiển thị badge với loại ca
		if (daySchedule) {
			return (
				<span className={`
					inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-full text-center
					${daySchedule.status === "Active" 
						? "bg-green-100 text-green-800" 
						: "bg-gray-100 text-gray-800"}
				`}>
					{daySchedule.date.shiftType}
				</span>
			);
		}
		return null;
	};

	return (
		<>
			<Navigation />
			<div className="admin-layout">
				<Sidebar />
				<main className="admin-content">
					<div className="admin-header flex justify-between items-center">
						<h1 className="admin-title flex items-center gap-2">
							<Calendar size={24} className="text-blue-600" />
							Staff Work Schedule
						</h1>
						<Button 
							onClick={() => setIsOpen(true)}
							className="flex items-center gap-2"
						>
							<Plus size={16} />
							Add Work Schedule
						</Button>
					</div>
					
					{isOpen && <AddShift 
						setIsOpen={setIsOpen} 
						open={isOpen} 
						onScheduleAdded={() => {
							fetchAllSchedules();
						}} 
					/>}
					
					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					<div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Select Month:</label>
								<select 
									value={selectedMonth} 
									onChange={handleMonthChange}
									className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
								>
									{Array.from({ length: 12 }, (_, i) => (
										<option key={i} value={i}>
											{new Date(0, i).toLocaleString("default", { month: "long" })}
										</option>
									))}
								</select>
							</div>
							
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Select Year:</label>
								<select 
									value={selectedYear} 
									onChange={handleYearChange}
									className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
								>
									{generateYearOptions()}
								</select>
							</div>
							
							<div>
								<Button 
									variant="outline"
									onClick={fetchAllSchedules}
									disabled={loading}
									className="w-full flex items-center justify-center gap-2"
								>
									<RefreshCw size={16} className={loading ? "animate-spin" : ""} />
									{loading ? "Loading..." : "Refresh Schedule"}
								</Button>
							</div>
						</div>
					</div>

					{loading ? (
						<div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
							<div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
							<p className="mt-4 text-gray-600">Loading schedules...</p>
						</div>
					) : (
						<div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
							{Object.keys(staffSchedules).length === 0 ? (
								<div className="bg-blue-50 text-blue-700 p-4 rounded-md">
									No schedules found for {new Date(0, selectedMonth).toLocaleString("default", { month: "long" })} {selectedYear}
								</div>
							) : (
								<div className="overflow-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="bg-gray-50 sticky left-0 z-10">Staff</TableHead>
												{daysInMonth.map((day) => (
													<TableHead key={day} className="text-center">{day}</TableHead>
												))}
											</TableRow>
										</TableHeader>
										<TableBody>
											{currentStaffs.map((staff) => (
												<TableRow key={staff.accountId}>
													<TableCell className="font-medium sticky left-0 bg-white z-10">{`${staff.firstName} ${staff.lastName}`}</TableCell>
													{daysInMonth.map((day) => (
														<TableCell key={`${staff.accountId}-${day}`} className="p-1 text-center">
															{renderShiftForDay(staff, day)}
														</TableCell>
													))}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
							
							{/* Custom Pagination */}
							{totalPages > 0 && (
								<div className="flex items-center justify-center mt-6">
									<nav className="flex items-center space-x-2">
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
											&laquo; Prev
										</Button>
										
										<div className="flex items-center space-x-1">
											{[...Array(totalPages)].map((_, index) => {
												const pageNum = index + 1;
												// Show limited page numbers
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
													return <span key={pageNum}>...</span>;
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
											Next &raquo;
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
				</main>
			</div>
		</>
	);
}
export default WorkSchedule;
