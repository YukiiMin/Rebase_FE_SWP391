import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function ComboList() {
	const comboAPI = "http://localhost:8080/vaccine/get/comboDetail";
	const [comboList, setComboList] = useState([]);

	useEffect(() => {
		fetch(comboAPI)
			.then((response) => response.json())
			.then((data) => {
				const groupedCombos = groupCombos(data.result);
				setComboList(groupedCombos);
				// setComboList(data.result);
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
		<div>
			<Navigation />
			<br />
			<Container>
				{console.log(comboList)}
				<h2>Vaccine combo list:</h2>
				<Form>
					<InputGroup className="mb-3">
						<Form.Control placeholder="Vaccine combo name..." aria-label="Combo name" aria-describedby="basic-addon2" />
						<Button variant="outline-secondary" id="button-addon2">
							Search
						</Button>
					</InputGroup>
				</Form>

				<Row xs={1} md={2} lg={4} className="g-4">
					{comboList.map((combo) => (
						<Col key={combo.comboId}>
							<Card>
								<Card.Img variant="top" src={"src/alt/notfound.jpg"} />
								<Card.Body>
									<Card.Title>{combo.comboName}</Card.Title>
									<Card.Text>Include: {combo.vaccines.join(", ")}</Card.Text>
									<Card.Text>
										<b>Description:</b> {combo.description}
									</Card.Text>
									<Link to={`/ComboDetail/${combo.id}`}>
										<Button>Detail</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>

				<Row>
					{comboList.length > 0 ? (
						comboList.map((combo) => {
							<div key={combo.comboId}>
								<h5>{combo.comboName}</h5>
							</div>;
						})
					) : (
						<>No data</>
					)}
				</Row>
			</Container>
		</div>
	);
}

export default ComboList;
