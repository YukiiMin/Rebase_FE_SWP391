import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import MainNav from "../components/layout/MainNav";
import UserSidebar from "../components/layout/UserSidebar";
import AddChild from "../components/layout/AddChild";
import UpdateChild from "../components/layout/UpdateChild";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { motion } from "framer-motion";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Alert, AlertDescription } from "../components/ui/alert";
import { apiService } from "../api";
import TokenUtils from "../utils/TokenUtils";

function UserChildren() {
	const token = localStorage.getItem("token");
	const decodedToken = jwtDecode(token);
	const [isAddOpen, setIsAddOpen] = useState(false); //For add child form
	const [isUpdateOpen, setIsUpdateOpen] = useState(false); //For update child form
	const [childs, setChilds] = useState([]);
	const [selectedChild, setSelectedChild] = useState([]);

	useEffect(() => {
		getChild();
	}, []);

	const getChild = async () => {
		try {
			const userInfo = TokenUtils.getUserInfo();
			if (!userInfo) return;
			
			const accountId = userInfo.userId;
			const response = await apiService.users.getChildren(accountId);
			const data = response.data;
			setChilds(data.children);
		} catch (err) {
			console.error("Something went wrong when fetching child: ", err);
		}
	};

	//After adding child
	const handleChildAdd = (newChild) => {
		if (newChild) {
			setChilds([newChild, ...childs]);
		} else {
			getChild();
		}
	};

	//Assign childId to the button
	const handleUpdateClick = (child) => {
		setSelectedChild(child);
		setIsUpdateOpen(true);
	};

	//After updating child
	const handleChildUpdate = (child) => {
		if (child) {
			setChilds([child, ...childs]);
		} else {
			getChild();
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
		hidden: { y: 20, opacity: 0 },
		visible: { 
			y: 0, 
			opacity: 1,
			transition: { type: "spring", stiffness: 100 }
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
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">Children</h2>
							<Button 
								onClick={() => setIsAddOpen(true)}
								className="flex items-center gap-2"
							>
								<PlusIcon className="h-4 w-4" />
								Add Child
							</Button>
							{isAddOpen && <AddChild setIsOpen={setIsAddOpen} open={isAddOpen} onAdded={handleChildAdd} />}
						</div>

						{childs.length > 0 ? (
							<motion.div 
								variants={containerVariants}
								initial="hidden"
								animate="visible"
								className="grid grid-cols-1 gap-4"
							>
								{childs.map((child) => (
									<motion.div key={child.id} variants={itemVariants}>
										<Card className="shadow-sm">
											<CardHeader className="bg-white pb-2">
												<h3 className="text-lg font-semibold">{child.name}</h3>
											</CardHeader>
											<CardContent className="pt-2">
												<dl className="grid grid-cols-2 gap-x-4 gap-y-2">
													<div>
														<dt className="text-sm font-medium text-gray-500">ID</dt>
														<dd className="text-sm text-gray-900">{child.id}</dd>
													</div>
													<div>
														<dt className="text-sm font-medium text-gray-500">Gender</dt>
														<dd className="text-sm text-gray-900">{child.gender}</dd>
													</div>
													<div>
														<dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
														<dd className="text-sm text-gray-900">{child.dob}</dd>
													</div>
													<div>
														<dt className="text-sm font-medium text-gray-500">Weight</dt>
														<dd className="text-sm text-gray-900">{`${child.weight}kg`}</dd>
													</div>
													<div>
														<dt className="text-sm font-medium text-gray-500">Height</dt>
														<dd className="text-sm text-gray-900">{`${child.height}cm`}</dd>
													</div>
												</dl>
											</CardContent>
											<CardFooter className="flex justify-end gap-2">
												<Button 
													variant="outline"
													size="sm"
													className="flex items-center gap-1"
													onClick={() => handleUpdateClick(child)}
												>
													<PencilIcon className="h-3.5 w-3.5" />
													Edit
												</Button>
												<Button 
													variant="destructive"
													size="sm"
													className="flex items-center gap-1"
												>
													<TrashIcon className="h-3.5 w-3.5" />
													Delete
												</Button>
											</CardFooter>
										</Card>
									</motion.div>
								))}
							</motion.div>
						) : (
							<Alert>
								<AlertDescription>
									No children found. Please add a child to get started.
								</AlertDescription>
							</Alert>
						)}
						
						{isUpdateOpen && selectedChild && (
							<UpdateChild setIsOpen={setIsUpdateOpen} open={isUpdateOpen} child={selectedChild} onUpdate={handleChildUpdate} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserChildren;
