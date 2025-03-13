import React, { useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

function TransactionPage() {
	const orderTotal = 2000;
	const paymentAPI = "http://localhost:8080/payment";
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();
	const accToken = localStorage.getItem("token");

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!stripe || !elements) return;

		setLoading(true);
		setError(null);
		setSuccess(null);

		const { error: stripeError, token } = await stripe.createToken(elements.getElement(CardElement));

		if (stripeError) {
			setError(stripeError.message);
			setLoading(false);
			return;
		}

		if (token) {
			console.log(token);
			try {
				const response = await fetch(`${paymentAPI}`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${accToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ amount: orderTotal, token: token.id }), // amount should be dynamic
				});

				if (!response.ok) {
					throw new Error("Payment failed");
				}

				setSuccess("Payment successful!");
				navigate("/");
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
	};
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2>Transaction</h2>
				<hr />
				<p>Please make sure to check your order detail carefully. We won't hold any responsibility after you clicked Confirm</p>
				<Row>
					<Col>
						<strong>Your vaccine order:</strong>
						<Table bordered>
							<thead>
								<tr>
									<th>#</th>
									<th>Vaccine name</th>
									<th>Quantity</th>
									<th>Price/Dose ($)</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>Covid 19</td>
									<td>1</td>
									<td>2000</td>
								</tr>
							</tbody>
						</Table>
						<strong>Your combos order:</strong>
						<Table bordered>
							<thead>
								<tr>
									<th>#</th>
									<th>Combo name</th>
									<th>Included Vaccines</th>
									<th>Quantity</th>
									<th>Price</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>Combo 5 in 1</td>
									<td>
										{"Hepatitus A, Hepatitus B, Diarhea, Headache, Stomachache"
											.split(", ") // Split the string into an array
											.map((vaccine, index, array) => (
												<React.Fragment key={index}>
													{vaccine}
													{index < array.length - 1 && <br />} {/* Add <br> except for the last vaccine */}
												</React.Fragment>
											))}
									</td>
									<td>
										{"1, 1, 1, 1, 2"
											.split(", ") // Split the string into an array
											.map((dose, index, array) => (
												<React.Fragment key={index}>
													{dose}
													{index < array.length - 1 && <br />} {/* Add <br> except for the last vaccine */}
												</React.Fragment>
											))}
									</td>
									<td>1800</td>
								</tr>
							</tbody>
						</Table>
					</Col>
					<Col lg={4}>
						<Card>
							<Card.Header>
								<b>Total</b>
							</Card.Header>
							<Card.Body>
								<Card.Text>
									<b>Price for single vaccines: </b>------------- 1000
								</Card.Text>
								<Card.Text>
									<b>Price for vaccine combos: </b>------------- 1000
								</Card.Text>
								<Card.Text>
									<b>Discount: </b>---------------------0%
								</Card.Text>
							</Card.Body>
							<Card.Footer>2000$</Card.Footer>
						</Card>
						<Card>
							<Card.Header>Your transaction detail</Card.Header>
							<Card.Body>
								{/* <Form method="POST">
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
								</Form> */}
								<Form onSubmit={handleSubmit}>
									<CardElement />
									{error && <div className="text-danger">{error}</div>}
									{success && <div className="text-success">{success}</div>}
									<Button type="submit" disabled={!stripe || loading}>
										{loading ? "Processing..." : "Confirm"}
									</Button>
								</Form>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default TransactionPage;
