import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function LoginPage() {
	return (
		<Container>
			<h1>Login</h1>
			<Form>
				<Row className="mb-3">
					<Form.Group as={Col} controlId="txtUsername">
						<Form.Label>Username</Form.Label>
						<Form.Control type="text" placeholder="Enter username" />
					</Form.Group>

					<Form.Group as={Col} controlId="txtPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Password" />
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
