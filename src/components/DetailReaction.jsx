import React, { useState, useEffect } from "react";
import { Alert, Badge, Button, Col, Form, Modal, Row, Table, Spinner } from "react-bootstrap";

function DetailReaction({ open, setIsOpen, booking }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [vaccineRecords, setVaccineRecords] = useState([]);
	const [reactionData, setReactionData] = useState({
		reaction: ""
	});
	const token = localStorage.getItem("token");

	useEffect(() => {
		if (booking && booking.bookingId) {
			fetchVaccinationRecords();
		}
	}, [booking]);

	const fetchVaccinationRecords = async () => {
		try {
			setLoading(true);
			const response = await fetch(`http://localhost:8080/vaccination/records/${booking.bookingId}`, {
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setVaccineRecords(data.result || []);
			} else {
				console.error("Failed to fetch vaccination records");
			}
		} catch (error) {
			console.error("Error fetching vaccination records:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleReactionSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Only submit if there's reaction text
			if (!reactionData.reaction.trim()) {
				setError("Please enter reaction details");
				setLoading(false);
				return;
			}

			const response = await fetch(`http://localhost:8080/booking/${booking.bookingId}/reaction`, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					reaction: reactionData.reaction
				})
			});

			if (response.ok) {
				// Close modal after successful submission
				setTimeout(() => {
					handleClose();
				}, 1500);
			} else {
				const data = await response.json();
				setError(data.message || "Failed to record reaction");
			}
		} catch (error) {
			console.error("Error recording reaction:", error);
			setError("An error occurred while recording the reaction");
		} finally {
			setLoading(false);
		}
	};

	// If no booking is selected, don't render
	if (!booking) return null;

	// Check if reaction is already recorded
	const hasReaction = booking.reaction && booking.reaction.trim() !== "";

	// Determine if bookings is in a state where reactions can be recorded
	const canRecordReaction = booking.status === "VACCINE_INJECTED" && !hasReaction;

	return (
		<>
			<Modal show={open} onHide={handleClose} size="xl">
				<Form onSubmit={handleReactionSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Vaccination Details - Enroll #{booking.bookingId}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{error && <Alert variant="danger">{error}</Alert>}

						<Form.Group className="mb-3" controlId="childName">
							<Form.Label>Child Name</Form.Label>
							<Form.Control type="text" value={booking.child?.name || "N/A"} readOnly />
						</Form.Group>
						<Row className="mb-3">
							<Col md={4}>
								<Form.Group controlId="appointmentDate">
									<Form.Label>Appointment Date</Form.Label>
									<Form.Control type="text" value={booking.appointmentDate || "N/A"} readOnly />
								</Form.Group>
							</Col>
							<Col md={4}>
								<Form.Group controlId="bookingStatus">
									<Form.Label>Booking Status</Form.Label>
									<Form.Control type="text" value={booking.status || "N/A"} readOnly />
								</Form.Group>
							</Col>
							<Col md={4}>
								<Form.Group controlId="parentName">
									<Form.Label>Parent Name</Form.Label>
									<Form.Control 
										type="text" 
										value={booking.child?.account ? 
											`${booking.child.account.firstName} ${booking.child.account.lastName}` : 
											"N/A"} 
										readOnly 
									/>
								</Form.Group>
							</Col>
						</Row>
						
						<h5 className="mt-4">Vaccination Records</h5>
						{loading ? (
							<div className="text-center my-4">
								<Spinner animation="border" variant="primary" />
								<p className="mt-2">Loading vaccination records...</p>
							</div>
						) : (
							<Table striped bordered hover responsive>
								<thead>
									<tr>
										<th>#</th>
										<th>Vaccine Name</th>
										<th>Dose</th>
										<th>Date Administered</th>
										<th>Status</th>
										<th>Notes</th>
									</tr>
								</thead>
								<tbody>
									{vaccineRecords.length > 0 ? (
										vaccineRecords.map((record, index) => (
											<tr key={index}>
												<td>{index + 1}</td>
												<td>{record.vaccineName || "N/A"}</td>
												<td>{record.doseNumber || "1"}</td>
												<td>{record.administeredDate || "N/A"}</td>
												<td>
													<Badge bg={record.status === "COMPLETED" ? "success" : "warning"}>
														{record.status || "PENDING"}
													</Badge>
												</td>
												<td>{record.notes || "No notes"}</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={6} className="text-center">
												No vaccination records found
											</td>
										</tr>
									)}
								</tbody>
							</Table>
						)}
						
						<h5 className="mt-4">Post-Vaccination Reaction</h5>
						{hasReaction ? (
							<>
								<Alert variant="info">
									<p><strong>Recorded Reaction:</strong></p>
									<p>{booking.reaction}</p>
								</Alert>
							</>
						) : (
							<Form.Group className="mb-3" controlId="reaction">
								<Form.Label>Reaction Details</Form.Label>
								<Form.Control 
									as="textarea" 
									rows={3} 
									placeholder={canRecordReaction ? 
										"Enter any reaction details observed after vaccination" : 
										"Reaction can only be recorded after vaccination is completed"}
									value={reactionData.reaction}
									onChange={(e) => setReactionData({...reactionData, reaction: e.target.value})}
									disabled={!canRecordReaction}
								/>
								{!canRecordReaction && booking.status !== "VACCINE_INJECTED" && (
									<Form.Text className="text-muted">
										Reactions can only be recorded for completed vaccinations.
									</Form.Text>
								)}
							</Form.Group>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						{canRecordReaction && (
							<Button variant="primary" type="submit" disabled={loading}>
								{loading ? (
									<>
										<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
										<span className="ms-2">Processing...</span>
									</>
								) : "Record Reaction"}
							</Button>
						)}
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}

export default DetailReaction;
