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
import { useTranslation } from "react-i18next";

function PriceListPage() {
	const { t } = useTranslation();
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
						{t('price_list.title')}
					</h1>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="mb-12"
				>
					<h2 className="text-2xl font-bold text-gray-900 mb-4">{t('price_list.vaccine_prices')}</h2>
					<Card>
						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>#</TableHead>
										<TableHead>{t('price_list.vaccine_name')}</TableHead>
										<TableHead>{t('price_list.origin')}</TableHead>
										<TableHead>{t('price_list.price_per_dose')}</TableHead>
										<TableHead>{t('price_list.status')}</TableHead>
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
														{vaccine.status ? t('price_list.available') : t('price_list.unavailable')}
													</span>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={5} className="text-center">
												{t('price_list.no_data')}
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
					<h2 className="text-2xl font-bold text-gray-900 mb-4">{t('price_list.payment_methods')}</h2>
					<Card>
						<CardContent className="pt-6">
							<ul className="space-y-2">
								<li className="flex items-center">
									<span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
									{t('price_list.payment_cash')}
								</li>
								<li className="flex items-center">
									<span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
									{t('price_list.payment_card')}
								</li>
								<li className="flex items-center">
									<span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
									{t('price_list.payment_ecommerce')}
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
