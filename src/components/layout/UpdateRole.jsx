import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";

function UpdateRole({ setIsOpen, open, userId }) {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const userAPI = "http://localhost:8080/users";
	const [role, setRole] = useState("");
	const [status, setStatus] = useState(true);

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

	//useEffect(() => {
	// 	if (user) {
	// 		setRole(user.roleName);
	// 		setStatus(user.status);
	// 	}
	// }, [user]);

	//get user information
	const getUser = async (userId) => {
		try {
			const response = await fetch(`${userAPI}/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				// Chỉ set role nếu nó nằm trong danh sách validRoles
				const validRole = validRoles.find(r => r.value === data.result.roleName);
				setRole(validRole ? validRole.value : "DOCTOR"); // Mặc định là DOCTOR nếu không hợp lệ
				setStatus(data.result.status);
			} else {
				console.error(response.status);
			}
		} catch (err) {
			console.error("Get user failed: ", err);
		}
	};

	//Update user information
	const handleSubmit = async () => {
		try {
			const response = await fetch(`${userAPI}/${userId}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					roleName: role,
					status: status,
				}),
			});
			if (response.ok) {
				alert("Update role successful!");
				handleClose();
				navigate('/Admin/ManageAccount');
			} else {
				console.error("Failed to update user:", response.status);
				const errorData = await response.json();
				alert(`Update failed: ${errorData.message || "Unknown error"}`);
			}
		} catch (err) {
			console.error("Error updating user role: ", err);
			alert("An error occurred during update. Please try again.");
		}
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleRoleChange = (value) => {
		setRole(value);
	};

	const handleStatusChange = (checked) => {
		setStatus(checked);
	};

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Role</DialogTitle>
				</DialogHeader>
				<form onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}} className="space-y-4">
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
					
					<div className="flex items-center justify-between space-y-2">
						<Label htmlFor="status">Status: {status ? "Active" : "Inactive"}</Label>
						<Switch 
							id="status" 
							checked={status} 
							onCheckedChange={handleStatusChange} 
						/>
					</div>
					
					<DialogFooter className="mt-6">
						<Button variant="outline" type="button" onClick={handleClose}>
							Cancel
						</Button>
						<Button type="submit">
							Update
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default UpdateRole;
