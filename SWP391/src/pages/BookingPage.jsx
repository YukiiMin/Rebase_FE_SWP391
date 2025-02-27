import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import AddChild from "../components/AddChild";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

function BookingPage() {
	const user = JSON.parse(localStorage.getItem("user"));
	const [isOpen, setIsOpen] = useState(false);

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
						<Button
							onClick={() => {
								setIsOpen(true);
							}}>
							Add child
						</Button>
						{isOpen && <AddChild setIsOpen={setIsOpen} open={isOpen} />}
					</InputGroup>
					<Row>
						<Col>
							<b>Choose vaccine type:</b>
							<Button>Single</Button>
							<Button>Combo</Button>
						</Col>
						<Col>
							<Form.Group className="mb-3" controlId="vaccinationDate">
								<Form.Label>
									<b>Choose vaccination date:</b>
								</Form.Label>
								<Form.Control type="date" placeholder="Choose Date" />
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>
									<b>Choose payment method: </b>
								</Form.Label>
								<br />
								<Form.Check defaultChecked label="Payment by credit card." name="payment" type="radio" id="credit" value="credit" />
								<Form.Check label="Cash payment at the cashier." name="payment" type="radio" id="cash" value="cash" />
								<Form.Check label="Payment via e-commerce applications, mobile payment services, VNPAY-QR e-wallets, Momo,..." name="payment" type="radio" id="app" value="app" />
							</Form.Group>
							<Button type="submit">Proceed</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default BookingPage;
