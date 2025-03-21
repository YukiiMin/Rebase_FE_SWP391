import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Alert, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
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
	
	// Check if state exists and provide default values to prevent errors
	const state = location.state || {};
	const { 
		selectedVaccine = [], 
		selectedCombo = [], 
		child = {}, 
		vaccinationDate = "", 
		payment = "credit", 
		type = "single", 
		orderId = null
	} = state;
	
	const accToken = localStorage.getItem("token");

	const [orderTotal, setOrderTotal] = useState(0);
	const [clientSecret, setClientSecret] = useState("");
	const [retryCount, setRetryCount] = useState(0);
	const [missingState, setMissingState] = useState(!location.state);

	useEffect(() => {
		// If state is missing, show error message and don't try to create payment intent
		if (!location.state) {
			setError("Transaction data is missing. Please go back to the booking page and try again.");
			return;
		}
		
		// Create PaymentIntent as soon as the page loads
		const createPaymentIntent = async () => {
			// Only create payment intent if we have an orderId
			if (orderId) {
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
			}
		};

		if (orderTotal > 0 && orderId && (!clientSecret || clientSecret === "")) {
			createPaymentIntent();
		}
	}, [orderTotal, orderId, accToken, retryCount, clientSecret, location.state]);

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
			// 1. Tạo booking
			console.log("Creating booking for child:", child);
			const bookingResponse = await fetch(`http://localhost:8080/booking/${child.id}/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					appointmentDate: vaccinationDate,
					status: "PENDING"
				}),
			});

			if (!bookingResponse.ok) {
				throw new Error("Failed to create booking");
			}

			const bookingData = await bookingResponse.json();
			const bookingId = bookingData.result.bookingId;

			// 2. Tạo order
			const orderResponse = await fetch(`http://localhost:8080/order/${bookingId}/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderDate: new Date().toISOString(),
				}),
			});

			if (!orderResponse.ok) {
				throw new Error("Failed to create order");
			}

			const orderData = await orderResponse.json();
			const orderId = orderData.result.id;

			// 3. Thêm chi tiết vaccine/combo vào order
			if (type === "single") {
				for (const v of selectedVaccine) {
					await fetch(`http://localhost:8080/order/${orderId}/addDetail/${v.vaccine.id}`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${accToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							quantity: v.quantity,
							totalPrice: v.quantity * v.vaccine.salePrice,
						}),
					});
				}
			} else if (type === "combo") {
				for (const combo of selectedCombo) {
					// Add combo to order
					await fetch(`http://localhost:8080/order/${orderId}/addCombo/${combo.comboId}`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${accToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							quantity: 1,
							totalPrice: combo.total * (((100 - combo.saleOff) * 1) / 100)
						}),
					});
				}
			}

			// 4. Tạo payment intent
			const paymentIntentResponse = await fetch(`http://localhost:8080/payment/${orderId}/create-intent`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ amount: orderTotal }),
			});

			const paymentIntentData = await paymentIntentResponse.json();
			const clientSecret = paymentIntentData.result.clientSecret;

			// 5. Xác nhận thanh toán Stripe
			const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement,
					billing_details: {
						name: "Test User",
						address: {
							country: "US",
						},
					},
				},
			});

			if (paymentError) {
				console.error("Payment error:", paymentError);
				setError(paymentError.message || "Payment failed. Please try again.");
				setLoading(false);
				return;
			}

			if (paymentIntent.status === "succeeded") {
				// 6. Xác nhận thanh toán với backend
				await fetch(`http://localhost:8080/payment/${orderId}/confirm`, {
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

				// 7. Cập nhật trạng thái booking sang PAID
				await fetch(`http://localhost:8080/booking/${bookingId}/payment`, {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${accToken}`,
					},
				});

				setSuccess("Payment successful!");
				setTimeout(() => {
					navigate("/");
				}, 2000);
			}
		} catch (err) {
			console.error("Payment submission error:", err);
			setError(err.message || "An unexpected error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const countTotal = () => {
		// If we don't have state, don't try to calculate
		if (!location.state) return;
		
		let total = 0;
		if (type === "single") {
			for (const v of selectedVaccine) {
				if (v.vaccine && v.vaccine.salePrice) {
					total += v.vaccine.salePrice * v.quantity;
				}
			}
		} else if (type === "combo") {
			for (const combo of selectedCombo) {
				if (combo.total && combo.saleOff !== undefined) {
					total += combo.total * (((100 - combo.saleOff) * 1) / 100);
				}
			}
		}
		setOrderTotal(parseFloat(total).toFixed(2));
	};

	//Calculate order total when going to transaction page
	useEffect(() => {
		countTotal();
	}, [selectedVaccine, selectedCombo, type, location.state]);

	useEffect(() => {
		console.log("Stripe initialized:", !!stripe);
		console.log("Elements initialized:", !!elements);
	}, [stripe, elements]);

	// Return early with an error message if state is missing
	if (missingState) {
		return (
			<div>
				<Navigation />
				<Container className="mt-5">
					<Alert variant="danger">
						<Alert.Heading>Transaction Data Missing</Alert.Heading>
						<p>
							No transaction data was found. This typically happens when you try to access this page directly
							without going through the booking process.
						</p>
						<hr />
						<div className="d-flex justify-content-end">
							<Button variant="outline-danger" onClick={() => navigate('/BookingPage')}>
								Return to Booking
							</Button>
						</div>
					</Alert>
				</Container>
			</div>
		);
	}

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
									{child?.name || "N/A"} <br />
									<b>Appointment date: </b>
									{vaccinationDate || "N/A"} <br />
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
