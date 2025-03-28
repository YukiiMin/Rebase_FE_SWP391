import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import MainNav from "../components/MainNav";
import { motion } from "framer-motion";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { CreditCard, Calendar, Lock } from "lucide-react";
import { InfoIcon } from "lucide-react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Label } from "../components/ui/label";

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

	// Format date
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	};

	// Return early with an error message if state is missing
	if (missingState) {
		return (
			<div className="min-h-screen bg-gray-50">
				<MainNav />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<Alert variant="destructive" className="mb-6">
						<ExclamationTriangleIcon className="h-5 w-5" />
						<AlertTitle>Transaction Data Missing</AlertTitle>
						<AlertDescription>
							No transaction data was found. This typically happens when you try to access this page directly
							without going through the booking process.
						</AlertDescription>
					</Alert>
					<Button variant="outline" onClick={() => navigate('/BookingPage')}>
						Return to Booking
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Transaction</h1>
					<p className="mb-6 text-gray-600">Please make sure to check your booking detail carefully. We won't hold any responsibility after you clicked Confirm</p>

					{/* Debug info - styled with Tailwind */}
					<div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4 mb-6">
						<h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
						<p>Order ID: {orderId || "Not available"}</p>
						<p>Total Amount: ${orderTotal} USD</p>
						<p className="text-sm mt-2">Note: Payments are processed in USD currency.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="md:col-span-2">
							<Card className="mb-6">
								<CardHeader>
									<CardTitle>Your booking detail</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="font-medium">Child name:</span>
											<span>{child?.name || "N/A"}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">Appointment date:</span>
											<span>{formatDate(vaccinationDate)}</span>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Your order</CardTitle>
								</CardHeader>
								<CardContent>
									{type === "single" && (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>#</TableHead>
													<TableHead>Vaccine name</TableHead>
													<TableHead>Quantity</TableHead>
													<TableHead className="text-right">Price/Dose (USD)</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{selectedVaccine.length > 0 ? (
													<>
														{selectedVaccine.map((v) => (
															<TableRow key={v.vaccine.id}>
																<TableCell>{v.vaccine.id}</TableCell>
																<TableCell className="font-medium">{v.vaccine.name}</TableCell>
																<TableCell>{v.quantity}</TableCell>
																<TableCell className="text-right">{v.vaccine.salePrice}</TableCell>
															</TableRow>
														))}
														<TableRow>
															<TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
															<TableCell className="text-right font-bold">${orderTotal}</TableCell>
														</TableRow>
													</>
												) : (
													<TableRow>
														<TableCell colSpan={4} className="text-center py-4 text-gray-500">No vaccine selected</TableCell>
													</TableRow>
												)}
											</TableBody>
										</Table>
									)}

									{type === "combo" && (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>#</TableHead>
													<TableHead>Combo name</TableHead>
													<TableHead>Included Vaccines</TableHead>
													<TableHead>Sale off</TableHead>
													<TableHead className="text-right">Price($)</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{selectedCombo.length > 0 ? (
													<>
														{selectedCombo.map((combo) => (
															<TableRow key={combo.comboId}>
																<TableCell>{combo.comboId}</TableCell>
																<TableCell className="font-medium">{combo.comboName}</TableCell>
																<TableCell>
																	<ul className="list-disc list-inside">
																		{combo.vaccines.map((vaccine, index) => (
																			<li key={index} className="text-sm">{vaccine}</li>
																		))}
																	</ul>
																</TableCell>
																<TableCell>{combo.saleOff}%</TableCell>
																<TableCell className="text-right">{combo.total}</TableCell>
															</TableRow>
														))}
														<TableRow>
															<TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
															<TableCell className="text-right font-bold">${orderTotal}</TableCell>
														</TableRow>
													</>
												) : (
													<TableRow>
														<TableCell colSpan={5} className="text-center py-4 text-gray-500">No combo selected</TableCell>
													</TableRow>
												)}
											</TableBody>
										</Table>
									)}
								</CardContent>
							</Card>
						</div>

						<div className="md:col-span-1">
							<Card className="border-blue-100">
								<CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
									<CardTitle className="flex items-center text-blue-900">
										<CreditCard className="w-5 h-5 mr-2" />
										Payment Details
									</CardTitle>
								</CardHeader>
								<CardContent className="p-6">
									<div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-6">
										<h3 className="font-semibold mb-2 flex items-center">
											<InfoIcon className="w-4 h-4 mr-2" />
											Test Mode Info
										</h3>
										<p className="mb-2">Please use these test card details:</p>
										<ul className="list-disc list-inside text-sm space-y-1">
											<li>Card number: 4242 4242 4242 4242</li>
											<li>Expiry date: Any future date (MM/YY format, e.g., 12/25)</li>
											<li>CVC: Any 3 digits</li>
											<li>Name: Any name</li>
										</ul>
									</div>

									<form onSubmit={handleSubmit} className="space-y-6">
										<div className="space-y-2">
											<Label className="text-sm font-medium text-gray-700">Card Number</Label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
													<CreditCard className="h-5 w-5 text-gray-400" />
												</div>
												<div className="border rounded-md p-3 pl-10 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
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
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
												<div className="relative">
													<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
														<Calendar className="h-5 w-5 text-gray-400" />
													</div>
													<div className="border rounded-md p-3 pl-10 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
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
												</div>
											</div>

											<div className="space-y-2">
												<Label className="text-sm font-medium text-gray-700">CVC</Label>
												<div className="relative">
													<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
														<Lock className="h-5 w-5 text-gray-400" />
													</div>
													<div className="border rounded-md p-3 pl-10 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
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
												</div>
											</div>
										</div>

										{error && (
											<Alert variant="destructive" className="bg-red-50 border-red-200">
												<ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
												<AlertDescription className="text-red-700">{error}</AlertDescription>
											</Alert>
										)}

										{success && (
											<Alert className="bg-green-50 text-green-800 border-green-200">
												<CheckCircleIcon className="h-4 w-4 text-green-500" />
												<AlertDescription>{success}</AlertDescription>
											</Alert>
										)}

										<div className="flex flex-col space-y-3">
											{error && error.includes("payment session") && (
												<Button 
													variant="outline" 
													type="button" 
													onClick={retryPayment} 
													disabled={loading || retryCount >= 3}
													className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
												>
													{loading ? (
														<div className="flex items-center">
															<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
															Processing...
														</div>
													) : (
														"Retry Payment"
													)}
												</Button>
											)}
											<Button 
												type="submit" 
												className="w-full bg-blue-600 hover:bg-blue-700 text-white"
												disabled={!stripe || loading || !clientSecret}
											>
												{loading ? (
													<div className="flex items-center">
														<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
														Processing...
													</div>
												) : (
													"Confirm Payment"
												)}
											</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default TransactionPage;
