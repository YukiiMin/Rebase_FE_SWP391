import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function VaccineList() {
	const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const [vaccinesList, setVaccinesList] = useState([]);

	useEffect(() => {
		fetch(vaccineAPI)
			.then((response) => response.json())
			.then((data) => {
				setVaccinesList(data);
			})
			.catch((error) => console.error("Error fetching vaccines:", error));
	}, []);

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2>Vaccine List:</h2>
				<Form>
					<InputGroup className="mb-3">
						<Form.Control placeholder="Vaccine name..." aria-label="Vaccine name" aria-describedby="basic-addon2" />
						<Button variant="outline-secondary" id="button-addon2">
							Search
						</Button>
					</InputGroup>
				</Form>
				<Row xs={1} md={2} lg={4} className="g-4">
					{vaccinesList.map((vaccine) => (
						<Col key={vaccine.id}>
							<Card>
								<Card.Img variant="top" /*src={vaccine.image}*/ src={"src/alt/notfound.jpg"} />
								<Card.Body>
									<Card.Title>{vaccine.vaccinename}</Card.Title>
									<Card.Text>Price: {vaccine.price}$</Card.Text>
									<Link to={`/VaccineDetail/${vaccine.id}`}>
										<Button>Detail</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
		</div>
	);
}

export default VaccineList;
