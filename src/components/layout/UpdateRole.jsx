import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";

function UpdateRole({ setIsOpen, open, userId }) {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const userAPI = "http://localhost:8080/users";
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
			const response = await fetch(`${userAPI}/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				const validRole = validRoles.find(r => r.value === data.result.roleName);
				setRole(validRole ? validRole.value : "DOCTOR");
			} else {
				const errorData = await response.json();
				setError(errorData.message || "Failed to fetch user data");
			}
		} catch (err) {
			setError("Error fetching user data: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	//Update user role
	const handleUpdateRole = async () => {
		try {
			setLoading(true);
			setError("");
			
			const response = await fetch(`${userAPI}/${userId}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					roleName: role
				}),
			});
			
			if (response.ok) {
				alert("Role updated successfully!");
				handleClose();
				navigate('/Admin/ManageAccount');
			} else {
				const errorData = await response.json();
				setError(errorData.message || "Failed to update role");
			}
		} catch (err) {
			setError("Error updating role: " + err.message);
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
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Role</DialogTitle>
				</DialogHeader>
				
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				
				<div className="space-y-4">
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
					
					<DialogFooter className="flex justify-end gap-2 pt-4">
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
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default UpdateRole;
