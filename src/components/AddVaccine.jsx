import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AddCategory from "./AddCategory";
import AddProtocol from "./AddProtocol";

function AddVaccine({ setIsOpen, open, onAdded }) {
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const vaccineAPI = "http://localhost:8080/vaccine";
	// const apiBaseUrl = "http://localhost:8080/api/vaccine";

	const [categories, setCategories] = useState([]);
	const [protocols, setProtocols] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
	const [selectedProtocol, setSelectedProtocol] = useState("");
	const [totalDose, setTotalDose] = useState(1);

	const handleClose = () => setIsOpen(false); //Close modal

	const validation = Yup.object({
		name: Yup.string().required("Vaccine Name is required"),
		description: Yup.string().required("Description is required").min(30, "Description must be at least 30 characters"),
		manufacturer: Yup.string().required("Manufacturer is required"),
		categoryId: Yup.string().required("Category is required"),
		dosage: Yup.string().required("Dosage is required"),
		contraindications: Yup.string().required("Contraindications are required").min(30, "Contraindications must be at least 30 characters"),
		precautions: Yup.string().required("Precautions are required").min(30, "Precautions must be at least 30 characters"),
		interactions: Yup.string().required("Interactions are required").min(30, "Interactions must be at least 30 characters"),
		adverseReaction: Yup.string().required("Adverse Reactions are required").min(30, "Adverse Reactions must be at least 30 characters"),
		storageConditions: Yup.string().required("Storage Conditions are required").min(30, "Storage Conditions must be at least 30 characters"),
		recommended: Yup.string().required("Recommended For is required").min(30, "Recommended For must be at least 30 characters"),
		preVaccination: Yup.string().required("Pre-Vaccination Information is required").min(30, "Pre-Vaccination Information must be at least 30 characters"),
		compatibility: Yup.string().required("Compatibility is required").min(30, "Compatibility must be at least 30 characters"),
		// imageUrl: Yup.mixed().required("Vaccine Image is required"),
		quantity: Yup.number().required("Quantity is required").min(0, "Quantity cannot be negative"),
		unitPrice: Yup.number().required("Unit price is required").min(0, "Unit price cannot be negative"),
		salePrice: Yup.number().required("Sale price is required").min(0, "Sale price cannot be negative").moreThan(Yup.ref("unitPrice"), "Sale price must be higher than Unit price"),
		status: Yup.boolean().required("Status is required"),
		totalDose: Yup.number().required("Total dose count is required").min(1, "Must have at least 1 dose").max(5, "Cannot exceed 5 doses"),
	});

	const formik = useFormik({
		initialValues: {
			name: "",
			description: "",
			manufacturer: "",
			categoryId: "",
			dosage: "",
			contraindications: "",
			precautions: "",
			interactions: "",
			adverseReaction: "",
			storageConditions: "",
			recommended: "",
			preVaccination: "",
			compatibility: "",
			imagineUrl: "https://vnvc.vn/wp-content/uploads/2024/09/vaccine-qdenga-1.jpg", //Tam thoi de URL cho den khi su dung duoc Upload img
			quantity: "",
			unitPrice: "",
			salePrice: "",
			status: true,
			totalDose: 1,
		},
		onSubmit: (values) => {
			handleAddVaccine(values);
		},
		validationSchema: validation,
	});

	useEffect(() => {
		fetchCategory();
		fetchProtocols();
	}, []);

	useEffect(() => {
		// Update the totalDose state when the form value changes
		setTotalDose(formik.values.totalDose);
	}, [formik.values.totalDose]);

	const fetchCategory = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/categories`);
			if (response.ok) {
				const data = await response.json();
				console.log("Categories:", data);
				setCategories(data.result);
			} else {
				console.error("Fetching category failed: ", response.status);
			}
		} catch (err) {
			console.error("Fetching category failed: ", err);
		}
	};

	const fetchProtocols = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/protocols`);
			if (response.ok) {
				const data = await response.json();
				console.log("Protocols:", data);
				setProtocols(data.result);
			} else {
				console.error("Fetching protocols failed: ", response.status);
			}
		} catch (err) {
			console.error("Fetching protocols failed: ", err);
		}
	};

	const handleAddVaccineToProtocol = async (vaccineId, protocolId) => {
		if (!protocolId) return;

		try {
			const response = await fetch(`${vaccineAPI}/protocol/${protocolId}/addVaccine/${vaccineId}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Vaccine added to protocol successfully:", data);
				return true;
			} else {
				console.error("Failed to add vaccine to protocol:", response.status);
				return false;
			}
		} catch (err) {
			console.error("Error adding vaccine to protocol:", err);
			return false;
		}
	};

	const handleAddVaccine = async (values) => {
		try {
			const categoryId = values.categoryId;
			const vaccineData = {
				name: values.name,
				description: values.description,
				manufacturer: values.manufacturer,
				dosage: values.dosage,
				contraindications: values.contraindications,
				precautions: values.precautions,
				interactions: values.interactions,
				adverseReaction: values.adverseReaction,
				storageConditions: values.storageConditions,
				recommended: values.recommended,
				preVaccination: values.preVaccination,
				compatibility: values.compatibility,
				imagineUrl: values.imagineUrl,
				quantity: values.quantity,
				unitPrice: values.unitPrice,
				salePrice: values.salePrice,
				status: values.status,
				totalDose: values.totalDose,
			};
			console.log(categoryId, vaccineData);
			const response = await fetch(`${vaccineAPI}/add/${categoryId}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(vaccineData),
			});
			
			if (response.ok) {
				console.log("Adding vaccine successful");
				const newVaccine = await response.json();
				console.log(newVaccine.result);
				
				// If a protocol was selected, add the vaccine to the protocol
				if (selectedProtocol) {
					const vaccineId = newVaccine.result.id;
					const success = await handleAddVaccineToProtocol(vaccineId, selectedProtocol);
					
					if (success) {
						alert("Vaccine added successfully with protocol assignment");
					} else {
						alert("Vaccine added but failed to assign protocol");
					}
				} else {
					alert("Vaccine added successfully!");
				}
				
				handleClose();
				onAdded(newVaccine.result);
			} else {
				console.error("Adding vaccine failed: ", response.status);
				alert("Failed to add vaccine. Please try again.");
			}
		} catch (err) {
			console.error("Add vaccine error:", err);
			alert("Error adding vaccine: " + err.message);
		}
	};

	//Function to set the new vaccine category to the top of the list
	const handleCategoryAdded = (newCategory) => {
		if (newCategory) {
			setCategories([newCategory, ...categories]);
		} else {
			fetchCategory();
		}
	};

	const handleProtocolAdded = (newProtocol) => {
		if (newProtocol) {
			setProtocols([newProtocol, ...protocols]);
			setSelectedProtocol(newProtocol.protocolId);
		} else {
			fetchProtocols();
		}
	};

	const handleFileChange = (event) => {
		formik.setFieldValue("imageUrl", event.currentTarget.files[0]);
	};

	return (
		<div>
			<Modal show={open} onHide={handleClose} size="xl">
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Vaccine</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row className="mb-3">
							<Form.Group as={Col} controlId="vaccineName">
								<Form.Label>Vaccine Name *</Form.Label>
								<Form.Control type="text" placeholder="Enter Vaccine Name" name="name" value={formik.values.name} onChange={formik.handleChange} isInvalid={formik.touched.name && formik.errors.name} />
								<Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="manufacturer">
								<Form.Label>Manufacturer *</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter Manufacturer"
									name="manufacturer"
									value={formik.values.manufacturer}
									onChange={formik.handleChange}
									isInvalid={formik.touched.manufacturer && formik.errors.manufacturer}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.manufacturer}</Form.Control.Feedback>
							</Form.Group>
						</Row>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="category">
								<div className="d-flex justify-content-between align-items-center">
									<Form.Label className="mb-0">Category</Form.Label>
									<Button size="sm" variant="outline-primary" onClick={() => setIsModalOpen(true)}>
										Add category
									</Button>
								</div>
								<Form.Select 
									name="categoryId" 
									value={formik.values.categoryId} 
									onChange={formik.handleChange} 
									isInvalid={formik.touched.categoryId && formik.errors.categoryId}
								>
									<option value="">---Choose Category---</option>
									{categories && categories.map((category) => (
										<option key={category.categoryId} value={category.categoryId}>
											{category.categoryName}
										</option>
									))}
								</Form.Select>
								<Form.Control.Feedback type="invalid">{formik.errors.categoryId}</Form.Control.Feedback>
								{isModalOpen && <AddCategory open={isModalOpen} setIsOpen={setIsModalOpen} onAddedCategory={handleCategoryAdded} />}
							</Form.Group>

							<Form.Group as={Col} controlId="totalDose">
								<Form.Label>Total Dose Count</Form.Label>
								<Form.Control 
									type="number" 
									min="1" 
									max="5"
									placeholder="Enter total number of doses" 
									name="totalDose" 
									value={formik.values.totalDose} 
									onChange={formik.handleChange} 
									isInvalid={formik.touched.totalDose && formik.errors.totalDose} 
								/>
								<Form.Text className="text-muted">
									Number of vaccine doses required (max 5)
								</Form.Text>
								<Form.Control.Feedback type="invalid">{formik.errors.totalDose}</Form.Control.Feedback>
							</Form.Group>
						</Row>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="protocol">
								<div className="d-flex justify-content-between align-items-center">
									<Form.Label className="mb-0">Protocol</Form.Label>
									<Button size="sm" variant="outline-primary" onClick={() => setIsProtocolModalOpen(true)}>
										Add Protocol
									</Button>
								</div>
								<Form.Select
									value={selectedProtocol}
									onChange={(e) => setSelectedProtocol(e.target.value)}
								>
									<option value="">---Choose Protocol---</option>
									{protocols && protocols.map((protocol) => (
										<option 
											key={protocol.protocolId} 
											value={protocol.protocolId}
											disabled={protocol.details?.length < totalDose}
										>
											{protocol.name} ({protocol.details?.length || 0} doses)
											{protocol.details?.length < totalDose ? " - Not enough doses" : ""}
										</option>
									))}
								</Form.Select>
								<Form.Text className="text-muted">
									Select a protocol with at least {totalDose} doses
								</Form.Text>
								{isProtocolModalOpen && <AddProtocol open={isProtocolModalOpen} setIsOpen={setIsProtocolModalOpen} onAddedProtocol={handleProtocolAdded} />}
							</Form.Group>

							{/* <Form.Group as={Col} controlId="dosage">
								<Form.Label>Dosage</Form.Label>
								<Form.Control type="number" placeholder="Enter Dosage" name="dosage" value={formik.values.dosage} onChange={formik.handleChange} isInvalid={formik.touched.dosage && formik.errors.dosage} />
								<Form.Control.Feedback type="invalid">{formik.errors.dosage}</Form.Control.Feedback>
							</Form.Group> */}
								<Form.Group as={Col} controlId="dosage">
								<Form.Label>Dosage *</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter DosageDosage"
									name="dosage"
									value={formik.values.dosage}
									onChange={formik.handleChange}
									isInvalid={formik.touched.dosage && formik.errors.dosage}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.dosage}</Form.Control.Feedback>
							</Form.Group>
						</Row>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="quantity">
								<Form.Label>Quantity</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter Quantity"
									name="quantity"
									value={formik.values.quantity}
									onChange={formik.handleChange}
									isInvalid={formik.touched.quantity && formik.errors.quantity}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.quantity}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="unitPPrice">
								<Form.Label>Unit Price ($)</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter Unit Price"
									name="unitPrice"
									value={formik.values.unitPrice}
									onChange={formik.handleChange}
									isInvalid={formik.touched.unitPrice && formik.errors.unitPrice}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.unitPrice}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="salePsalePrice">
								<Form.Label>Sale Price ($)</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter Sale Price"
									name="salePrice"
									value={formik.values.salePrice}
									onChange={formik.handleChange}
									isInvalid={formik.touched.salePrice && formik.errors.salePrice}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.salePrice}</Form.Control.Feedback>
							</Form.Group>
						</Row>
						<Form.Group className="mb-3" controlId="description">
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Description"
								name="description"
								value={formik.values.description}
								onChange={formik.handleChange}
								isInvalid={formik.touched.description && formik.errors.description}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="contraindications">
							<Form.Label>Contraindications</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Contraindications"
								name="contraindications"
								value={formik.values.contraindications}
								onChange={formik.handleChange}
								isInvalid={formik.touched.contraindications && formik.errors.contraindications}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.contraindications}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="precautions">
							<Form.Label>Precautions</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Precautions"
								name="precautions"
								value={formik.values.precautions}
								onChange={formik.handleChange}
								isInvalid={formik.touched.precautions && formik.errors.precautions}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.precautions}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="interactions">
							<Form.Label>Interactions</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Interactions"
								name="interactions"
								value={formik.values.interactions}
								onChange={formik.handleChange}
								isInvalid={formik.touched.interactions && formik.errors.interactions}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.interactions}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="adverseReaction">
							<Form.Label>Adverse Reactions</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Adverse Reactions"
								name="adverseReaction"
								value={formik.values.adverseReaction}
								onChange={formik.handleChange}
								isInvalid={formik.touched.adverseReaction && formik.errors.adverseReaction}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.adverseReaction}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="storageConditions">
							<Form.Label>Storage Conditions</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Storage Conditions"
								name="storageConditions"
								value={formik.values.storageConditions}
								onChange={formik.handleChange}
								isInvalid={formik.touched.storageConditions && formik.errors.storageConditions}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.storageConditions}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="recommended">
							<Form.Label>Recommended For</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Recommended For"
								name="recommended"
								value={formik.values.recommended}
								onChange={formik.handleChange}
								isInvalid={formik.touched.recommended && formik.errors.recommended}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.recommended}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="preVaccination">
							<Form.Label>Pre-Vaccination Information</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Pre-Vaccination Information"
								name="preVaccination"
								value={formik.values.preVaccination}
								onChange={formik.handleChange}
								isInvalid={formik.touched.preVaccination && formik.errors.preVaccination}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.preVaccination}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="compatibility">
							<Form.Label>Compatibility</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Compatibility Information"
								name="compatibility"
								value={formik.values.compatibility}
								onChange={formik.handleChange}
								isInvalid={formik.touched.compatibility && formik.errors.compatibility}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.compatibility}</Form.Control.Feedback>
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

export default AddVaccine;
