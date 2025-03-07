import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, CardGroup, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../alt/notfound.jpg";

function HomePage() {
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const vaccineAPI = "http://localhost:8080/vaccine/get";
	const [vaccinesList, setVaccinesList] = useState([]);

	useEffect(() => {
		fetch(vaccineAPI)
			.then((response) => response.json())
			.then((data) => {
				setVaccinesList(data.result);
			})
			.catch((error) => console.error("Error fetching vaccines:", error));
	}, []);

	const getRandomVaccines = (vaccines, count) => {
		const shuffled = vaccines.sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};

	const randomVaccines = getRandomVaccines(vaccinesList, 4);

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Navigation />
			<Container className="py-5">
				<div className="text-center mb-4">
					<h2 className="display-4 fw-bold text-primary">Welcome</h2>
					<p className="lead">
						Welcome to our Child Vaccination System! We're here to help you keep your little ones healthy and protected. Scheduling vaccinations is easy, and we'll guide you every step of the way. Let's
						work together to ensure a happy and healthy future for your children.
					</p>
				</div>
				<div className="mb-5">
					<h3 className="mb-3">
						Vaccine list: <Link to={"/VaccineList"}>See all</Link>
					</h3>
				</div>

				<Row xs={1} md={2} lg={4} className="g-4">
					{randomVaccines.map((vaccine) => (
						<Col key={vaccine.id}>
							<Card className="h-100 shadow-sm">
								<Card.Img variant="top" src={vaccine.imagineUrl} alt={vaccine.id} style={{ height: "200px", objectFit: "cover" }} />
								<Card.Body className="d-flex flex-column">
									<Card.Title className="fw-bold">{vaccine.name}</Card.Title>
									<Card.Text className="flex-grow-1">Price: {vaccine.price}$</Card.Text>
									<Link to={`/VaccineDetail/${vaccine.id}`} className="mt-3">
										<Button variant="info" className="w-100">
											Detail
										</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
				<hr className="my-5"></hr>
				<h3 className="mb-3">Our service:</h3>
				<Row xs={1} md={2} lg={4}>
					<Col>
						<Card className="h-100 shadow-sm">
							<Card.Body className="text-center">
								<Link to={"#"} className="text-decoration-none">
									<h5 className="mb-3 text-primary">Booking Appointment</h5>
									<p className="text-muted">
										Schedule your child's vaccinations and check-ups with ease. Our online booking system lets you choose the date and time that suits your family's schedule, ensuring timely care and peace of
										mind. Get instant confirmations and reminders, so you never miss an appointment.
									</p>
								</Link>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card className="h-100 shadow-sm">
							<Card.Body className="text-center">
								<Link to={"#"} className="text-decoration-none">
									<h5 className="mb-3 text-primary">Child Care</h5>
									<p className="text-muted">
										Access comprehensive resources and expert advice on child care. From nutrition and development to common illnesses and preventative measures, we provide reliable information to support you
										in nurturing a healthy and happy childhood. Find tips, guides, and support tailored to your child's age and needs.
									</p>
								</Link>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card className="h-100 shadow-sm">
							<Card.Body className="text-center">
								<Link to={"#"} className="text-decoration-none">
									<h5 className="mb-3 text-primary">Doctor Consulting</h5>
									<p className="text-muted">
										Connect with experienced pediatricians for personalized consultations and medical advice. Whether you have questions about your child's health, need guidance on specific concerns, or require
										a virtual check-up, our online consulting service provides convenient and reliable access to expert care from the comfort of your home.
									</p>
								</Link>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card className="h-100 shadow-sm">
							<Card.Body className="text-center">
								<Link to={"#"} className="text-decoration-none">
									<h5 className="mb-3 text-primary">Premium Service</h5>
									<p className="text-muted">
										Experience enhanced care and exclusive benefits with our premium service. Enjoy priority scheduling, extended consultation times, personalized care plans, and direct access to a dedicated
										care team. Our premium service is designed to provide you and your child with the highest level of attention and support.
									</p>
								</Link>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<div>
					<h3 className="mb-3">Blog:</h3>
					<CardGroup>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</Card.Text>
							</Card.Body>
							<Card.Footer>
								<small className="text-muted">Last updated 3 mins ago</small>
							</Card.Footer>
						</Card>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>This card has supporting text below as a natural lead-in to additional content.</Card.Text>
							</Card.Body>
							<Card.Footer>
								<small className="text-muted">Last updated 3 mins ago</small>
							</Card.Footer>
						</Card>
						<Card>
							<Card.Img variant="top" src="src/alt/notfound.jpg" />
							<Card.Body>
								<Card.Title>Card title</Card.Title>
								<Card.Text>
									This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.
								</Card.Text>
							</Card.Body>
							<Card.Footer>
								<small className="text-muted">Last updated 3 mins ago</small>
							</Card.Footer>
						</Card>
					</CardGroup>
				</div>
			</Container>
		</div>
	);
}

export default HomePage;
