import React, { useEffect, useState } from "react";
import { Button, Col, Container, Pagination, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import UpdateRole from "../components/UpdateRole";
import AddAccount from "../components/AddAccount";

function AccountManage() {
	const token = localStorage.getItem("token");
	const [accountList, setAccountList] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isUpdateOpen, setIsUpdateOpen] = useState(false);

	const [selectedAccount, setSelectedAccount] = useState("");

	// const accountAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/account";
	const accountAPI = "http://localhost:8080/users/getAllUser";

	useEffect(() => {
		fetchAccount();
	}, [accountAPI, token]);

	const fetchAccount = async () => {
		const response = await fetch(accountAPI, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-type": "application/json",
			},
		});
		if (response.ok) {
			const data = await response.json();
			setAccountList(data.result);
		} else {
			console.error();
		}
	};

	const handleUpdateClick = (accountId) => {
		setSelectedAccount(accountId);
		setIsUpdateOpen(true);
	};

	const handleAddAccount = (newAccount) => {
		if (newAccount) {
			setAccountList([newAccount, ...accountList]);
		} else {
			fetchAccount();
		}
	};

	//Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of items per page
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentsAccounts = accountList && accountList.length > 0 ? accountList.slice(indexOfFirstItems, indexOfLastItems) : []; //Ensure list not empty
	const totalPages = Math.ceil(accountList.length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	let items = [];
	for (let number = 1; number <= totalPages; number++) {
		items.push(
			<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
				{number}
			</Pagination.Item>
		);
	}

	const pagination = (
		<Pagination>
			<Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
			<Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
			{items}
			<Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
			<Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
		</Pagination>
	);

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col lg={10}>
					<Container className="py-4">
						{/* <h1 className="mb-4 text-primary">Account Management</h1> */}
						<Row className="mb-4 align-items-center">
							<Col>
								<h1 className="text-primary">Account Management</h1>
							</Col>
							<Col className="text-end">
								<Button variant="primary" onClick={() => setIsOpen(true)}>
									Add Account
								</Button>
							</Col>
							{isOpen && <AddAccount setIsOpen={setIsOpen} open={isOpen} onAccountAdded={handleAddAccount} />}
						</Row>
						<hr className="mb-4"></hr>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>AccountID</th>
									<th>Full Name</th>
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
								{currentsAccounts.length > 0 ? (
									currentsAccounts.map((user, index) => (
										<tr key={user.accountId}>
											<td>{user.accountId}</td>
											<td>
												{user.firstName} {user.lastName}
											</td>
											<td>{user.username}</td>
											<td>{user.gender}</td>
											<td>{user.email}</td>
											<td>{user.phoneNumber}</td>
											<td>{user.address}</td>
											<td>{user.roleName}</td>
											<td>{user.status ? "Active" : "Deactive"}</td>
											<td>
												<Button variant="info" size="sm" className="me-2" onClick={() => handleUpdateClick(user.accountId)}>
													Update
												</Button>
												<Button variant="danger" size="sm" className="me-2">
													Delete
												</Button>
												{isUpdateOpen && <UpdateRole setIsOpen={setIsUpdateOpen} open={isUpdateOpen} userId={selectedAccount} />}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={11} className="text-center">
											No data
										</td>
									</tr>
								)}
							</tbody>
						</Table>
						{pagination}
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default AccountManage;
