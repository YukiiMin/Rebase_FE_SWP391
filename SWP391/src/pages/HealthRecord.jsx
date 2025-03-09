import React from "react";
import Navigation from "../components/Navbar";
import { Button, Col, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import SideMenu from "../components/SideMenu";

function HealthRecord() {
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<Row>
					<SideMenu />
					<Col>
						<h2>Health Record:</h2>
						<Tabs defaultActiveKey="child1" id="uncontrolled-tab-example" className="mb-3">
							<Tab eventKey="child1" title="Child 1">
								<Table striped bordered hover responsive>
									<thead>
										<tr>
											<th>#</th>
											<th>Check-in Date</th>
											<th>Doctor</th>
											<th>Diagnosis Detail</th>
											<th>Nurse</th>
											<th>Vaccination Record Detail</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>09/03/2023</td>
											<td>Snoop Dogg</td>
											<td>
												<Button size="sm">Diagnosis</Button>
											</td>
											<td>Jack97</td>
											<td>
												<Button size="sm">Record</Button>
											</td>
										</tr>
									</tbody>
								</Table>
							</Tab>
							<Tab eventKey="child2" title="Child 2">
								<Table striped bordered hover responsive>
									<thead>
										<tr>
											<th>#</th>
											<th>Check-in Date</th>
											<th>Doctor</th>
											<th>Diagnosis Detail</th>
											<th>Nurse</th>
											<th>Vaccination Record Detail</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>1</td>
											<td>09/03/2023</td>
											<td>John Cena</td>
											<td>
												<Button size="sm">Diagnosis</Button>
											</td>
											<td>Jack97</td>
											<td>
												<Button size="sm">Record</Button>
											</td>
										</tr>
									</tbody>
								</Table>
							</Tab>
						</Tabs>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default HealthRecord;
