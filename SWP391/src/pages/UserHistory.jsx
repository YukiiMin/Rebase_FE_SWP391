import React from "react";
import Navigation from "../components/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";

function UserHistory() {
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<Row>
					<SideMenu />
					<Col>
						<h2>Vaccination History:</h2>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserHistory;
