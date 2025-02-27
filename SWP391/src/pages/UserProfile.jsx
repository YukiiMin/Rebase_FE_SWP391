import React, { useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Col, Container, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";

function UserProfile() {
	const user = JSON.parse(localStorage.getItem("user"));
	const [isOpen, setIsOpen] = useState(false); //use this to open user update form

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<Row>
					<SideMenu />
					<Col>
						<h2>User Profile:</h2>
						<hr></hr>
						<Container>
							<b>Fullname: </b> {user.firstName} {user.lastName} <br />
							<b>Gender: </b> {user.gender} <br />
							<b>Email: </b> {user.email} <br />
							<b>Phone number: </b> {user.phoneNumber} <br />
							<b>Address: </b> {user.address} <br />
							<b>Username: </b> {user.username} <br />
							<Button
								onClick={() => {
									setIsOpen(true);
								}}>
								Edit profile
							</Button>
						</Container>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserProfile;
