import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row, Table, Alert, Spinner } from "react-bootstrap";

function Diagnosis({ open, setIsOpen, booking, onDiagnosisComplete }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [diagnosisData, setDiagnosisData] = useState({
		diagnosisResults: [],
		recommendedVaccines: ""
	});
	const token = localStorage.getItem("token");

	useEffect(() => {
		// Initialize diagnosis results based on ordered vaccines
		if (booking && booking.vaccineOrders) {
			const initialResults = booking.vaccineOrders.map(order => ({
				vaccineOrderId: order.id,
				vaccineName: order.vaccine?.name || "Unknown Vaccine",
				doseNumber: 1, // Default value, can be adjusted based on child's history
				result: "",
				note: ""
			}));
			setDiagnosisData({
				...diagnosisData,
				diagnosisResults: initialResults
			});
		}
	}, [booking]);

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleDiagnosisChange = (index, field, value) => {
		const updatedResults = [...diagnosisData.diagnosisResults];
		updatedResults[index] = {
			...updatedResults[index],
			[field]: value
		};
		setDiagnosisData({
			...diagnosisData,
			diagnosisResults: updatedResults
		});
	};

	const handleSubmitDiagnosis = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");

		// Validate form
		const isValid = diagnosisData.diagnosisResults.every(result => 
			result.result && result.result.trim() !== ""
		);

		if (!isValid) {
			setError("Please provide a diagnosis result for each vaccine");
			setLoading(false);
			return;
		}

		try {
			// Submit diagnosis to backend
			const response = await fetch(`http://localhost:8080/diagnosis/${booking.bookingId}/create`, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					diagnosisResults: diagnosisData.diagnosisResults,
					recommendedVaccines: diagnosisData.recommendedVaccines
				})
			});

			const data = await response.json();
			
			if (response.ok) {
				setSuccess("Diagnosis submitted successfully");
				setTimeout(() => {
					if (onDiagnosisComplete) {
						onDiagnosisComplete();
					}
				}, 1500);
			} else {
				setError(data.message || "Failed to submit diagnosis");
			}
		} catch (error) {
			console.error("Error submitting diagnosis:", error);
			setError("An error occurred while submitting the diagnosis");
		} finally {
			setLoading(false);
		}
	};

	// If no booking is selected, don't render
	if (!booking) return null;

	return (
		<>
			<Modal show={open} onHide={handleClose} size="xl">
				<Form onSubmit={handleSubmitDiagnosis}>
					<Modal.Header closeButton>
						<Modal.Title>Medical Diagnosis - Enroll #{booking.bookingId}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{error && <Alert variant="danger">{error}</Alert>}
						{success && <Alert variant="success">{success}</Alert>}

						<Form.Group className="mb-3" controlId="childName">
							<Form.Label>Child Name</Form.Label>
							<Form.Control type="text" value={booking.child?.name || "N/A"} readOnly />
						</Form.Group>
						<Row className="mb-3">
							<Col xl={8}>
								<Row>
									<Form.Group as={Col} controlId="parentName">
										<Form.Label>Parent Name</Form.Label>
										<Form.Control 
											type="text" 
											value={booking.child?.account ? 
												`${booking.child.account.firstName} ${booking.child.account.lastName}` : 
												"N/A"} 
											readOnly 
										/>
									</Form.Group>
									<Form.Group as={Col} controlId="appointmentDate">
										<Form.Label>Appointment Date</Form.Label>
										<Form.Control type="text" value={booking.appointmentDate || "N/A"} readOnly />
									</Form.Group>
								</Row>
							</Col>
							<Col xl={4}>
								<Form.Group controlId="bookingStatus">
									<Form.Label>Booking Status</Form.Label>
									<Form.Control type="text" value={booking.status || "N/A"} readOnly />
								</Form.Group>
							</Col>
						</Row>
						
						<h5 className="mt-4">Diagnosis Details</h5>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>Vaccine name</th>
									<th>Dose No.</th>
									<th>Diagnosis Result</th>
									<th>Note</th>
								</tr>
							</thead>
							<tbody>
								{diagnosisData.diagnosisResults.length > 0 ? (
									diagnosisData.diagnosisResults.map((vaccine, index) => (
										<tr key={index}>
											<td>{index + 1}</td>
											<td>{vaccine.vaccineName}</td>
											<td>{vaccine.doseNumber}</td>
											<td>
												<Form.Group className="mb-0">
													<Form.Select 
														value={vaccine.result}
														onChange={(e) => handleDiagnosisChange(index, "result", e.target.value)}
														required
													>
														<option value="">Select result</option>
														<option value="NORMAL">Normal - Can proceed with vaccination</option>
														<option value="CAUTION">Caution - Proceed with extra monitoring</option>
														<option value="POSTPONE">Postpone - Minor issues require delay</option>
														<option value="CONTRAINDICATED">Contraindicated - Cannot vaccinate</option>
													</Form.Select>
												</Form.Group>
											</td>
											<td>
												<Form.Group className="mb-0">
													<Form.Control 
														as="textarea" 
														rows={1} 
														placeholder="Additional notes" 
														value={vaccine.note}
														onChange={(e) => handleDiagnosisChange(index, "note", e.target.value)}
													/>
												</Form.Group>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={5} className="text-center">No vaccines found in this booking</td>
									</tr>
								)}
							</tbody>
						</Table>
						<Form.Group className="mb-3" controlId="recommendedVaccines">
							<Form.Label>Recommended Future Vaccines</Form.Label>
							<Form.Control 
								as="textarea" 
								rows={3} 
								placeholder="Enter recommended vaccines for future appointments" 
								value={diagnosisData.recommendedVaccines}
								onChange={(e) => setDiagnosisData({...diagnosisData, recommendedVaccines: e.target.value})}
							/>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose} disabled={loading}>
							Close
						</Button>
						<Button variant="primary" type="submit" disabled={loading}>
							{loading ? (
								<>
									<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
									<span className="ms-2">Processing...</span>
								</>
							) : "Submit Diagnosis"}
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}

export default Diagnosis;
