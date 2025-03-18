import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { Button, Col, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AddCombo({ setIsOpen, open }) {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const searchVaccAPI = "http://localhost:8080/vaccine";
	const comboAPI = "http://localhost:8080/vaccine/combo";

	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);

	const [selectedVaccs, setSelectedVaccs] = useState([]);

	const handleClose = () => setIsOpen(false); //Close modal

	const validation = Yup.object({
		comboName: Yup.string().required("Combo Name is required"),
		description: Yup.string().required("Description is required").min(30, "Description must be at least 30 characters"),
		saleOff: Yup.number().min(0, "Sale cannot be negative"),
		comboCategory: Yup.string().required("Combo category is required"),
	});

	const formik = useFormik({
		initialValues: {
			comboName: "",
			description: "",
			saleOff: 0,
			comboCategory: "",
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
			const comboData = {
				comboName: values.comboName,
				description: values.description,
			};
			const response = await fetch(`${comboAPI}/add`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(comboData),
			});
			if (response.ok) {
				const data = await response.json();
				const comboId = data.result.id;
				console.log("ComboId: ", comboId, ". Next is adding combo detail"); //Get the comboId for the addComboDetail func
				handleAddComboDetail(values, comboId);
			} else {
				console.error("Adding combo failed: ", response.status);
			}
		} catch (err) {
			console.log("Add combo failed: ", err);
		}
	};

	// const handleAddCombo = async (values) => {
	// 	try {
	// 		console.log(values);
	// 		const response = await fetch(`${comboAPI}/add`, {
	// 			method: "POST",
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify(values),
	// 		});
	// 		if (response.ok) {
	// 			console.log("Add combo successful, proceed to adding combo detail");
	// 			//Get new id from the response
	// 			const responseData = await response.json();
	// 			const comboId = responseData.result.id;
	// 			console.log("id:", comboId);
	// 			handleAddComboDetail(values, comboId);
	// 		} else {
	// 			console.error("Adding combo failed: ", response.status);
	// 		}
	// 	} catch (err) {
	// 		console.error("Add combo error:", err);
	// 	}
	// };

	//Add vaccine combo detail using the newly create comboId

	const handleAddComboDetail = async (values, comboId) => {
		console.log(selectedVaccs);
		try {
			let success = true;
			for (const item of selectedVaccs) {
				console.log(item.vaccine.id);
				const detailData = {
					dose: item.dose,
					comboCategory: values.comboCategory,
					saleOff: values.saleOff,
				};
				console.log(detailData);
				console.log(`${comboAPI}/detail/${comboId}/${item.vaccine.id}`);
				const response = await fetch(`${comboAPI}/detail/${comboId}/${item.vaccine.id}`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(detailData),
				});
				if (response.ok) {
					console.log(`Adding detail for vaccineId ${item.vaccine.id} success`);
				} else {
					console.error(`Adding detail for vaccine ${item.vaccine.id} failed: `, response.status);
					success = false;
				}
			}
			if (success) {
				alert("Adding combo successful!!!");
				handleClose();
				navigate("/Admin/ManageCombo");
				window.location.reload(); // Reload page after redirect
			}
		} catch (err) {
			console.error("Add detail failed: ", err);
		}
	};

	// const handleAddComboDetail = async (values, comboId) => {
	// 	try {
	// 		console.log(values, `comboId: ${comboId}`, selectedVaccs);
	// 		for (const item of selectedVaccs) {
	// 			console.log(item)
	// 			const response = await fetch(`${comboAPI}/detail/${comboId}/${item.vaccine.id}`, {
	// 				method: "POST",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify(values),
	// 			});
	// 			if (response.ok) {
	// 				console.log("Add combo detail successful");
	// 				alert("Adding combo successful");
	// 				handleClose();
	// 				// navigate("/Admin/ManageCombo");
	// 				// window.location.reload(); // Reload page after redirect
	// 			} else {
	// 				console.error("Add combo detail error: ", response.status);
	// 			}
	// 		}
	// 	} catch (err) {
	// 		console.error("Add combo error:", err);
	// 	}
	// };

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
								<Table striped bordered hover responsive>
									<thead>
										<tr>
											<th></th>
											<th>#</th>
											<th>Vaccine name</th>
											<th>Unit Price</th>
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
									<Form.Label>Combo Category</Form.Label>
									<Form.Select name="comboCategory" value={formik.values.comboCategory} onChange={formik.handleChange} isInvalid={formik.touched.comboCategory && formik.errors.comboCategory}>
										<option value="">---Choose Category---</option>
										<option value="Combo for kids">Combo for kids</option>
										<option value="Combo for preschool children">Combo for preschool children</option>
									</Form.Select>
									{/* <Form.Control
										type="text"
										placeholder="Enter combo category"
										name="comboCategory"
										value={formik.values.comboCategory}
										onChange={formik.handleChange}
										isInvalid={formik.touched.comboCategory && formik.errors.comboCategory}
									/> */}
									<Form.Control.Feedback type="invalid">{formik.errors.comboCategory}</Form.Control.Feedback>
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
