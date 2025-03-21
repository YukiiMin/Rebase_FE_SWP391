import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Table, Row, Alert, Spinner } from 'react-bootstrap';
import StaffMenu from "../components/StaffMenu";
import { jwtDecode } from 'jwt-decode';
import Navigation from "../components/Navbar";

function VaccinationPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState(null);
    const [diagnosis, setDiagnosis] = useState(null);
    const [vaccines, setVaccines] = useState([]);
    const [vaccinationNotes, setVaccinationNotes] = useState({});
    const [success, setSuccess] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [testMode, setTestMode] = useState(false);
    const [nurseId, setNurseId] = useState(null);

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
            setNurseId(decoded.sub || "test_nurse_id");
        } catch (error) {
            console.error("Error decoding token:", error);
            if (!testMode) {
                setNurseId("test_nurse_id");
                setTestMode(true);
            }
        }

        // Fetch booking details and diagnosis when component mounts
        if (bookingId) {
            fetchBookingDetails();
            fetchDiagnosisDetails();
        }
    }, [bookingId, token, navigate, testMode]);

    const createDummyData = () => {
        console.log("Creating dummy data for testing");
        
        // Create dummy booking
        const dummyBooking = {
            bookingId: bookingId || 1,
            appointmentDate: "2025-03-21",
            status: "DIAGNOSED",
            child: {
                name: "Yukii Meo",
                account: {
                    firstName: "Hoang",
                    lastName: "Minh"
                }
            }
        };
        
        // Create dummy diagnosis
        const dummyDiagnosis = {
            diagnosisId: 1,
            doctorName: "Dr. Test Doctor",
            diagnosisDate: "2025-03-21",
            recommendedVaccines: "Patient should get additional vaccines in 3 months.",
            diagnosisResults: [
                {
                    vaccineOrderId: 1,
                    vaccineName: "Covid-19 Vaccine",
                    doseNumber: 1,
                    result: "NORMAL",
                    note: "Patient is healthy and ready for vaccination"
                },
                {
                    vaccineOrderId: 2,
                    vaccineName: "Influenza Vaccine",
                    doseNumber: 1,
                    result: "CAUTION",
                    note: "Patient has mild allergies, monitor after vaccination"
                }
            ]
        };
        
        setBooking(dummyBooking);
        setDiagnosis(dummyDiagnosis);
        
        // Set vaccines from diagnosis
        const eligibleVaccines = dummyDiagnosis.diagnosisResults.filter(
            result => result.result === "NORMAL" || result.result === "CAUTION"
        );
        
        setVaccines(eligibleVaccines);
        
        // Initialize notes
        const notes = {};
        eligibleVaccines.forEach(vaccine => {
            notes[vaccine.vaccineOrderId] = "";
        });
        setVaccinationNotes(notes);
        
        setLoading(false);
    };

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
            if (!testMode) {
                setLoading(false);
            }
        }
    };

    const fetchDiagnosisDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/diagnosis/${bookingId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Diagnosis data:", data);
                setDiagnosis(data.result);
                
                // Initialize vaccines from diagnosis results
                if (data.result && data.result.diagnosisResults) {
                    const eligibleVaccines = data.result.diagnosisResults.filter(
                        result => result.result === "NORMAL" || result.result === "CAUTION"
                    );
                    
                    setVaccines(eligibleVaccines);
                    
                    // Initialize notes object
                    const notes = {};
                    eligibleVaccines.forEach(vaccine => {
                        notes[vaccine.vaccineOrderId] = "";
                    });
                    setVaccinationNotes(notes);
                }
            } else {
                console.error("Failed to load diagnosis details, status:", response.status);
                setError("Failed to load diagnosis details");
                
                // In test mode, we already created dummy data in fetchBookingDetails
            }
        } catch (error) {
            console.error("Error fetching diagnosis:", error);
            setError("An error occurred while fetching diagnosis data");
            
            // In test mode, we already created dummy data in fetchBookingDetails
        }
    };

    const handleNoteChange = (vaccineOrderId, note) => {
        setVaccinationNotes({
            ...vaccinationNotes,
            [vaccineOrderId]: note
        });
    };

    const handleSubmitVaccination = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Lấy dữ liệu các vaccine cần tiêm
            const vaccinationData = vaccines.map(vaccine => ({
                vaccineOrderId: vaccine.vaccineOrderId,
                notes: vaccinationNotes[vaccine.vaccineOrderId] || ""
            }));

            // For testing mode, just simulate a successful response
            if (testMode) {
                console.log("Test mode: Simulating successful vaccination", vaccinationData);
                setTimeout(() => {
                    setSuccess("Vaccination records successfully created! (TEST MODE)");
                    setTimeout(() => {
                        navigate("/Staff/Vaccination");
                    }, 2000);
                }, 1000);
            } else {
                // Gọi API để ghi nhận tiêm chủng
                console.log(`Sending vaccination request for booking ${bookingId} with nurse ${nurseId}`);
                
                const response = await fetch(`http://localhost:8080/vaccination/${bookingId}/injection/${nurseId}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        vaccinations: vaccinationData
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Vaccination response:", data);
                    setSuccess("Vaccination records successfully created!");
                    setTimeout(() => {
                        navigate("/Staff/Vaccination");
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    console.error("Error response:", errorData);
                    setError(errorData.message || "Failed to record vaccinations");
                }
            }
        } catch (error) {
            console.error("Error recording vaccinations:", error);
            setError("An error occurred while submitting vaccination data");
        } finally {
            setLoading(false);
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
                            <span className="ms-2">Loading vaccination data...</span>
                        </Container>
                    </Col>
                </Row>
            </div>
        );
    }

    // Verify booking status is DIAGNOSED
    if (booking && booking.status !== "DIAGNOSED") {
        // FOR TESTING: Comment out the redirect for now to allow viewing the page
        console.log("Warning: Booking is not in DIAGNOSED state. Current status:", booking.status);
        
        // Instead of redirecting, show a warning but continue rendering the page
        return (
            <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Row lg={10}>
                    <StaffMenu />
                    <Col>
                        <Container className="py-4">
                            <Alert variant="warning">
                                <Alert.Heading>Testing Mode - Invalid Booking Status</Alert.Heading>
                                <p>This booking is not ready for vaccination. Current status: {booking.status || "n/a"}</p>
                                <p>In production, you would be redirected to the check-in page.</p>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" onClick={() => navigate("/Staff/Vaccination")}>
                                        Return to Vaccination Management
                                    </Button>
                                    <Button variant="danger" onClick={() => setError("")}>
                                        Continue anyway (Testing)
                                    </Button>
                                </div>
                            </Alert>
                            
                            {/* Continue rendering the page normally below this alert */}
                            <h1 className="text-primary mb-4">Administer Vaccination (TEST MODE)</h1>
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
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card className="mb-4">
                                <Card.Header as="h5">Doctor's Diagnosis</Card.Header>
                                <Card.Body>
                                    {diagnosis ? (
                                        <>
                                            <p><strong>Diagnosed by:</strong> {diagnosis.doctorName || "N/A"}</p>
                                            <p><strong>Diagnosis Date:</strong> {diagnosis.diagnosisDate || "N/A"}</p>
                                            
                                            {diagnosis.recommendedVaccines && (
                                                <div className="mb-3">
                                                    <p><strong>Doctor's Recommendations:</strong></p>
                                                    <Alert variant="info">
                                                        {diagnosis.recommendedVaccines}
                                                    </Alert>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p>No diagnosis information available</p>
                                    )}
                                </Card.Body>
                            </Card>

                            <h4 className="mt-4 mb-3">Vaccine Administration</h4>
                            <Form onSubmit={handleSubmitVaccination}>
                                {vaccines.length > 0 ? (
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Vaccine</th>
                                                <th>Dose</th>
                                                <th>Doctor's Assessment</th>
                                                <th>Admin Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vaccines.map((vaccine, index) => (
                                                <tr key={index}>
                                                    <td>{vaccine.vaccineName}</td>
                                                    <td>{vaccine.doseNumber}</td>
                                                    <td>
                                                        {vaccine.result} 
                                                        {vaccine.note && <div className="text-muted small">{vaccine.note}</div>}
                                                    </td>
                                                    <td>
                                                        <Form.Control 
                                                            as="textarea" 
                                                            rows={2}
                                                            placeholder="Enter notes about administration"
                                                            value={vaccinationNotes[vaccine.vaccineOrderId] || ""}
                                                            onChange={(e) => handleNoteChange(vaccine.vaccineOrderId, e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Alert variant="warning">
                                        No vaccines eligible for administration based on doctor's diagnosis
                                    </Alert>
                                )}

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
                                        disabled={loading || vaccines.length === 0}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                <span className="ms-2">Processing...</span>
                                            </>
                                        ) : "Record Vaccinations"}
                                    </Button>
                                </div>
                            </Form>
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
                            <h1 className="text-primary mb-4">Administer Vaccination</h1>
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
                                            <p><strong>Nurse ID:</strong> {nurseId || "N/A"}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card className="mb-4">
                                <Card.Header as="h5">Doctor's Diagnosis</Card.Header>
                                <Card.Body>
                                    {diagnosis ? (
                                        <>
                                            <p><strong>Diagnosed by:</strong> {diagnosis.doctorName || "N/A"}</p>
                                            <p><strong>Diagnosis Date:</strong> {diagnosis.diagnosisDate || "N/A"}</p>
                                            
                                            {diagnosis.recommendedVaccines && (
                                                <div className="mb-3">
                                                    <p><strong>Doctor's Recommendations:</strong></p>
                                                    <Alert variant="info">
                                                        {diagnosis.recommendedVaccines}
                                                    </Alert>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p>No diagnosis information available</p>
                                    )}
                                </Card.Body>
                            </Card>

                            <h4 className="mt-4 mb-3">Vaccine Administration</h4>
                            <Form onSubmit={handleSubmitVaccination}>
                                {vaccines.length > 0 ? (
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Vaccine</th>
                                                <th>Dose</th>
                                                <th>Doctor's Assessment</th>
                                                <th>Admin Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vaccines.map((vaccine, index) => (
                                                <tr key={index}>
                                                    <td>{vaccine.vaccineName}</td>
                                                    <td>{vaccine.doseNumber}</td>
                                                    <td>
                                                        {vaccine.result} 
                                                        {vaccine.note && <div className="text-muted small">{vaccine.note}</div>}
                                                    </td>
                                                    <td>
                                                        <Form.Control 
                                                            as="textarea" 
                                                            rows={2}
                                                            placeholder="Enter notes about administration"
                                                            value={vaccinationNotes[vaccine.vaccineOrderId] || ""}
                                                            onChange={(e) => handleNoteChange(vaccine.vaccineOrderId, e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Alert variant="warning">
                                        No vaccines eligible for administration based on doctor's diagnosis
                                    </Alert>
                                )}

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
                                        disabled={loading || vaccines.length === 0}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                <span className="ms-2">Processing...</span>
                                            </>
                                        ) : "Record Vaccinations"}
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

export default VaccinationPage; 