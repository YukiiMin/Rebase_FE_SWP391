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
import { cn } from "../lib/utils";
import { UserIcon, SyringeIcon, PackageIcon, CalendarIcon } from "lucide-react";

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

	const [pageLoading, setPageLoading] = useState(true);
	const [apiErrors, setApiErrors] = useState({
		vaccines: false,
		combos: false,
		children: false
	});

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
		
		const loadData = async () => {
			setPageLoading(true);
			
			try {
				await Promise.all([
					getChild(),
					getVaccines(),
					getCombo()
				]);
			} catch (error) {
				console.error("Error loading initial data:", error);
			} finally {
				setPageLoading(false);
			}
		};
		
		loadData();
	}, [navigate, token]);

	// Near the top of the component after useState declarations
	useEffect(() => {
		// Debug token information
		console.log("Token available:", !!token);
		if (token) {
			try {
				console.log("Token decoded sub:", decodedToken?.sub);
				console.log("Token scope:", decodedToken?.scope);
				const expiry = decodedToken?.exp ? new Date(decodedToken.exp * 1000).toISOString() : 'unknown';
				console.log("Token expiry:", expiry);
				console.log("Token valid:", decodedToken?.exp ? (decodedToken.exp * 1000 > Date.now()) : 'unknown');
			} catch (error) {
				console.error("Error debugging token:", error);
			}
		}
	}, [token, decodedToken]);

	//Get list of single Vaccine
	const getVaccines = async () => {
		try {
			setApiErrors(prev => ({ ...prev, vaccines: false }));
			const response = await fetch(`${vaccineAPI}/get`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log("Vaccine API response status:", response.status);
			
			if (response.ok) {
				// Get the raw text first to check if it's valid JSON
				const text = await response.text();
				
				// Try to parse the text as JSON
				let data;
				try {
					data = JSON.parse(text);
					console.log("Vaccine data received:", data);
				} catch (jsonError) {
					console.error("Invalid JSON response from vaccine API:", text);
					console.error("JSON parse error:", jsonError);
					setApiErrors(prev => ({ ...prev, vaccines: true }));
					setVaccinesList([]);
					return;
				}
				
				if (data && data.result) {
					setVaccinesList(data.result);
				} else {
					console.error("Invalid vaccine data structure:", data);
					setVaccinesList([]);
					setApiErrors(prev => ({ ...prev, vaccines: true }));
				}
			} else {
				console.error("Get vaccine error: ", response.status);
				setVaccinesList([]);
				setApiErrors(prev => ({ ...prev, vaccines: true }));
			}
		} catch (err) {
			console.error("Vaccine API error:", err);
			setVaccinesList([]);
			setApiErrors(prev => ({ ...prev, vaccines: true }));
		}
	};

	//Get list of Combo Vaccine
	const getCombo = async () => {
		try {
			setApiErrors(prev => ({ ...prev, combos: false }));
			const response = await fetch(`${comboAPI}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log("Combo API response status:", response.status);
			
			if (response.ok) {
				// Get the raw text first to check if it's valid JSON
				const text = await response.text();
				
				// Try to parse the text as JSON
				let data;
				try {
					data = JSON.parse(text);
					console.log("Combo data received:", data);
				} catch (jsonError) {
					console.error("Invalid JSON response from combo API:", text);
					console.error("JSON parse error:", jsonError);
					setApiErrors(prev => ({ ...prev, combos: true }));
					setComboList([]);
					return;
				}
				
				if (data && data.result) {
					const groupedCombos = groupCombos(data.result);
					setComboList(groupedCombos);
				} else {
					console.error("Invalid combo data structure:", data);
					setComboList([]);
					setApiErrors(prev => ({ ...prev, combos: true }));
				}
			} else {
				console.error("Get combo error: ", response.status);
				setComboList([]);
				setApiErrors(prev => ({ ...prev, combos: true }));
			}
		} catch (err) {
			console.error("Combo API error:", err);
			setComboList([]);
			setApiErrors(prev => ({ ...prev, combos: true }));
		}
	};

	//Get account's children
	const getChild = async () => {
		try {
			setApiErrors(prev => ({ ...prev, children: false }));
			const accountId = decodedToken.sub;
			
			// Log account ID for debugging
			console.log("Fetching children for account ID:", accountId);
			
			const response = await fetch(`${userAPI}/${accountId}/children`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			
			// Log response status
			console.log("Children API response status:", response.status);
			
			if (response.ok) {
				// Get the raw text first to check if it's valid JSON
				const text = await response.text();
				
				// Try to parse the text as JSON
				let data;
				try {
					data = JSON.parse(text);
					console.log("Raw children API response:", data);
				} catch (jsonError) {
					console.error("Invalid JSON response:", text);
					console.error("JSON parse error:", jsonError);
					setBookingError("Invalid response from server. Please try again.");
					setApiErrors(prev => ({ ...prev, children: true }));
					return;
				}
				
				// Check the structure of the data to ensure we're handling it correctly
				if (data && data.result) {
					// The structure might be different than expected
					// It could be data.result directly instead of data.result.children
					let childrenData = Array.isArray(data.result) ? data.result : 
							 (data.result.children ? data.result.children : []);
					
					console.log("Processed children data:", childrenData);
					
					// Ensure each child has valid properties
					childrenData = childrenData.map(child => {
						// Ensure we have at least an ID and a name for display
						const validChild = {
							...child,
							id: child.id || child.childId || Math.floor(Math.random() * 10000) + 1,
							name: child.name || 
								 (child.firstName && child.lastName ? `${child.firstName} ${child.lastName}` : 
								 `Child ${child.id || child.childId || "Unknown"}`)
						};
						return validChild;
					});
					
					setChilds(childrenData);
					
					if (childrenData.length === 0) {
						setBookingError("No children found. Please add a child.");
					} else {
						setBookingError("");
					}
				} else {
					console.error("Invalid children data structure:", data);
					setBookingError("Could not load children data. Please try again.");
					setApiErrors(prev => ({ ...prev, children: true }));
				}
			} else {
				console.error("Get children failed: ", response.status);
				setBookingError("Could not load children data. Please try again.");
				setApiErrors(prev => ({ ...prev, children: true }));
			}
		} catch (err) {
			console.log(err);
			setBookingError("Could not load children data. Please try again.");
			setApiErrors(prev => ({ ...prev, children: true }));
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
			const selectedChildId = parseInt(values.childId);
			const selectedChild = childs.find((child) => 
				(child.id === selectedChildId) || (child.childId === selectedChildId)
			);
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

	// Find the selected child by its ID, and make sure we're using the right property
	const handleSelectChange = (value) => {
		// Only set value if it's not empty
		if (value && value.trim() !== "") {
			formik.setFieldValue("childId", value);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<MainNav />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-8 text-center"
				>
					<h1 className="text-4xl font-bold text-blue-900">Vaccination Booking</h1>
					<p className="mt-2 text-gray-600">Schedule your vaccination appointment with ease</p>
				</motion.div>

				{pageLoading ? (
					<div className="text-center py-12">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
						<p className="mt-4 text-gray-600">Loading booking information...</p>
					</div>
				) : (
					<>
						{(apiErrors.vaccines || apiErrors.combos || apiErrors.children) && (
							<Alert variant="destructive" className="mb-6">
								<AlertDescription>
									There was an error loading some data. Please refresh the page or try again later.
								</AlertDescription>
							</Alert>
						)}

						<form onSubmit={formik.handleSubmit} className="space-y-8">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								<Card className="overflow-hidden border-blue-100">
									<CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
										<CardTitle className="flex items-center text-blue-900">
											<UserIcon className="w-5 h-5 mr-2" />
											Select Child
										</CardTitle>
									</CardHeader>
									<CardContent className="p-6">
										<div className="flex flex-col sm:flex-row gap-4">
											<div className="flex-grow">
												<Select
													name="childId"
													value={formik.values.childId}
													onValueChange={handleSelectChange}
												>
													<SelectTrigger className="bg-white border-gray-200 text-gray-900 h-11">
														<SelectValue placeholder="Select a child" className="text-gray-500" />
													</SelectTrigger>
													<SelectContent>
														{childs.length > 0 ? (
															childs.map((child) => {
																const childId = (child.id || child.childId || Math.floor(Math.random() * 10000) + 1).toString();
																const childName = child.name || 
																	(child.firstName && child.lastName ? `${child.firstName} ${child.lastName}` : 
																	"Child " + childId);
																
																return (
																	<SelectItem 
																		key={`child-${childId}`} 
																		value={childId}
																		className="text-gray-900 hover:bg-blue-50"
																	>
																		{childName}
																	</SelectItem>
																);
															})
														) : (
															<SelectItem value="no-child" disabled className="text-gray-500">
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
												className="flex items-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors h-11"
												onClick={() => setIsOpen(true)}
											>
												<PlusCircleIcon className="mr-2 h-4 w-4" />
												Add Child
											</Button>
											{isOpen && <AddChild setIsOpen={setIsOpen} open={isOpen} onAdded={() => handleChildAdd()} />}
										</div>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.4 }}
							>
								<Tabs value={type} onValueChange={handleTypeChange} className="w-full">
									<TabsList className="grid w-full grid-cols-2 bg-blue-50 p-1 gap-2">
										<TabsTrigger 
											value="single"
											className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
										>
											Single Vaccines
										</TabsTrigger>
										<TabsTrigger 
											value="combo"
											className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
										>
											Combo Packages
										</TabsTrigger>
									</TabsList>
									
									<TabsContent value="single" className="mt-6">
										<Card className="border-blue-100">
											<CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
												<CardTitle className="flex items-center text-blue-900">
													<SyringeIcon className="w-5 h-5 mr-2" />
													Select Individual Vaccines
												</CardTitle>
											</CardHeader>
											<CardContent className="p-6">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
													<div>
														<h3 className="text-lg font-medium mb-4 text-blue-900">Available Vaccines</h3>
														{vaccinesList.length > 0 ? (
															<div className="space-y-3">
																{vaccinesList.map((vaccine) => (
																	<div
																		key={vaccine.id}
																		className={cn(
																			"p-4 rounded-lg border transition-all",
																			selectedVaccine.some((v) => v.vaccine.id === vaccine.id)
																				? "border-blue-200 bg-blue-50"
																				: "border-gray-200"
																		)}
																	>
																		<div className="flex items-center justify-between">
																			<div className="flex items-center space-x-3">
																				<Checkbox
																					checked={selectedVaccine.some((v) => v.vaccine.id === vaccine.id)}
																					onCheckedChange={() => {
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
																					}}
																					className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
																				/>
																				<div>
																					<p className="font-medium text-gray-900">{vaccine.name}</p>
																					<div className="flex flex-col gap-1 mt-1">
																						<p className="text-sm text-gray-500">Manufacturer: {vaccine.manufacturer}</p>
																						<p className="text-sm text-gray-500">Category: {vaccine.vaccineCategory}</p>
																					</div>
																				</div>
																			</div>
																			<p className="font-semibold text-blue-600">{formatCurrency(vaccine.salePrice)}</p>
																		</div>
																	</div>
																))}
															</div>
														) : (
															<div className="text-center py-8 border rounded-lg bg-gray-50">
																<p className="text-gray-500">No vaccine data found</p>
															</div>
														)}
													</div>
													
													<div>
														<h3 className="text-lg font-medium mb-4 text-blue-900">Your Selected Vaccines</h3>
														{selectedVaccine.length > 0 ? (
															<div className="space-y-4">
																{selectedVaccine.map((v) => (
																	<motion.div
																		key={v.vaccine.id}
																		initial={{ opacity: 0, x: 20 }}
																		animate={{ opacity: 1, x: 0 }}
																		exit={{ opacity: 0, x: -20 }}
																		className="p-4 rounded-lg border border-blue-200 bg-blue-50"
																	>
																		<div className="flex justify-between items-start">
																			<div>
																				<p className="font-medium text-gray-900">{v.vaccine.name}</p>
																				<p className="text-sm text-gray-500 mt-1">Quantity: {v.quantity}</p>
																			</div>
																			<p className="font-semibold text-blue-600">
																				{formatCurrency(v.vaccine.salePrice * v.quantity)}
																			</p>
																		</div>
																	</motion.div>
																))}
																<div className="mt-4 p-4 border-t border-blue-200">
																	<div className="flex justify-between items-center">
																		<span className="font-medium text-gray-900">Total:</span>
																		<span className="font-semibold text-blue-600">
																			{formatCurrency(
																				selectedVaccine.reduce(
																					(total, v) => total + (v.vaccine.salePrice * v.quantity),
																					0
																				)
																			)}
																		</span>
																	</div>
																</div>
															</div>
														) : (
															<div className="text-center py-8 border rounded-lg bg-gray-50">
																<p className="text-gray-500">No vaccines selected</p>
															</div>
														)}
													</div>
												</div>
											</CardContent>
										</Card>
									</TabsContent>
									
									<TabsContent value="combo" className="mt-6">
										<Card className="border-blue-100">
											<CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
												<CardTitle className="flex items-center text-blue-900">
													<PackageIcon className="w-5 h-5 mr-2" />
													Select Vaccine Combos
												</CardTitle>
											</CardHeader>
											<CardContent className="p-6">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
													<div>
														<h3 className="text-lg font-medium mb-4 text-blue-900">Available Combos</h3>
														{comboList.length > 0 ? (
															<div className="space-y-4">
																{comboList.map((combo) => (
																	<div
																		key={combo.comboId}
																		className={cn(
																			"p-4 rounded-lg border transition-all cursor-pointer",
																			selectedCombo.some((c) => c.comboId === combo.comboId)
																				? "border-blue-200 bg-blue-50"
																				: "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
																		)}
																		onClick={() => handleComboSelection(combo)}
																	>
																		<div className="flex items-start justify-between">
																			<div className="flex items-start space-x-3">
																				<Checkbox
																					checked={selectedCombo.some((c) => c.comboId === combo.comboId)}
																					className="mt-1 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
																				/>
																				<div>
																					<p className="font-medium text-gray-900">{combo.comboName}</p>
																					<p className="text-sm text-gray-500 mt-1">{combo.description}</p>
																					<div className="flex flex-wrap gap-1 mt-2">
																						{combo.vaccines.map((vaccine, idx) => (
																							<span
																								key={idx}
																								className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
																							>
																								{vaccine}
																							</span>
																						))}
																					</div>
																				</div>
																			</div>
																			<div className="text-right">
																				{combo.saleOff > 0 && (
																					<div className="line-through text-sm text-gray-500">
																						{formatCurrency(combo.total)}
																					</div>
																				)}
																				<div className="font-semibold text-blue-600">
																					{formatCurrency(combo.total * (1 - combo.saleOff / 100))}
																				</div>
																				{combo.saleOff > 0 && (
																					<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">
																						Save {combo.saleOff}%
																					</span>
																				)}
																			</div>
																		</div>
																	</div>
																))}
															</div>
														) : (
															<div className="text-center py-8 border rounded-lg bg-gray-50">
																<p className="text-gray-500">No combo packages found</p>
															</div>
														)}
													</div>
													
													<div>
														<h3 className="text-lg font-medium mb-4 text-blue-900">Your Selected Combos</h3>
														{selectedCombo.length > 0 ? (
															<div className="space-y-4">
																{selectedCombo.map((combo) => (
																	<motion.div
																		key={combo.comboId}
																		initial={{ opacity: 0, x: 20 }}
																		animate={{ opacity: 1, x: 0 }}
																		exit={{ opacity: 0, x: -20 }}
																		className="p-4 rounded-lg border border-blue-200 bg-blue-50"
																	>
																		<h4 className="font-medium text-gray-900">{combo.comboName}</h4>
																		<p className="text-sm text-gray-600 mt-1">{combo.description}</p>
																	
																		<div className="mt-3">
																			<div className="text-sm text-gray-500">Included vaccines:</div>
																			<div className="flex flex-wrap gap-1 mt-1">
																				{combo.vaccines.map((vaccine, idx) => (
																					<span
																						key={idx}
																						className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-700 border border-blue-200"
																					>
																						{vaccine}
																					</span>
																				))}
																			</div>
																		</div>
																	
																		<div className="mt-3 flex justify-between items-center">
																			<span className="text-sm text-gray-600">Price:</span>
																			<div className="text-right">
																				{combo.saleOff > 0 && (
																					<div className="line-through text-sm text-gray-500">
																						{formatCurrency(combo.total)}
																					</div>
																				)}
																				<div className="font-semibold text-blue-600">
																					{formatCurrency(combo.total * (1 - combo.saleOff / 100))}
																				</div>
																			</div>
																		</div>
																	</motion.div>
																))}
																<div className="mt-4 p-4 border-t border-blue-200">
																	<div className="flex justify-between items-center">
																		<span className="font-medium text-gray-900">Total:</span>
																		<span className="font-semibold text-blue-600">
																			{formatCurrency(
																				selectedCombo.reduce(
																					(total, combo) => total + (combo.total * (1 - combo.saleOff / 100)),
																					0
																				)
																			)}
																		</span>
																	</div>
																</div>
															</div>
														) : (
															<div className="text-center py-8 border rounded-lg bg-gray-50">
																<p className="text-gray-500">No combo packages selected</p>
															</div>
														)}
													</div>
												</div>
											</CardContent>
										</Card>
									</TabsContent>
								</Tabs>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.6 }}
							>
								<Card className="border-blue-100">
									<CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
										<CardTitle className="flex items-center text-blue-900">
											<CalendarIcon className="w-5 h-5 mr-2" />
											Appointment Details
										</CardTitle>
									</CardHeader>
									<CardContent className="p-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
											<div className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="vaccinationDate" className="text-gray-700">Vaccination Date</Label>
													<Input
														id="vaccinationDate"
														name="vaccinationDate"
														type="date"
														value={formik.values.vaccinationDate}
														onChange={formik.handleChange}
														className={cn(
															"h-11",
															formik.touched.vaccinationDate && formik.errors.vaccinationDate
																? "border-red-500 focus:ring-red-500"
																: "border-gray-200 focus:ring-blue-500"
														)}
													/>
													{formik.touched.vaccinationDate && formik.errors.vaccinationDate && (
														<p className="text-sm text-red-500 mt-1">{formik.errors.vaccinationDate}</p>
													)}
												</div>
											</div>
											
											<div className="space-y-4">
												<Label className="text-gray-700">Payment Method</Label>
												<RadioGroup
													defaultValue="credit"
													value={formik.values.payment}
													onValueChange={(value) => formik.setFieldValue("payment", value)}
													className="space-y-3"
												>
													<div className="flex items-start space-x-3">
														<RadioGroupItem 
															value="credit" 
															id="payment-credit"
															className="mt-1 border-gray-300 text-blue-600"
														/>
														<div>
															<Label htmlFor="payment-credit" className="font-medium text-gray-900">
																Payment by credit card
															</Label>
															<p className="text-sm text-gray-500">
																Secure online payment with credit or debit card
															</p>
														</div>
													</div>
													
													<div className="flex items-start space-x-3 opacity-50">
														<RadioGroupItem 
															value="cash" 
															id="payment-cash" 
															disabled
															className="mt-1 border-gray-300"
														/>
														<div>
															<Label htmlFor="payment-cash" className="font-medium text-gray-900">
																Cash payment at the cashier
															</Label>
															<p className="text-sm text-gray-500">
																Pay at the clinic before your appointment
															</p>
														</div>
													</div>
													
													<div className="flex items-start space-x-3 opacity-50">
														<RadioGroupItem 
															value="app" 
															id="payment-app" 
															disabled
															className="mt-1 border-gray-300"
														/>
														<div>
															<Label htmlFor="payment-app" className="font-medium text-gray-900">
																Mobile payment
															</Label>
															<p className="text-sm text-gray-500">
																Pay via e-commerce applications, VNPAY-QR, Momo, etc.
															</p>
														</div>
													</div>
												</RadioGroup>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>

							{bookingError && (
								<Alert variant="destructive">
									<AlertDescription>{bookingError}</AlertDescription>
								</Alert>
							)}

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.8 }}
								className="flex justify-end"
							>
								<Button 
									type="submit" 
									size="lg"
									className="bg-blue-600 hover:bg-blue-700 text-white px-8"
								>
									Proceed to Checkout
								</Button>
							</motion.div>
						</form>
					</>
				)}
			</div>
		</div>
	);
}

export default BookingPage;