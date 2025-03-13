import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";
import UpdateUser from "../components/UpdateUser";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function UserProfile() {
	const userAPI = "http://localhost:8080/users";

	const token = localStorage.getItem("token");
	const [user, setUser] = useState({});
	const [userId, setUserId] = useState("");
	const [isOpen, setIsOpen] = useState(false); //use this to open user update form
	const navigate = useNavigate();

	useEffect(() => {
		if (token) {
			const decodedToken = jwtDecode(token);
			setUserId(decodedToken.sub);
		}
	}, [navigate]);

	useEffect(() => {
		if (userId) {
			getUser(userId);
		}
	}, [userId]);

	const getUser = async (userId) => {
		try {
			const response = await fetch(`${userAPI}/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setUser(data.result);
			} else {
				console.error(response.status);
			}
		} catch (err) {
			console.error("Get user failed: ", err);
		}
	};

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				{console.log(user)}
				<Row>
					<SideMenu />
					<Col>
						<h2>User Profile:</h2>
						<hr></hr>
						<Container className="d-flex justify-content-center">
							<Card style={{ width: "18rem" }}>
								<Card.Img variant="top" src="src/alt/notfound.jpg" />
								<ListGroup className="list-group-flush">
									<ListGroup.Item>
										Fullname: {user.firstName} {user.lastName}
									</ListGroup.Item>
									<ListGroup.Item>Gender: {user.gender}</ListGroup.Item>
									<ListGroup.Item>Email: {user.email}</ListGroup.Item>
									<ListGroup.Item>Phone number: {user.phoneNumber}</ListGroup.Item>
									<ListGroup.Item>Address: {user.address}</ListGroup.Item>
								</ListGroup>
								<Card.Body>
									<Button
										onClick={() => {
											setIsOpen(true);
										}}>
										Edit profile
									</Button>
									{isOpen && <UpdateUser setIsOpen={setIsOpen} open={isOpen} user={user} />}
								</Card.Body>
							</Card>
						</Container>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserProfile;
