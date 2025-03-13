import { useFormik } from "formik";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";

function UpdateChild({ setIsOpen, childId, open, onUpdate }) {
	const token = localStorage.getItem("token");
	const childAPI = "http://localhost:8080/children";

	const validation = Yup.object().shape({
		firstName: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
		lastName: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
		dob: Yup.date().required("Date of birth is required"),
		height: Yup.number().required("Height is required").positive("Height must be positive"),
		weight: Yup.number().required("Weight is required").positive("Weight must be positive"),
		gender: Yup.string().oneOf(["MALE", "FEMALE"]).required("Gender is required"),
		imageUrl: Yup.string().url("Invalid URL"), // optional, but if present, must be a valid URL
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			dob: "",
			height: "",
			weight: "",
			gender: "MALE",
			imageUrl: "https://media.npr.org/assets/img/2013/03/11/istock-4306066-baby_custom-00a02f589803ea4cb7b723dd1df6981d77e7cdc7.jpg",
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
		validationSchema: validation,
	});

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleSubmit = async (values) => {
		// console.log(values);
		try {
			const response = await fetch(`${childAPI}/${childId}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify(values),
			});
			if (response.ok) {
				const data = await response.json();
				const newChild = data.result;
				onUpdate(newChild);
			} else {
				console.error("Updating child failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when updating child: ", err);
		}
	};
	return (
		<div>
			{console.log(childId)}
			<Modal show={open} onHide={handleClose}>
				<Form method="PATCH" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Update child</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row className="mb-3">
							<Form.Group as={Col} controlId="fisrtName">
								<Form.Label>First name</Form.Label>
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

							<Form.Group as={Col} controlId="lastName">
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
							<Form.Check inline defaultChecked label="Male" name="gender" type="radio" id="Male" value="MALE" onChange={formik.handleChange} isInvalid={formik.touched.gender && formik.errors.gender} />
							<Form.Check inline label="Female" name="gender" type="radio" id="Female" value="FEMALE" onChange={formik.handleChange} isInvalid={formik.touched.gender && formik.errors.gender} />
							{formik.touched.gender && formik.errors.gender && <div className="invalid-feedback d-block">{formik.errors.gender}</div>}
						</Form.Group>

						<Form.Group className="mb-3" controlId="dateOfBirth">
							<Form.Label>Date of Birth</Form.Label>
							<Form.Control type="date" name="dob" value={formik.values.dob} onChange={formik.handleChange} isInvalid={formik.touched.dob && formik.errors.dob} />
							<Form.Control.Feedback type="invalid">{formik.errors.dob}</Form.Control.Feedback>
						</Form.Group>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="weight">
								<Form.Label>Weight (kg)</Form.Label>
								<Form.Control type="number" placeholder="Weight" name="weight" value={formik.values.weight} onChange={formik.handleChange} isInvalid={formik.touched.weight && formik.errors.weight} />
								<Form.Control.Feedback type="invalid">{formik.errors.weight}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="lastName">
								<Form.Label>Height (cm)</Form.Label>
								<Form.Control type="number" placeholder="Height" name="height" value={formik.values.height} onChange={formik.handleChange} isInvalid={formik.touched.height && formik.errors.height} />
								<Form.Control.Feedback type="invalid">{formik.errors.height}</Form.Control.Feedback>
							</Form.Group>
						</Row>

						{/* <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Child Image</Form.Label>
                    <Form.Control type="file" name="imageUrl" onChange={handleFileChange} />
                </Form.Group> */}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button type="submit" variant="primary">
							Update
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default UpdateChild;
