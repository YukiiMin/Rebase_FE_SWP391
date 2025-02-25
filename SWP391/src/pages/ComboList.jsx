import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Container, Form, InputGroup, Row } from "react-bootstrap";

function ComboList() {
	const comboAPI = "";
	const [comboList, setComboList] = useState([]);

	useEffect(() => {
		fetch(comboAPI)
			.then((response) => response.json())
			.then((data) => {
				setComboList(data);
			})
			.catch((error) => console.error("Error fetching combos:", error));
	}, []);

	return (
		<div>
			<Navigation />
			<br />
			<Container>
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
						<Col key={combo.id}>
							<Card>
								<Card.Img variant="top" /*src={vaccine.image}*/ src={"src/alt/notfound.jpg"} />
								<Card.Body>
									<Card.Title>{combo.comboname}</Card.Title>
									<Card.Text>Price: {combo.price}$</Card.Text>
									<Link to={`/ComboDetail/${combo.id}`}>
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

export default ComboList;
