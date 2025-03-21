import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

	const handleRoleChange = (e) => {
		setRole(e.target.value);
	};

	const handleStatusChange = (e) => {
		setStatus(e.target.checked);
	};

	return (
		<div>
			<Modal show={open} onHide={handleClose}>
				{console.log(role, status)}
				<Form method="PATCH" onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}>
					<Modal.Header closeButton>
						<Modal.Title>Update Role</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3">
							<Form.Label>Role</Form.Label>
							<Form.Select value={role} onChange={handleRoleChange}>
								{validRoles.map((roleOption) => (
									<option key={roleOption.value} value={roleOption.value}>
										{roleOption.label}
									</option>
								))}
							</Form.Select>
						</Form.Group>
						
						<Form.Group className="mb-3">
							<Form.Check 
								type="switch" 
								id="status" 
								label={status ? "Active" : "Inactive"} 
								checked={status} 
								onChange={handleStatusChange} 
							/>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="primary" type="submit">
							Update
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default UpdateRole;
