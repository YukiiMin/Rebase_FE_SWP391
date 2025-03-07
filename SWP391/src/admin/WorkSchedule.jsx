import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddShift from "../components/AddShift";

function WorkSchedule() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [daysInMonth, setDaysInMonth] = useState([]);

	const staffData = [
		{ id: 1, name: "Staff1" },
		{ id: 2, name: "Staff2" },
		// Add more staff members as needed
		// Need to fetch list of staff from API
	];

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

	React.useEffect(() => {
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

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col>
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
								{staffData.map((staff) => (
									<tr key={staff.id}>
										<td>{staff.name}</td>
										{daysInMonth.map((day) => (
											<td key={`${staff.id}-${day}`}></td>
										))}
									</tr>
								))}
							</tbody>
						</Table>
					</Container>
				</Col>
			</Row>
		</div>
	);
}
export default WorkSchedule;
