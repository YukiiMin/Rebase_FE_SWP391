import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";
import Navigation from "../components/Navbar";

function UserScheduling() {
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<Row>
					<SideMenu />
					<Col>
						<h2>Booking Schedule:</h2>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserScheduling;
