import React from "react";
import { Col, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Sidebar() {
	return (
		<Col lg={2} style={{ backgroundColor: "#e0e0e0", paddingTop: "20px" }}>
			<Navbar>
				<Nav defaultActiveKey="/Admin/Dashboard" className="flex-column">
					<Navbar.Brand
						href="/"
						style={{
							fontWeight: "bold",
							fontSize: "1.2rem",
							marginBottom: "20px",
							color: "#007bff",
						}}>
						Vaccine Schedule
					</Navbar.Brand>
					<NavLink
						to={"/Admin/Dashboard"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Dashboard
					</NavLink>
					<NavLink
						to={"/Admin/ManageAccount"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Account
					</NavLink>
					<NavLink
						to={"/Admin/VaccineManage"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Vaccine
					</NavLink>
					<NavLink
						to={"/Admin/ManageCombo"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Vaccine Combo
					</NavLink>
					<NavLink
						to={"/Admin/WorkSchedule"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Work Schedule
					</NavLink>
					<NavLink
						to="/Admin/ProtocolManage"
						className="text-decoration-none py-2 d-flex align-items-center ps-4"
						style={{ color: "inherit" }}
					>
						<i className="fas fa-list-ol me-3"></i>
						<span>Protocol Management</span>
					</NavLink>
				</Nav>
			</Navbar>
		</Col>
	);
}

export default Sidebar;
