import { useFormik } from "formik";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

function RegisterPage() {
	const navigate = useNavigate();
	const accountAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/account";
	// const accountAPI = "http://localhost:8080/users/register";

	const validation = Yup.object().shape({
		firstName: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
		lastName: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
		username: Yup.string().required("Username is required").min(5, "Username must be at least 5 characters"),
		password: Yup.string().required("Password is required").min(5, "Password must be at least 2 characters"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password"), null], "Passwords must match")
			.required("Confirm password is required"),
		email: Yup.string().email("Invalid email").required("Email is required"),
		phoneNumber: Yup.string().required("Phone number is required"),
		address: Yup.string().required("Address is required").min(5, "Address must be at least 5 characters"),
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			gender: "male",
			username: "",
			password: "",
			confirmPassword: "",
			email: "",
			phoneNumber: "",
			address: "",
			urlImage: "",
			roleid: "1",
		},
		onSubmit: (values) => {
			handleRegister(values);
		},
		validationSchema: validation,
	});

	const handleRegister = async (values) => {
		try {
			const { confirmPassword, ...registerValues } = values;
			const response = await fetch(accountAPI, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registerValues),
			});

			if (response.ok) {
				console.log("Registration successful");
				alert("Registration successful!");
				navigate("/login");
			} else {
				console.error("Registration failed:", response.status);
				alert("Registration failed. Please try again.");
			}
		} catch (error) {
			console.error("Registration error:", error);
			alert("An error occurred during registration. Please try again.");
		}
	};

	return (
		<Container>
			<Link to={"/"}>Home</Link>
			<h1>Register</h1>
			<Form method="POST" onSubmit={formik.handleSubmit}>
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
					<Form.Check inline defaultChecked label="Male" name="gender" type="radio" id="Male" value="male" onChange={formik.handleChange} />
					<Form.Check inline label="Female" name="gender" type="radio" id="Female" value="female" onChange={formik.handleChange} />
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
					<Form.Control type="password" placeholder="Password" name="password" value={formik.values.password} onChange={formik.handleChange} isInvalid={formik.touched.password && formik.errors.password} />
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
				</Form.Group>

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

				<Button variant="primary" type="submit">
					Submit
				</Button>
			</Form>
			<p>
				Already have an account? <Link to={"/Login"}>Login</Link> now.
			</p>
		</Container>
	);
}

export default RegisterPage;
