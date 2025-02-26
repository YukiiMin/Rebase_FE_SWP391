import React from "react";
import { Col, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Sidebar() {
	return (
		<Col sm={2}>
			<Nav defaultActiveKey="/ManageAccount" className="me-auto flex-column">
				<NavLink to={"/ManageAccount"} className={"nav-link"}>
					Account
				</NavLink>
				<NavLink to={"/ManageVaccine"} className={"nav-link"}>
					Vaccine
				</NavLink>
				<NavLink to={"/ManageCombo"} className={"nav-link"}>
					Vaccine Combo
				</NavLink>
				<NavLink to={"/WorkSchedule"} className={"nav-link"}>
					Work Schedule
				</NavLink>
			</Nav>
		</Col>
	);
}

export default Sidebar;
