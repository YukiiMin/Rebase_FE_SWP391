import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Pagination, Row, Table, Badge, Alert } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddShift from "../components/AddShift";
import Navigation from "../components/Navbar";
import { TokenUtils } from "../utils/TokenUtils";

function WorkSchedule() {
	const api = "http://localhost:8080";
	const token = TokenUtils.getToken();

	const [isOpen, setIsOpen] = useState(false);
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-based month index
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [daysInMonth, setDaysInMonth] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// const staffData = [
	// 	{ id: 1, name: "Staff1" },
	// 	{ id: 2, name: "Staff2" },
	// 	// Add more staff members as needed
	// 	// Need to fetch list of staff from API
	// ];

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

	let items = [];
	for (let number = 1; number <= totalPages; number++) {
		items.push(
			<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
				{number}
			</Pagination.Item>
		);
	}

	const pagination = (
		<Pagination>
			<Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
			<Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
			{items}
			<Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
			<Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
		</Pagination>
	);

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
				<Badge 
					bg={daySchedule.status === "Active" ? "success" : "secondary"}
					className="w-100"
				>
					{daySchedule.date.shiftType}
				</Badge>
			);
		}
		return null;
	};

	return (
		<>
			<Navigation />
			<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
				<Row>
					<Sidebar />
					<Col lg={10}>
						<Container className="py-4">
							<Row className="mb-4 align-items-center">
								<Col>
									<h1 className="text-primary">Shift Management</h1>
								</Col>
								<Col className="text-end">
									<Button variant="primary" onClick={() => setIsOpen(true)}>
										Add Work
									</Button>
								</Col>
								{isOpen && <AddShift 
									setIsOpen={setIsOpen} 
									open={isOpen} 
									onScheduleAdded={() => {
										fetchAllSchedules();
									}} 
								/>}
							</Row>
							<hr className="mb-4"></hr>
							
							{error && <Alert variant="danger">{error}</Alert>}
							
							<Row className="mb-3">
								<Col xs={12} md={6} lg={4}>
									<Form.Label>Select Month:</Form.Label>
									<Form.Select value={selectedMonth} onChange={handleMonthChange}>
										{Array.from({ length: 12 }, (_, i) => (
											<option key={i} value={i}>
												{new Date(0, i).toLocaleString("default", { month: "long" })}
											</option>
										))}
									</Form.Select>
								</Col>
								<Col xs={12} md={6} lg={4}>
									<Form.Label>Select Year:</Form.Label>
									<Form.Select value={selectedYear} onChange={handleYearChange}>
										{generateYearOptions()}
									</Form.Select>
								</Col>
								<Col xs={12} md={6} lg={4} className="d-flex align-items-end">
									<Button 
										variant="outline-primary" 
										onClick={fetchAllSchedules}
										disabled={loading}
									>
										{loading ? "Loading..." : "Refresh Schedule"}
									</Button>
								</Col>
							</Row>

							{loading ? (
								<div className="text-center p-4">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
									<p className="mt-2">Loading schedules...</p>
								</div>
							) : (
								<>
									{Object.keys(staffSchedules).length === 0 ? (
										<Alert variant="info">
											No schedules found for {new Date(0, selectedMonth).toLocaleString("default", { month: "long" })} {selectedYear}
										</Alert>
									) : (
										<Table striped bordered hover responsive>
											<thead>
												<tr>
													<th>Staff</th>
													{daysInMonth.map((day) => (
														<th key={day}>{day}</th>
													))}
												</tr>
											</thead>
											<tbody>
												{currentStaffs.map((staff) => (
													<tr key={staff.accountId}>
														<td>{`${staff.firstName} ${staff.lastName}`}</td>
														{daysInMonth.map((day) => (
															<td key={`${staff.accountId}-${day}`}>
																{renderShiftForDay(staff, day)}
															</td>
														))}
													</tr>
												))}
											</tbody>
										</Table>
									)}
									{pagination}
								</>
							)}
						</Container>
					</Col>
				</Row>
			</div>
		</>
	);
}
export default WorkSchedule;
