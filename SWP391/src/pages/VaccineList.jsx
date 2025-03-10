import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function VaccineList() {
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const vaccineAPI = "http://localhost:8080/vaccine";
	const [vaccinesList, setVaccinesList] = useState([]);
	const [searchList, setSearchList] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		fetch(`${vaccineAPI}/get`)
			.then((response) => response.json())
			.then((data) => {
				setVaccinesList(data.result);
				setSearchList(data.result);
			})
			.catch((error) => console.error("Error fetching vaccines:", error));
	}, []);

	const handleChangeSearch = (e) => {
		setSearch(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let response;
			if (search) {
				response = await fetch(`${vaccineAPI}/${search}`);
			} else {
				response = await fetch(`${vaccineAPI}/get`);
			}
			if (response.ok) {
				const data = await response.json();
				setSearchList(data.result);
			} else {
				console.error("Search error: ", response.status);
			}
		} catch (err) {
			console.error("Search error:", err);
		}
	};

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				{console.log(searchList)}
				<h2>Vaccine List:</h2>
				<Form method="POST" onSubmit={handleSubmit}>
					<InputGroup className="mb-3">
						<Form.Control type="text" placeholder="Vaccine name..." aria-label="Vaccine name" aria-describedby="basic-addon2" value={search} onChange={handleChangeSearch} />
						<Button variant="outline-secondary" id="button-addon2" type="submit">
							Search
						</Button>
					</InputGroup>
				</Form>
				<Row xs={1} md={2} lg={4} className="g-4">
					{vaccinesList.length > 0 ? (
						searchList.map((vaccine) => (
							<Col key={vaccine.id}>
								<Card className="h-100 shadow-sm">
									<Card.Img
										variant="top"
										//  src={vaccine.image}
										src="src/alt/notfound.jpg"
										style={{ height: "200px", objectFit: "cover" }}
									/>
									<Card.Body className="d-flex flex-column">
										<Card.Title className="fw-bold">{vaccine.name}</Card.Title>
										<Card.Text className="flex-grow-1">Price: {vaccine.price}$</Card.Text>
										<Card.Text>{vaccine.description}</Card.Text>
										<Link to={`/VaccineDetail/${vaccine.id}`} className="mt-3">
											<Button variant="info" className="w-100">
												Detail
											</Button>
										</Link>
									</Card.Body>
								</Card>
							</Col>
						))
					) : (
						<p className="text-center w-100 mt-3">
							<span className="text-danger fw-bold">No data retrieved.</span> Please check your network connection.
						</p>
					)}
				</Row>
			</Container>
		</div>
	);
}

export default VaccineList;
