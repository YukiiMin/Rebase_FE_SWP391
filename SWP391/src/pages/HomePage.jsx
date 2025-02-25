import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../alt/notfound.jpg";

function HomePage() {
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

	const getRandomVaccines = (vaccines, count) => {
		const shuffled = vaccines.sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};

	const randomVaccines = getRandomVaccines(vaccinesList, 4);

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2>Welcome</h2>
				<p>
					Welcome! Whether you're scheduling your child's first vaccinations or managing your own booster shots, we're here to support you. Discover our services and take control of your vaccination
					journey.
				</p>
				<h2>
					Vaccine List:<Link to={"/VaccineList"}>See all</Link>
				</h2>

				<Row xs={1} md={2} lg={4} className="g-4">
					{randomVaccines.map((vaccine) => (
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
				<hr></hr>
				<h2>Our Service:</h2>
				<Row xs={1} md={2} lg={4}>
					<Link to={"#"}>###</Link>
					<Link to={"#"}>###</Link>
					<Link to={"#"}>###</Link>
					<Link to={"#"}>###</Link>
				</Row>
				<h2>Blog:</h2>
			</Container>
		</div>
	);
}

export default HomePage;
