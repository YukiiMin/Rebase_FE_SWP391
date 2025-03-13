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
		fetchVaccine();
	}, []);

	const fetchVaccine = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/get`);
			if (response.ok) {
				const data = await response.json();
				setVaccinesList(data.result);
				setSearchList(data.result);
			} else {
				console.error("Fetching vaccines failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when fetching vaccines: ", err);
		}
	};

	const handleChangeSearch = (e) => {
		setSearch(e.target.value);
		//If user delete all search value, return the default vaccine list
		if (e.target.value === "") {
			setSearchList(vaccinesList);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (search) {
			const filteredVaccines = vaccinesList.filter((vaccine) => vaccine.name.toLowerCase().includes(search.toLowerCase()));
			setSearchList(filteredVaccines);
		} else {
			setSearchList(vaccinesList);
		}
	};

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				{/* {console.log(searchList)} */}
				<h2>Vaccine List:</h2>
				<Form onSubmit={handleSearch}>
					<InputGroup className="mb-3">
						<Form.Control type="text" placeholder="Vaccine name..." aria-label="Vaccine name" aria-describedby="basic-addon2" value={search} onChange={handleChangeSearch} />
						<Button variant="outline-secondary" id="button-addon2" type="submit">
							Search
						</Button>
					</InputGroup>
				</Form>
				{vaccinesList.length > 0 ? (
					<Row xs={1} md={2} lg={4} className="g-4">
						{searchList.length > 0 ? (
							searchList.map((vaccine) => (
								<Col key={vaccine.id}>
									<Card className="h-100 shadow-sm">
										<Card.Img variant="top" src={vaccine.imagineUrl} style={{ height: "200px", objectFit: "cover" }} />
										<Card.Body className="d-flex flex-column">
											<Card.Title className="fw-bold">{vaccine.name}</Card.Title>
											<Card.Text className="flex-grow-1">Price: {vaccine.salePrice}$</Card.Text>
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
							<p className="text-center w-100 mt-3">No results found for "{search}"</p>
						)}
					</Row>
				) : (
					<p className="text-center w-100 mt-3">
						<span className="text-danger fw-bold">No data retrieved.</span> Please check your network connection.
					</p>
				)}
			</Container>
		</div>
	);
}

export default VaccineList;
