import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

function Dashboard() {
	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col>
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Dashboard</h1>
						<hr className="mb-4"></hr>
						<Row xs={1} md={3} className="g-4">
							<Col>
								<Card className="h-100 shadow-sm">
									<Card.Body>
										<Card.Title className="text-primary">Accounts</Card.Title>
										<Card.Text>
											Total: 100 accounts
											<br />
											Admin: 2, User: 70, Staff: 28
										</Card.Text>
									</Card.Body>
								</Card>
							</Col>
							<Col>
								<Card className="h-100 shadow-sm">
									<Card.Body>
										<Card.Title className="text-primary">Vaccines</Card.Title>
										<Card.Text>
											In stock: 2704 doses
											<br />
											Most used: Covid, HIV, Others
										</Card.Text>
									</Card.Body>
								</Card>
							</Col>
							<Col>
								<Card className="h-100 shadow-sm">
									<Card.Body>
										<Card.Title className="text-primary">Revenue</Card.Title>
										<Card.Text>5,000,000$</Card.Text>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default Dashboard;
