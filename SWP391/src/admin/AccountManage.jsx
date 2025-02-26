import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

function AccountManage() {
	const [accounts, setAccounts] = useState([]);

	const accountAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/account";

	useEffect(() => {
		fetch(accountAPI)
			.then((response) => response.json())
			.then((data) => {
				setAccounts(data);
			})
			.catch((error) => console.error("Error fetching accounts:", error));
	}, []);

	return (
		<Container>
			<Row>
				<Sidebar />
				<Col>
					<Container>
						<h1>Account Manage</h1>
						<hr></hr>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>First Name</th>
									<th>Last Name</th>
									<th>Username</th>
									<th>Gender</th>
									<th>Email</th>
									<th>Phone Number</th>
									<th>Address</th>
									<th>Role</th>
									<th>Status</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{accounts.map((user) => (
									<tr key={user.id}>
										<td>{user.id}</td>
										<td>{user.firstName}</td>
										<td>{user.lastName}</td>
										<td>{user.username}</td>
										<td>{user.gender}</td>
										<td>{user.email}</td>
										<td>{user.phoneNumber}</td>
										<td>{user.address}</td>
										<td>{user.roleid}</td>
										<td>{user.status}</td>
										<td>
											<Button variant="info">Update</Button>
											<Button variant="danger">Delete</Button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</Container>
				</Col>
			</Row>
		</Container>
	);
}

export default AccountManage;
