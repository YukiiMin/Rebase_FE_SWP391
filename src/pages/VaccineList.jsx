import React, { useEffect, useState } from "react";
import MainNav from "../components/layout/MainNav";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { apiService } from "../api";

function VaccineList() {
	const { t } = useTranslation();
	const [vaccinesList, setVaccinesList] = useState([]);
	const [searchList, setSearchList] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		fetchVaccine();
	}, []);

	const fetchVaccine = async () => {
		try {
			const response = await apiService.vaccine.getAll();
			const data = response.data;
			setVaccinesList(data.result);
			setSearchList(data.result);
		} catch (err) {
			console.error("Something went wrong when fetching vaccines: ", err);
		}
	};

	const handleChangeSearch = (e) => {
		setSearch(e.target.value);
		//If user delete all search value, return the default vaccine list
		if (e.target.value === "") {
			setSearchList(vaccinesList);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (search) {
			const filteredVaccines = vaccinesList.filter((vaccine) => vaccine.name.toLowerCase().includes(search.toLowerCase()));
			setSearchList(filteredVaccines);
		} else {
			setSearchList(vaccinesList);
		}
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
					<h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">{t('vaccines.list_title')}</h1>
					
					<form onSubmit={handleSearch} className="w-full md:w-96">
						<div className="relative">
							<Input 
								type="text"
								placeholder={t('vaccines.search_placeholder')} 
								value={search} 
								onChange={handleChangeSearch}
								className="pr-10"
							/>
							<Button 
								type="submit" 
								size="icon" 
								variant="ghost" 
								className="absolute right-0 top-0 h-full"
							>
								<MagnifyingGlassIcon className="h-5 w-5" />
							</Button>
						</div>
					</form>
				</div>

				{vaccinesList.length > 0 ? (
					<motion.div 
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
					>
						{searchList.length > 0 ? (
							searchList.map((vaccine) => (
								<motion.div key={vaccine.id} variants={itemVariants}>
									<Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
										<div className="h-48 overflow-hidden">
											<img 
												src={vaccine.imagineUrl} 
												alt={vaccine.name} 
												className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
											/>
										</div>
										<CardHeader className="pb-2">
											<CardTitle className="line-clamp-1">{vaccine.name}</CardTitle>
										</CardHeader>
										<CardContent className="pb-2 flex-grow">
											<p className="text-gray-600 font-medium">{t('vaccines.price')}: ${vaccine.salePrice}</p>
											<p className="text-gray-500 text-sm line-clamp-3 mt-2">{vaccine.description}</p>
										</CardContent>
										<CardFooter className="pt-0">
											<Button asChild className="w-full">
												<Link to={`/VaccineDetail/${vaccine.id}`}>{t('vaccines.view_details')}</Link>
											</Button>
										</CardFooter>
									</Card>
								</motion.div>
							))
						) : (
							<div className="col-span-full flex items-center justify-center py-12">
								<p className="text-gray-500 text-lg">{t('vaccines.no_results')} "{search}"</p>
							</div>
						)}
					</motion.div>
				) : (
					<div className="flex flex-col items-center justify-center py-16">
						<div className="text-red-500 font-bold text-xl mb-2">{t('vaccines.no_data')}</div>
						<p className="text-gray-500">{t('vaccines.check_connection')}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default VaccineList;
