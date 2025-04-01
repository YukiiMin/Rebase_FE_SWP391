import React, { useEffect, useState } from "react";
import MainNav from "../components/layout/MainNav";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

function VaccineDetail() {
	const { t } = useTranslation();
	const [vaccineList, setVaccineList] = useState([]);
	const [vaccine, setVaccine] = useState();
	const [loading, setLoading] = useState(true);
	const vaccineAPI = "http://localhost:8080/vaccine";
	const { id } = useParams();

	useEffect(() => {
		fetchAPI();
	}, [id]);

	useEffect(() => {
		if (vaccineList && id) {
			const foundVaccine = vaccineList.find((vaccine) => vaccine.id === parseInt(id));
			setVaccine(foundVaccine || null); // Set vaccine to null if not found
		}
	}, [vaccineList, id]);

	const fetchAPI = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${vaccineAPI}/get`);
			if (response.ok) {
				const data = await response.json();
				setVaccineList(data.result);
				setLoading(false);
			} else {
				console.error("Fetching vaccines failed: ", response.status);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{loading ? (
					<div className="flex justify-center items-center min-h-[300px]">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
					</div>
				) : vaccine ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Card className="shadow-lg">
							<CardHeader className="pb-0">
								<div className="flex flex-col md:flex-row gap-6">
									<div className="md:w-1/3 flex justify-center">
										<img 
											src={vaccine.imagineUrl} 
											alt={vaccine.name} 
											className="rounded-lg object-contain max-h-[250px] w-auto"
										/>
									</div>
									<div className="md:w-2/3">
										<CardTitle className="text-2xl mb-4 text-primary">{vaccine.name}</CardTitle>
										<div className="space-y-2">
											<p className="flex justify-between border-b pb-2">
												<span className="font-semibold">{t('vaccine_detail.manufacturer')}:</span> 
												<span>{vaccine.manufacturer}</span>
											</p>
											<p className="flex justify-between border-b pb-2">
												<span className="font-semibold">{t('vaccine_detail.price')}:</span> 
												<span className="font-semibold text-primary">${vaccine.salePrice}</span>
											</p>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
									<div>
										<h3 className="text-lg font-semibold mb-2">{t('vaccine_detail.description')}</h3>
										<p className="text-gray-700 mb-4">{vaccine.description}</p>
										
										<InfoItem label={t('vaccine_detail.category')} value={vaccine.category} />
										<InfoItem label={t('vaccine_detail.dosage')} value={vaccine.dosage} />
										<InfoItem label={t('vaccine_detail.contraindications')} value={vaccine.contraindications} />
										<InfoItem label={t('vaccine_detail.precautions')} value={vaccine.precautions} />
										<InfoItem label={t('vaccine_detail.interactions')} value={vaccine.interactions} />
									</div>
									<div>
										<InfoItem label={t('vaccine_detail.adverse_reactions')} value={vaccine.adverseReaction} />
										<InfoItem label={t('vaccine_detail.storage_conditions')} value={vaccine.storageConditions} />
										<InfoItem label={t('vaccine_detail.recommended_for')} value={vaccine.recommended} />
										<InfoItem label={t('vaccine_detail.pre_vaccination')} value={vaccine.preVaccination} />
										<InfoItem label={t('vaccine_detail.compatibility')} value={vaccine.compatibility} />
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				) : (
					<div className="text-center py-12">
						<h2 className="text-2xl font-bold text-gray-700">{t('vaccine_detail.not_found')}</h2>
						<p className="mt-2 text-gray-500">{t('vaccine_detail.not_found_message')}</p>
					</div>
				)}
			</div>
		</div>
	);
}

const InfoItem = ({ label, value }) => (
	<div className="mb-4">
		<h4 className="font-semibold text-gray-800">{label}:</h4>
		<p className="text-gray-600 mt-1">{value || "Not specified"}</p>
	</div>
);

export default VaccineDetail;
