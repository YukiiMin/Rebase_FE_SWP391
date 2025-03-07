import React from "react";
import Navigation from "../components/Navbar";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function TransactionPage() {
	const navigate = useNavigate();

	const handleSubmit = () => {
		console.log("Payment success");
		navigate("/");
	};
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2>Transaction</h2>
				<hr />
				<Form method="POST">
					<Form.Group className="mb-3" controlId="cardholder">
						<Form.Label>Cardholder Name</Form.Label>
						<Form.Control type="text" placeholder="Cardholder name..." />
					</Form.Group>
					<Form.Group className="mb-3" controlId="cardnumber">
						<Form.Label>Card Number</Form.Label>
						<Form.Control type="number" placeholder="Card number..." />
					</Form.Group>
					<Form.Group className="mb-3" controlId="expireDate">
						<Form.Label>Expire time</Form.Label>
						<Form.Control type="month" />
					</Form.Group>
					<Button onClick={handleSubmit}>Confirm</Button>
				</Form>
			</Container>
		</div>
	);
}

export default TransactionPage;
