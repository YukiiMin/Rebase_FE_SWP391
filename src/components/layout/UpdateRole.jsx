import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../api";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";

function UpdateRole({ setIsOpen, open, userId }) {
	const navigate = useNavigate();
	const [role, setRole] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Danh sách role hợp lệ
	const validRoles = [
		{ value: "ADMIN", label: "Admin" },
		{ value: "DOCTOR", label: "Doctor" },
		{ value: "NURSE", label: "Nurse" }
	];

	useEffect(() => {
		if (userId) {
			getUser(userId);
		}
	}, [userId]);

	//get user information
	const getUser = async (userId) => {
		try {
			setLoading(true);
			const response = await apiService.users.getById(userId);
			const data = response.data;
			const validRole = validRoles.find(r => r.value === data.result.roleName);
			setRole(validRole ? validRole.value : "DOCTOR");
		} catch (err) {
			setError("Error fetching user data: " + err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	//Update user role
	const handleUpdateRole = async () => {
		try {
			setLoading(true);
			setError("");
			
			await apiService.users.update(userId, {
				roleName: role
			});
			
			alert("Role updated successfully!");
			handleClose();
			navigate('/Admin/ManageAccount');
		} catch (err) {
			setError(err.response?.data?.message || "Failed to update role");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleRoleChange = (value) => {
		setRole(value);
	};

	return (
		<div className="relative z-50">
			{open && (
				<>
					{/* Custom backdrop with Tailwind classes */}
					<div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose}></div>
					
					{/* Modal content */}
					<div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
						<button 
							className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
							onClick={handleClose}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
							<span className="sr-only">Close</span>
						</button>
						
						<div className="flex flex-col space-y-1.5 text-center sm:text-left">
							<h2 className="text-lg font-semibold leading-none tracking-tight">Update Role</h2>
						</div>
						
						{error && (
							<Alert variant="destructive" className="mt-4">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						
						<div className="mt-4 space-y-4">
							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<Select value={role} onValueChange={handleRoleChange}>
									<SelectTrigger id="role">
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										{validRoles.map((roleOption) => (
											<SelectItem key={roleOption.value} value={roleOption.value}>
												{roleOption.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							
							<div className="flex justify-end gap-2 pt-4">
								<Button variant="outline" type="button" onClick={handleClose} disabled={loading}>
									Cancel
								</Button>
								<Button 
									type="button" 
									onClick={handleUpdateRole}
									disabled={loading}
								>
									Update Role
								</Button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default UpdateRole;
