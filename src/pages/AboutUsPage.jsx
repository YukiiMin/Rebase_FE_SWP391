import React from "react";
import MainNav from "../components/MainNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";

function AboutUsPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			
			<main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Our mission is to provide safe, effective vaccination services to protect children's health
						and contribute to a healthier community.
					</p>
				</motion.div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<Card>
							<CardHeader>
								<CardTitle>Our Mission</CardTitle>
								<CardDescription>What drives us every day</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									We are committed to providing the highest quality vaccination services to children.
									Our goal is to ensure that every child has access to life-saving vaccines in a safe,
									comfortable environment with the highest standards of care.
								</p>
							</CardContent>
						</Card>
					</motion.div>
					
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Card>
							<CardHeader>
								<CardTitle>Our Team</CardTitle>
								<CardDescription>Experienced healthcare professionals</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Our team consists of highly qualified doctors, nurses, and healthcare professionals
									who specialize in pediatric care and vaccination. Each team member is committed to
									providing compassionate, personalized care to every child and family.
								</p>
							</CardContent>
						</Card>
					</motion.div>
					
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<Card>
							<CardHeader>
								<CardTitle>Our Approach</CardTitle>
								<CardDescription>Child-centered care</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									We understand that vaccination can be stressful for both children and parents.
									That's why we've designed our services to be child-friendly, with an emphasis on
									comfort, clear communication, and compassionate care throughout the process.
								</p>
							</CardContent>
						</Card>
					</motion.div>
				</div>
				
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="mt-16"
				>
					<Card>
						<CardHeader>
							<CardTitle className="text-center">Our History</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 max-w-4xl mx-auto">
								Founded in 2010, our vaccination center has grown from a small clinic to a comprehensive
								children's health service. Over the years, we've helped protect thousands of children
								from preventable diseases through timely, effective vaccination programs. Our commitment
								to excellence in healthcare has made us a trusted partner for families throughout the region.
							</p>
						</CardContent>
					</Card>
				</motion.div>
			</main>
		</div>
	);
}

export default AboutUsPage;
