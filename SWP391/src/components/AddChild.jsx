import { useFormik } from "formik";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AddChild({ setIsOpen, open }) {
	const navigate = useNavigate();
	const childAPI = "";

	const handleClose = () => setIsOpen(false); //Close modal

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			dateOfBirth: "",
			height: "",
			weight: "",
			gender: "male",
			imageUrl: null,
		},
		onSubmit: (values) => {
			handleAddChild(values);
		},
	});

	const handleAddChild = async (values) => {
		try {
			console.log(values);
			const response = await fetch(childAPI, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});
			if (response.ok) {
				console.log("Adding child successful");
				alert("Adding child successful!");
				handleClose();
				navigate('/children');
				window.location.reload(); // Reload page after redirect
			} else {
				console.error("Adding child failed: ", response.status);
				alert("Adding child failed. Please try again.");
			}
		} catch (err) {
			console.error("Add child error:", err);
			alert("An error occurred during adding child. Please try again.");
		}
	};

	const handleFileChange = (event) => {
		formik.setFieldValue("imageUrl", event.currentTarget.files[0]);
	};

	return (
		<div>
			<Modal show={open} onHide={handleClose}>
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Add child</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row className="mb-3">
							<Form.Group as={Col} controlId="fisrtName">
								<Form.Label>First name</Form.Label>
								<Form.Control type="text" placeholder="Enter first name" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} />
							</Form.Group>

							<Form.Group as={Col} controlId="lastName">
								<Form.Label>Last name</Form.Label>
								<Form.Control type="text" placeholder="Enter last name" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} />
							</Form.Group>
						</Row>

						<Form.Group className="mb-3">
							<Form.Check inline defaultChecked label="Male" name="gender" type="radio" id="Male" value="male" onChange={formik.handleChange} />
							<Form.Check inline label="Female" name="gender" type="radio" id="Female" value="female" onChange={formik.handleChange} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="dateOfBirth">
							<Form.Label>Date of Birth</Form.Label>
							<Form.Control type="date" name="dateOfBirth" value={formik.values.dateOfBirth} onChange={formik.handleChange} />
						</Form.Group>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="weight">
								<Form.Label>Weight</Form.Label>
								<Form.Control type="number" placeholder="Weight" name="weight" value={formik.values.weight} onChange={formik.handleChange} />
							</Form.Group>

							<Form.Group as={Col} controlId="lastName">
								<Form.Label>Height</Form.Label>
								<Form.Control type="number" placeholder="Height" name="height" value={formik.values.height} onChange={formik.handleChange} />
							</Form.Group>
						</Row>

						<Form.Group controlId="formFile" className="mb-3">
							<Form.Label>Child Image</Form.Label>
							<Form.Control type="file" name="imageUrl" onChange={handleFileChange} />
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button type="submit" variant="primary">
							Add
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default AddChild;
