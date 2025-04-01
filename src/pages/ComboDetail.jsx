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

function ComboDetail() {
	const { id } = useParams();
	const comboDetailsAPI = "http://localhost:8080/vaccine/comboDetails";
	const [combo, setCombo] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchComboDetail();
	}, [id]);

	const fetchComboDetail = async () => {
		try {
			setLoading(true);
			const response = await fetch(comboDetailsAPI);
			if (!response.ok) {
				throw new Error(`Failed to fetch combo details: ${response.status}`);
			}
			
			const data = await response.json();
			
			// Filter results for the specific combo ID
			const comboDetails = data.result.filter(item => item.comboId === parseInt(id, 10));
			
			if (comboDetails.length === 0) {
				setError("Combo package not found.");
				setLoading(false);
				return;
			}
			
			// Group vaccine details for this combo
			const processedCombo = processComboDetails(comboDetails);
			setCombo(processedCombo);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching combo details:", err);
			setError(err.message);
			setLoading(false);
		}
	};

	const processComboDetails = (comboData) => {
		if (!comboData || comboData.length === 0) return null;
		
		// Extract basic combo info from the first item
		const firstItem = comboData[0];
		const result = {
			comboId: firstItem.comboId,
			comboName: firstItem.comboName,
			ageGroup: firstItem.ageGroup,
			description: firstItem.description,
			saleOff: firstItem.saleOff,
			totalPrice: 0,
			discountedPrice: 0,
			vaccines: []
		};
		
		// Process all vaccines in this combo
		comboData.forEach(item => {
			result.vaccines.push({
				vaccineId: item.vaccineId,
				vaccineName: item.vaccineName,
				price: item.price,
				disease: item.disease,
				origin: item.origin
			});
			
			// Add to total price
			result.totalPrice += item.price || 0;
		});
		
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
						<div className="animate-pulse text-xl text-gray-500">Loading combo details...</div>
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
									For {combo.ageGroup || "all ages"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="mb-6">
									<h3 className="text-base font-medium mb-2">Description</h3>
									<p className="text-gray-700">{combo.description}</p>
								</div>

								<Separator className="my-4" />

								<div className="mb-6">
									<h3 className="text-base font-medium mb-4">Included Vaccines</h3>
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
											{combo.vaccines.map((vaccine) => (
												<TableRow key={vaccine.vaccineId}>
													<TableCell className="font-medium">{vaccine.vaccineName}</TableCell>
													<TableCell>{vaccine.disease}</TableCell>
													<TableCell>{vaccine.origin}</TableCell>
													<TableCell className="text-right">{formatCurrency(vaccine.price)}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
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
