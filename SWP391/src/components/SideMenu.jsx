import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Col, Image, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

function SideMenu() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
			try {
				const decodedToken = jwtDecode(token);
				console.log(decodedToken);
				setUsername(decodedToken.username);
			} catch (err) {
				console.error("Error decoding token:", err);
			}
		} else {
			setIsLoggedIn(false);
		}
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsLoggedIn(false);
		navigate("/Login"); // Navigate to Login page after logout
	};
	return (
		<Col sm={3}>
			<Nav className="me-auto flex-column" defaultActiveKey={"/Profile"}>
				<Image src="src/alt/notfound.jpg" rounded fluid />
				<b style={{ textAlign: "center" }}>{username}</b>
				<hr></hr>
				<NavLink to={"/Profile"} className={"nav-link"}>
					Profile
				</NavLink>
				<NavLink to={"/Children"} className={"nav-link"}>
					Children Management
				</NavLink>
				<NavLink to={"/Scheduling"} className={"nav-link"}>
					Booking Schedule
				</NavLink>
				<NavLink to={"/History"} className={"nav-link"}>
					Vaccination History
				</NavLink>
				<NavLink to={"/Record"} className={"nav-link"}>
					Health Record
				</NavLink>
				<NavLink className="nav-link" onClick={handleLogout}>
					Log out
				</NavLink>
			</Nav>
		</Col>
	);
}

export default SideMenu;
