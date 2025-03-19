import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
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

	const [schedule, setSchedule] = useState([]); //Array object which each object is a staff schedule
	const [staffList, setStaffList] = useState([]); //Array of staffs

	const handleMonthChange = (event) => {
		setSelectedMonth(parseInt(event.target.value));
		updateDaysInMonth(parseInt(event.target.value), selectedYear);
	};

	const handleYearChange = (event) => {
		setSelectedYear(parseInt(event.target.value));
		updateDaysInMonth(selectedMonth, parseInt(event.target.value));
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

	useEffect(() => {
		if (staffList.length > 0) {
			fetchSchedule();
		}
	}, [staffList]);

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

	const fetchSchedule = async () => {
		try {
			if (!staffList || staffList.length == 0) {
				//Make sure staffs are loaded
				return;
			}
			const allSchedules = [];
			for (const staff of staffList) {
				const response = await fetch(`${scheduleAPI}/allworkdate/${staff.accountId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					// console.log(data);
					// setSchedule(data.result);
					allSchedules.push({ staffId: staff.accountId, schedule: data.result });
				} else {
					console.log("Fetching schedule failed: ", response.status);
				}
				setSchedule(allSchedules);
			}
		} catch (err) {
			console.log(err);
		}
	};

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
							{isOpen && <AddShift setIsOpen={setIsOpen} open={isOpen} />}
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
											<td key={`${staff.id}-${day}`}></td>
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
