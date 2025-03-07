import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Card, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

function VaccineDetail() {
	const [vaccine, setVaccine] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const vaccineAPI = "http://localhost:8080/vaccine";
	const { id } = useParams();

	useEffect(() => {
		fetchAPI();
	}, [id]);

	const fetchAPI = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${vaccineAPI}/${id}`);
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				setVaccine(data.result[0]);
				setLoading(false);
			} else {
				throw new Error(`Error: ${response.status}`);
			}
			// if (!response.ok) {
			// 	throw new Error(`Error: ${response.status}`);
			// }
			// const data = await response.json();
			// setVaccine(data.result);
			// setLoading(false);
		} catch (err) {
			console.log(err);
			setError(err);
			setLoading(false);
		}
	};
	//If something went wrong
	if (error) {
		return (
			<div>
				<Navigation />
				<br />
				<Container>
					{console.log(error)}
					<h2>Error Loading Vaccine Details</h2>
					<p>{error.message}</p>
				</Container>
			</div>
		);
	}

	return (
		<div>
			<Navigation />
			<br />
			<Container className="my-4">
				{loading ? (
					<div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</div>
				) : vaccine ? (
					<>
						<Card className="shadow">
							<Card.Body>
								<Row>
									<Col md={4} className="text-center">
										<Image src={vaccine.imagineUrl} alt={vaccine.name} fluid className="mb-3" style={{ maxHeight: "250px", objectFit: "contain" }} />
									</Col>
									<Col md={8}>
										<Card.Title className="mb-3">{vaccine.name}</Card.Title>
										<p>
											<strong>Manufacturer:</strong> {vaccine.manufacturer}
										</p>
										<p>
											<strong>Unit price:</strong> {vaccine.price}$
										</p>
									</Col>
								</Row>
								<hr />
								<Row>
									<Col md={6}>
										<p>
											<strong>Description:</strong> {vaccine.description}
										</p>
										<p>
											<strong>Category:</strong> {vaccine.category}
										</p>
										<p>
											<strong>Dosage:</strong> {vaccine.dosage}
										</p>
										<p>
											<strong>Contraindications:</strong> {vaccine.contraindications}
										</p>
										<p>
											<strong>Precautions:</strong> {vaccine.precautions}
										</p>
										<p>
											<strong>Interactions:</strong> {vaccine.interactions}
										</p>
									</Col>
									<Col md={6}>
										<p>
											<strong>Adverse Reactions:</strong> {vaccine.adverseReaction}
										</p>
										<p>
											<strong>Storage Conditions:</strong> {vaccine.storageConditions}
										</p>
										<p>
											<strong>Recommended For:</strong> {vaccine.recommended}
										</p>
										<p>
											<strong>Pre-Vaccination Information:</strong> {vaccine.preVaccination}
										</p>
										<p>
											<strong>Compatibility:</strong> {vaccine.compatibility}
										</p>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</>
				) : (
					<>
						<p className="text-center">Vaccine not found.</p>
					</>
				)}
			</Container>
		</div>
	);
}

export default VaccineDetail;
