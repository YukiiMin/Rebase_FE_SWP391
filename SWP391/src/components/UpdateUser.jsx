import { useFormik } from "formik";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

function UpdateUser({ setIsOpen, open, user }) {
	const token = localStorage.getItem("token");
	const userAPI = "http://localhost:8080/user";
	const navigate = useNavigate();

	const validation = Yup.object().shape({
		firstName: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
		lastName: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
		username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters").max(50, "Username must be at most 50 characters"),
		// password: Yup.string().required("Password is required").min(3, "Password must be at least 2 characters").max(50, "Password must be at most 16 characters"),
		// confirmPassword: Yup.string()
		// 	.oneOf([Yup.ref("password"), null], "Passwords must match")
		// 	.required("Confirm password is required"),
		email: Yup.string()
			.email("Invalid email")
			.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must have a '.' after '@'")
			.required("Email is required")
			.max(50, "Email must be at most 50 characters"),
		phoneNumber: Yup.string()
			.required("Phone number is required")
			.matches(/^0\d+$/, "Phone number must start with 0 and contain only digits")
			.min(10, "Phone number must be at least 10 digits")
			.max(12, "Phone number cannot be longer than 12 digits"),
		address: Yup.string().required("Address is required").min(5, "Address must be at least 5 characters").max(100, "Address must be at most 100 characters"),
	});

	const formik = useFormik({
		initialValues: {
			accountId: user.accountId,
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
			password: user.password,
			confirmPassword: "",
			gender: user.gender,
			email: user.email,
			phoneNumber: user.phoneNumber,
			address: user.address,
			urlImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIFYgpCPMtvHYo7rQ8fFSEgLa1BO78b_9hHA&s",
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
		validationSchema: validation,
	});
	const handleClose = () => setIsOpen(false); //Close modal

	const handleSubmit = async (values) => {
		try {
			const userData = {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				phoneNumber: values.phoneNumber,
				address: values.address,
				gender: values.gender,
				urlImage: values.urlImage,
			};
			const userId = values.accountId;
			console.log(userId);
			console.log(userData);
			const response = await fetch(`${userAPI}/${userId}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});
			if (response.ok) {
				alert("Update profile successful!");
				handleClose();
				navigate("/User/Profile");
				// window.location.reload(); // Reload page after redirect
			} else {
				const data = await response.json();
				console.log(data);
				console.error("Update profile failed: ", response.status);
				alert("Update profile failed. Please try again.");
			}
		} catch (err) {
			console.error("Update profile error:", err);
			alert("An error occurred during update. Please try again.");
		}
	};

	return (
		<div>
			{console.log(user)}
			<Modal show={open} onHide={handleClose} size="xl">
				<Form method="PATCH" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Update Profile</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row className="mb-3">
							<Form.Group as={Col} controlId="txtFirstname">
								<Form.Label>First Name</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter first name"
									name="firstName"
									value={formik.values.firstName}
									onChange={formik.handleChange}
									isInvalid={formik.touched.firstName && formik.errors.firstName}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.firstName}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="txtLastname">
								<Form.Label>Last name</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter last name"
									name="lastName"
									value={formik.values.lastName}
									onChange={formik.handleChange}
									isInvalid={formik.touched.lastName && formik.errors.lastName}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.lastName}</Form.Control.Feedback>
							</Form.Group>
						</Row>

						<Form.Group className="mb-3">
							<Form.Check inline label="Male" name="gender" type="radio" id="Male" value="MALE" onChange={formik.handleChange} />
							<Form.Check inline label="Female" name="gender" type="radio" id="Female" value="FEMALE" onChange={formik.handleChange} />
						</Form.Group>

						{/* <Form.Group className="mb-3" controlId="txtUsername">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter username"
								name="username"
								value={formik.values.username}
								onChange={formik.handleChange}
								isInvalid={formik.touched.username && formik.errors.username}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="txtPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								name="password"
								// value={formik.values.password}
								// onChange={formik.handleChange}
								// isInvalid={formik.touched.password && formik.errors.password}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="txtConfirm">
							<Form.Label>Confirm password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Confirm password"
								name="confirmPassword"
								value={formik.values.confirmPassword}
								onChange={formik.handleChange}
								isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
						</Form.Group> */}

						<Row className="mb-3">
							<Form.Group as={Col} controlId="txtEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" placeholder="Enter email" name="email" value={formik.values.email} onChange={formik.handleChange} isInvalid={formik.touched.email && formik.errors.email} />
								<Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="txtPhone">
								<Form.Label>Phone number</Form.Label>
								<Form.Control
									type="tel"
									placeholder="Enter phone number"
									name="phoneNumber"
									value={formik.values.phoneNumber}
									onChange={formik.handleChange}
									isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.phoneNumber}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="txtAddress">
								<Form.Label>Address</Form.Label>
								<Form.Control type="text" placeholder="Enter address" name="address" value={formik.values.address} onChange={formik.handleChange} isInvalid={formik.touched.address && formik.errors.address} />
								<Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
							</Form.Group>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="primary" type="submit">
							Save Changes
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default UpdateUser;
