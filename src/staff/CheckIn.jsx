import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Pagination, Row, Table, Alert } from "react-bootstrap";
import StaffMenu from "../components/StaffMenu";
import DetailReaction from "../components/DetailReaction";
import Diagnosis from "../components/Diagnosis";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navbar";

function CheckIn() {
	const navigate = useNavigate();
	const bookingAPI = "http://localhost:8080/booking";
	
	// Check for token, set a dummy one for testing if not available
	const [token, setToken] = useState(localStorage.getItem("token"));
	
	const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
	const [isRecordOpen, setIsRecordOpen] = useState(false);
	const [searchName, setSearchName] = useState("");
	const [bookingList, setBookingList] = useState([]);
	const [filteredList, setFilteredList] = useState([]);
	const [statusFilter, setStatusFilter] = useState("ALL");
	const [messageAlert, setMessageAlert] = useState({ show: false, type: "", message: "" });
	const [loadingAction, setLoadingAction] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState(null);

	useEffect(() => {
		getBooking();
	}, []);

	useEffect(() => {
		handleSearch();
	}, [bookingList, searchName, statusFilter]);

	//Get all bookings
	const getBooking = async () => {
		try {
			// Kiểm tra token một cách chi tiết hơn
			if (!token) {
				console.error("No token found. Redirecting to login.");
				navigate('/Login'); // Chuyển hướng đến trang đăng nhập nếu không có token
				return;
			}

			console.log("Fetching bookings with token:", token);
			const response = await fetch(`${bookingAPI}/all`, {
				method: 'GET', // Thêm method rõ ràng
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			console.log("Response status:", response.status);

			if (!response.ok) {
				// Xử lý các mã lỗi khác nhau
				if (response.status === 401 || response.status === 403) {
					console.error("Unauthorized. Redirecting to login.");
					localStorage.removeItem('token'); // Xóa token không hợp lệ
					navigate('/Login');
					return;
				}

				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Clone response để có thể log nguyên văn response
			const responseClone = response.clone();
			const rawResponse = await responseClone.text();
			console.log("Raw API response:", rawResponse);
			
			// Parse response bình thường
			const data = await response.json();
			console.log("Booking data received (parsed):", data);
			
			// Chi tiết hơn về cấu trúc dữ liệu
			if (data && data.result) {
				console.log("Result array length:", Array.isArray(data.result) ? data.result.length : "Not an array");
				if (Array.isArray(data.result) && data.result.length > 0) {
					console.log("First booking sample:", JSON.stringify(data.result[0], null, 2));
					console.log("First booking child object:", data.result[0].child);
					if (data.result[0].child) {
						console.log("First booking child account:", data.result[0].child.account);
					}
				}
			}
			
			// Kiểm tra xem data có phải là mảng không
			const bookingData = Array.isArray(data.result) ? data.result : 
								(Array.isArray(data) ? data : []);
			
			if (bookingData.length === 0) {
				console.log("No bookings found in the response");
				setMessageAlert({
					show: true,
					type: "info",
					message: "No bookings found."
				});
			}
			
			setBookingList(bookingData);
		} catch (err) {
			console.error("Error fetching bookings:", err);
			setMessageAlert({
				show: true,
				type: "danger",
				message: `Failed to load bookings: ${err.message}`
			});
			// Đặt một mảng rỗng để tránh lỗi
			setBookingList([]);
		}
	};

	// Function to handle check-in process
	const handleCheckIn = async (bookingId) => {
		try {
			setLoadingAction(true);
			const response = await fetch(`${bookingAPI}/${bookingId}/checkin`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();
			
			if (response.ok) {
				// Update local booking status
				setBookingList(bookingList.map(booking => 
					booking.bookingId === bookingId 
					? {...booking, status: "CHECKED_IN"} 
					: booking
				));
				
				setMessageAlert({
					show: true,
					type: "success",
					message: "Check-in completed successfully!"
				});
				
				// Auto refresh the list
				getBooking();
			} else {
				setMessageAlert({
					show: true,
					type: "danger",
					message: data.message || "Failed to check-in. Please try again."
				});
			}
		} catch (error) {
			console.error("Error during check-in:", error);
			setMessageAlert({
				show: true,
				type: "danger",
				message: "An error occurred during check-in."
			});
		} finally {
			setLoadingAction(false);
		}
	};

	// Function to handle staff assignment
	const handleAssignStaff = async (bookingId) => {
		try {
			setLoadingAction(true);
			const response = await fetch(`${bookingAPI}/${bookingId}/assign`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();
			
			if (response.ok) {
				// Update local booking status
				setBookingList(bookingList.map(booking => 
					booking.bookingId === bookingId 
					? {...booking, status: "ASSIGNED"} 
					: booking
				));
				
				setMessageAlert({
					show: true,
					type: "success",
					message: `Staff assigned successfully! Doctor: ${data.result?.assignedDoctor || "N/A"}`
				});
				
				// Auto refresh the list
				getBooking();
			} else {
				setMessageAlert({
					show: true,
					type: "danger",
					message: data.message || "Failed to assign staff. Please try again."
				});
			}
		} catch (error) {
			console.error("Error during staff assignment:", error);
			setMessageAlert({
				show: true,
				type: "danger",
				message: "An error occurred during staff assignment."
			});
		} finally {
			setLoadingAction(false);
		}
	};

	// Function to display booking status with appropriate badge
	const renderStatusBadge = (status) => {
		if (!status || status === "n/a") return <Badge bg="light" text="dark">Pending</Badge>;
		
		const statusColors = {
			"PENDING": { bg: "warning", text: "dark" },
			"PAID": { bg: "info", text: "dark" },
			"CHECKED_IN": { bg: "primary", text: "white" },
			"ASSIGNED": { bg: "success", text: "white" },
			"DIAGNOSED": { bg: "info", text: "white" },
			"VACCINE_INJECTED": { bg: "primary", text: "white" },
			"COMPLETED": { bg: "success", text: "white" },
			"CANCELLED": { bg: "danger", text: "white" }
		};
		
		const style = statusColors[status] || { bg: "secondary", text: "white" };
		return <Badge bg={style.bg} text={style.text}>{status}</Badge>;
	};

	//Sort the booking by vaccination date. The upcoming vaccination date with go first, any past vaccination date will go last
	const sortBookings = (bookings) => {
		// Kiểm tra nếu bookings không phải mảng hoặc rỗng
		if (!Array.isArray(bookings) || bookings.length === 0) {
			return [];
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0); // Normalize to midnight

		const futureBookings = [];
		const pastBookings = [];

		bookings.forEach((booking) => {
			if (!booking || !booking.appointmentDate) {
				console.warn("Invalid booking found:", booking);
				return; // Skip this booking
			}

			try {
				const bookingDate = new Date(booking.appointmentDate);
				bookingDate.setHours(0, 0, 0, 0); // Normalize

				if (bookingDate >= today) {
					futureBookings.push(booking);
				} else {
					pastBookings.push(booking);
				}
			} catch (error) {
				console.error("Error processing booking date:", error, booking);
			}
		});

		futureBookings.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
		pastBookings.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

		return [...futureBookings, ...pastBookings];
	};

	//Function to search by children name and filter by status
	const handleSearch = () => {
		// Đảm bảo bookingList là một mảng
		const safeBookingList = Array.isArray(bookingList) ? bookingList : [];
		
		// Nếu mảng rỗng, hiển thị thông báo và thoát sớm
		if (safeBookingList.length === 0) {
			setFilteredList([]);
			setCurrentPage(1);
			return;
		}
		
		let filtered = [...safeBookingList];
		
		// Kiểm tra toàn bộ mảng tìm phần tử lỗi
		filtered = filtered.filter(booking => {
			if (!booking) return false;
			return true;
		});
		
		// Filter by child name
		if (searchName) {
			filtered = filtered.filter((booking) => 
				// Thêm kiểm tra an toàn cho booking.child
				booking.child && 
				booking.child.name && 
				booking.child.name.toLowerCase().includes(searchName.toLowerCase())
			);
		}
		
		// Filter by status
		if (statusFilter !== "ALL") {
			filtered = filtered.filter((booking) => booking.status === statusFilter);
		}
		
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

	// Function to generate patient enroll number (for display purposes)
	const generateEnrollNumber = (bookingId, appointmentDate) => {
		const date = new Date(appointmentDate);
		const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
		return `ENR-${dateStr}-${bookingId.toString().padStart(3, '0')}`;
	};

	return (
		<>
			<Navigation />
			<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
				<Row lg={10}>
					<StaffMenu />
					<Col>
						<Container className="py-4">
							<h1 className="mb-4 text-primary">Check-In & Assign Staff</h1>
							<hr className="mb-4"></hr>
							
							{messageAlert.show && (
								<Alert variant={messageAlert.type} onClose={() => setMessageAlert({...messageAlert, show: false})} dismissible>
									{messageAlert.message}
								</Alert>
							)}
							
							<Row className="mb-3">
								<Col md={8}>
									<Form.Control 
										type="text" 
										placeholder="Search Child Name" 
										value={searchName} 
										onChange={(e) => setSearchName(e.target.value)} 
									/>
								</Col>
								<Col md={4}>
									<Form.Select 
										value={statusFilter} 
										onChange={(e) => setStatusFilter(e.target.value)}
									>
										<option value="ALL">All Statuses</option>
										<option value="PENDING">Pending</option>
										<option value="PAID">Paid</option>
										<option value="CHECKED_IN">Checked In</option>
										<option value="ASSIGNED">Assigned</option>
										<option value="DIAGNOSED">Diagnosed</option>
										<option value="VACCINE_INJECTED">Vaccine Injected</option>
										<option value="COMPLETED">Completed</option>
										<option value="CANCELLED">Cancelled</option>
									</Form.Select>
								</Col>
							</Row>
							
							<Table striped bordered hover responsive>
								<thead>
									<tr>
										<th>#</th>
										<th>Enroll Number</th>
										<th>Appointment Date</th>
										<th>Child Name</th>
										<th>Parent Name</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{currentBookings.length > 0 ? (
										currentBookings.map((booking) => (
											<tr key={booking.bookingId}>
												<td>{booking.bookingId}</td>
												<td>{generateEnrollNumber(booking.bookingId, booking.appointmentDate)}</td>
												<td>{booking.appointmentDate}</td>
												<td>{booking.child?.name || "N/A"}</td>
												<td>
													{booking.child && booking.child.account
														? `${booking.child.account.firstName || ""} ${booking.child.account.lastName || ""}`.trim() || "N/A"
														: "N/A"}
												</td>
												<td>
													{renderStatusBadge(booking.status)}
												</td>
												<td>
													{booking.status === "PAID" && (
														<Button 
															size="sm" 
															variant="primary" 
															onClick={() => handleCheckIn(booking.bookingId)}
															disabled={loadingAction}
															className="me-1"
														>
															Check-in
														</Button>
													)}
													
													{booking.status === "CHECKED_IN" && (
														<Button 
															size="sm" 
															variant="success" 
															onClick={() => handleAssignStaff(booking.bookingId)}
															disabled={loadingAction}
															className="me-1"
														>
															Assign Staff
														</Button>
													)}
													
													{booking.status === "ASSIGNED" && (
														<Button 
															size="sm" 
															variant="info" 
															onClick={() => {
																setSelectedBooking(booking);
																setIsDiagnosisOpen(true);
															}}
															className="me-1"
														>
															Add Diagnosis
														</Button>
													)}
													
													{booking.status === "DIAGNOSED" && (
														<Button 
															size="sm" 
															variant="warning" 
															onClick={() => {
																// Redirect to vaccination page using navigate
																navigate(`/Staff/Vaccination/${booking.bookingId}`);
															}}
															className="me-1"
														>
															Administer Vaccine
														</Button>
													)}
													
													{(booking.status === "VACCINE_INJECTED" || booking.status === "COMPLETED") && (
														<Button 
															size="sm" 
															variant="secondary" 
															onClick={() => {
																setSelectedBooking(booking);
																setIsRecordOpen(true);
															}}
															className="me-1"
														>
															View Records
														</Button>
													)}
													
													{/* Temporary solution to see all buttons regardless of status */}
													{(!booking.status || booking.status === "n/a") && (
														<>
															<Button 
																size="sm" 
																variant="primary" 
																onClick={() => handleCheckIn(booking.bookingId)}
																disabled={loadingAction}
																className="me-1"
															>
																Check-in
															</Button>
															<Button 
																size="sm" 
																variant="success" 
																onClick={() => handleAssignStaff(booking.bookingId)}
																disabled={loadingAction}
																className="me-1"
															>
																Assign Staff
															</Button>
															<Button 
																size="sm" 
																variant="warning" 
																onClick={() => navigate(`/Staff/Vaccination/${booking.bookingId}`)}
																className="me-1"
															>
																Go To Vaccination
															</Button>
														</>
													)}
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={7} className="text-center">No bookings match your criteria</td>
										</tr>
									)}
								</tbody>
							</Table>
							{pagination}
							
							{isDiagnosisOpen && (
								<Diagnosis 
									open={isDiagnosisOpen} 
									setIsOpen={setIsDiagnosisOpen} 
									booking={selectedBooking}
									onDiagnosisComplete={() => {
										setIsDiagnosisOpen(false);
										getBooking(); // Refresh list after diagnosis
									}}
								/>
							)}
							
							{isRecordOpen && (
								<DetailReaction 
									open={isRecordOpen} 
									setIsOpen={setIsRecordOpen} 
									booking={selectedBooking}
								/>
							)}
						</Container>
					</Col>
				</Row>
			</div>
		</>
	);
}

export default CheckIn;
