import React from "react";
import Navigation from "../components/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";

function UserProfile() {
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
							<b>Fullname: </b> ABCXYZ <br />
							<b>Gender: </b> Male <br />
							<b>Email: </b> abcxyz@gmail.com <br />
							<b>Phone number: </b> 1234567890 <br />
							<b>Address: </b> 123ABC, NY, USA <br />
							<b>Username: </b> tester1 <br />
						</Container>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserProfile;
