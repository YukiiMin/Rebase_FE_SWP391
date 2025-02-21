import { useFormik } from "formik";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

function RegisterPage() {
	const navigate = useNavigate();
	const accountAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/account";

	const formik = useFormik({
		initialValues: {
			firstname: "",
			lastname: "",
			gender: "male",
			username: "",
			password: "",
			confirm: "",
			email: "",
			phoneNumber: "",
			address: "",
			roleid: "1",
		},
		onSubmit: (values) => {
			handleRegister(values);
		},
		validationSchema: Yup.object({
			firstname: Yup.string().required("Enter first name").min(1, "Must enter"),
		}),
	});

	const handleRegister = (values) => {
		console.log(values);
		fetch(accountAPI, {
			method: "POST",
			body: JSON.stringify(values),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "same-origin",
		})
			.then(() => {
				window.alert("Success");
				navigate("/Login");
			})
			.catch((err) => console.log(err));
	};

	return (
		<Container>
			<h1>Register</h1>
			<Form method="POST" onSubmit={formik.handleSubmit}>
				<Row className="mb-3">
					<Form.Group as={Col} controlId="txtFirstname">
						<Form.Label>First Name</Form.Label>
						<Form.Control type="text" placeholder="Enter first name" name="firstname" value={formik.values.firstname} onChange={formik.handleChange} />
					</Form.Group>

					<Form.Group as={Col} controlId="txtLastname">
						<Form.Label>Last name</Form.Label>
						<Form.Control type="text" placeholder="Enter last name" name="lastname" value={formik.values.lastname} onChange={formik.handleChange} />
					</Form.Group>
				</Row>

				<Form.Group className="mb-3">
					<Form.Check inline defaultChecked label="Male" name="gender" type="radio" id="Male" value="male" onChange={formik.handleChange} />
					<Form.Check inline label="Female" name="gender" type="radio" id="Female" value="female" onChange={formik.handleChange} />
				</Form.Group>

				<Form.Group className="mb-3" controlId="txtUsername">
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" placeholder="Enter username" name="username" value={formik.values.username} onChange={formik.handleChange} />
				</Form.Group>

				<Form.Group className="mb-3" controlId="txtPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" placeholder="Password" name="password" value={formik.values.password} onChange={formik.handleChange} />
				</Form.Group>

				<Form.Group className="mb-3" controlId="txtConfirm">
					<Form.Label>Confirm password</Form.Label>
					<Form.Control type="password" placeholder="Confirm password" name="confirm" value={formik.values.confirm} onChange={formik.handleChange} />
				</Form.Group>

				<Row className="mb-3">
					<Form.Group as={Col} controlId="txtEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" placeholder="Enter email" name="email" value={formik.values.email} onChange={formik.handleChange} />
					</Form.Group>

					<Form.Group as={Col} controlId="txtPhone">
						<Form.Label>Phone number</Form.Label>
						<Form.Control type="tel" placeholder="Enter phone number" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} />
					</Form.Group>

					<Form.Group as={Col} controlId="txtAddress">
						<Form.Label>Address</Form.Label>
						<Form.Control type="text" placeholder="Enter address" name="address" value={formik.values.address} onChange={formik.handleChange} />
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
