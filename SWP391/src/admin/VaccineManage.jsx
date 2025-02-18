import React from "react";
import Sidebar from "../components/Sidebar";
import { Container, Table } from "react-bootstrap";

function VaccineManage() {
	return (
		<>
			<Sidebar />
			<Container>
				<h1>Vaccine Manage</h1>
				<Table striped bordered hover responsive>
					<thead>
						<tr>
							<th>#</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Username</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Mark</td>
							<td>Otto</td>
							<td>@mdo</td>
						</tr>
						<tr>
							<td>2</td>
							<td>Jacob</td>
							<td>Thornton</td>
							<td>@fat</td>
						</tr>
					</tbody>
				</Table>
			</Container>
		</>
	);
}

export default VaccineManage;
