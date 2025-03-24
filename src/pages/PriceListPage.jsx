import React, { useEffect, useState } from "react";
import MainNav from "../components/MainNav";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function PriceListPage() {
	const vaccineAPI = "http://localhost:8080/vaccine";
	const [vaccineList, setVaccineList] = useState([]);

	useEffect(() => {
		getVaccine();
	}, []);

	const getVaccine = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/get`);
			if (response.ok) {
				const data = await response.json();
				setVaccineList(data.result);
			} else {
				console.error("Fetching vaccine failed: ", response.status);
			}
		} catch (err) {
			console.log("Something went wrong when fetching vaccines: ", err);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-8"
				>
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						Vaccination Price List and Payment Methods
					</h1>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="mb-12"
				>
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Vaccination Price List</h2>
					<Card>
						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>#</TableHead>
										<TableHead>Vaccine Name</TableHead>
										<TableHead>Origin</TableHead>
										<TableHead>Price/Dose ($)</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{vaccineList.length > 0 ? (
										vaccineList.map((vaccine) => (
											<TableRow key={vaccine.id}>
												<TableCell>{vaccine.id}</TableCell>
												<TableCell className="font-medium">{vaccine.name}</TableCell>
												<TableCell>{vaccine.manufacturer}</TableCell>
												<TableCell>${vaccine.salePrice}</TableCell>
												<TableCell>
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium ${
															vaccine.status
																? "bg-green-100 text-green-800"
																: "bg-red-100 text-red-800"
														}`}
													>
														{vaccine.status ? "Available" : "Unavailable"}
													</span>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={5} className="text-center">
												No data available
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Methods</h2>
					<Card>
						<CardContent className="pt-6">
							<ul className="space-y-2">
								<li className="flex items-center">
									<span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
									Cash payment at the cashier.
								</li>
								<li className="flex items-center">
									<span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
									Payment by credit card.
								</li>
								<li className="flex items-center">
									<span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
									Payment via e-commerce applications, mobile payment services, VNPAY-QR e-wallets, Momo, etc.
								</li>
							</ul>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}

export default PriceListPage;
