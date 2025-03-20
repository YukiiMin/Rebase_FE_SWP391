// import React, { useState } from "react";
// import { Button, Form, Modal } from "react-bootstrap";
// import { toast } from "react-toastify";

// function AddAccount({ setIsOpen, open, onAccountAdded }) {
// 	const token = localStorage.getItem("token");
// 	const [formData, setFormData] = useState({
// 		username: "",
// 		password: "",
// 		firstName: "",
// 		lastName: "",
// 		email: "",
// 		phoneNumber: "",
// 		address: "",
// 		gender: "MALE",
// 		roleName: "DOCTOR", // Default to DOCTOR
// 		status: true
// 	});

// 	const [errors, setErrors] = useState({});

// 	const handleChange = (e) => {
// 		const { name, value } = e.target;
// 		setFormData({ ...formData, [name]: value });
		
// 		// Clear error when field is edited
// 		if (errors[name]) {
// 			setErrors({ ...errors, [name]: null });
// 		}
// 	};

// 	const validate = () => {
// 		const newErrors = {};
		
// 		// Username validation
// 		if (!formData.username || formData.username.length < 3) {
// 			newErrors.username = "Username must be at least 3 characters";
// 		}
		
// 		// Password validation
// 		if (!formData.password || formData.password.length < 3) {
// 			newErrors.password = "Password must be at least 3 characters";
// 		}
		
// 		// Email validation
// 		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
// 		if (!formData.email || !emailRegex.test(formData.email)) {
// 			newErrors.email = "Please enter a valid email";
// 		}
		
// 		// Phone validation
// 		const phoneRegex = /^0[0-9]{9}$/;
// 		if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
// 			newErrors.phoneNumber = "Phone number must be 10 digits and start with 0";
// 		}
		
// 		// Basic validation for other fields
// 		if (!formData.firstName) newErrors.firstName = "First name is required";
// 		if (!formData.lastName) newErrors.lastName = "Last name is required";
// 		if (!formData.address) newErrors.address = "Address is required";

// 		setErrors(newErrors);
// 		return Object.keys(newErrors).length === 0;
// 	};

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
		
// 		if (!validate()) {
// 			toast.error("Please correct the errors in the form");
// 			return;
// 		}

// 		try {
// 			const response = await fetch("http://localhost:8080/users/staff", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${token}`,
// 				},
// 				body: JSON.stringify(formData),
// 			});

// 			const data = await response.json();

// 			if (response.ok && data.code === 200) {
// 				toast.success("Staff account created successfully");
// 				setIsOpen(false);
// 				// Call the callback with the new account data
// 				if (onAccountAdded) {
// 					onAccountAdded(data.result);
// 				}
// 			} else {
// 				toast.error(data.message || "Failed to create account");
// 			}
// 		} catch (error) {
// 			console.error("Error creating account:", error);
// 			toast.error("An error occurred while creating the account");
// 		}
// 	};

// 	return (
// 		<Modal show={open} onHide={() => setIsOpen(false)}>
// 			<Modal.Header closeButton>
// 				<Modal.Title>Add Staff Account</Modal.Title>
// 			</Modal.Header>
// 			<Modal.Body>
// 				<Form onSubmit={handleSubmit}>
// 					<Form.Group className="mb-3">
// 						<Form.Label>Username</Form.Label>
// 						<Form.Control
// 							type="text"
// 							name="username"
// 							value={formData.username}
// 							onChange={handleChange}
// 							isInvalid={!!errors.username}
// 						/>
// 						<Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
// 					</Form.Group>

// 					<Form.Group className="mb-3">
// 						<Form.Label>Password</Form.Label>
// 						<Form.Control
// 							type="password"
// 							name="password"
// 							value={formData.password}
// 							onChange={handleChange}
// 							isInvalid={!!errors.password}
// 						/>
// 						<Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
// 					</Form.Group>

// 					<Form.Group className="mb-3">
// 						<Form.Label>First Name</Form.Label>
// 						<Form.Control
// 							type="text"
// 							name="firstName"
// 							value={formData.firstName}
// 							onChange={handleChange}
// 							isInvalid={!!errors.firstName}
// 						/>
// 						<Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
// 					</Form.Group>

// 					<Form.Group className="mb-3">
// 						<Form.Label>Last Name</Form.Label>
// 						<Form.Control
// 							type="text"
// 							name="lastName"
// 							value={formData.lastName}
// 							onChange={handleChange}
// 							isInvalid={!!errors.lastName}
// 						/>
// 						<Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
// 					</Form.Group>

// 					<Form.Group className="mb-3">
// 						<Form.Label>Email</Form.Label>
// 						<Form.Control
// 							type="email"
// 							name="email"
// 							value={formData.email}
// 							onChange={handleChange}
// 							isInvalid={!!errors.email}
// 						/>
// 						<Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
// 					</Form.Group>

// 					<Form.Group className="mb-3">
// 						<Form.Label>Phone Number</Form.Label>
// 						<Form.Control
// 							type="text"
// 							name="phoneNumber"
// 							value={formData.phoneNumber}
// 							onChange={handleChange}
// 							isInvalid={!!errors.phoneNumber}
// 						/>
// 						<Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
// 					</Form.Group>

// 					<Form.Group className="mb-3">
// 						<Form.Label>Address</Form.Label>
// 						<Form.Control
// 							type="text"
// 							name="address"
// 							value={formData.address}
// 							onChange={handleChange}
// 							isInvalid={!!errors.address}
// 						/>
// 						<Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
// 					</Form.Group>

// 					<Form.Group className="mb-3">
// 						<Form.Label>Gender</Form.Label>
// 						<Form.Select name="gender" value={formData.gender} onChange={handleChange}>
// 							<option value="MALE">Male</option>
// 							<option value="FEMALE">Female</option>
// 							<option value="OTHER">Other</option>
// 						</Form.Select>
// 					</Form.Group>

// 					<Form.Group className="mb-3">
// 						<Form.Label>Role</Form.Label>
// 						<Form.Select name="roleName" value={formData.roleName} onChange={handleChange}>
// 							<option value="DOCTOR">Doctor</option>
// 							<option value="NURSE">Nurse</option>
// 						</Form.Select>
// 					</Form.Group>

// 					<div className="d-flex justify-content-end mt-4">
// 						<Button variant="secondary" className="me-2" onClick={() => setIsOpen(false)}>
// 							Cancel
// 						</Button>
// 						<Button variant="primary" type="submit">
// 							Add Account
// 						</Button>
// 					</div>
// 				</Form>
// 			</Modal.Body>
// 		</Modal>
// 	);
// }

// export default AddAccount;
