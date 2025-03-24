import React, { useEffect, useState } from "react";
import MainNav from "../components/MainNav";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { motion } from "framer-motion";
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import AddChild from "../components/AddChild";
import { Alert, AlertDescription } from "../components/ui/alert";

function BookingPage() {
	const vaccineAPI = "http://localhost:8080/vaccine";
	const comboAPI = "http://localhost:8080/vaccine/comboDetails";
	const userAPI = "http://localhost:8080/users";
	const token = localStorage.getItem("token");
	const decodedToken = token ? jwtDecode(token) : null;

	const navigate = useNavigate();
	const [vaccinesList, setVaccinesList] = useState([]); //List vaccine to show to user
	const [comboList, setComboList] = useState([]); //List combo to show to user
	const [childs, setChilds] = useState([]); //List of user's children

	const [selectedVaccine, setSelectedVaccine] = useState([]); //List of user chosen vaccine
	const [selectedCombo, setSelectedCombo] = useState([]); //List of user chosen combo

	const [bookingError, setBookingError] = useState("");

	const [type, setType] = useState("single");

	const [isOpen, setIsOpen] = useState(false);

	const validation = Yup.object({
		childId: Yup.number().required("Choose your child."),
		vaccinationDate: Yup.date().required("Choose a vaccination date."),
		payment: Yup.string().required("Choose your payment method"),
	});

	const formik = useFormik({
		initialValues: {
			childId: "",
			vaccinationDate: "",
			payment: "credit",
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
		validationSchema: validation,
	});
	
	//User must login to use this feature
	useEffect(() => {
		if (!token) {
			navigate("/Login");
			console.log("You must login to use this feature");
			return;
		}
		getChild();
		getVaccines();
		getCombo();
	}, [navigate, token]);

	//Get list of single Vaccine
	const getVaccines = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/get`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setVaccinesList(data.result);
			} else {
				console.error("Get vaccine error: ", response.status);
			}
		} catch (err) {
			console.error(err);
		}
	};

	//Get list of Combo Vaccine
	const getCombo = async () => {
		try {
			const response = await fetch(`${comboAPI}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				const groupedCombos = groupCombos(data.result);
				setComboList(groupedCombos);
			} else {
				console.error("Get combo error: ", response.status);
			}
		} catch (err) {
			console.error(err);
		}
	};

	//Get account's children
	const getChild = async () => {
		try {
			const accountId = decodedToken.sub;
			const response = await fetch(`${userAPI}/${accountId}/children`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Children data:", data);
				
				// The endpoint returns an AccDTO with result.children array
				if (data && data.result && data.result.children) {
					setChilds(data.result.children);
					if (data.result.children.length === 0) {
						setBookingError("No children found. Please add a child.");
					}
				} else {
					console.error("Invalid children data structure:", data);
					setBookingError("Could not load children data. Please try again.");
				}
			} else {
				console.error("Get children failed: ", response.status);
				setBookingError("Could not load children data. Please try again.");
			}
		} catch (err) {
			console.log(err);
			setBookingError("Could not load children data. Please try again.");
		}
	};

	//Get the new child to the top of the list
	const handleChildAdd = (newChild) => {
		if (newChild) {
			setChilds([newChild, ...childs]);
		} else {
			getChild();
		}
	};

	//Group vaccine with the same comboId
	const groupCombos = (combosData) => {
		const grouped = {};
		combosData.forEach((combo) => {
			if (!grouped[combo.comboId]) {
				grouped[combo.comboId] = {
					comboId: combo.comboId,
					comboName: combo.comboName,
					description: combo.description,
					comboCategory: combo.comboCategory,
					saleOff: combo.saleOff,
					total: combo.total,
					vaccines: [], // Initialize vaccines array
				};
			}
			grouped[combo.comboId].vaccines.push(combo.vaccineName);
		});
		// Convert grouped object to array
		return Object.values(grouped);
	};

	//Change list depend on type (single or combo)
	const handleTypeChange = (value) => {
		setType(value);
	};

	const handleSubmit = async (values) => {
		if (type === "single" && selectedVaccine.length === 0) {
			setBookingError("Please choose at least 1 vaccine to proceed!");
			return;
		}

		if (type === "combo" && selectedCombo.length === 0) {
			setBookingError("Please choose at least 1 combo to proceed!");
			return;
		}

		createBooking(values);
	};

	// Create booking first
	const createBooking = async (values) => {
		try {
			const bookingResponse = await fetch(`http://localhost:8080/booking/${values.childId}/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					appointmentDate: values.vaccinationDate,
					status: "PENDING",
				}),
			});

			if (!bookingResponse.ok) {
				throw new Error("Failed to create booking");
			}
			const bookingData = await bookingResponse.json();
			console.log(bookingData);
			const bookingId = bookingData.result.bookingId;
			if (bookingId) {
				createOrder(values, bookingId);
			}
			console.log(bookingId);
		} catch (error) {
			setBookingError(error.message);
		}
	};

	//Create order with bookingId
	const createOrder = async (values, bookingId) => {
		try {
			const orderResponse = await fetch(`http://localhost:8080/order/${bookingId}/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
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
			console.log(orderData);
			const orderId = orderData.result.id;
			if (orderId) {
				addDetail(values, orderId);
			}
			console.log(orderId);
		} catch (error) {
			setBookingError(error.message);
		}
	};

	//Add vaccine detail to order
	//Might move this function to transaction page
	const addDetail = async (values, orderId) => {
		try {
			let success = true;
			if (type === "single") {
				for (const v of selectedVaccine) {
					const detailResponse = await fetch(`http://localhost:8080/order/${orderId}/addDetail/${v.vaccine.id}`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							quantity: v.quantity,
							totalPrice: v.quantity * v.vaccine.salePrice,
						}),
					});
					if (!detailResponse.ok) {
						throw new Error(`Failed to add vaccine ${v.vaccine.id} to orderDetail`);
						success = false;
					}
					//Stop the process if the response throws error
					if (!success) {
						return;
					}
				}
			} else if (type === "combo") {
				// Handle combo vaccines here
				for (const combo of selectedCombo) {
					// Add combo to order
					const detailResponse = await fetch(`http://localhost:8080/order/${orderId}/addCombo/${combo.comboId}`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							quantity: 1,
							totalPrice: combo.total * (((100 - combo.saleOff) * 1) / 100)
						}),
					});
					if (!detailResponse.ok) {
						throw new Error(`Failed to add combo ${combo.comboId} to order`);
						success = false;
					}
					if (!success) {
						return;
					}
				}
			}

			// Find the selected child by its ID, and make sure we're using the right property
			const selectedChild = childs.find((child) => child.id === parseInt(values.childId));
			console.log("Selected child:", selectedChild, "Child ID:", values.childId);
			
			if (!selectedChild) {
				throw new Error("Selected child not found. Please try again.");
			}
			
			navigate("/Transaction", {
				state: {
					selectedVaccine: selectedVaccine,
					selectedCombo: selectedCombo,
					child: selectedChild,
					vaccinationDate: values.vaccinationDate,
					payment: values.payment,
					type: type,
					orderId: orderId,
				},
			});
		} catch (error) {
			setBookingError(error.message);
		}
	};

	const handleVaccineSelection = (vaccine) => {
		const index = selectedVaccine.findIndex((v) => v.vaccine.id === vaccine.id);
		if (index !== -1) {
			// Vaccine already selected, remove it
			const newSelectedVaccine = [...selectedVaccine];
			newSelectedVaccine.splice(index, 1);
			setSelectedVaccine(newSelectedVaccine);
		} else {
			// Vaccine not selected, add it
			setSelectedVaccine([...selectedVaccine, { vaccine, quantity: 1 }]);
		}
	};

	const handleComboSelection = (combo) => {
		const index = selectedCombo.findIndex((c) => c.comboId === combo.comboId);
		if (index !== -1) {
			const newSelectedCombo = [...selectedCombo];
			newSelectedCombo.splice(index, 1);
			setSelectedCombo(newSelectedCombo);
		} else {
			setSelectedCombo([...selectedCombo, combo]);
		}
	};

	// Format currency
	const formatCurrency = (price) => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 text-center">Vaccination Booking</h1>
				</div>

				<form onSubmit={formik.handleSubmit} className="space-y-8">
					<Card>
						<CardHeader>
							<CardTitle>Select Child</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex-grow">
									<Select
										name="childId"
										value={formik.values.childId}
										onValueChange={(value) => formik.setFieldValue("childId", value)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a child" />
										</SelectTrigger>
										<SelectContent>
											{childs.length > 0 ? (
												childs.map((child) => (
													<SelectItem key={child.id} value={child.id.toString()}>
														{child.name}
													</SelectItem>
												))
											) : (
												<SelectItem value="" disabled>
													No children found
												</SelectItem>
											)}
										</SelectContent>
									</Select>
									{formik.touched.childId && formik.errors.childId && (
										<p className="text-sm text-red-500 mt-1">{formik.errors.childId}</p>
									)}
								</div>
								<Button 
									type="button" 
									variant="outline" 
									className="flex items-center"
									onClick={() => setIsOpen(true)}
								>
									<PlusCircleIcon className="mr-2 h-4 w-4" />
									Add Child
								</Button>
							</div>
							{isOpen && <AddChild setIsOpen={setIsOpen} open={isOpen} onAdded={handleChildAdd} />}
						</CardContent>
					</Card>

					<Tabs value={type} onValueChange={handleTypeChange} className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="single">Single Vaccines</TabsTrigger>
							<TabsTrigger value="combo">Combo Packages</TabsTrigger>
						</TabsList>
						
						<TabsContent value="single" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Select Individual Vaccines</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										<div>
											<h3 className="text-lg font-medium mb-4">Available Vaccines</h3>
											{vaccinesList.length > 0 ? (
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead className="w-12"></TableHead>
															<TableHead>Vaccine Name</TableHead>
															<TableHead>Price</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{vaccinesList.map((vaccine) => (
															<TableRow key={vaccine.id}>
																<TableCell>
																	<Checkbox
																		checked={selectedVaccine.some((v) => v.vaccine.id === vaccine.id)}
																		onCheckedChange={() => handleVaccineSelection(vaccine)}
																	/>
																</TableCell>
																<TableCell>{vaccine.name}</TableCell>
																<TableCell>{formatCurrency(vaccine.salePrice)}</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											) : (
												<div className="text-center py-4 text-gray-500">
													No vaccine data found. Check your network connection.
												</div>
											)}
										</div>
										
										<div>
											<h3 className="text-lg font-medium mb-4">Your Selected Vaccines</h3>
											{selectedVaccine.length > 0 ? (
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>Vaccine Name</TableHead>
															<TableHead>Quantity</TableHead>
															<TableHead>Price</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{selectedVaccine.map((v) => (
															<TableRow key={v.vaccine.id}>
																<TableCell>{v.vaccine.name}</TableCell>
																<TableCell>{v.quantity}</TableCell>
																<TableCell>{formatCurrency(v.vaccine.salePrice * v.quantity)}</TableCell>
															</TableRow>
														))}
														<TableRow>
															<TableCell colSpan={2} className="text-right font-medium">Total:</TableCell>
															<TableCell className="font-semibold">
																{formatCurrency(selectedVaccine.reduce((total, v) => total + (v.vaccine.salePrice * v.quantity), 0))}
															</TableCell>
														</TableRow>
													</TableBody>
												</Table>
											) : (
												<div className="text-center py-8 border rounded-md bg-gray-50">
													<p className="text-gray-500">No vaccines selected</p>
													{selectedVaccine.length === 0 && bookingError && (
														<Alert variant="destructive" className="mt-4">
															<AlertDescription>{bookingError}</AlertDescription>
														</Alert>
													)}
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
						
						<TabsContent value="combo" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Select Vaccine Combos</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										<div>
											<h3 className="text-lg font-medium mb-4">Available Combos</h3>
											{comboList.length > 0 ? (
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead className="w-12"></TableHead>
															<TableHead>Combo Name</TableHead>
															<TableHead>Price</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{comboList.map((combo) => (
															<TableRow key={combo.comboId}>
																<TableCell>
																	<Checkbox
																		checked={selectedCombo.some((c) => c.comboId === combo.comboId)}
																		onCheckedChange={() => handleComboSelection(combo)}
																	/>
																</TableCell>
																<TableCell>
																	<div>
																		<div className="font-medium">{combo.comboName}</div>
																		<div className="text-sm text-gray-500">
																			{combo.vaccines.slice(0, 2).join(", ")}
																			{combo.vaccines.length > 2 && ` +${combo.vaccines.length - 2} more`}
																		</div>
																	</div>
																</TableCell>
																<TableCell>
																	{combo.saleOff > 0 ? (
																		<div>
																			<div className="line-through text-gray-500">{formatCurrency(combo.total)}</div>
																			<div className="text-green-600">
																				{formatCurrency(combo.total * (1 - combo.saleOff / 100))}
																				<span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
																					{combo.saleOff}% OFF
																				</span>
																			</div>
																		</div>
																	) : (
																		formatCurrency(combo.total)
																	)}
																</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											) : (
												<div className="text-center py-4 text-gray-500">
													No combo data found. Check your network connection.
												</div>
											)}
										</div>
										
										<div>
											<h3 className="text-lg font-medium mb-4">Your Selected Combos</h3>
											{selectedCombo.length > 0 ? (
												<div className="space-y-4">
													{selectedCombo.map((combo) => (
														<Card key={combo.comboId}>
															<CardContent className="pt-6">
																<h4 className="font-medium text-lg">{combo.comboName}</h4>
																<p className="text-sm text-gray-500 mt-1">{combo.description}</p>
																
																<div className="mt-4">
																	<h5 className="text-sm font-medium mb-2">Included Vaccines:</h5>
																	<ul className="list-disc pl-5 text-sm text-gray-600">
																		{combo.vaccines.map((vaccine, idx) => (
																			<li key={idx}>{vaccine}</li>
																		))}
																	</ul>
																</div>
																
																<div className="mt-4 flex justify-between items-center">
																	<span className="text-sm text-gray-600">Price:</span>
																	{combo.saleOff > 0 ? (
																		<div className="text-right">
																			<div className="line-through text-sm text-gray-500">{formatCurrency(combo.total)}</div>
																			<div className="font-semibold">{formatCurrency(combo.total * (1 - combo.saleOff / 100))}</div>
																		</div>
																	) : (
																		<span className="font-semibold">{formatCurrency(combo.total)}</span>
																	)}
																</div>
															</CardContent>
														</Card>
													))}
													<div className="mt-4 py-3 px-4 border-t border-gray-200 flex justify-between">
														<span className="font-medium">Total:</span>
														<span className="font-semibold">
															{formatCurrency(
																selectedCombo.reduce(
																	(total, combo) => total + (combo.total * (1 - combo.saleOff / 100)), 
																	0
																)
															)}
														</span>
													</div>
												</div>
											) : (
												<div className="text-center py-8 border rounded-md bg-gray-50">
													<p className="text-gray-500">No combo packages selected</p>
													{selectedCombo.length === 0 && bookingError && (
														<Alert variant="destructive" className="mt-4">
															<AlertDescription>{bookingError}</AlertDescription>
														</Alert>
													)}
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>

					<Card>
						<CardHeader>
							<CardTitle>Appointment Details</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="vaccinationDate">Vaccination Date</Label>
									<Input
										id="vaccinationDate"
										name="vaccinationDate"
										type="date"
										value={formik.values.vaccinationDate}
										onChange={formik.handleChange}
										className={formik.touched.vaccinationDate && formik.errors.vaccinationDate ? "border-red-500" : ""}
									/>
									{formik.touched.vaccinationDate && formik.errors.vaccinationDate && (
										<p className="text-sm text-red-500 mt-1">{formik.errors.vaccinationDate}</p>
									)}
								</div>
							</div>
							
							<div className="space-y-4">
								<div>
									<Label className="mb-2 block">Payment Method</Label>
									<RadioGroup
										defaultValue="credit"
										value={formik.values.payment}
										onValueChange={(value) => formik.setFieldValue("payment", value)}
									>
										<div className="flex items-start space-x-2 mb-3">
											<RadioGroupItem value="credit" id="payment-credit" />
											<div>
												<Label htmlFor="payment-credit" className="font-medium">Payment by credit card</Label>
												<p className="text-sm text-gray-500">Secure online payment with credit or debit card</p>
											</div>
										</div>
										<div className="flex items-start space-x-2 mb-3 opacity-50">
											<RadioGroupItem value="cash" id="payment-cash" disabled />
											<div>
												<Label htmlFor="payment-cash" className="font-medium">Cash payment at the cashier</Label>
												<p className="text-sm text-gray-500">Pay at the clinic before your appointment</p>
											</div>
										</div>
										<div className="flex items-start space-x-2 opacity-50">
											<RadioGroupItem value="app" id="payment-app" disabled />
											<div>
												<Label htmlFor="payment-app" className="font-medium">Mobile payment</Label>
												<p className="text-sm text-gray-500">Pay via e-commerce applications, VNPAY-QR, Momo, etc.</p>
											</div>
										</div>
									</RadioGroup>
								</div>
							</div>
						</CardContent>
					</Card>

					{bookingError && (
						<Alert variant="destructive">
							<AlertDescription>{bookingError}</AlertDescription>
						</Alert>
					)}

					<div className="flex justify-end">
						<Button type="submit" size="lg">
							Proceed to Checkout
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default BookingPage;