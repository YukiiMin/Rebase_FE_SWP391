import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

function VaccineDetail() {
	const [vaccine, setVaccine] = useState({});
	const [loading, setLoading] = useState(true);
	const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const { id } = useParams();

	useEffect(() => {
		const fetchAPI = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${vaccineAPI}/${id}`);
				if (!response.ok) {
					throw new Error(`Error: ${response.status}`);
				}
				const data = await response.json();
				setVaccine(data);
				setLoading(false);
			} catch (err) {
				console.log(err);
				setLoading(false);
			}
		};
		fetchAPI();
	}, [id]);

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				{console.log(vaccine)}
				{loading ? (
					<>
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</>
				) : (
					<>
						<h2>{vaccine.vaccinename}</h2>
						<p>Price: {vaccine.price}$</p>
						<hr></hr>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga omnis placeat voluptates voluptatem reiciendis, distinctio earum cum iure est iusto dolores veniam veritatis optio dolorem libero
						id quis. Explicabo, unde.
					</>
				)}
			</Container>
		</div>
	);
}

export default VaccineDetail;
