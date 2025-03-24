import React, { useEffect, useState } from "react";
import MainNav from "../components/MainNav";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { motion } from "framer-motion";
import { Separator } from "../components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import TokenUtils from "../utils/TokenUtils";
import { useNavigate } from "react-router-dom";

function HealthRecord() {
	const [userData, setUserData] = useState(null);
	const [vaccinationRecords, setVaccinationRecords] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	
	useEffect(() => {
		const fetchData = async () => {
			// Check if user is logged in
			const token = TokenUtils.getAccessToken();
			if (!token) {
				navigate("/login");
				return;
			}

			try {
				setLoading(true);
				
				// Fetch user data
				const userData = await fetchUserData();
				setUserData(userData);
				
				// Fetch vaccination records
				if (userData && userData.userId) {
					const records = await fetchVaccinationRecords(userData.userId);
					setVaccinationRecords(records);
				}
				
				setLoading(false);
			} catch (err) {
				console.error("Error fetching health records:", err);
				setError(err.message);
				setLoading(false);
			}
		};

		fetchData();
	}, [navigate]);

	const fetchUserData = async () => {
		// Mock user data - in a real application, you would fetch this from your API
		return {
			userId: 1,
			name: "Tuan Nguyen",
			dob: "2000-05-15",
			gender: "Male",
			address: "Ho Chi Minh City, Vietnam",
			phoneNumber: "0912345678",
			email: "tuan.nguyen@example.com",
			bloodType: "A+",
			allergies: ["Penicillin", "Pollen"],
			chronicConditions: ["None"]
		};
	};

	const fetchVaccinationRecords = async (userId) => {
		// Mock vaccination records - in a real application, you would fetch this from your API
		return [
			{
				id: 1,
				date: "2023-01-15",
				vaccineName: "COVID-19 Vaccine",
				manufacturer: "Pfizer",
				doseNumber: 1,
				nextDose: "2023-02-05",
				administeredBy: "Dr. Hang Tran",
				location: "City Central Hospital",
				lotNumber: "PF123456",
				notes: "No immediate side effects observed."
			},
			{
				id: 2,
				date: "2023-02-05",
				vaccineName: "COVID-19 Vaccine",
				manufacturer: "Pfizer",
				doseNumber: 2,
				nextDose: null,
				administeredBy: "Dr. Hang Tran",
				location: "City Central Hospital",
				lotNumber: "PF789012",
				notes: "Mild fever for 24 hours post-vaccination."
			},
			{
				id: 3,
				date: "2022-11-10",
				vaccineName: "Influenza Vaccine",
				manufacturer: "GlaxoSmithKline",
				doseNumber: 1,
				nextDose: "2023-11-10",
				administeredBy: "Dr. Minh Nguyen",
				location: "Community Health Center",
				lotNumber: "FL202201",
				notes: "Annual vaccination"
			}
		];
	};

	// Format date from YYYY-MM-DD to DD/MM/YYYY
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
	};

	// Calculate age from date of birth
	const calculateAge = (dob) => {
		const birthDate = new Date(dob);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
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

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<MainNav />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex justify-center items-center h-64">
						<div className="animate-pulse text-xl text-gray-500">Loading health records...</div>
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
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="space-y-8"
				>
					<motion.div variants={itemVariants}>
						<h1 className="text-3xl font-bold text-gray-900 mb-6">Health Record</h1>
						
						<Card>
							<CardHeader>
								<CardTitle>Personal Information</CardTitle>
								<CardDescription>Your basic health information and personal details</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<dl className="space-y-4">
											<div>
												<dt className="text-sm font-medium text-gray-500">Full Name</dt>
												<dd className="mt-1 text-base text-gray-900">{userData?.name}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
												<dd className="mt-1 text-base text-gray-900">
													{formatDate(userData?.dob)} ({calculateAge(userData?.dob)} years old)
												</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Gender</dt>
												<dd className="mt-1 text-base text-gray-900">{userData?.gender}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Address</dt>
												<dd className="mt-1 text-base text-gray-900">{userData?.address}</dd>
											</div>
										</dl>
									</div>
									<div>
										<dl className="space-y-4">
											<div>
												<dt className="text-sm font-medium text-gray-500">Phone Number</dt>
												<dd className="mt-1 text-base text-gray-900">{userData?.phoneNumber}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Email</dt>
												<dd className="mt-1 text-base text-gray-900">{userData?.email}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Blood Type</dt>
												<dd className="mt-1 text-base text-gray-900">{userData?.bloodType}</dd>
											</div>
											<div>
												<dt className="text-sm font-medium text-gray-500">Allergies</dt>
												<dd className="mt-1 text-base text-gray-900">
													{userData?.allergies.length > 0 ? userData.allergies.join(", ") : "None"}
												</dd>
											</div>
										</dl>
									</div>
								</div>
								
								<div className="mt-6 flex justify-end">
									<Button variant="outline">Update Information</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Tabs defaultValue="vaccination-records" className="w-full">
							<TabsList className="mb-6">
								<TabsTrigger value="vaccination-records">Vaccination Records</TabsTrigger>
								<TabsTrigger value="upcoming-appointments">Upcoming Appointments</TabsTrigger>
								<TabsTrigger value="medical-history">Medical History</TabsTrigger>
							</TabsList>
							
							<TabsContent value="vaccination-records">
								<Card>
									<CardHeader>
										<CardTitle>Vaccination Records</CardTitle>
										<CardDescription>Your vaccination history and upcoming doses</CardDescription>
									</CardHeader>
									<CardContent>
										{vaccinationRecords.length > 0 ? (
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Date</TableHead>
														<TableHead>Vaccine</TableHead>
														<TableHead>Dose</TableHead>
														<TableHead>Next Dose</TableHead>
														<TableHead>Location</TableHead>
														<TableHead className="text-right">Actions</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{vaccinationRecords.map((record) => (
														<TableRow key={record.id}>
															<TableCell>{formatDate(record.date)}</TableCell>
															<TableCell className="font-medium">{record.vaccineName}</TableCell>
															<TableCell>{record.doseNumber}</TableCell>
															<TableCell>{record.nextDose ? formatDate(record.nextDose) : "Complete"}</TableCell>
															<TableCell>{record.location}</TableCell>
															<TableCell className="text-right">
																<Button variant="outline" size="sm">
																	View Details
																</Button>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										) : (
											<div className="py-8 text-center">
												<p className="text-gray-500">No vaccination records found.</p>
											</div>
										)}
										
										<Separator className="my-6" />
										
										<div className="flex justify-between">
											<Button variant="outline">Download Records</Button>
											<Button>Add New Record</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
							
							<TabsContent value="upcoming-appointments">
								<Card>
									<CardHeader>
										<CardTitle>Upcoming Appointments</CardTitle>
										<CardDescription>Your scheduled vaccination appointments</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="py-8 text-center">
											<p className="text-gray-500">No upcoming appointments.</p>
											<Button className="mt-4">Schedule an Appointment</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
							
							<TabsContent value="medical-history">
								<Card>
									<CardHeader>
										<CardTitle>Medical History</CardTitle>
										<CardDescription>Your medical history and conditions</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<h3 className="text-lg font-medium mb-3">Chronic Conditions</h3>
												<ul className="list-disc list-inside text-gray-700 space-y-1">
													{userData?.chronicConditions.map((condition, index) => (
														<li key={index}>{condition}</li>
													))}
												</ul>
											</div>
											<div>
												<h3 className="text-lg font-medium mb-3">Family Medical History</h3>
												<p className="text-gray-500">No family medical history recorded.</p>
											</div>
										</div>
										
										<Separator className="my-6" />
										
										<div className="flex justify-end">
											<Button variant="outline">Update Medical History</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

export default HealthRecord;
