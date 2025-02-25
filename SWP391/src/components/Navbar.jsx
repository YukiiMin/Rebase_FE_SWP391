import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

function Navigation() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setIsLoggedIn(true);
			setUsername(user.username);
		} else {
			setIsLoggedIn(false);
			setUsername("");
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user");
		setIsLoggedIn(false);
		setUsername("");
		navigate("/Login"); // Navigate to Login page after logout
	};

	return (
		<>
			<Container>
				<Navbar expand="lg" className="bg-body-tertiary">
					<Container>
						<Navbar.Brand href="/">Vaccine Schedule System</Navbar.Brand>
					</Container>
					<Nav className="justify-content-end">
						{isLoggedIn ? (
							<NavDropdown title={username} id="basic-nav-dropdown">
								<NavLink to={"/Profile"} className={"dropdown-item"}>
									Profile
								</NavLink>
								<NavLink to={"/ChildrenManagement"} className={"dropdown-item"}>
									Children Management
								</NavLink>
								<NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
							</NavDropdown>
						) : (
							<NavLink to={"/Login"} className={"nav-link"}>
								Login
							</NavLink>
						)}
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
