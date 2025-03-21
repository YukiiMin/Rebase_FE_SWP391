import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TokenUtils from "../utils/TokenUtils";

function Navigation() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const [role, setRole] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const checkToken = () => {
			const token = TokenUtils.getToken();
			if (token && TokenUtils.isValidToken(token)) {
				setIsLoggedIn(true);
				try {
					const decodedToken = TokenUtils.decodeToken(token);
					setUsername(decodedToken.username || decodedToken.sub || 'User');
					setRole(decodedToken.scope);
					console.log("User role:", decodedToken.scope);
				} catch (err) {
					console.error("Error processing token:", err);
				}
			} else {
				setIsLoggedIn(false);
				setUsername("");
				setRole("");
			}
		};

		checkToken();

		// Lắng nghe sự kiện thay đổi token
		const handleStorageChange = () => {
			checkToken();
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, []);

	const handleLogout = () => {
		TokenUtils.removeToken();
		setIsLoggedIn(false);
		setUsername("");
		setRole("");
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
								{role === "ADMIN" ? (
									<>
										<NavLink to={"/Admin/Dashboard"} className={"dropdown-item"}>
											Dashboard
										</NavLink>
										<NavLink to={"/Admin/ManageAccount"} className={"dropdown-item"}>
											Account Management
										</NavLink>
										<NavLink to={"/Admin/VaccineManage"} className={"dropdown-item"}>
											Vaccine Management
										</NavLink>
										<NavLink to={"/Admin/ProtocolManage"} className={"dropdown-item"}>
											Protocol Management
										</NavLink>
										<NavLink to={"/Admin/ManageCombo"} className={"dropdown-item"}>
											Combo Management
										</NavLink>
										<NavLink to={"/Admin/WorkSchedule"} className={"dropdown-item"}>
											Work Schedule
										</NavLink>
									</>
								) : (
									<>
										<NavLink to={"/User/Profile"} className={"dropdown-item"}>
											Profile
										</NavLink>
										<NavLink to={"/User/Children"} className={"dropdown-item"}>
											Children Management
										</NavLink>
										<NavLink to={"/User/Scheduling"} className={"dropdown-item"}>
											Booking Schedule
										</NavLink>
										<NavLink to={"/User/History"} className={"dropdown-item"}>
											Vaccination History
										</NavLink>
										<NavLink to={"/User/Record"} className={"dropdown-item"}>
											Health Record
										</NavLink>
									</>
								)}
								<NavDropdown.Divider />
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
					
					{role === "ADMIN" && (
						<Nav className="justify-content-end">
							<NavLink to={"/Admin/Dashboard"} className={"nav-link"}>
								Admin Page
							</NavLink>
						</Nav>
					)}
					
					{(role === "DOCTOR" || role === "NURSE" || role === "ADMIN") && (
						<Nav className="justify-content-end">
							<NavLink to={"/Staff/StaffPage"} className={"nav-link"}>
								Staff Page
							</NavLink>
						</Nav>
					)}
				</Container>
			</Navbar>
		</>
	);
}

export default Navigation;
