import React, { useEffect, useState } from "react";
import MainNav from "../components/layout/MainNav";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import apiService from "../api/apiService";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

function ComboList() {
	const [comboList, setComboList] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredCombos, setFilteredCombos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		getCombo();
	}, []);

	useEffect(() => {
		if (searchTerm === "") {
			setFilteredCombos(comboList);
		} else {
			const filtered = comboList.filter(combo => 
				combo.comboName?.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredCombos(filtered);
		}
	}, [searchTerm, comboList]);

	const getCombo = async () => {
		try {
			setLoading(true);
			setError("");
			const response = await apiService.vaccine.getComboDetails();
			const data = response.data;
			
			if (!data || !data.result || !Array.isArray(data.result)) {
				setError("Invalid data format received from the server");
				setComboList([]);
				setFilteredCombos([]);
				return;
			}
			
			const groupedCombos = groupCombos(data.result);
			setComboList(groupedCombos);
			setFilteredCombos(groupedCombos);
		} catch (err) {
			console.error("Error fetching combo list:", err);
			setError("Failed to load combo packages: " + (err.response?.data?.message || err.message));
		} finally {
			setLoading(false);
		}
	};

	//Group vaccine with the same comboId
	const groupCombos = (combosData) => {
		if (!Array.isArray(combosData)) {
			console.error("Expected combosData to be an array but got:", typeof combosData);
			return [];
		}
		
		const grouped = {};
		combosData.forEach((combo) => {
			if (!combo.comboId) {
				console.warn("Combo missing comboId:", combo);
				return;
			}
			
			if (!grouped[combo.comboId]) {
				grouped[combo.comboId] = {
					comboId: combo.comboId,
					comboName: combo.comboName || "Unnamed Combo",
					description: combo.description || "",
					// Use comboCategory instead of ageGroup which doesn't exist in backend model
					comboCategory: combo.comboCategory || "",
					saleOff: combo.saleOff || 0,
					vaccines: [], // Initialize vaccines array
				};
			}
			
			// Only add vaccine name if it exists
			if (combo.vaccineName) {
				grouped[combo.comboId].vaccines.push(combo.vaccineName);
			}
		});
		// Convert grouped object to array
		return Object.values(grouped);
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};
	
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

	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="flex flex-col md:flex-row justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Vaccine Combo List</h1>
					
					<div className="w-full md:w-96">
						<div className="relative">
							<Input 
								type="text"
								placeholder="Search combo packages..." 
								value={searchTerm} 
								onChange={handleSearchChange}
								className="pr-10"
							/>
							<div className="absolute right-0 top-0 h-full flex items-center pr-3">
								<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
							</div>
						</div>
					</div>
				</div>

				{error && (
					<Alert variant="destructive" className="mb-6">
						<ExclamationTriangleIcon className="h-5 w-5" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
						<span className="ml-3 text-gray-600">Loading combo packages...</span>
					</div>
				) : comboList.length > 0 ? (
					<motion.div 
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
					>
						{filteredCombos.map((combo) => (
							<motion.div key={combo.comboId} variants={itemVariants}>
								<Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300">
									<div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
										<img 
											src={"src/alt/notfound.jpg"} 
											alt={combo.comboName} 
											className="w-full h-full object-cover"
										/>
									</div>
									<CardHeader className="pb-2">
										<CardTitle className="line-clamp-1">{combo.comboName}</CardTitle>
									</CardHeader>
									<CardContent className="pb-2 flex-grow">
										<div className="mb-3">
											<h3 className="text-sm font-semibold text-gray-600">Includes:</h3>
											<ul className="list-disc list-inside text-sm text-gray-500 pl-2">
												{combo.vaccines.length > 0 ? combo.vaccines.map((vaccine, idx) => (
													<li key={idx} className="line-clamp-1">{vaccine}</li>
												)) : (
													<li className="text-gray-400">No vaccines listed</li>
												)}
											</ul>
										</div>
										{combo.saleOff > 0 && (
											<div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
												{combo.saleOff}% OFF
											</div>
										)}
										<p className="text-gray-500 text-sm line-clamp-2">
											<span className="font-semibold">Description:</span> {combo.description || "No description available"}
										</p>
									</CardContent>
									<CardFooter className="pt-0">
										<Button asChild className="w-full">
											<Link to={`/ComboDetail/${combo.comboId}`}>View Details</Link>
										</Button>
									</CardFooter>
								</Card>
							</motion.div>
						))}
						
						{filteredCombos.length === 0 && (
							<div className="col-span-full flex items-center justify-center py-12">
								<p className="text-gray-500 text-lg">No combo packages found matching "{searchTerm}"</p>
							</div>
						)}
					</motion.div>
				) : (
					<div className="flex flex-col items-center justify-center py-16">
						<div className="text-red-500 font-bold text-xl mb-2">No combo data retrieved.</div>
						<p className="text-gray-500">Please check your network connection or try again later.</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default ComboList;
