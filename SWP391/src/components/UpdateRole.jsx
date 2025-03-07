import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function UpdateRole({ setIsOpen, open, userId }) {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const userAPI = "http://localhost:8080/users";
	const [role, setRole] = useState();
	const [status, setStatus] = useState(true);

	useEffect(() => {
		if (userId) {
			getUser(userId);
		}
	}, [userId]);

	// useEffect(() => {
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
				setRole(data.result.roleName);
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
					role: role,
					status: status,
				}),
			});
			if (response.ok) {
				alert("Update role successful!");
				handleClose();
				navigate('/admin/account-manage');
				window.location.reload(); // Reload page after redirect
			} else {
				console.error("Failed to update user:", response.status);
				alert("Update role failed. Please try again.");
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
				<Form method="POST" onSubmit={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Update Role</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Select value={role} onChange={handleRoleChange}>
							<option value="USER">User</option>
							<option value="STAFF">Staff</option>
							<option value="ADMIN">Admin</option>
						</Form.Select>
						<Form.Check type="switch" id="status" label="Status" checked={status} onChange={handleStatusChange} />
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={handleSubmit}>
							Update
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default UpdateRole;
