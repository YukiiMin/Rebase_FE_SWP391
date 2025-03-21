import React, { useState } from "react";
import { Container, Row, Col, Table, Form } from "react-bootstrap";
import StaffMenu from "../components/StaffMenu";
import Navigation from "../components/Navbar";

function Schedule() {
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [daysInMonth, setDaysInMonth] = useState([]);
	const [firstDayOfMonth, setFirstDayOfMonth] = useState(0);
	const today = new Date();
	const [highlightedDay, setHighlightedDay] = useState(null);

	const handleMonthChange = (event) => {
		setSelectedMonth(parseInt(event.target.value));
		updateCalendar(parseInt(event.target.value), selectedYear);
	};

	const handleYearChange = (event) => {
		setSelectedYear(parseInt(event.target.value));
		updateCalendar(selectedMonth, parseInt(event.target.value));
	};

	const updateCalendar = (month, year) => {
		const lastDay = new Date(year, month + 1, 0).getDate();
		const days = Array.from({ length: lastDay }, (_, i) => i + 1);
		let firstDay = new Date(year, month, 1).getDay();
		if (firstDay === 0) {
			firstDay = 6;
		} else {
			firstDay -= 1;
		}
		setDaysInMonth(days);
		setFirstDayOfMonth(firstDay);
		setHighlightedDay(today.getMonth() === month && today.getFullYear() === year ? today.getDate() : null);
	};

	React.useEffect(() => {
		updateCalendar(selectedMonth, selectedYear);
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

	const renderCalendar = () => {
		const weeks = [];
		let week = [];
		let dayIndex = 0;

		for (let i = 0; i < firstDayOfMonth; i++) {
			week.push(<td key={`empty-${i}`}></td>);
			dayIndex++;
		}

		daysInMonth.forEach((day) => {
			const isToday = day === highlightedDay;
			week.push(
				<td
					key={day}
					style={{
						backgroundColor: isToday ? "lightblue" : "transparent",
						fontWeight: isToday ? "bold" : "normal",
					}}>
					{day}
				</td>
			);
			dayIndex++;

			if (dayIndex % 7 === 0) {
				weeks.push(<tr key={`week-${weeks.length}`}>{week}</tr>);
				week = [];
			}
		});

		if (week.length > 0) {
			while (week.length < 7) {
				week.push(<td key={`empty-${dayIndex++}`}></td>);
			}
			weeks.push(<tr key={`week-${weeks.length}`}>{week}</tr>);
		}

		return weeks;
	};

	return (
		<>
			<Navigation />
			<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
				<Row>
					<StaffMenu />
					<Col>
						<Container className="py-4">
							<h1 className="mb-4 text-primary">Work Schedule</h1>
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
							<hr className="mb-4"></hr>
							<Table striped bordered hover responsive>
								<thead>
									<tr>
										{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
											<th key={day}>{day}</th>
										))}
									</tr>
								</thead>
								<tbody>{renderCalendar()}</tbody>
							</Table>
						</Container>
					</Col>
				</Row>
			</div>
		</>
	);
}

export default Schedule;
