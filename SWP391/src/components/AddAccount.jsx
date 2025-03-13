import { useFormik } from "formik";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

function AddAccount({ setIsOpen, open, onAccountAdded }) {
	const accountAPI = "http://localhost:8080/users/register";
	const navigate = useNavigate();

	const validation = Yup.object().shape({
		firstName: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
		lastName: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
		username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters").max(50, "Username must be at most 50 characters"),

		// DON'T need these field because password is a fixed value
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
		// role: Yup.string().required("Choose Account Role"),
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			gender: "MALE",
			username: "",
			password: "123456", //Default password of any accounts added by ADMIN
			email: "",
			phoneNumber: "",
			address: "",
			urlImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIFYgpCPMtvHYo7rQ8fFSEgLa1BO78b_9hHA&s",
			// role: "",
		},
		onSubmit: (values) => {
			handleAddAccount(values);
		},
		validationSchema: validation,
	});

	const handleClose = () => setIsOpen(false); //Close modal

	const handleAddAccount = async (values) => {
		try {
			const response = await fetch(accountAPI, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});
			if (response.ok) {
				const data = await response.json();
				const newAccount = data.result;
				console.log(newAccount);
				// const newAccount = await response.json();
				console.log("Hien tai do cai Register tra ve 1 chuoi vo nghia nen ko lay ra duoc thang moi tao. Khi lam cai add account BE can tra ve dung");
				handleClose();
				onAccountAdded(newAccount);
			} else {
				console.error("Adding account failed: ", response.status);
			}
		} catch (err) {
			console.error("Registration failed:", err);
		}
	};

	return (
		<div>
			<Modal show={open} onHide={handleClose} size="xl">
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Account</Modal.Title>
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
							<Form.Check inline defaultChecked label="Male" name="gender" type="radio" id="Male" value="MALE" onChange={formik.handleChange} />
							<Form.Check inline label="Female" name="gender" type="radio" id="Female" value="FEMALE" onChange={formik.handleChange} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="txtUsername">
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
								disabled
								name="password"
								value={formik.values.password}
								// onChange={formik.handleChange}
								// isInvalid={formik.touched.password && formik.errors.password}
							/>
							{/* <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback> */}
						</Form.Group>
						{/* 
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
						</Row>
						<Row>
							<Form.Group as={Col} controlId="txtAddress">
								<Form.Label>Address</Form.Label>
								<Form.Control type="text" placeholder="Enter address" name="address" value={formik.values.address} onChange={formik.handleChange} isInvalid={formik.touched.address && formik.errors.address} />
								<Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
							</Form.Group>
							{/* 
							<Form.Group as={Col} controlId="txtRole">
								<Form.Label>Role</Form.Label>
								<Form.Select aria-label="Role" name="role" value={formik.values.role} onChange={formik.handleChange} isInvalid={formik.touched.role && formik.errors.role}>
									<option value="">---Choose Role---</option>
									<option value="USER">User</option>
									<option value="ADMIN">Admin</option>
									<option value="STAFF">Staff</option>
								</Form.Select>
								<Form.Control.Feedback type="invalid">{formik.errors.role}</Form.Control.Feedback>
							</Form.Group>
                             */}
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

export default AddAccount;
