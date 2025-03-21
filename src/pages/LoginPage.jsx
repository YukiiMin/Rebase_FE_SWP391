import { useFormik } from "formik";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import TokenUtils from "../utils/TokenUtils";

function LoginPage() {
	const navigate = useNavigate();
	// const accountAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/account";
	const accountAPI = "http://localhost:8080/auth/login";

	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		onSubmit: (values) => {
			handleLogin(values);
		},
	});

	const handleLogin = async (values) => {
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
				const token = data.result.token;
				
				// Sử dụng TokenUtils để lưu token
				TokenUtils.setToken(token);
				
				console.log("Login successful");
				alert("Login successful!");
				navigate("/");
			} else {
				const errorData = await response.json().catch(() => null);
				console.error("Login failed:", response.status, errorData);
				alert("Login failed. Please check your username and password.");
			}
		} catch (error) {
			console.error("Login error:", error);
			alert("An error occurred during login. Please try again.");
		}
	};

	return (
		<Container>
			<Link to={"/"}>Home</Link>
			<h1>Login</h1>
			<Row>
				<Col>
					<Form method="POST" onSubmit={formik.handleSubmit}>
						<Row className="mb-3">
							<Form.Group as={Col} controlId="txtUsername">
								<Form.Label>Username</Form.Label>
								<Form.Control type="text" placeholder="Enter username" name="username" value={formik.values.username} onChange={formik.handleChange} />
							</Form.Group>

							<Form.Group as={Col} controlId="txtPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" placeholder="Password" name="password" value={formik.values.password} onChange={formik.handleChange} />
							</Form.Group>
						</Row>
						<Button variant="primary" type="submit">
							Submit
						</Button>
					</Form>
				</Col>
				<Col className="d-flex flex-column align-items-center">
					<div className="d-flex align-items-center my-3">
						<hr className="flex-grow-1" style={{ borderTop: "1px solid #ccc" }} />
						<span className="mx-2">OR</span>
						<hr className="flex-grow-1" style={{ borderTop: "1px solid #ccc" }} />
					</div>

					<p>Continue with Google</p>
					<Button>Google</Button>
				</Col>
			</Row>

			<p>
				New to our website? <Link to={"/Register"}>Register</Link> now.
			</p>
		</Container>
	);
}

export default LoginPage;
