import React from "react";
import Navigation from "../components/Navbar";
import { Container } from "react-bootstrap";

function ComboList() {
	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2>Vaccine combo list:</h2>
			</Container>
		</div>
	);
}

export default ComboList;
