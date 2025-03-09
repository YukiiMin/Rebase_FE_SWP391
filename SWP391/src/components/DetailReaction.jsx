import React from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";

function DetailReaction({ open, setIsOpen }) {
	const handleClose = () => {
		setIsOpen(false);
	};
	return (
		<>
			<Modal show={open} onHide={handleClose} size="xl">
				<Form>
					<Modal.Header closeButton>
						<Modal.Title>Detail</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3" controlId="childName">
							<Form.Label>Child Name</Form.Label>
							<Form.Control type="text" placeholder="Enter username" name="username" value="Child 1" readOnly />
						</Form.Group>
						<Row className="mb-3">
							<Col xl={10}>
								<Row>
									<Form.Group as={Col} controlId="doctorName">
										<Form.Label>Doctor Name</Form.Label>
										<Form.Control type="text" placeholder="Enter username" name="username" value="Snoop Dogg" readOnly />
									</Form.Group>
									<Form.Group as={Col} controlId="doctorName">
										<Form.Label>Nurse Name</Form.Label>
										<Form.Control type="text" placeholder="Enter username" name="username" value="Jack" readOnly />
									</Form.Group>
								</Row>
							</Col>
							<Col xl={2}>
								<Form.Group controlId="doctorName">
									<Form.Label>Room</Form.Label>
									<Form.Control type="number" placeholder="Enter username" name="username" value="420" readOnly />
								</Form.Group>
							</Col>
						</Row>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>Vaccine name</th>
									<th>Dose No.</th>
									<th>Result</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>Covid 19</td>
									<td>1</td>
									<td>
										<Form.Group className="mb-3" controlId="txtRole">
											<Form.Check type={"checkbox"} id={`checkbox-vaccine`} />
										</Form.Group>
									</td>
								</tr>
								<tr>
									<td>2</td>
									<td>Sot xuat huyet</td>
									<td>1</td>
									<td>
										<Form.Group className="mb-3" controlId="txtRole">
											<Form.Check type={"checkbox"} id={`checkbox-vaccine`} />
										</Form.Group>
									</td>
								</tr>
							</tbody>
						</Table>
						<Form.Group className="mb-3" controlId="description">
							<Form.Label>Reaction description</Form.Label>
							<Form.Control as="textarea" rows={3} placeholder="Enter child reaction" name="description" />
						</Form.Group>

						{/* <Form.Group className="mb-3" controlId="txtRole">
							<Form.Label>Reaction</Form.Label>
							<Form.Select aria-label="Role" name="Reaction">
								<option value="">---Reaction---</option>
								<option value="false">No Reaction</option>
								<option value="true">Have Reaction</option>
							</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3" controlId="description">
							<Form.Label>Reaction description</Form.Label>
							<Form.Control as="textarea" rows={3} placeholder="Enter child reaction" name="description" />
						</Form.Group>
						<Form.Group className="mb-3" controlId="doctorName">
							<Form.Label>Used Vaccine</Form.Label>
							<Form.Control type="text" placeholder="Enter username" name="username" value="Tieu chay, Viem gan, Covid" readOnly />
						</Form.Group> */}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="primary" type="submit">
							Save Changes
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}

export default DetailReaction;
