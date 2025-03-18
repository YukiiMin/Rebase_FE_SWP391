import React from "react";
import StaffMenu from "../components/StaffMenu";
import { Col, Container, Row } from "react-bootstrap";

function StaffHome() {
	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<StaffMenu />
				<Col>
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Staff Page</h1>
						<hr className="mb-4"></hr>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default StaffHome;
