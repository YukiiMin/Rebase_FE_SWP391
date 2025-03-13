import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Container, Table } from "react-bootstrap";

function PriceListPage() {
	const vaccineAPI = "http://localhost:8080/vaccine";
	const [vaccineList, setVaccineList] = useState([]);
	const token = localStorage.getItem("token");

	useEffect(() => {
		getVaccine();
	}, []);

	const getVaccine = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/get`);
			if (response.ok) {
				const data = await response.json();
				setVaccineList(data.result);
			} else {
				console.error("Fetching vaccine failed: ", response.status);
			}
		} catch (err) {
			console.log("Something went wrong when fetching vaccines: ", err);
		}
	};

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2 className="mt-4 mb-4">Vaccination price list and payment methods</h2>

				<h3 className="mb-3">Vaccination price list</h3>
				<Table striped>
					<thead>
						<tr>
							<th>#</th>
							<th>Vaccine name</th>
							<th>Origin</th>
							<th>Price/Dose ($)</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{vaccineList.length > 0 ? (
							vaccineList.map((vaccine) => (
								<tr key={vaccine.id}>
									<td>{vaccine.id}</td>
									<td>{vaccine.name}</td>
									<td>{vaccine.manufacturer}</td>
									<td>{vaccine.salePrice}</td>
									<td>{vaccine.status ? "Available" : "Unavailable"}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={5}>No data</td>
							</tr>
						)}
					</tbody>
				</Table>
				<br />
				<h3 className="mt-4 mb-3">Payment methods</h3>
				<ul>
					<li>Cash payment at the cashier.</li>
					<li>Payment by credit card.</li>
					<li>Payment via e-commerce applications, mobile payment services, VNPAY-QR e-wallets, Momo,...</li>
				</ul>
			</Container>
		</div>
	);
}

export default PriceListPage;
