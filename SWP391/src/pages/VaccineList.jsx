import React from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function VaccineList() {
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2>Vaccine List:</h2>
				<Form>
					<InputGroup className="mb-3">
						<Form.Control placeholder="Vaccine name..." aria-label="Vaccine name" aria-describedby="basic-addon2" />
						<Button variant="outline-secondary" id="button-addon2">
							Search
						</Button>
					</InputGroup>
				</Form>
				<Row xs={1} md={2} lg={4} className="g-4">
					<Col>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" alt={""} />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</Card.Text>
								<Link to={"/VaccineDetail"}>
									<Button>Detail</Button>
								</Link>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" alt={""} />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" alt={""} />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" alt={""} />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default VaccineList;
