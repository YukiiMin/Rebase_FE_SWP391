import React from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../alt/notfound.jpg";

function HomePage() {
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2>Welcome</h2>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae dolorem tenetur necessitatibus ex eaque corrupti sed odit natus perferendis aperiam veniam a rerum nobis, cupiditate earum
					blanditiis nostrum rem exercitationem.
				</p>
				<h2>
					Vaccine List:<Link to={"/VaccineList"}>See all</Link>
				</h2>

				<Row xs={1} md={2} lg={4} className="g-4">
					<Col>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" alt={""} />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</Card.Text>
								<Link to={"/VaccineDetail"}>
									<Button>Detail</Button>
								</Link>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" alt={""} />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" alt={""} />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" alt={""} />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
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
