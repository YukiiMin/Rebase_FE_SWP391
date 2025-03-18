import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import AddChild from "../components/AddChild";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";
import { jwtDecode } from "jwt-decode";
import UpdateChild from "../components/UpdateChild";

function UserChildren() {
	const token = localStorage.getItem("token");
	const decodedToken = jwtDecode(token);
	const userAPI = "http://localhost:8080/users";
	const [isAddOpen, setIsAddOpen] = useState(false); //For add child form
	const [isUpdateOpen, setIsUpdateOpen] = useState(false); //For update child form
	const [childs, setChilds] = useState([]);

	const [selectedChild, setSelectedChild] = useState([]);

	useEffect(() => {
		getChild();
	}, []);

	const getChild = async () => {
		try {
			const accountId = decodedToken.sub;
			const response = await fetch(`${userAPI}/${accountId}/children`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				setChilds(data.children);
			} else {
				console.error("Get children failed: ", response.status);
			}
		} catch (err) {
			console.error("SOmething went wrong when fetching child: ", err);
		}
	};

	//After adding child
	const handleChildAdd = (newChild) => {
		if (newChild) {
			setChilds([newChild, ...childs]);
		} else {
			getChild();
		}
	};

	//Assign childId to the button
	const handleUpdateClick = (child) => {
		setSelectedChild(child);
		setIsUpdateOpen(true);
	};

	//After updating child
	const handleChildUpdate = (child) => {
		if (child) {
			setChilds([child, ...childs]);
		} else {
			getChild();
		}
	};

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Navigation />
			<br />
			<Container>
				{console.log(childs)}
				<Row>
					<SideMenu />
					<Col>
						<Row className="mb-3">
							<Col>
								<h2 className="mb-0">Children</h2>
							</Col>
							<Col className="text-end">
								<Button
									onClick={() => {
										setIsAddOpen(true);
									}}>
									Add
								</Button>
							</Col>
							{isAddOpen && <AddChild setIsOpen={setIsAddOpen} open={isAddOpen} onAdded={handleChildAdd} />}
						</Row>
						<hr />
						<Container>
							{childs.length > 0 ? (
								childs.map((child) => (
									<Card className="shadow-sm" key={child.id}>
										<Card.Header as="h5" className="bg-white">
											{child.name}
										</Card.Header>
										<Card.Body>
											<Card.Text>
												<Row>
													<Col xs={6}>
														<strong>Id:</strong>
													</Col>
													<Col xs={6}>{child.id}</Col>
													<Col xs={6}>
														<strong>Gender:</strong>
													</Col>
													<Col xs={6}>{child.gender}</Col>
													<Col xs={6}>
														<strong>Date of birth:</strong>
													</Col>
													<Col xs={6}>{child.dob}</Col>
													<Col xs={6}>
														<strong>Weight:</strong>
													</Col>
													<Col xs={6}>{`${child.weight}kg`}</Col>
													<Col xs={6}>
														<strong>Height:</strong>
													</Col>
													<Col xs={6}>{`${child.height}cm`}</Col>
												</Row>
											</Card.Text>
											<div className="d-flex justify-content-end">
												<Button
													variant="info"
													className="me-2"
													onClick={() => {
														handleUpdateClick(child);
													}}>
													Edit
												</Button>
												<Button variant="danger">Delete</Button>
											</div>
										</Card.Body>
										{isUpdateOpen && selectedChild && <UpdateChild setIsOpen={setIsUpdateOpen} open={isUpdateOpen} child={selectedChild} onUpdate={handleChildUpdate} />}
									</Card>
								))
							) : (
								<>No data</>
							)}
						</Container>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserChildren;
