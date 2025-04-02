import React from 'react';
import MainNav from "../../components/layout/MainNav";
import StaffMenu from "../../components/layout/StaffMenu";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { CalendarCheck, Users, ClipboardCheck, Syringe } from "lucide-react";

const StaffHome = () => {
	const { t } = useTranslation();
	
	return (
		<div className="min-h-screen bg-gray-100">
			<MainNav isAdmin={true} />
			<div className="flex">
				<StaffMenu />
				<main className="flex-grow p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
						<p className="text-gray-600">Welcome to the staff portal of the Vaccination Scheduling System</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-lg font-medium">Check-In</CardTitle>
							</CardHeader>
							<CardContent className="pt-2">
								<div className="flex items-center space-x-2">
									<ClipboardCheck className="h-10 w-10 text-primary" />
									<div>
										<p className="text-sm text-gray-500">Register patient arrivals and update appointment status</p>
									</div>
								</div>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-lg font-medium">Work Schedule</CardTitle>
							</CardHeader>
							<CardContent className="pt-2">
								<div className="flex items-center space-x-2">
									<CalendarCheck className="h-10 w-10 text-primary" />
									<div>
										<p className="text-sm text-gray-500">View and manage your work schedule and shifts</p>
									</div>
								</div>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-lg font-medium">Diagnosis</CardTitle>
							</CardHeader>
							<CardContent className="pt-2">
								<div className="flex items-center space-x-2">
									<Users className="h-10 w-10 text-primary" />
									<div>
										<p className="text-sm text-gray-500">Conduct patient examinations and record findings</p>
									</div>
								</div>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-lg font-medium">Vaccination</CardTitle>
							</CardHeader>
							<CardContent className="pt-2">
								<div className="flex items-center space-x-2">
									<Syringe className="h-10 w-10 text-primary" />
									<div>
										<p className="text-sm text-gray-500">Administer vaccines and record patient responses</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</main>
			</div>
		</div>
	);
}

export default StaffHome;
