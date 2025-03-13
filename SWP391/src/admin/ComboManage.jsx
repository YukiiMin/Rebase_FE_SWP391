import React, { useState, useEffect } from "react";
import { Accordion, Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddCombo from "../components/AddCombo";

function ComboManage() {
	const [combos, setCombos] = useState([]);
	const comboAPI = "http://localhost:8080/vaccine/get/comboDetail";
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		fetch(comboAPI)
			.then((response) => response.json())
			.then((data) => {
				// setCombos(data.result);
				console.log(data.result);
				const groupedCombos = groupCombos(data.result);
				setCombos(groupedCombos);
			})
			.catch((error) => console.error("Error fetching combos:", error));
	}, []);

	//Group vaccine with the same comboId
	const groupCombos = (combosData) => {
		const grouped = {};
		combosData.forEach((combo) => {
			if (!grouped[combo.comboId]) {
				grouped[combo.comboId] = {
					comboId: combo.comboId,
					comboName: combo.comboName,
					description: combo.description,
					comboCategory: combo.comboCategory,
					saleOff: combo.saleOff,
					total: combo.total,
					vaccines: [], // Initialize vaccines array
				};
			}
			grouped[combo.comboId].vaccines.push({ name: combo.vaccineName, dose: combo.dose });
		});
		// Convert grouped object to array
		return Object.values(grouped);
	};

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col>
					<Container className="py-4">
						{console.log(combos)}
						<Row className="mb-4 align-items-center">
							<Col>
								<h1 className="text-primary">Combo Vaccine Management</h1>
							</Col>
							<Col className="text-end">
								<Button variant="primary" onClick={() => setIsOpen(true)}>
									Add New Combo
								</Button>
							</Col>
						</Row>
						{isOpen && <AddCombo setIsOpen={setIsOpen} open={isOpen} />}
						<hr className="mb-4"></hr>
						<Accordion alwaysOpen>
							{combos.length > 0 ? (
								combos.map((combo) => (
									<Accordion.Item eventKey={combo.comboId} key={combo.comboId} className="mb-3">
										<Accordion.Header className="bg-light">
											<div className="d-flex justify-content-between w-100">
												<span className="fw-bold">{combo.comboName}</span>
												<span>
													<b>Total Price: </b> {parseFloat(combo.total).toFixed(2)}
												</span>
											</div>
										</Accordion.Header>
										<Accordion.Body>
											<p>
												<b>Description:</b> {combo.description}
											</p>
											<p>
												<b>Combo category:</b> {combo.comboCategory}
											</p>
											<p>
												<b>Sale off:</b> {combo.saleOff}
											</p>
											<Table striped bordered hover responsive className="table-sm">
												<thead>
													<tr>
														<th>#</th>
														<th>Vaccine name</th>
														<th>Manufacturer</th>
														<th>Dose</th>
													</tr>
												</thead>
												<tbody>
													{combo.vaccines.map((vaccine, index) => (
														<tr key={index}>
															<td>{index + 1}</td>
															<td>{vaccine.name}</td>
															<td>{vaccine.manufacturer}</td>
															<td>{vaccine.dose}</td>
														</tr>
													))}
												</tbody>
											</Table>
										</Accordion.Body>
									</Accordion.Item>
								))
							) : (
								<p className="text-center mt-3">No data</p>
							)}
						</Accordion>

						{/* <Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>ComboID</th>
									<th>Combo Name</th>
									<th>Description</th>
									<th>Vaccines(Dose)</th>
									<th>Target Age Group</th>
									<th>Sale %</th>
									<th>Total Price ($) </th>
								</tr>
							</thead>
							<tbody>
								{combos.length > 0 ? (
									combos.map((combo, index) => (
										<tr key={combo.comboId}>
											<td>{index + 1}</td>
											<td>{combo.comboId}</td>
											<td>{combo.comboName}</td>
											<td>{combo.description}</td>
											{/* <td>{combo.vaccineName}</td> */}
						{/* <td>{combo.vaccines.join(", ")}</td> */}
						{/* <td>
												<ul>
													{combo.vaccines.map((vaccine, index) => (
														<li key={index}>
															{vaccine.name} ({vaccine.dose})
														</li>
													))}
												</ul>
											</td> */}
						{/*Vaccine(dose), Vaccine(dose) */}
						{/* <td>{combo.comboCategory}</td>
											<td>{combo.saleOff}%</td>
											<td>{parseFloat(combo.total).toFixed(2)}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="7">No combos added yet.</td>
									</tr>
								)}
							</tbody>
						</Table> */}
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default ComboManage;
