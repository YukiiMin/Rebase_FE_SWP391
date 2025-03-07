import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import StaffMenu from "../components/StaffMenu";

function CheckIn() {
	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<StaffMenu />
				<Col>
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Check-In</h1>
						<hr className="mb-4"></hr>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default CheckIn;
