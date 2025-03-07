import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { Button, Col, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";

function AddCombo({ setIsOpen, open }) {
	const searchVaccAPI = "http://localhost:8080/vaccine";
	const addComboAPI = "http://localhost:8080/vaccine/combo/add";
	const addComDetailAPI = "http://localhost:8080/vaccine/combo/detail";

	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);

	const [selectedVaccs, setSelectedVaccs] = useState([]);

	const handleClose = () => setIsOpen(false); //Close modal

	const validation = Yup.object({
		comboName: Yup.string().required("Combo Name is required"),
		description: Yup.string().required("Description is required").min(30, "Description must be at least 30 characters"),
		saleOff: Yup.number().min(0, "Sale cannot be negative"),
		ageGroup: Yup.string().required("Age group is required"),
	});

	const formik = useFormik({
		initialValues: {
			comboName: "",
			description: "",
			saleOff: 0,
			ageGroup: "",
		},
		onSubmit: (values) => {
			handleAddCombo(values);
		},
		validationSchema: validation,
	});

	const handleSelectVaccine = (vaccine) => {
		const isSelected = selectedVaccs.some((vac) => vac.vaccine.id === vaccine.id);
		if (isSelected) {
			//Unchose the vaccine
			setSelectedVaccs(selectedVaccs.filter((vac) => vac.vaccine.id !== vaccine.id));
		} else {
			setSelectedVaccs([...selectedVaccs, { vaccine, dose: 0 }]);
		}
	};

	const handleDoseChange = (vaccineId, dose) => {
		setSelectedVaccs(selectedVaccs.map((v) => (v.vaccine.id === vaccineId ? { ...v, dose: parseInt(dose, 10) } : v)));
	};

	//Add the vaccine combo first
	const handleAddCombo = async (values) => {
		try {
			console.log(values);
			const response = await fetch(addComboAPI, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});
			if (response.ok) {
				console.log("Add combo successful, proceed to adding combo detail");
				//Get new id from the response
				const responseData = await response.json();
				const comboId = responseData.id;
				console.log("id:", comboId);
				handleAddComboDetail(values, comboId);
			} else {
				console.error("Adding combo failed: ", response.status);
				alert("Adding combo failed. Please try again.");
			}
		} catch (err) {
			console.error("Add combo error:", err);
			alert("An error occurred during adding child. Please try again.");
		}
	};

	//Add vaccine combo detail using the newly create comboId
	const handleAddComboDetail = async (values, comboId) => {
		try {
			console.log(values, `comboId: ${comboId}`, selectedVaccs);
			// const response = await fetch(addComDetailAPI + "/" + comboId + "/" + vaccineId);
			for (const item of selectedVaccs) {
				const response = await fetch(`${addComDetailAPI}/${comboId}/${item.vaccine.id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				});
				if (response.ok) {
					console.log("Add combo detail successful");
					alert("Adding combo successful");
					handleClose();
				} else {
					console.error("Add combo detail error: ", response.status);
				}
			}
		} catch (err) {
			console.error("Add combo error:", err);
			alert("An error occurred during adding child. Please try again.");
		}
	};

	//Function search vaccine for the form
	const handleSearch = async (search) => {
		console.log(search);
		try {
			// const response = await fetch(searchVaccAPI + "/" + search);
			const response = await fetch(`${searchVaccAPI}/${search}`);
			if (response.ok) {
				const data = await response.json();
				setSearchResult(data.result);
			} else {
				console.error("Search error:", response.status);
				alert("Something went wrong with the searching");
			}
		} catch (err) {
			console.error("Search errror:", err);
		}
	};

	return (
		<div>
			<Modal show={open} onHide={handleClose} size="xl">
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Combo Vaccine</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3" controlId="formGridComboName">
							<Form.Label>Combo Name *</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter Combo Name"
								name="comboName"
								value={formik.values.comboName}
								onChange={formik.handleChange}
								isInvalid={formik.touched.comboName && formik.errors.comboName}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.comboName}</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formGridComboDescription">
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Combo Description"
								name="description"
								value={formik.values.description}
								onChange={formik.handleChange}
								isInvalid={formik.touched.description && formik.errors.description}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
						</Form.Group>
						<Row>
							<Col>
								<InputGroup className="mb-3">
									<Form.Control placeholder="Vaccine name..." aria-label="Vaccine name" name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
									<Button variant="outline-secondary" id="button-addon2" onClick={(e) => handleSearch(search)}>
										Search
									</Button>
								</InputGroup>
								Dang bi loi, nho fix
								<Table striped bordered hover responsive>
									{console.log(searchResult)}
									<thead>
										<tr>
											<th></th>
											<th>#</th>
											<th>Vaccine name</th>
											<th>Category</th>
											<th>Dose</th>
										</tr>
									</thead>
									<tbody>
										{searchResult.length > 0 ? (
											searchResult.map((vaccine) => (
												<tr key={vaccine.id}>
													<td>
														<Form.Check inline name="vaccineid" type={"checkbox"} checked={selectedVaccs.some((vac) => vac.vaccine.id === vaccine.id)} onChange={() => handleSelectVaccine(vaccine)} />
													</td>
													<td>{vaccine.id}</td>
													<td>{vaccine.name}</td>
													<td>{vaccine.price}</td>
													<td>
														<Form.Group className="mb-3" controlId={`dose-${vaccine.id}`}>
															<Form.Control
																type="number"
																placeholder="Enter dose"
																value={selectedVaccs.find((v) => v.vaccine.id === vaccine.id)?.dose || 0}
																onChange={(e) => handleDoseChange(vaccine.id, e.target.value)}
															/>
															{/* <Form.Control.Feedback type="invalid">{errors.comboName}</Form.Control.Feedback> */}
														</Form.Group>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan={5}>No result</td>
											</tr>
										)}
									</tbody>
								</Table>
							</Col>
							<Col>
								<Form.Group className="mb-3" controlId="sale">
									<Form.Label>Sale off (%)</Form.Label>
									<Form.Control type="number" placeholder="Enter sale" name="saleOff" value={formik.values.saleOff} onChange={formik.handleChange} isInvalid={formik.touched.saleOff && formik.errors.saleOff} />
									<Form.Control.Feedback type="invalid">{formik.errors.saleOff}</Form.Control.Feedback>
								</Form.Group>
								<Form.Group className="mb-3" controlId="ageGroup">
									<Form.Label>Age group</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter age group"
										name="ageGroup"
										value={formik.values.ageGroup}
										onChange={formik.handleChange}
										isInvalid={formik.touched.ageGroup && formik.errors.ageGroup}
									/>
									<Form.Control.Feedback type="invalid">{formik.errors.ageGroup}</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>
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

export default AddCombo;
