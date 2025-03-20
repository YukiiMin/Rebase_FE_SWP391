import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";

function AddProtocol({ open, setIsOpen, onAddedProtocol }) {
  const token = localStorage.getItem("token");
  const apiUrl = "http://localhost:8080/vaccine/protocol/add";
  const [protocolDetails, setProtocolDetails] = useState([
    { doseNumber: 1, intervalDays: 0 }
  ]);

  const validation = Yup.object({
    name: Yup.string().required("Protocol name is required"),
    description: Yup.string().required("Protocol description is required").min(10, "Description must be at least 10 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
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

  const handleAddDose = () => {
    const lastDose = protocolDetails[protocolDetails.length - 1];
    setProtocolDetails([
      ...protocolDetails,
      { doseNumber: lastDose.doseNumber + 1, intervalDays: 0 }
    ]);
  };

  const handleRemoveDose = (index) => {
    if (protocolDetails.length > 1) {
      const updatedDetails = [...protocolDetails];
      updatedDetails.splice(index, 1);
      
      // Renumber the doseNumbers
      const renumbered = updatedDetails.map((detail, idx) => ({
        ...detail,
        doseNumber: idx + 1
      }));
      
      setProtocolDetails(renumbered);
    }
  };

  const handleDoseChange = (index, field, value) => {
    const updatedDetails = [...protocolDetails];
    updatedDetails[index][field] = value;
    setProtocolDetails(updatedDetails);
  };

  const handleSubmit = async (values) => {
    try {
      const protocolData = {
        name: values.name,
        description: values.description,
        details: protocolDetails
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(protocolData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Protocol added successfully:", data);
        handleClose();
        onAddedProtocol(data.result);
      } else {
        console.error("Failed to add protocol:", response.status);
        // Toast notification for error would go here
      }
    } catch (err) {
      console.error("Error adding protocol:", err);
      // Toast notification for error would go here
    }
  };

  return (
    <Modal show={open} onHide={handleClose} size="lg" backdrop="static">
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Protocol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="protocolName">
            <Form.Label>Protocol Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter protocol name (e.g., 'Standard 3-dose')"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="protocolDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter protocol description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              isInvalid={formik.touched.description && formik.errors.description}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
          </Form.Group>

          <hr className="my-4" />
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Dose Details</h5>
            <Button variant="outline-primary" size="sm" onClick={handleAddDose}>
              Add Another Dose
            </Button>
          </div>

          {protocolDetails.map((detail, index) => (
            <Row key={index} className="mb-3 align-items-center">
              <Col xs={3}>
                <Form.Group controlId={`doseNumber-${index}`}>
                  <Form.Label>Dose Number</Form.Label>
                  <Form.Control
                    type="number"
                    value={detail.doseNumber}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col xs={7}>
                <Form.Group controlId={`intervalDays-${index}`}>
                  <Form.Label>Interval Days (from previous dose)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="Enter interval in days"
                    value={detail.intervalDays}
                    onChange={(e) => handleDoseChange(index, 'intervalDays', parseInt(e.target.value) || 0)}
                  />
                  {index === 0 && (
                    <Form.Text className="text-muted">
                      First dose interval is typically 0 (from start date)
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col xs={2} className="d-flex align-items-end justify-content-end">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveDose(index)}
                  disabled={protocolDetails.length <= 1}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Protocol
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddProtocol; 