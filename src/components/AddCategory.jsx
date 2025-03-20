import { useFormik } from "formik";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import * as Yup from "yup";

function AddCategory({ open, setIsOpen, onAddedCategory }) {
	const token = localStorage.getItem("token");
	const vaccineAPI = "http://localhost:8080/vaccine";

	const validation = Yup.object({
		categoryName: Yup.string().required("Category name is required."),
		description: Yup.string().required("Category description is required").min(10, "Description must be at least 10 characters"),
	});

	const formik = useFormik({
		initialValues: {
			categoryName: "",
			description: "",
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
		try {
			const response = await fetch(`${vaccineAPI}/category/add`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});
			if (response.ok) {
				console.log("Adding category successful");
				const newCategory = await response.json();
				console.log(newCategory.result);
				handleClose();
				onAddedCategory(newCategory.result);
			} else {
				console.error("Adding category failed: ", response.status);
			}
		} catch (err) {
			console.error("Adding category failed: ", err);
		}
	};

	return (
		<div>
			<Modal show={open} onHide={handleClose} size="sm" backdrop="static">
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Category</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3" controlId="categoryName">
							<Form.Label>Category name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter category name"
								name="categoryName"
								value={formik.values.categoryName}
								onChange={formik.handleChange}
								isInvalid={formik.touched.categoryName && formik.errors.categoryName}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.categoryName}</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="categoryDescription">
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								rows={2}
								placeholder="Enter description"
								name="description"
								value={formik.values.description}
								onChange={formik.handleChange}
								isInvalid={formik.touched.description && formik.errors.description}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
						</Form.Group>
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

export default AddCategory;
