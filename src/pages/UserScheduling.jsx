import React from "react";
import MainNav from "../components/layout/MainNav";
import UserSidebar from "../components/layout/UserSidebar";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";

function UserScheduling() {
	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="flex flex-col md:flex-row gap-8">
					<div className="md:w-1/4">
						<UserSidebar />
					</div>
					<div className="md:w-3/4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Schedule</h2>
							<Card className="shadow-sm">
								<CardContent className="pt-6">
									<p className="text-gray-500">Your upcoming vaccination appointments will appear here.</p>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserScheduling;
