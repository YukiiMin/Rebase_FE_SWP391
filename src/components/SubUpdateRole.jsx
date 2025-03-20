// import React, { useEffect, useState } from "react";
// import { Button, Form, Modal } from "react-bootstrap";
// import { toast } from "react-toastify";

// function UpdateRole({ setIsOpen, open, userId, onRoleUpdated }) {
// 	const token = localStorage.getItem("token");
// 	const [roles, setRoles] = useState([]);
// 	const [selectedRole, setSelectedRole] = useState("");
// 	const [isLoading, setIsLoading] = useState(false);

// 	useEffect(() => {
// 		if (open) {
// 			fetchRoles();
// 		}
// 	}, [open]);

// 	const fetchRoles = async () => {
// 		try {
// 			// Fetch available roles
// 			const response = await fetch("http://localhost:8080/roles", {
// 				headers: {
// 					Authorization: `Bearer ${token}`
// 				}
// 			});
			
// 			if (response.ok) {
// 				const data = await response.json();
// 				if (data.code === 200 && data.result) {
// 					// Filter out ADMIN role unless current user is ADMIN
// 					setRoles(data.result);
// 				}
// 			}
// 		} catch (error) {
// 			console.error("Error fetching roles:", error);
// 		}
// 	};

// 	const handleRoleChange = (e) => {
// 		setSelectedRole(e.target.value);
// 	};

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
		
// 		if (!selectedRole) {
// 			toast.error("Please select a role");
// 			return;
// 		}
		
// 		setIsLoading(true);
		
// 		try {
// 			const response = await fetch(`http://localhost:8080/users/${userId}/role`, {
// 				method: "PATCH",
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${token}`
// 				},
// 				body: JSON.stringify({ roleName: selectedRole })
// 			});
			
// 			const data = await response.json();
			
// 			if (response.ok && data.code === 200) {
// 				toast.success("Role updated successfully");
// 				setIsOpen(false);
// 				if (onRoleUpdated) {
// 					onRoleUpdated(userId, selectedRole);
// 				}
// 			} else {
// 				toast.error(data.message || "Failed to update role");
// 			}
// 		} catch (error) {
// 			console.error("Error updating role:", error);
// 			toast.error("An error occurred while updating the role");
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return (
// 		<Modal show={open} onHide={() => setIsOpen(false)}>
// 			<Modal.Header closeButton>
// 				<Modal.Title>Update Role</Modal.Title>
// 			</Modal.Header>
// 			<Modal.Body>
// 				<Form onSubmit={handleSubmit}>
// 					<Form.Group className="mb-3">
// 						<Form.Label>Select Role</Form.Label>
// 						<Form.Select 
// 							value={selectedRole} 
// 							onChange={handleRoleChange}
// 							required
// 						>
// 							<option value="">Select a role</option>
// 							{roles.map((role) => (
// 								<option key={role.roleName} value={role.roleName}>
// 									{role.roleName}
// 								</option>
// 							))}
// 						</Form.Select>
// 					</Form.Group>
					
// 					<div className="d-flex justify-content-end">
// 						<Button 
// 							variant="secondary" 
// 							className="me-2"
// 							onClick={() => setIsOpen(false)}
// 						>
// 							Cancel
// 						</Button>
// 						<Button 
// 							variant="primary" 
// 							type="submit"
// 							disabled={isLoading}
// 						>
// 							{isLoading ? "Updating..." : "Update Role"}
// 						</Button>
// 					</div>
// 				</Form>
// 			</Modal.Body>
// 		</Modal>
// 	);
// }

// export default UpdateRole;
