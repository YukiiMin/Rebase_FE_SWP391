import React from "react";
import Navigation from "../components/Navbar";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

function BookingPage() {
	return (
		<>
			<Navigation />
			<br />
			<Container>
				<h2>Vaccination Booking</h2>
				<br />
				<Form>
					<InputGroup className="mb-3">
						<Form.Select aria-label="Default select example">
							<option>Choose child</option>
							<option value="1">Child 1</option>
							<option value="2">Child 2</option>
							<option value="3">Child 3</option>
						</Form.Select>
						<Button>Add child</Button>
					</InputGroup>
					<p>Choose vaccine type</p>
					<Button>Single</Button>
					<Button>Combo</Button>
					<Form.Group className="mb-3" controlId="vaccinationDate">
						<Form.Label>Choose vaccination date</Form.Label>
						<Form.Control type="date" placeholder="Choose Date" />
					</Form.Group>
				</Form>
			</Container>
		</>
	);
}

export default BookingPage;
