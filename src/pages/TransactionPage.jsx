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
	const { selectedVaccine, selectedCombo, child, vaccinationDate, payment, type, orderId } = location.state;
	const accToken = localStorage.getItem("token");

	const [orderTotal, setOrderTotal] = useState(0);
	const [clientSecret, setClientSecret] = useState("");
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		// Create PaymentIntent as soon as the page loads
		const createPaymentIntent = async () => {
			if (!orderId) {
				setError("No order ID found. Please try booking again.");
				return;
			}

			try {
				console.log("Creating payment intent for order:", orderId, "with amount:", orderTotal);
				const response = await fetch(`${paymentAPI}/${orderId}/create-intent`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${accToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ amount: orderTotal }),
				});

				const data = await response.json();
				console.log("Payment intent response:", data);

				if (!response.ok) {
					console.error("Payment intent creation failed:", data);
					throw new Error(data.message || "Failed to create payment intent");
				}

				if (!data.result || !data.result.clientSecret) {
					console.error("No client secret in response:", data);
					throw new Error("Invalid response from payment server");
				}

				setClientSecret(data.result.clientSecret);
				setRetryCount(0); // Reset retry count on successful creation
			} catch (err) {
				console.error("Payment error:", err);
				setError(err.message || "Payment initialization failed. Note: Payment amount may be too low for processing.");
			}
		};

		if (orderTotal > 0 && orderId && (!clientSecret || clientSecret === "")) {
			createPaymentIntent();
		}
	}, [orderTotal, orderId, accToken, retryCount, clientSecret]);

	// Function to retry payment by creating a new payment intent
	const retryPayment = () => {
		if (retryCount < 3) {
			// Limit to 3 retries
			setLoading(true);
			setError(null);
			setClientSecret(""); // Clear the client secret to force a new payment intent
			setRetryCount((prev) => prev + 1);
			setLoading(false);
		} else {
			setError("Maximum retry attempts reached. Please try again later or contact support.");
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!stripe || !elements) {
			setError("Stripe hasn't been initialized. Please refresh the page.");
			return;
		}

		setLoading(true);
		setError(null);
		setSuccess(null);

		const cardElement = elements.getElement(CardNumberElement);
		if (!cardElement) {
			setError("Card details are incomplete.");
			setLoading(false);
			return;
		}

		try {
			console.log("Confirming payment with clientSecret:", clientSecret ? "Available" : "Missing");

			const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement,
					billing_details: {
						name: "Test User",
						address: {
							country: "US", // Adding country to ensure proper validation
						},
					},
				},
			});

			if (paymentError) {
				console.error("Payment error:", paymentError);

				// Special handling for specific Stripe errors
				if (paymentError.code === "payment_intent_unexpected_state") {
					// This error occurs when the PaymentIntent has been used or modified outside of this session
					setError("There was an issue with your payment session. Please click 'Retry Payment' to generate a new payment session.");
					console.log("Detailed error info:", paymentError);
					// Clear client secret to force a new payment intent on retry
					setClientSecret("");
					setLoading(false);
					return;
				}

				// Handle card validation errors
				if (paymentError.type === "validation_error") {
					setError(`Card validation error: ${paymentError.message}`);
					setLoading(false);
					return;
				}

				// Default error handling
				setError(paymentError.message || "Payment failed. Please try again.");
				setLoading(false);
				return;
			}

			console.log("Payment intent result:", paymentIntent);

			if (paymentIntent.status === "succeeded") {
				// Payment successful, update order status
				try {
					console.log("Confirming payment with backend for order:", orderId);
					const response = await fetch(`${paymentAPI}/${orderId}/confirm`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${accToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							paymentIntentId: paymentIntent.id,
							amount: orderTotal,
						}),
					});

					const responseData = await response.text();
					console.log("Backend confirmation response:", response.status, responseData);

					if (!response.ok) {
						throw new Error(`Failed to confirm payment with backend: ${response.status} ${responseData}`);
					}

					setSuccess("Payment successful!");
					setTimeout(() => {
						navigate("/");
					}, 2000);
				} catch (backendError) {
					console.error("Backend confirmation error:", backendError);
					setError(`Payment was processed but failed to update order. Please contact support with this reference: ${paymentIntent.id}`);
				}
			} else if (paymentIntent.status === "requires_action") {
				// Handle 3D Secure authentication if needed
				setError("Additional authentication required. Please complete the verification prompted by your bank.");
			} else {
				setError(`Payment failed with status: ${paymentIntent.status}. Please try again.`);
			}
		} catch (err) {
			console.error("Payment submission error:", err);
			setError("An unexpected error occurred. Please try again or use a different payment method.");
		} finally {
			setLoading(false);
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
				total += combo.total * (((100 - combo.saleOff) * 1) / 100);
			}
		}
		setOrderTotal(parseFloat(total).toFixed(2));
	};

	//Calculate order total when going to transaction page
	useEffect(() => {
		countTotal();
	}, [selectedVaccine, selectedCombo, type]);

	useEffect(() => {
		console.log("Stripe initialized:", !!stripe);
		console.log("Elements initialized:", !!elements);
	}, [stripe, elements]);

	return (
		<div>
			{console.log(selectedVaccine, selectedCombo, child, vaccinationDate, payment, type)}
			<Navigation />
			<br />
			<Container>
				<h2>Transaction</h2>
				<hr />
				<p>Please make sure to check your booking detail carefully. We won't hold any responsibility after you clicked Confirm</p>

				{/* Debug info - can be removed in production */}
				<div className="alert alert-info">
					<p>
						<strong>Debug Info:</strong>
					</p>
					<p>Order ID: {orderId || "Not available"}</p>
					<p>Total Amount: ${orderTotal} USD</p>
					<p>Note: Payments are processed in USD currency.</p>
				</div>

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
												<th>Price/Dose (USD)</th>
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
												<th>Sale off</th>
												<th>Price($)</th>
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
															<td>
																<ul>
																	{combo.vaccines.map((vaccine, index) => (
																		<li key={index}>{vaccine}</li>
																	))}
																</ul>
															</td>
															<td>{combo.saleOff}%</td>
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
					</Col>
					<Col lg={6}>
						<Card>
							<Card.Header>
								<Card.Title>Your transaction detail</Card.Title>
							</Card.Header>
							<Card.Body>
								<div className="alert alert-warning mb-3">
									<p>
										<strong>Test Mode Info:</strong>
									</p>
									<p>Please use these test card details:</p>
									<ul>
										<li>Card number: 4242 4242 4242 4242</li>
										<li>Expiry date: Any future date (MM/YY format, e.g., 12/25)</li>
										<li>CVC: Any 3 digits</li>
										<li>Name: Any name</li>
									</ul>
								</div>
								<Form onSubmit={handleSubmit}>
									<Form.Group className="mb-3">
										<Form.Label>Card Number</Form.Label>
										{/* Bỏ <CardNumberElement />      <CardExpiryElement />*/}
										<div className="form-control">
											<CardNumberElement
												options={{
													style: {
														base: {
															fontSize: "16px",
															color: "#424770",
															"::placeholder": {
																color: "#aab7c4",
															},
														},
														invalid: {
															color: "#9e2146",
														},
													},
												}}
											/>
										</div>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Card Expiration Date</Form.Label>
										{/*Bỏ <CardExpiryElement />  */}
										<div className="form-control">
											<CardExpiryElement
												options={{
													style: {
														base: {
															fontSize: "16px",
															color: "#424770",
															"::placeholder": {
																color: "#aab7c4",
															},
														},
														invalid: {
															color: "#9e2146",
														},
													},
												}}
											/>
										</div>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>CVC</Form.Label>
										{/* Bỏ <CardCvcElement /> */}
										<div className="form-control">
											<CardCvcElement
												options={{
													style: {
														base: {
															fontSize: "16px",
															color: "#424770",
															"::placeholder": {
																color: "#aab7c4",
															},
														},
														invalid: {
															color: "#9e2146",
														},
													},
												}}
											/>
										</div>
									</Form.Group>
									{/* <CardElement /> */}
									{error && <div className="text-danger">{error}</div>}
									{success && <div className="text-success">{success}</div>}
									{error && error.includes("payment session") && (
										<Button variant="warning" className="me-2 mt-2" onClick={retryPayment} disabled={loading || retryCount >= 3}>
											{loading ? "Processing..." : "Retry Payment"}
										</Button>
									)}
									<Button type="submit" disabled={!stripe || loading || !clientSecret} className="mt-2">
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
