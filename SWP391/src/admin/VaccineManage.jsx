import React, { useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar"; // Assuming Sidebar is correctly implemented

function VaccineManage() {
    const [show, setShow] = useState(false);
    const [vaccineName, setVaccineName] = useState("");
    const [description, setDescription] = useState("");
    const [origin, setOrigin] = useState("");
    const [instructions, setInstructions] = useState("");
    const [contraindications, setContraindications] = useState("");
    const [precautions, setPrecautions] = useState("");
    const [interactions, setInteractions] = useState("");
    const [sideEffects, setSideEffects] = useState("");
    const [storageInstructions, setStorageInstructions] = useState("");
    const [targetGroups, setTargetGroups] = useState("");
    const [schedule, setSchedule] = useState("");
    const [postVaccinationReactions, setPostVaccinationReactions] = useState("");
    const [receivedDate, setReceivedDate] = useState("");
    const [vaccineImage, setVaccineImage] = useState(null); // Store the image file
    const [quantity, setQuantity] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [status, setStatus] = useState("Active"); // Default to Active
    const [vaccineType, setVaccineType] = useState(""); // Existing or New
    const [newVaccineType, setNewVaccineType] = useState(""); // For adding a new type
    const [vaccineTypes, setVaccineTypes] = useState(["Live attenuated vaccines", "Inactivated vaccines", "Subunit vaccines", "DNA vaccines"]); // Example types

    const [errors, setErrors] = useState({});
    const [vaccines, setVaccines] = useState([]); // Initialize as an empty array

    const handleClose = () => {
        setShow(false);
        clearForm();
    };
    const handleShow = () => setShow(true);

    const clearForm = () => {
        setVaccineName("");
        setDescription("");
        setOrigin("");
        setInstructions("");
        setContraindications("");
        setPrecautions("");
        setInteractions("");
        setSideEffects("");
        setStorageInstructions("");
        setTargetGroups("");
        setSchedule("");
        setPostVaccinationReactions("");
        setReceivedDate("");
        setVaccineImage(null);
        setQuantity("");
        setExpiryDate("");
        setStatus("Active");
        setVaccineType("");
        setNewVaccineType("");
        setErrors({});
    };

    const handleSave = () => {
        const newErrors = {};
        if (!vaccineName.trim()) newErrors.vaccineName = "Vaccine Name is required";
        if (!origin.trim()) newErrors.origin = "Origin is required";
        if (!quantity) newErrors.quantity = "Quantity is required";
        if (!expiryDate) newErrors.expiryDate = "Expiry Date is required";
        if(!vaccineType) newErrors.vaccineType = "Vaccine Type is required"
        if(vaccineType === "New" && !newVaccineType.trim()) newErrors.newVaccineType = "New Vaccine Type is required."

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const finalVaccineType = vaccineType === "New" ? newVaccineType : vaccineType;

        const newVaccine = {
            id: vaccines.length > 0 ? Math.max(...vaccines.map(v => v.id)) + 1 : 1,
            name: vaccineName,
            description,
            origin,
            instructions,
            contraindications,
            precautions,
            interactions,
            sideEffects,
            storageInstructions,
            targetGroups,
            schedule,
            postVaccinationReactions,
            receivedDate,
            image: vaccineImage, // Store the File object directly
            quantity: parseInt(quantity, 10), // Ensure it's a number
            expiryDate,
            status,
            vaccineType: finalVaccineType,
        };

        setVaccines([...vaccines, newVaccine]);
        handleClose();
    };

    const handleImageChange = (e) => {
      // Check if files exist and the first file is selected
      if (e.target.files && e.target.files[0]) {
        setVaccineImage(e.target.files[0]); // Store the file object
      }
    };

    return (
        <>
            <Sidebar />
            <Container>
                <h1>Vaccine Manage</h1>
                <Button variant="primary" onClick={handleShow} className="mb-3">
                    Add New Vaccine
                </Button>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Vaccine Name</th>
                            <th>Description</th>
                            <th>Origin</th>
                            <th>Quantity</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                             <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vaccines.map((vaccine) => (
                            <tr key={vaccine.id}>
                                <td>{vaccine.id}</td>
                                <td>{vaccine.name}</td>
                                <td>{vaccine.description}</td>
                                <td>{vaccine.origin}</td>
                                <td>{vaccine.quantity}</td>
                                <td>{vaccine.expiryDate}</td>
                                <td>{vaccine.status}</td>
                                <td>{vaccine.vaccineType}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={show} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Vaccine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridVaccineName">
                                    <Form.Label>Vaccine Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Vaccine Name"
                                        value={vaccineName}
                                        onChange={(e) => setVaccineName(e.target.value)}
                                        isInvalid={!!errors.vaccineName}
                                        aria-label="Vaccine Name"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.vaccineName}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridOrigin">
                                    <Form.Label>Origin *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Origin"
                                        value={origin}
                                        onChange={(e) => setOrigin(e.target.value)}
                                        isInvalid={!!errors.origin}
                                        aria-label="Origin"
                                    />
                                     <Form.Control.Feedback type="invalid">{errors.origin}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Form.Group className="mb-3" controlId="formGridDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    aria-label="Description"
                                />
                            </Form.Group>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridInstructions">
                                    <Form.Label>Instructions</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter Instructions"
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        aria-label="Instructions"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridContraindications">
                                    <Form.Label>Contraindications</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter Contraindications"
                                        value={contraindications}
                                        onChange={(e) => setContraindications(e.target.value)}
                                        aria-label="Contraindications"
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridPrecautions">
                                    <Form.Label>Precautions</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter Precautions"
                                        value={precautions}
                                        onChange={(e) => setPrecautions(e.target.value)}
                                        aria-label="Precautions"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridInteractions">
                                    <Form.Label>Interactions</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter Interactions"
                                        value={interactions}
                                        onChange={(e) => setInteractions(e.target.value)}
                                        aria-label="Interactions"
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                 <Form.Group as={Col} controlId="formGridSideEffects">
                                    <Form.Label>Side Effects</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter Side Effects"
                                        value={sideEffects}
                                        onChange={(e) => setSideEffects(e.target.value)}
                                        aria-label="Side Effects"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridStorageInstructions">
                                    <Form.Label>Storage Instructions</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter Storage Instructions"
                                        value={storageInstructions}
                                        onChange={(e) => setStorageInstructions(e.target.value)}
                                        aria-label="Storage Instructions"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridTargetGroups">
                                        <Form.Label>Target Groups</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Target Groups"
                                            value={targetGroups}
                                            onChange={(e) => setTargetGroups(e.target.value)}
                                            aria-label="Target Groups"
                                        />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridSchedule">
                                    <Form.Label>Schedule</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Schedule"
                                        value={schedule}
                                        onChange={(e) => setSchedule(e.target.value)}
                                        aria-label="Schedule"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                  <Form.Group as={Col} controlId="formGridPostVaccinationReactions">
                                    <Form.Label>Post-Vaccination Reactions</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter Post-Vaccination Reactions"
                                        value={postVaccinationReactions}
                                        onChange={(e) => setPostVaccinationReactions(e.target.value)}
                                        aria-label="Post-Vaccination Reactions"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridReceivedDate">
                                    <Form.Label>Received Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={receivedDate}
                                        onChange={(e) => setReceivedDate(e.target.value)}
                                        aria-label="Received Date"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">

                                 <Form.Group as={Col} controlId="formGridQuantity">
                                    <Form.Label>Quantity *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter Quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        isInvalid={!!errors.quantity}
                                        aria-label="Quantity"
                                    />
                                     <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridExpiryDate">
                                    <Form.Label>Expiry Date *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        isInvalid={!!errors.expiryDate}
                                        aria-label="Expiry Date"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.expiryDate}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridStatus">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            aria-label="Status"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </Form.Select>
                                    </Form.Group>
                                     <Form.Group as={Col} controlId="formGridVaccineType">
                                        <Form.Label>Vaccine Type *</Form.Label>
                                        <Form.Select
                                            value={vaccineType}
                                            onChange={(e) => setVaccineType(e.target.value)}
                                            isInvalid={!!errors.vaccineType}
                                             aria-label="Vaccine Type"
                                        >
                                            <option value="">Select a type...</option>
                                            {vaccineTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                            <option value="New">Add New Type</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errors.vaccineType}</Form.Control.Feedback>
                                    </Form.Group>

                            </Row>
                            {vaccineType === "New" && (
                                            <Form.Group className="mb-3" controlId="formGridNewVaccineType">
                                                <Form.Label>New Vaccine Type *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter New Vaccine Type"
                                                    value={newVaccineType}
                                                    onChange={(e) => setNewVaccineType(e.target.value)}
                                                    isInvalid={!!errors.newVaccineType}
                                                    aria-label="New Vaccine Type"
                                                />
                                  <Form.Control.Feedback type="invalid">{errors.newVaccineType}</Form.Control.Feedback>

                                            </Form.Group>
                            )}

                            <Form.Group controlId="formGridImage" className="mb-3">
                                <Form.Label>Vaccine Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                    aria-label="Vaccine Image"

                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}

export default VaccineManage;