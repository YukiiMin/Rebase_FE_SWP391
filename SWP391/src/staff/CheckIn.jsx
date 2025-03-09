import React, { useState } from "react";
import { Badge, Button, Col, Container, Row, Table } from "react-bootstrap";
import StaffMenu from "../components/StaffMenu";
import DetailReaction from "../components/DetailReaction";
import Diagnosis from "../components/Diagnosis";

function CheckIn() {
	const bookingAPI = "";
	const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
	const [isRecordOpen, setIsRecordOpen] = useState(false);

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<StaffMenu />
				<Col>
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Check-In</h1>
						<hr className="mb-4"></hr>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>Parent</th>
									<th>Child</th>
									<th>Check-in Date and Time</th>
									<th>Status</th>
									<th>Patient Number</th>
									<th>Assign Doctor</th>
									<th>Doctor</th>
									{/*<th>Room</th> */}
									<th>Doctor Diagnosis</th>
									<th>Health Record</th>
								</tr>
							</thead>
							<tbody>
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
									{/* <td>Snoop Dogg</td>
									<td>401</td> */}
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
								</tr>
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
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default CheckIn;
