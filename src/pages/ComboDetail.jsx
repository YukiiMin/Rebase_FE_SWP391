import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainNav from "../components/layout/MainNav";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeftIcon, CalendarIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import apiService from "../api/apiService";

function ComboDetail() {
	const { id } = useParams();
	const [combo, setCombo] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchComboDetail();
	}, [id]);

	const fetchComboDetail = async () => {
		try {
			setLoading(true);
			setError(null);
			
			// First get the combo basic info
			const comboResponse = await apiService.vaccine.getComboById(id);
			
			if (!comboResponse.data || !comboResponse.data.result) {
				setError("Combo package not found or invalid response format.");
				setLoading(false);
				return;
			}

			const comboBasicInfo = comboResponse.data.result;
			
			// Then get combo details to get included vaccines
			const comboDetailsResponse = await apiService.vaccine.getComboDetails();
			if (!comboDetailsResponse.data || !comboDetailsResponse.data.result) {
				setError("Could not fetch combo details.");
				setLoading(false);
				return;
			}
			
			// Filter only details for this combo
			const comboDetails = comboDetailsResponse.data.result.filter(
				detail => detail.comboId === parseInt(id)
			);
			
			if (comboDetails.length === 0) {
				setError("No vaccines found for this combo package.");
			}
			
			// Process the combo data
			const processedCombo = processComboDetails(comboBasicInfo, comboDetails);
			setCombo(processedCombo);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching combo details:", err);
			setError(err.response?.data?.message || err.message || "Failed to fetch combo details");
			setLoading(false);
		}
	};

	const processComboDetails = (comboBasicInfo, comboDetails) => {
		if (!comboBasicInfo) return null;
		
		// Extract basic combo info
		const result = {
			comboId: comboBasicInfo.id,
			comboName: comboBasicInfo.comboName || "Unnamed Combo",
			comboCategory: comboBasicInfo.comboCategory || "General",
			description: comboBasicInfo.description || "",
			saleOff: comboBasicInfo.saleOff || 0,
			totalPrice: comboBasicInfo.total || 0,
			discountedPrice: 0,
			vaccines: []
		};
		
		// Process all vaccines in this combo if we have details
		if (Array.isArray(comboDetails) && comboDetails.length > 0) {
			comboDetails.forEach(item => {
				// Only add if we have at least the vaccine name
				if (item.vaccineName) {
					result.vaccines.push({
						vaccineId: item.vaccineId || 0,
						vaccineName: item.vaccineName,
						price: item.price || 0,
						// These fields might not be in the actual API response
						// Setting defaults to avoid UI issues
						disease: item.disease || "Not specified",
						origin: item.manufacturer || "Not specified"
					});
				}
			});
		}
		
		// Calculate discounted price
		if (result.saleOff > 0) {
			result.discountedPrice = result.totalPrice * (1 - result.saleOff / 100);
		} else {
			result.discountedPrice = result.totalPrice;
		}
		
		return result;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<MainNav />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mr-3"></div>
						<div className="text-xl text-gray-500">Loading combo details...</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<MainNav />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<Alert variant="destructive" className="mb-6">
						<ExclamationTriangleIcon className="h-5 w-5" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
					<Button asChild>
						<Link to="/ComboList">
							<ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Combo List
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	if (!combo) {
		return (
			<div className="min-h-screen bg-gray-50">
				<MainNav />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<Alert variant="destructive" className="mb-6">
						<ExclamationTriangleIcon className="h-5 w-5" />
						<AlertTitle>Not Found</AlertTitle>
						<AlertDescription>The combo package you're looking for does not exist.</AlertDescription>
					</Alert>
					<Button asChild>
						<Link to="/ComboList">
							<ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Combo List
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 }
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="mb-6">
					<Button variant="outline" asChild>
						<Link to="/ComboList">
							<ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Combo List
						</Link>
					</Button>
				</div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="grid grid-cols-1 lg:grid-cols-3 gap-8"
				>
					{/* Main Info */}
					<motion.div variants={itemVariants} className="lg:col-span-2">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-2xl">{combo.comboName}</CardTitle>
								<CardDescription>
									For {combo.comboCategory || "all ages"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="mb-6">
									<h3 className="text-base font-medium mb-2">Description</h3>
									<p className="text-gray-700">{combo.description || "No description available"}</p>
								</div>

								<Separator className="my-4" />

								<div className="mb-6">
									<h3 className="text-base font-medium mb-4">Included Vaccines</h3>
									{combo.vaccines && combo.vaccines.length > 0 ? (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Vaccine</TableHead>
													<TableHead>Disease Prevention</TableHead>
													<TableHead>Origin</TableHead>
													<TableHead className="text-right">Price</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{combo.vaccines.map((vaccine, index) => (
													<TableRow key={vaccine.vaccineId || index}>
														<TableCell className="font-medium">{vaccine.vaccineName}</TableCell>
														<TableCell>{vaccine.disease}</TableCell>
														<TableCell>{vaccine.origin}</TableCell>
														<TableCell className="text-right">{formatCurrency(vaccine.price)}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									) : (
										<div className="py-4 text-center text-gray-500">
											No vaccine details available for this combo.
										</div>
									)}
								</div>

								<Separator className="my-4" />

								<div className="flex flex-col sm:flex-row sm:justify-between gap-4">
									<div>
										<h3 className="text-base font-medium mb-2">Benefits</h3>
										<ul className="list-inside space-y-1">
											<li className="flex items-center text-sm text-gray-700">
												<CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
												Complete protection against multiple diseases
											</li>
											<li className="flex items-center text-sm text-gray-700">
												<CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
												Simplified vaccination schedule
											</li>
											<li className="flex items-center text-sm text-gray-700">
												<CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
												Cost savings compared to individual vaccines
											</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Pricing and Booking */}
					<motion.div variants={itemVariants}>
						<Card>
							<CardHeader>
								<CardTitle>Pricing</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="mb-4">
									<div className="flex justify-between items-center mb-2">
										<span className="text-gray-600">Total Value:</span>
										<span className={combo.saleOff > 0 ? "line-through text-gray-500" : "font-semibold"}>
											{formatCurrency(combo.totalPrice)}
										</span>
									</div>
									
									{combo.saleOff > 0 && (
										<>
											<div className="flex justify-between items-center mb-2">
												<span className="text-gray-600">Discount:</span>
												<span className="text-green-600">-{combo.saleOff}%</span>
											</div>
											<div className="flex justify-between items-center text-lg font-semibold">
												<span>Package Price:</span>
												<span>{formatCurrency(combo.discountedPrice)}</span>
											</div>
											<div className="mt-2 py-1 px-3 bg-green-100 text-green-800 text-xs rounded-md inline-block">
												You save {formatCurrency(combo.totalPrice - combo.discountedPrice)}
											</div>
										</>
									)}
								</div>
								
								<Separator className="my-4" />
								
								<div className="mb-4">
									<h3 className="text-sm font-medium mb-2">Notes</h3>
									<ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
										<li>Price includes medical consultation</li>
										<li>Vaccines will be administered based on the recommended schedule</li>
										<li>Follow-up doses scheduled separately</li>
									</ul>
								</div>
							</CardContent>
							<CardFooter className="flex flex-col gap-3">
								<Button className="w-full flex items-center justify-center">
									<CalendarIcon className="h-4 w-4 mr-2" />
									Book Appointment
								</Button>
								<Button variant="outline" className="w-full">
									Add to Health Plan
								</Button>
							</CardFooter>
						</Card>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

export default ComboDetail;
