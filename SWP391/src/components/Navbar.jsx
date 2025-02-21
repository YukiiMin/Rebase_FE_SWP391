import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
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
						<NavDropdown title="Username" id="basic-nav-dropdown">
							<NavLink to={"/"} className={"dropdown-item"}>
								Profile
							</NavLink>
							<NavLink to={"/"} className={"dropdown-item"}>
								Children Management
							</NavLink>
							<NavLink to={"/"} className={"dropdown-item"}>
								Logout
							</NavLink>
						</NavDropdown>
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
						<NavDropdown title="Information" id="basic-nav-dropdown">
							<NavLink to={"/VaccineList"} className={"dropdown-item"}>
								Vaccine List
							</NavLink>
							<NavLink to={"/ComboList"} className={"dropdown-item"}>
								Vaccine Combo List
							</NavLink>
						</NavDropdown>
						<NavLink to={"/Booking"} className={"nav-link"}>
							Booking
						</NavLink>
					</Nav>
				</Container>
			</Navbar>
		</>
	);
}

export default Navigation;
