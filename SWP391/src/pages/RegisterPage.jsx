import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
	const navigate = useNavigate();

	return (
		<Container>
			<h1>Register</h1>
			<Form>
				<Row className="mb-3">
					<Form.Group as={Col} controlId="txtFirstname">
						<Form.Label>First Name</Form.Label>
						<Form.Control type="text" placeholder="Enter first name" />
					</Form.Group>

					<Form.Group as={Col} controlId="txtLastname">
						<Form.Label>Last name</Form.Label>
						<Form.Control type="text" placeholder="Enter last name" />
					</Form.Group>
				</Row>

				<Form.Group className="mb-3">
					<Form.Check inline label="Male" name="group1" type="radio" id="Male" />
					<Form.Check inline label="Female" name="group1" type="radio" id="Female" />
				</Form.Group>

				<Form.Group className="mb-3" controlId="txtUsername">
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" placeholder="Enter username" />
				</Form.Group>

				<Form.Group className="mb-3" controlId="txtPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" placeholder="Password" />
				</Form.Group>

				<Form.Group className="mb-3" controlId="txtConfirm">
					<Form.Label>Confirm password</Form.Label>
					<Form.Control type="password" placeholder="Confirm password" />
				</Form.Group>

				<Row className="mb-3">
					<Form.Group as={Col} controlId="txtEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" placeholder="Enter email" />
					</Form.Group>

					<Form.Group as={Col} controlId="txtPhone">
						<Form.Label>Phone number</Form.Label>
						<Form.Control type="tel" placeholder="Enter phone number" />
					</Form.Group>

					<Form.Group as={Col} controlId="txtAddress">
						<Form.Label>Address</Form.Label>
						<Form.Control type="text" placeholder="Enter address" />
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
