import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Sidebar() {
	return (
		<Nav defaultActiveKey="/ManageAccount" className="flex-column-md">
			<NavLink to={"/ManageAccount"} className={"nav-link"}>
				Account
			</NavLink>
			<NavLink to={"/ManageVaccine"} className={"nav-link"}>
				Vaccine
			</NavLink>
			<NavLink to={"/ManageCombo"} className={"nav-link"}>
				Vaccine Combo
			</NavLink>
			<NavLink to={"#"} className={"nav-link"}>
				###
			</NavLink>
		</Nav>
	);
}

export default Sidebar;
