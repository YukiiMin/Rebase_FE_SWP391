import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

function ComboManage() {
  const [showModal, setShowModal] = useState(false);
  const [comboName, setComboName] = useState("");
  const [comboDescription, setComboDescription] = useState("");
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [targetAgeGroup, setTargetAgeGroup] = useState("");
  const [salePercentage, setSalePercentage] = useState(0);
  const [comboCategory, setComboCategory] = useState("");
  const [newComboCategory, setNewComboCategory] = useState("");
  const [comboCategories, setComboCategories] = useState(["Basic", "Premium", "Custom"]);
  const [errors, setErrors] = useState({});
  const [vaccines, setVaccines] = useState([]); // Available vaccines
  const [combos, setCombos] = useState([]);   //  Store the list of combos

  // Load vaccine data (replace with API call)
  useEffect(() => {
    const fetchedVaccines = [
      { id: 1, name: "BCG" },
      { id: 2, name: "HepB" },
      { id: 3, name: "MMR" },
      { id: 4, name: "DTaP" },
    ];
    setVaccines(fetchedVaccines);

    // Load existing combos (replace with API call)
    const fetchedCombos = [
        {
          id: 1,
          name: "Example Combo 1",
          description: "An example combo",
          vaccines: [{vaccineId: 1, vaccineName: "BCG", doses: 1}],
          targetAgeGroup: "0-12 months",
          salePercentage: 10,
          category: "Basic",
        },
        {
          id: 2,
          name: "Example Combo 2",
          description: "Another example",
          vaccines: [{vaccineId: 2, vaccineName: "HepB", doses: 2}, {vaccineId: 3, vaccineName: "MMR", doses: 1}],
          targetAgeGroup: "12-24 months",
          salePercentage: 15,
          category: "Premium",
        }
      ];
    setCombos(fetchedCombos);

  }, []); // Empty dependency array means this runs only once on mount


  const handleCloseModal = () => {
    setShowModal(false);
    clearForm();
  };
  const handleShowModal = () => setShowModal(true);

  const clearForm = () => {
    setComboName("");
    setComboDescription("");
    setSelectedVaccines([]);
    setTargetAgeGroup("");
    setSalePercentage(0);
    setComboCategory("");
    setNewComboCategory("");
    setErrors({});
  };

  const handleVaccineSelect = (vaccineId) => {
    const selectedVaccine = vaccines.find((v) => v.id === vaccineId);

    if (!selectedVaccine) {
      console.warn(`Vaccine with ID ${vaccineId} not found.`);
      return;
    }

    const existingIndex = selectedVaccines.findIndex(
      (item) => item.vaccineId === vaccineId
    );

    if (existingIndex > -1) {
      const updatedVaccines = [...selectedVaccines];
      updatedVaccines.splice(existingIndex, 1);
      setSelectedVaccines(updatedVaccines);
    } else {
      setSelectedVaccines([
        ...selectedVaccines,
        { vaccineId: vaccineId, vaccineName: selectedVaccine.name, doses: 1 },
      ]);
    }
  };

  const handleDoseChange = (vaccineId, newDoses) => {
    setSelectedVaccines((prevVaccines) =>
      prevVaccines.map((vaccine) =>
        vaccine.vaccineId === vaccineId
          ? { ...vaccine, doses: parseInt(newDoses, 10) || 0 }
          : vaccine
      )
    );
  };

  const handleSaveCombo = () => {
    const newErrors = {};
    if (!comboName.trim()) newErrors.comboName = "Combo Name is required";
    if (selectedVaccines.length === 0)
      newErrors.selectedVaccines = "At least one vaccine must be selected";
    if (!targetAgeGroup) newErrors.targetAgeGroup = "Target Age Group is required";
    if (isNaN(salePercentage) || salePercentage < 0 || salePercentage > 100)
      newErrors.salePercentage = "Sale Percentage must be between 0 and 100";

    if (comboCategory === "New" && !newComboCategory.trim())
      newErrors.newComboCategory = "New Category Name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const finalComboCategory =
      comboCategory === "New" ? newComboCategory : comboCategory;

    const newCombo = {
      id: Date.now(), //  Use a proper ID generation method!  This is for demonstration only.
      name: comboName,
      description: comboDescription,
      vaccines: selectedVaccines,
      targetAgeGroup,
      salePercentage: parseFloat(salePercentage),
      category: finalComboCategory,
    };

    // *** KEY CHANGE: Update the combos state ***
    setCombos([...combos, newCombo]);

    // Add new category to list
    if (comboCategory === "New") {
            setComboCategories([...comboCategories, newComboCategory]);
        }

    clearForm();
    handleCloseModal();
  };

    // Function to format the vaccines list for display
  const formatVaccines = (vaccinesList) => {
        return vaccinesList.map(v => `${v.vaccineName} (${v.doses})`).join(', ');
    };

  return (
    <>
      <Sidebar />
      <Container>
        <h1>Combo Vaccine Management</h1>
        <Button variant="primary" onClick={handleShowModal} className="mb-3">
          Add New Combo
        </Button>

        {/* Display Combo List */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Combo Name</th>
              <th>Description</th>
              <th>Vaccines</th>
              <th>Target Age Group</th>
              <th>Sale %</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {combos.length > 0 ? (
              combos.map((combo) => (
                <tr key={combo.id}>
                  <td>{combo.id}</td>
                  <td>{combo.name}</td>
                  <td>{combo.description}</td>
                  <td>{formatVaccines(combo.vaccines)}</td>
                  <td>{combo.targetAgeGroup}</td>
                  <td>{combo.salePercentage}%</td>
                  <td>{combo.category}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No combos added yet.</td>
              </tr>
            )}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add New Combo Vaccine</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formGridComboName">
                <Form.Label>Combo Name *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Combo Name"
                  value={comboName}
                  onChange={(e) => setComboName(e.target.value)}
                  isInvalid={!!errors.comboName}
                  aria-label="Combo Name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.comboName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGridComboDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter Combo Description"
                  value={comboDescription}
                  onChange={(e) => setComboDescription(e.target.value)}
                  aria-label="Combo Description"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGridVaccines">
                <Form.Label>Select Vaccines *</Form.Label>
                {errors.selectedVaccines && (
                  <div className="text-danger">{errors.selectedVaccines}</div>
                )}
                {vaccines.map((vaccine) => (
                  <div key={vaccine.id} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`vaccine-${vaccine.id}`}
                      label={vaccine.name}
                      checked={selectedVaccines.some(
                        (v) => v.vaccineId === vaccine.id
                      )}
                      onChange={() => handleVaccineSelect(vaccine.id)}
                      inline
                    />
                    {selectedVaccines.some((v) => v.vaccineId === vaccine.id) && (
                      <Form.Control
                        type="number"
                        min="1"
                        value={selectedVaccines.find((v) => v.vaccineId === vaccine.id).doses}
                        onChange={(e) => handleDoseChange(vaccine.id, e.target.value)}
                        style={{ width: "80px", display: "inline-block", marginLeft: "10px" }}
                      />
                    )}
                  </div>
                ))}
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridTargetAgeGroup">
                  <Form.Label>Target Age Group *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Target Age Group (e.g., 0-6 months)"
                    value={targetAgeGroup}
                    onChange={(e) => setTargetAgeGroup(e.target.value)}
                    isInvalid={!!errors.targetAgeGroup}
                    aria-label="Target Age Group"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.targetAgeGroup}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridSalePercentage">
                  <Form.Label>Sale Percentage *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Sale Percentage (0-100)"
                    value={salePercentage}
                    onChange={(e) => setSalePercentage(e.target.value)}
                    isInvalid={!!errors.salePercentage}
                    aria-label="Sale Percentage"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salePercentage}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridComboCategory">
                  <Form.Label>Combo Category *</Form.Label>
                  <Form.Select
                    value={comboCategory}
                    onChange={(e) => setComboCategory(e.target.value)}
                    isInvalid={!!errors.comboCategory}
                    aria-label="Combo Category"
                  >
                    <option value="">Select a category...</option>
                    {comboCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="New">Add New Category</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.comboCategory}
                  </Form.Control.Feedback>
                </Form.Group>

                {comboCategory === "New" && (
                  <Form.Group as={Col} controlId="formGridNewComboCategory">
                    <Form.Label>New Category Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter New Category Name"
                      value={newComboCategory}
                      onChange={(e) => setNewComboCategory(e.target.value)}
                      isInvalid={!!errors.newComboCategory}
                      aria-label="New Category Name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.newComboCategory}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveCombo}>
              Save Combo
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default ComboManage;