import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
import StaffMenu from "../components/StaffMenu";
import DetailReaction from "../components/DetailReaction";
import Diagnosis from "../components/Diagnosis";

function CheckIn() {
	const bookingAPI = "http://localhost:8080/booking";
	const token = localStorage.getItem("token");
	const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
	const [isRecordOpen, setIsRecordOpen] = useState(false);
	const [searchName, setSearchName] = useState("");
	const [bookingList, setBookingList] = useState([]);
	const [filteredList, setFilteredList] = useState([]);

	useEffect(() => {
		getBooking();
	}, []);

	useEffect(() => {
		handleSearch();
	}, [bookingList, searchName]);

	//Get all bookings
	const getBooking = async () => {
		try {
			const response = await fetch(`${bookingAPI}/all`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				// console.log(data);
				setBookingList(data);
			} else {
				console.error("Getting booking failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when getting booking: ", err);
		}
	};

	//Sort the booking by vaccination date. The upcoming vaccination date with go first, any past vaccination date will go last
	const sortBookings = (bookings) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Normalize to midnight

		const futureBookings = [];
		const pastBookings = [];

		bookings.forEach((booking) => {
			const bookingDate = new Date(booking.appointmentDate);
			bookingDate.setHours(0, 0, 0, 0); // Normalize

			if (bookingDate >= today) {
				futureBookings.push(booking);
			} else {
				pastBookings.push(booking);
			}
		});

		futureBookings.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
		pastBookings.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

		return [...futureBookings, ...pastBookings];
	};

	//Function to search by children name
	const handleSearch = () => {
		if (!searchName) {
			setFilteredList(sortBookings(bookingList));
			setCurrentPage(1);
			return;
		}
		const filtered = bookingList.filter((booking) => booking.child.name.toLowerCase().includes(searchName.toLowerCase()));
		setFilteredList(sortBookings(filtered));
		setCurrentPage(1);
	};

	//Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of items per page
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentBookings = filteredList && filteredList.length > 0 ? filteredList.slice(indexOfFirstItems, indexOfLastItems) : []; //Ensure list not empty
	const totalPages = Math.ceil(filteredList.length / itemsPerPage);

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
			{console.log(filteredList)}
			<Row lg={10}>
				<StaffMenu />
				<Col>
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Check-In</h1>
						<hr className="mb-4"></hr>
						<Form.Control type="text" placeholder="Search Child Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="mb-3" />
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>Date Booked</th>
									<th>Child Name</th>
									<th>Parent Name</th>
									<th>Status</th>
									{/* <th>Check-in Date and Time</th>
									<th>Patient Number</th>
									<th>Assign Doctor</th>
									<th>Doctor</th>
									<th>Doctor Diagnosis</th>
									<th>Health Record</th> */}
								</tr>
							</thead>
							<tbody>
								{currentBookings.length > 0 ? (
									currentBookings.map((booking) => (
										<tr key={booking.bookingId}>
											<td>{booking.bookingId}</td>
											<td>{booking.appointmentDate}</td>
											<td>{booking.child.name}</td>
											<td>{`${booking.child.account.firstName} ${booking.child.account.lastName}`}</td>
											<td>
												<Badge bg="light" text="dark">
													n/a
												</Badge>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={10}>No data</td>
									</tr>
								)}

								{/* 								
								<tr>
									<td>1</td>
									<td>testUsername</td>
									<td>Child1</td>
									<td>10/03/2025 16:00</td>
									<td>
										<Badge bg="light" text="dark">
											n/a
										</Badge>
										<Badge bg="secondary">check-in</Badge>
										<Badge bg="info">waiting diagnos</Badge>
										<Badge bg="warning">diagnosing</Badge>
										<Badge bg="info">waiting vaccination</Badge>
										<Badge bg="warning">vaccinating</Badge>
										<Badge bg="info">waiting result</Badge>
										<Badge bg="success">done</Badge>
										<Badge bg="danger">cancel</Badge>
									</td>
									<td>1</td>
									<td>Snoop Dogg</td>
									<td>
										<Button size="sm" disabled>
											Assign
										</Button>
									</td>
									<td>
										<Button size="sm" onClick={() => setIsDiagnosisOpen(true)}>
											Add diagnosis
										</Button>
									</td>
									{isDiagnosisOpen && <Diagnosis open={isDiagnosisOpen} setIsOpen={setIsDiagnosisOpen} />}
									<td>
										<Button size="sm" onClick={() => setIsRecordOpen(true)}>
											Detail
										</Button>
									</td>
									{isRecordOpen && <DetailReaction open={isRecordOpen} setIsOpen={setIsRecordOpen} />}
								</tr> */}

								{/* <tr>
									<td>2</td>
									<td>testUsername</td>
									<td>Child1</td>
									<td>n/a</td>
									<td>n/a</td>
									<td>
										<Button size="sm">Assign</Button>
									</td>
									<td>n/a</td>
									<td>n/a</td>
									<td>
										<Button size="sm" disabled>
											Reaction
										</Button>
									</td>
								</tr> */}
								{/* <tr>
									<td>1</td>
									<td>testUsername</td>
									<td>Child1</td>
									<td>Await</td>
									<td>
										<Button size="sm">Assign Doctor</Button>
									</td>
									<td></td>
								</tr>
								<tr>
									<td>1</td>
									<td>testUsername</td>
									<td>Child1</td>
									<td>Await</td>
									<td>
										<Button size="sm">Assign Doctor</Button>
									</td>
									<td></td>
								</tr>
								<tr>
									<td>1</td>
									<td>testUsername</td>
									<td>Child1</td>
									<td>Done</td>
									<td>
										<Button size="sm" disabled>
											Assign Doctor
										</Button>
									</td>
									<td>
										<u>Reaction</u>
									</td>
								</tr> */}
							</tbody>
						</Table>
						{pagination}
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default CheckIn;
