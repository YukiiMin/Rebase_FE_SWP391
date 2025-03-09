import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
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
					ageGroup: combo.ageGroup,
					saleOff: combo.saleOff,
					vaccines: [], // Initialize vaccines array
				};
			}
			grouped[combo.comboId].vaccines.push(combo.vaccineName);
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
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>Combo Name</th>
									<th>Description</th>
									<th>Vaccines</th>
									<th>Target Age Group</th>
									<th>Sale %</th>
									<th>Total Price</th>
								</tr>
							</thead>
							<tbody>
								{combos.length > 0 ? (
									combos.map((combo) => (
										<tr key={combo.comboId}>
											<td>{combo.comboId}</td>
											<td>{combo.comboName}</td>
											<td>{combo.description}</td>
											{/* <td>{combo.vaccineName}</td> */}
											<td>{combo.vaccines.join(", ")}</td>
											<td>{combo.ageGroup}</td>
											<td>{combo.saleOff}%</td>
											<td>Price</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="7">No combos added yet.</td>
									</tr>
								)}
							</tbody>
						</Table>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default ComboManage;
