import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";

function TransactionPage() {
	const paymentAPI = "http://localhost:8080/payment";
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();
	const { selectedVaccine, selectedCombo, child, vaccinationDate, payment, type } = location.state;
	const accToken = localStorage.getItem("token");

	const [orderTotal, setOrderTotal] = useState(0);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!stripe || !elements) return;
		setLoading(true);
		setError(null);
		setSuccess(null);

		//Collect cards detail and generate a token
		// const { error: stripeError, token } = await stripe.createToken(elements.getElement(CardElement));
		const cardElement = elements.getElement(CardNumberElement);
		if (!cardElement) {
			setError("Card details are incomplete.");
			setLoading(false);
			return;
		}

		const { error: stripeError, token } = await stripe.createToken(cardElement);

		if (stripeError) {
			setError(stripeError.message);
			setLoading(false);
			return;
		}

		//After getting token, send to BE API
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

	const countTotal = () => {
		let total = 0;
		if (type === "single") {
			for (const v of selectedVaccine) {
				total += v.vaccine.salePrice * v.quantity;
			}
		} else if (type === "combo") {
			for (const combo of selectedCombo) {
				total += combo.total;
			}
		}
		setOrderTotal(total);
	};

	useEffect(() => {
		countTotal();
	}, [selectedVaccine, selectedCombo, type]);

	return (
		<div>
			{/* {console.log(selectedVaccine, selectedCombo, child, vaccinationDate, payment, type)} */}
			<Navigation />
			<br />
			<Container>
				<h2>Transaction</h2>
				<hr />
				<p>Please make sure to check your booking detail carefully. We won't hold any responsibility after you clicked Confirm</p>
				<Row>
					<Col>
						<Card>
							<Card.Header>
								<Card.Title>Your booking detail</Card.Title>
							</Card.Header>
							<Card.Body>
								<Card.Text>
									<b>Child name: </b>
									{child.name} <br />
									<b>Appointment date: </b>
									{vaccinationDate} <br />
								</Card.Text>
							</Card.Body>
						</Card>
						<Card>
							<Card.Header>
								<Card.Title>Your order</Card.Title>
							</Card.Header>
							<Card.Body>
								{type === "single" && (
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
											{selectedVaccine.length > 0 ? (
												<>
													{selectedVaccine.map((v) => (
														<tr key={v.vaccine.id}>
															<td>{v.vaccine.id}</td>
															<td>{v.vaccine.name}</td>
															<td>{v.quantity}</td>
															<td>{v.vaccine.salePrice}</td>
														</tr>
													))}
													<tr>
														<td colSpan={3}>Total</td>
														<td>{orderTotal}</td>
													</tr>
												</>
											) : (
												<>No vaccine selected</>
											)}
										</tbody>
									</Table>
								)}

								{type === "combo" && (
									<Table>
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
											{selectedCombo.length > 0 ? (
												<>
													{selectedCombo.map((combo) => (
														<tr key={combo.comboId}>
															{/* {console.log(combo)} */}
															<td>{combo.comboId}</td>
															<td>{combo.comboName}</td>
															<td></td>
															<td></td>
															<td>{combo.total}</td>
														</tr>
													))}
													<tr>
														<td colSpan={4}>Total</td>
														<td>{orderTotal}</td>
													</tr>
												</>
											) : (
												<>No combo selected</>
											)}
										</tbody>
									</Table>
								)}
							</Card.Body>
						</Card>

						{/* <strong>Your combos order:</strong>
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
													{index < array.length - 1 && <br />}
												</React.Fragment>
											))}
									</td>
									<td>
										{"1, 1, 1, 1, 2"
											.split(", ") // Split the string into an array
											.map((dose, index, array) => (
												<React.Fragment key={index}>
													{dose}
													{index < array.length - 1 && <br />} 
												</React.Fragment>
											))}
									</td>
									<td>1800</td>
								</tr>
							</tbody>
						</Table> */}
					</Col>
					<Col lg={6}>
						{/* <Card>
							<Card.Header>
								<b>Booking detail</b>
							</Card.Header>
							<Card.Body>
								<Card.Text>
									<b>Child name: </b>
									{child.name}
								</Card.Text>
								<Card.Text>
									<b>Price for vaccine combos: </b>------------- 1000
								</Card.Text>
							</Card.Body>
							<Card.Footer>2000$</Card.Footer>
						</Card> */}
						<Card>
							<Card.Header>
								<Card.Title>Your transaction detail</Card.Title>
							</Card.Header>
							<Card.Body>
								<Form onSubmit={handleSubmit}>
									<Form.Group className="mb-3">
										<Form.Label>Card Number</Form.Label>
										<CardNumberElement />
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Card Expiration Date</Form.Label>
										<CardExpiryElement />
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>CVC</Form.Label>
										<CardCvcElement />
									</Form.Group>
									{/* <CardElement /> */}
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
