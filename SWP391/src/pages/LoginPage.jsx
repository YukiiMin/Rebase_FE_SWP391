import { useFormik } from "formik";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
	const navigate = useNavigate();
	const accountAPI = "";
	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		onSubmit: (values) => {
			handleLogin(values);
			navigate("/");
		},
	});

	const handleLogin = (values) => {
		console.log(values);
	};

	return (
		<Container>
			<h1>Login</h1>
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
			<hr></hr>
			<p>Or continue with Google</p>
			<Button>Google</Button>
			<p>
				New to our website? <Link to={"/Register"}>Register</Link> now.
			</p>
		</Container>
	);
}

export default LoginPage;
