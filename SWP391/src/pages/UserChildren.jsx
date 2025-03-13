import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import AddChild from "../components/AddChild";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";

function UserChildren() {
	const token = localStorage.getItem("token");
	const childAPI = "http://localhost:8080/children";
	const [isOpen, setIsOpen] = useState(false);
	const [childs, setChilds] = useState([]);

	useEffect(() => {
		fetchChild();
	}, []);

	const fetchChild = async () => {
		try {
			const response = await fetch(`${childAPI}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				setChilds(data);
			} else {
				console.error("Fetching child failed: ", response.status);
			}
		} catch (err) {
			console.error("SOmething went wrong when fetching child: ", err);
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
										setIsOpen(true);
									}}>
									Add
								</Button>
							</Col>
							{isOpen && <AddChild setIsOpen={setIsOpen} open={isOpen} />}
						</Row>
						<hr />
						<Container>
							{childs.length > 0 ? (
								childs.map((child) => (
									<Card className="shadow-sm">
										<Card.Header as="h5" className="bg-white">
											{child.name}
										</Card.Header>
										<Card.Body>
											<Card.Text>
												<Row>
													<Col xs={6}>
														<strong>Id:</strong>
													</Col>
													<Col xs={6}>{child.child_id}</Col>
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
												{/* <b>Id:</b> 12345
										<br />
										<b>Gender:</b> Non binary <b>Date of birth:</b> 01-01-2025
										<br />
										<b>Weight:</b> 1kg <b>Height:</b> 20cm */}
											</Card.Text>
											<div className="d-flex justify-content-end">
												<Button variant="info" className="me-2">
													Edit
												</Button>
												<Button variant="danger">Delete</Button>
											</div>
										</Card.Body>
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
