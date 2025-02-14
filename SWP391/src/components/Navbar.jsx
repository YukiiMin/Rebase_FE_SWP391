import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Navigation() {
	return (
		<Navbar bg="dark" data-bs-theme="dark">
			<Container>
				<Navbar.Brand href="/">Navbar</Navbar.Brand>
				<Nav className="me-auto">
					<NavLink to={"/"} className={"nav-link"}>
						Home
					</NavLink>
					<NavLink to={"/AboutUs"} className={"nav-link"}>
						About Us
					</NavLink>
					<NavLink to={"/PriceList"} className={"nav-link"}>
						Price List
					</NavLink>
				</Nav>
				<Nav className="me-auto">
					<Nav.Link>Login</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);
}

export default Navigation;
