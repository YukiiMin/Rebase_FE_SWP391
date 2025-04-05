import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNav from "../components/layout/MainNav";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { PencilIcon, UserIcon } from "@heroicons/react/24/outline";
import UserSidebar from "../components/layout/UserSidebar";
import UpdateUser from "../components/layout/UpdateUser";
import { apiService } from "../api";
import TokenUtils from "../utils/TokenUtils";

function UserProfile() {
	const [user, setUser] = useState({});
	const [userId, setUserId] = useState("");
	const [isOpen, setIsOpen] = useState(false); //use this to open user update form
	const navigate = useNavigate();

	useEffect(() => {
		const userInfo = TokenUtils.getUserInfo();
		if (userInfo) {
			setUserId(userInfo.userId);
		} else {
			navigate("/login");
		}
	}, [navigate]);

	useEffect(() => {
		if (userId) {
			getUser(userId);
		}
	}, [userId]);

	const getUser = async (userId) => {
		try {
			const response = await apiService.users.getById(userId);
			setUser(response.data.result);
		} catch (err) {
			console.error("Get user failed: ", err);
		}
	};

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
							<h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>
							<Card className="shadow-sm">
								<CardHeader className="pb-0 flex justify-center">
									<Avatar className="h-24 w-24">
										<AvatarImage src="/src/alt/notfound.jpg" alt="Profile image" />
										<AvatarFallback className="bg-primary text-white">
											<UserIcon className="h-12 w-12" />
										</AvatarFallback>
									</Avatar>
								</CardHeader>
								<CardContent className="pt-6">
									<div className="space-y-4">
										<ProfileItem label="Full Name" value={`${user.firstName || ''} ${user.lastName || ''}`} />
										<ProfileItem label="Gender" value={user.gender || 'Not specified'} />
										<ProfileItem label="Email" value={user.email || 'Not specified'} />
										<ProfileItem label="Phone Number" value={user.phoneNumber || 'Not specified'} />
										<ProfileItem label="Address" value={user.address || 'Not specified'} />
									</div>
								</CardContent>
								<CardFooter className="flex justify-center">
									<Button 
										onClick={() => setIsOpen(true)}
										className="flex items-center gap-2"
									>
										<PencilIcon className="h-4 w-4" />
										Edit Profile
									</Button>
									{isOpen && <UpdateUser setIsOpen={setIsOpen} open={isOpen} user={user} />}
								</CardFooter>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}

const ProfileItem = ({ label, value }) => (
	<div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2">
		<span className="font-medium text-gray-500">{label}:</span>
		<span className="text-gray-900">{value}</span>
	</div>
);

export default UserProfile;
