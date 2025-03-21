import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Pagination, Row, Table, Alert, Spinner } from "react-bootstrap";
import StaffMenu from "../components/StaffMenu";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navbar";

function VaccinationManagement() {
    const navigate = useNavigate();
    const bookingAPI = "http://localhost:8080/booking";
    
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [bookingList, setBookingList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchName, setSearchName] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageAlert, setMessageAlert] = useState({ show: false, type: "", message: "" });
    const [loadingAction, setLoadingAction] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showRecordModal, setShowRecordModal] = useState(false);

    // Theo dõi thay đổi của localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const currentToken = localStorage.getItem('token');
            setToken(currentToken);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        // Kiểm tra token
        if (!token) {
            console.warn("No token found, redirecting to login");
            navigate('/Login');
            return;
        }
        
        getVaccinationBookings();
    }, [token, navigate]);

    useEffect(() => {
        handleSearch();
    }, [bookingList, searchName, statusFilter]);

    const getVaccinationBookings = async () => {
        try {
            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate('/Login');
                return;
            }
    
            setLoading(true);
            console.log("Fetching vaccination bookings with token:", token);
            const response = await fetch(`${bookingAPI}/all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log("Response status:", response.status);
    
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.error("Unauthorized. Redirecting to login.");
                    localStorage.removeItem('token');
                    setToken(null);
                    navigate('/Login');
                    return;
                }
    
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Booking data received:", data);
            
            // Kiểm tra xem data có phải là mảng không
            const bookingData = Array.isArray(data.result) ? data.result : 
                                (Array.isArray(data) ? data : []);
            
            // Chỉ lấy các booking có status liên quan đến quá trình tiêm chủng
            const relevantBookings = bookingData.filter(booking => 
                ["CHECKED_IN", "ASSIGNED", "DIAGNOSED", "VACCINE_INJECTED"].includes(booking.status)
            );
            
            setBookingList(relevantBookings);
            
        } catch (err) {
            console.error("Error fetching vaccination bookings:", err);
            setMessageAlert({
                show: true,
                type: "danger",
                message: `Failed to load vaccination bookings: ${err.message}`
            });
            setBookingList([]);
        } finally {
            setLoading(false);
        }
    };

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
                getVaccinationBookings();
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
            "CHECKED_IN": { bg: "primary", text: "white" },
            "ASSIGNED": { bg: "success", text: "white" },
            "DIAGNOSED": { bg: "info", text: "white" },
            "VACCINE_INJECTED": { bg: "primary", text: "white" }
        };
        
        const style = statusColors[status] || { bg: "secondary", text: "white" };
        return <Badge bg={style.bg} text={style.text}>{status}</Badge>;
    };

    // Sort bookings by appointment date
    const sortBookings = (bookings) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureBookings = [];
        const pastBookings = [];

        bookings.forEach((booking) => {
            const bookingDate = new Date(booking.appointmentDate);
            bookingDate.setHours(0, 0, 0, 0);

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

    // Search and filter function
    const handleSearch = () => {
        const safeBookingList = Array.isArray(bookingList) ? bookingList : [];
        
        let filtered = [...safeBookingList];
        
        // Filter by child name
        if (searchName) {
            filtered = filtered.filter((booking) => 
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

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItems = currentPage * itemsPerPage;
    const indexOfFirstItems = indexOfLastItems - itemsPerPage;
    const currentBookings = filteredList && filteredList.length > 0 ? 
        filteredList.slice(indexOfFirstItems, indexOfLastItems) : [];
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

    // Generate patient enroll number
    const generateEnrollNumber = (bookingId, appointmentDate) => {
        const date = new Date(appointmentDate);
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        return `ENR-${dateStr}-${bookingId.toString().padStart(3, '0')}`;
    };

    const handleActionClick = (booking) => {
        const { status, bookingId } = booking;
        
        switch(status) {
            case "CHECKED_IN":
                handleAssignStaff(bookingId);
                break;
            case "ASSIGNED":
                // Chuyển đến trang chẩn đoán
                navigate(`/Staff/Diagnosis/${bookingId}`);
                break;
            case "DIAGNOSED":
                navigate(`/Staff/Vaccination/${bookingId}`);
                break;
            case "VACCINE_INJECTED":
                // Hiển thị bản ghi tiêm chủng
                setSelectedBooking(booking);
                setShowRecordModal(true);
                break;
            default:
                setMessageAlert({
                    show: true,
                    type: "warning",
                    message: "No action available for this booking status."
                });
        }
    };

    // Cập nhật render nút Action Button
    const renderActionButton = (booking) => {
        const { status } = booking;
        
        switch(status) {
            case "CHECKED_IN":
                return (
                    <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleActionClick(booking)}
                    >
                        Assign Staff
                    </Button>
                );
            case "ASSIGNED":
                return (
                    <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleActionClick(booking)}
                    >
                        Diagnose
                    </Button>
                );
            case "DIAGNOSED":
                return (
                    <Button 
                        variant="info" 
                        size="sm"
                        onClick={() => handleActionClick(booking)}
                    >
                        Administer Vaccine
                    </Button>
                );
            case "VACCINE_INJECTED":
                return (
                    <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleActionClick(booking)}
                    >
                        View Records
                    </Button>
                );
            default:
                return (
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        disabled
                    >
                        No Action
                    </Button>
                );
        }
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Row lg={10}>
                    <StaffMenu />
                    <Col>
                        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                            <Spinner animation="border" variant="primary" />
                            <span className="ms-2">Loading vaccination bookings...</span>
                        </Container>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <>
            <Navigation />
            <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Row lg={10}>
                    <StaffMenu />
                    <Col>
                        <Container className="py-4">
                            <h1 className="mb-4 text-primary">Vaccination Management</h1>
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
                                        <option value="CHECKED_IN">Checked In</option>
                                        <option value="ASSIGNED">Assigned</option>
                                        <option value="DIAGNOSED">Diagnosed</option>
                                        <option value="VACCINE_INJECTED">Vaccine Injected</option>
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
                                                <td>{booking.child.name}</td>
                                                <td>{`${booking.child.account.firstName} ${booking.child.account.lastName}`}</td>
                                                <td>
                                                    {renderStatusBadge(booking.status)}
                                                </td>
                                                <td>
                                                    {renderActionButton(booking)}
                                                    
                                                    <Button 
                                                        size="sm" 
                                                        variant="primary" 
                                                        onClick={() => navigate(`/Staff/Vaccination/${booking.bookingId}/details`)}
                                                        className="ms-1"
                                                    >
                                                        View Details
                                                    </Button>
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
                        </Container>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default VaccinationManagement; 