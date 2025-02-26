import React from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";

function UserChildren() {
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<Row>
					<SideMenu />
					<Col>
						<Row>
							<Col>
								<h2>Children</h2>
							</Col>
							<Col className="text-end">
								<Button>Add</Button>
							</Col>
						</Row>
						<hr></hr>
						<Container>
							<Card>
								<Card.Header as="h5">Children name</Card.Header>
								<Card.Body>
									<Card.Text>
										<b>Id:</b> 12345
										<br />
										<b>Gender:</b> Non binary <b>Date of birth:</b> 01-01-2025
										<br />
										<b>Weight:</b> 1kg <b>Height:</b> 20cm
									</Card.Text>
									<Button variant="info">Edit</Button>
									<Button variant="danger">Delete</Button>
								</Card.Body>
							</Card>
						</Container>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserChildren;
