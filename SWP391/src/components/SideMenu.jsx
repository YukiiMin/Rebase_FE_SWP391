import React, { useEffect, useState } from "react";
import { Col, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

function SideMenu() {
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
		<Col sm={3}>
			<Nav className="me-auto flex-column" defaultActiveKey={"/Profile"}>
				<NavLink to={"/Profile"} className={"nav-link"}>
					Profile
				</NavLink>
				<NavLink to={"/Children Management"} className={"nav-link"}>
					Children Management
				</NavLink>
				<NavLink to={"#"} className={"nav-link"}>
					Booking Schedule
				</NavLink>
				<NavLink to={"#"} className={"nav-link"}>
					Vaccination History
				</NavLink>
				<NavLink to={"#"} className={"nav-link"}>
					Health Record
				</NavLink>
				<Nav.Item className="nav-link" onClick={handleLogout}>
					Log out
				</Nav.Item>
			</Nav>
		</Col>
	);
}

export default SideMenu;
