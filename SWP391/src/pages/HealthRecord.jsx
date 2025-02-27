import React from "react";
import Navigation from "../components/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";

function HealthRecord() {
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<Row>
					<SideMenu />
					<Col>
						<h2>Health Record:</h2>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default HealthRecord;
