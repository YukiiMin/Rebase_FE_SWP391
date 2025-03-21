import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Table, Row, Alert, Spinner } from 'react-bootstrap';
import StaffMenu from "../components/StaffMenu";
import { jwtDecode } from 'jwt-decode';
import Navigation from "../components/Navbar";

function DiagnosisPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState(null);
    const [success, setSuccess] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [testMode, setTestMode] = useState(false);
    const [doctorId, setDoctorId] = useState(null);
    
    // Thông tin chẩn đoán
    const [description, setDescription] = useState("");
    const [treatment, setTreatment] = useState("");
    const [result, setResult] = useState("");
    const [vaccineResults, setVaccineResults] = useState([]);

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

        // Lấy thông tin người dùng từ token
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded);
            // Lấy userId từ token (tùy thuộc vào cấu trúc token của bạn)
            setDoctorId(decoded.sub || "test_doctor_id");
        } catch (error) {
            console.error("Error decoding token:", error);
            if (!testMode) {
                setDoctorId("test_doctor_id");
                setTestMode(true);
            }
        }

        // Fetch booking details when component mounts
        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId, token, navigate, testMode]);

    const fetchBookingDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/booking/${bookingId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Booking data:", data);
                setBooking(data.result);
                
                // Nếu booking có vaccine orders, khởi tạo kết quả chẩn đoán cho mỗi vaccine
                if (data.result && data.result.vaccineOrders && data.result.vaccineOrders.length > 0) {
                    const initialVaccineResults = data.result.vaccineOrders.map(order => ({
                        vaccineOrderId: order.id,
                        vaccineName: order.vaccine.name,
                        doseNumber: order.dose ? order.dose.doseNumber : 1,
                        result: "NORMAL", // Mặc định là bình thường
                        note: ""
                    }));
                    setVaccineResults(initialVaccineResults);
                }
            } else {
                console.error("Failed to load booking details, status:", response.status);
                setError("Failed to load booking details");
                
                // If in test mode, create dummy data
                if (testMode) {
                    createDummyData();
                }
            }
        } catch (error) {
            console.error("Error fetching booking:", error);
            setError("An error occurred while fetching booking data");
            
            // If in test mode, create dummy data
            if (testMode) {
                createDummyData();
            }
        } finally {
            setLoading(false);
        }
    };

    const createDummyData = () => {
        console.log("Creating dummy data for testing");
        
        // Create dummy booking
        const dummyBooking = {
            bookingId: bookingId || 1,
            appointmentDate: "2025-03-21",
            status: "ASSIGNED",
            child: {
                name: "Yukii Meo",
                account: {
                    firstName: "Hoang",
                    lastName: "Minh"
                }
            },
            vaccineOrders: [
                {
                    id: 1,
                    vaccine: { id: 1, name: "Covid-19 Vaccine" },
                    dose: { doseNumber: 1 }
                },
                {
                    id: 2,
                    vaccine: { id: 2, name: "Influenza Vaccine" },
                    dose: { doseNumber: 1 }
                }
            ]
        };
        
        setBooking(dummyBooking);
        
        // Khởi tạo kết quả chẩn đoán cho mỗi vaccine
        const initialVaccineResults = dummyBooking.vaccineOrders.map(order => ({
            vaccineOrderId: order.id,
            vaccineName: order.vaccine.name,
            doseNumber: order.dose.doseNumber,
            result: "NORMAL", // Mặc định là bình thường
            note: ""
        }));
        setVaccineResults(initialVaccineResults);
    };

    const handleVaccineResultChange = (index, field, value) => {
        const updatedResults = [...vaccineResults];
        updatedResults[index] = {
            ...updatedResults[index],
            [field]: value
        };
        setVaccineResults(updatedResults);
    };

    const handleSubmitDiagnosis = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Chuẩn bị dữ liệu chẩn đoán
            const diagnosisData = {
                description: description,
                treatment: treatment,
                result: result,
                vaccineResults: vaccineResults
            };

            // For testing mode, just simulate a successful response
            if (testMode) {
                console.log("Test mode: Simulating successful diagnosis", diagnosisData);
                setTimeout(() => {
                    setSuccess("Diagnosis successfully recorded! (TEST MODE)");
                    setTimeout(() => {
                        navigate("/Staff/Vaccination");
                    }, 2000);
                }, 1000);
            } else {
                // Gọi API để ghi nhận chẩn đoán
                console.log(`Sending diagnosis request for booking ${bookingId} with doctor ${doctorId}`);
                
                const response = await fetch(`http://localhost:8080/vaccination/${bookingId}/diagnosis/${doctorId}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(diagnosisData)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Diagnosis response:", data);
                    setSuccess("Diagnosis successfully recorded!");
                    setTimeout(() => {
                        navigate("/Staff/Vaccination");
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    console.error("Error response:", errorData);
                    setError(errorData.message || "Failed to record diagnosis");
                }
            }
        } catch (error) {
            console.error("Error recording diagnosis:", error);
            setError("An error occurred while submitting diagnosis data");
        } finally {
            setLoading(false);
        }
    };

    // Verify booking status is ASSIGNED
    if (booking && booking.status !== "ASSIGNED") {
        console.log("Warning: Booking is not in ASSIGNED state. Current status:", booking.status);
        
        return (
            <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Row lg={10}>
                    <StaffMenu />
                    <Col>
                        <Container className="py-4">
                            <Alert variant="warning">
                                <Alert.Heading>Invalid Booking Status</Alert.Heading>
                                <p>This booking is not ready for diagnosis. Current status: {booking.status || "n/a"}</p>
                                <p>Only bookings with status ASSIGNED can be diagnosed.</p>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" onClick={() => navigate("/Staff/Vaccination")}>
                                        Return to Vaccination Management
                                    </Button>
                                    {testMode && (
                                        <Button variant="danger" onClick={() => setError("")}>
                                            Continue anyway (Testing)
                                        </Button>
                                    )}
                                </div>
                            </Alert>
                        </Container>
                    </Col>
                </Row>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Row lg={10}>
                    <StaffMenu />
                    <Col>
                        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                            <Spinner animation="border" variant="primary" />
                            <span className="ms-2">Loading booking data...</span>
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
                            <h1 className="text-primary mb-4">Doctor's Diagnosis</h1>
                            <hr className="mb-4" />

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Card className="mb-4">
                                <Card.Header as="h5">Patient Information</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Child Name:</strong> {booking?.child?.name || "N/A"}</p>
                                            <p><strong>Booking ID:</strong> {booking?.bookingId || "N/A"}</p>
                                            <p><strong>Appointment Date:</strong> {booking?.appointmentDate || "N/A"}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Parent:</strong> {booking?.child?.account ? 
                                                `${booking.child.account.firstName} ${booking.child.account.lastName}` : 
                                                "N/A"}</p>
                                            <p><strong>Status:</strong> {booking?.status || "N/A"}</p>
                                            <p><strong>Doctor ID:</strong> {doctorId || "N/A"}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Form onSubmit={handleSubmitDiagnosis}>
                                <Card className="mb-4">
                                    <Card.Header as="h5">Medical Assessment</Card.Header>
                                    <Card.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Diagnosis Description</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={3}
                                                placeholder="Enter detailed diagnosis"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label>Recommended Treatment</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={3}
                                                placeholder="Enter treatment recommendations"
                                                value={treatment}
                                                onChange={(e) => setTreatment(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label>Overall Result</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={2}
                                                placeholder="Enter overall diagnosis result"
                                                value={result}
                                                onChange={(e) => setResult(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>

                                <Card className="mb-4">
                                    <Card.Header as="h5">Vaccine Assessment</Card.Header>
                                    <Card.Body>
                                        {vaccineResults.length > 0 ? (
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>Vaccine</th>
                                                        <th>Dose</th>
                                                        <th>Result</th>
                                                        <th>Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vaccineResults.map((vaccine, index) => (
                                                        <tr key={index}>
                                                            <td>{vaccine.vaccineName}</td>
                                                            <td>{vaccine.doseNumber}</td>
                                                            <td>
                                                                <Form.Select 
                                                                    value={vaccine.result}
                                                                    onChange={(e) => handleVaccineResultChange(index, 'result', e.target.value)}
                                                                >
                                                                    <option value="NORMAL">NORMAL</option>
                                                                    <option value="CAUTION">CAUTION</option>
                                                                    <option value="CONTRAINDICATED">CONTRAINDICATED</option>
                                                                </Form.Select>
                                                            </td>
                                                            <td>
                                                                <Form.Control 
                                                                    as="textarea" 
                                                                    rows={2}
                                                                    placeholder="Enter notes about this vaccine"
                                                                    value={vaccine.note}
                                                                    onChange={(e) => handleVaccineResultChange(index, 'note', e.target.value)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <Alert variant="warning">
                                                No vaccines ordered for this booking
                                            </Alert>
                                        )}
                                    </Card.Body>
                                </Card>

                                <div className="d-flex justify-content-end mt-4">
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => navigate("/Staff/Vaccination")}
                                        className="me-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                <span className="ms-2">Processing...</span>
                                            </>
                                        ) : "Submit Diagnosis"}
                                    </Button>
                                </div>
                            </Form>
                        </Container>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default DiagnosisPage; 