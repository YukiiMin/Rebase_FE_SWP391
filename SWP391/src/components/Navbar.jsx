import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Navigation() {
	return (
		<>
			<Container>
				<Navbar expand="lg" className="bg-body-tertiary">
					<Container>
						<Navbar.Brand href="/">Vaccine Schedule System</Navbar.Brand>
					</Container>
					<Nav className="justify-content-end">
						<NavLink to={"/Login"} className={"nav-link"}>
							Login
						</NavLink>
					</Nav>
				</Navbar>
			</Container>
			<Navbar bg="dark" data-bs-theme="dark">
				<Container>
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
				</Container>
			</Navbar>
		</>
	);
}

export default Navigation;
