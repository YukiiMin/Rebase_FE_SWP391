import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

function UpdateUser({ setIsOpen, open }) {
	const handleClose = () => setIsOpen(false); //Close modal

	return (
		<div>
			<Modal show={open} onHide={handleClose}>
				<Form method="POST" onSubmit={handleClose}>
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
									// value={formik.values.firstName}
									// onChange={formik.handleChange}
									// isInvalid={formik.touched.firstName && formik.errors.firstName}
								/>
								{/* <Form.Control.Feedback type="invalid">{formik.errors.firstName}</Form.Control.Feedback> */}
							</Form.Group>

							<Form.Group as={Col} controlId="txtLastname">
								<Form.Label>Last name</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter last name"
									name="lastName"
									// value={formik.values.lastName}
									// onChange={formik.handleChange}
									// isInvalid={formik.touched.lastName && formik.errors.lastName}
								/>
								{/* <Form.Control.Feedback type="invalid">{formik.errors.lastName}</Form.Control.Feedback> */}
							</Form.Group>
						</Row>

						<Form.Group className="mb-3">
							<Form.Check
								inline
								defaultChecked
								label="Male"
								name="gender"
								type="radio"
								id="Male"
								value="MALE"
								// onChange={formik.handleChange}
							/>
							<Form.Check
								inline
								label="Female"
								name="gender"
								type="radio"
								id="Female"
								value="FEMALE"
								//  onChange={formik.handleChange}
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="txtUsername">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter username"
								name="username"
								// value={formik.values.username}
								// onChange={formik.handleChange}
								// isInvalid={formik.touched.username && formik.errors.username}
							/>
							{/* <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback> */}
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
							{/* <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback> */}
						</Form.Group>

						<Form.Group className="mb-3" controlId="txtConfirm">
							<Form.Label>Confirm password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Confirm password"
								name="confirmPassword"
								// value={formik.values.confirmPassword}
								// onChange={formik.handleChange}
								// isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
							/>
							{/* <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback> */}
						</Form.Group>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="txtEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter email"
									name="email"
									//  value={formik.values.email} onChange={formik.handleChange} isInvalid={formik.touched.email && formik.errors.email}
								/>
								{/* <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback> */}
							</Form.Group>

							<Form.Group as={Col} controlId="txtPhone">
								<Form.Label>Phone number</Form.Label>
								<Form.Control
									type="tel"
									placeholder="Enter phone number"
									name="phoneNumber"
									// value={formik.values.phoneNumber}
									// onChange={formik.handleChange}
									// isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
								/>
								{/* <Form.Control.Feedback type="invalid">{formik.errors.phoneNumber}</Form.Control.Feedback> */}
							</Form.Group>

							<Form.Group as={Col} controlId="txtAddress">
								<Form.Label>Address</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter address"
									name="address"
									//  value={formik.values.address} onChange={formik.handleChange} isInvalid={formik.touched.address && formik.errors.address}
								/>
								{/* <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback> */}
							</Form.Group>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={handleClose}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default UpdateUser;
