import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Pagination, Row, Table, Badge } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddShift from "../components/AddShift";

function WorkSchedule() {
	const scheduleAPI = "http://localhost:8080/working";
	const accountAPI = "http://localhost:8080/users";
	const token = localStorage.getItem("token");

	const [isOpen, setIsOpen] = useState(false);
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [daysInMonth, setDaysInMonth] = useState([]);

	// const staffData = [
	// 	{ id: 1, name: "Staff1" },
	// 	{ id: 2, name: "Staff2" },
	// 	// Add more staff members as needed
	// 	// Need to fetch list of staff from API
	// ];

	const [schedule, setSchedule] = useState({}); // Thay đổi để lưu trữ lịch theo từng nhân viên
	const [staffList, setStaffList] = useState([]); //Array of staffs

	const handleMonthChange = (event) => {
		const month = parseInt(event.target.value);
		setSelectedMonth(month);
		updateDaysInMonth(month, selectedYear);
		fetchScheduleForAllStaff(month, selectedYear);
	};

	const handleYearChange = (event) => {
		const year = parseInt(event.target.value);
		setSelectedYear(year);
		updateDaysInMonth(selectedMonth, year);
		fetchScheduleForAllStaff(selectedMonth, year);
	};

	const updateDaysInMonth = (month, year) => {
		const lastDay = new Date(year, month + 1, 0).getDate();
		const days = Array.from({ length: lastDay }, (_, i) => i + 1);
		setDaysInMonth(days);
	};

	useEffect(() => {
		updateDaysInMonth(selectedMonth, selectedYear);
	}, [selectedMonth, selectedYear]);

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

	useEffect(() => {
		getStaff();
	}, []);

	// useEffect(() => {
	// 	if (staffList.length > 0) {
	// 		fetchSchedule();
	// 	}
	// }, [staffList]);

	const getStaff = async () => {
		try {
			const response = await fetch(`${accountAPI}/getAllUser`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setStaffList(data.result);
			} else {
				console.error("Getting staffs data failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when getting staffs: ", err);
		}
	};

	// const fetchSchedule = async () => {
		const fetchScheduleForAllStaff = async (month, year) => {
		try {
			// if (!staffList || staffList.length == 0) {
			// 	//Make sure staffs are loaded
			// 	return;
			// }
			if (!staffList || staffList.length === 0) return;

			const scheduleMap = {};
			// const allSchedules = [];
			for (const staff of staffList) {
				const response = await fetch(`${scheduleAPI}/allworkdate/${staff.accountId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					console.log(`Schedules for staff ${staff.accountId}:`, data.result);
					
					// Lọc các ngày làm việc theo tháng và năm
					const filteredSchedule = data.result.filter(work => {
						// Debug date parsing
						debugDateParsing(work.date.dayWork);
						
						const workDate = new Date(work.date.dayWork);
						// return workDate.getMonth() === month && workDate.getFullYear() === year;
						const isMatchingMonthAndYear = workDate.getMonth() === month && workDate.getFullYear() === year;
						
						// Log chi tiết để debug
						console.log(`Work date: ${workDate}, Month: ${workDate.getMonth()}, Year: ${workDate.getFullYear()}`);
						console.log(`Matching month (${month}) and year (${year}): ${isMatchingMonthAndYear}`);
						
						return isMatchingMonthAndYear;
					});
					
					console.log(`Filtered schedules for staff ${staff.accountId}:`, filteredSchedule);
					
					scheduleMap[staff.accountId] = filteredSchedule;
				} else {
					console.log("Fetching schedule failed: ", response.status);
				}
			}
			setSchedule(scheduleMap);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (staffList.length > 0) {
			fetchScheduleForAllStaff(selectedMonth, selectedYear);
		}
	}, [staffList]);

	//Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of items per page
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentStaffs = staffList && staffList.length > 0 ? staffList.slice(indexOfFirstItems, indexOfLastItems) : []; //Ensure list not empty
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
		const staffSchedule = schedule[staff.accountId] || [];
		const daySchedule = staffSchedule.find(work => {
			const workDate = new Date(work.date.dayWork);
			return workDate.getDate() === day;
		});

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

	// Hàm debug để in ra múi giờ và định dạng ngày
	const debugDateParsing = (dateString) => {
		const date = new Date(dateString);
		console.log('Date String:', dateString);
		console.log('Date Object:', date);
		console.log('Date toString:', date.toString());
		console.log('Date toISOString:', date.toISOString());
		console.log('Date getMonth():', date.getMonth());
		console.log('Date getFullYear():', date.getFullYear());
		console.log('Date getDate():', date.getDate());
		console.log('Timezone Offset:', date.getTimezoneOffset());
	};

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				{/* {console.log(staffs)} */}
				{console.log(schedule)}
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
									fetchScheduleForAllStaff(selectedMonth, selectedYear);
								}} 
							/>}
						</Row>
						<hr className="mb-4"></hr>
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
						</Row>

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
						{pagination}
					</Container>
				</Col>
			</Row>
		</div>
	);
}
export default WorkSchedule;
