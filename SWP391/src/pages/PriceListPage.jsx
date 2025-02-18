import React from "react";
import Navigation from "../components/Navbar";
import { Container, Table } from "react-bootstrap";

function PriceListPage() {
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2>Vaccination price list and payment methods:</h2>
				<br />
				<h3>Vaccination price list</h3>
				<Table striped>
					<thead>
						<tr>
							<th>#</th>
							<th>Vaccine name</th>
							<th>Origin</th>
							<th>Price/Dose (VND)</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Pentaxim</td>
							<td>France</td>
							<td>795000</td>
							<td>Available</td>
						</tr>
						<tr>
							<td>2</td>
							<td>Rotateq</td>
							<td>USA</td>
							<td>665000</td>
							<td>Unavailable</td>
						</tr>
						<tr>
							<td>3</td>
							<td>Rotavin</td>
							<td>Vietnam</td>
							<td>490000</td>
							<td>Available</td>
						</tr>
					</tbody>
				</Table>
				<br />
				<h3>Payment methods:</h3>
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
