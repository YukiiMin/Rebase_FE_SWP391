import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "../lib/utils";

function SideMenu() {
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decodedToken = jwtDecode(token);
				// console.log(decodedToken);
				setUsername(decodedToken.username);
			} catch (err) {
				console.error("Error decoding token:", err);
			}
		} else {
			// setIsLoggedIn(false);
		}
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		// setIsLoggedIn(false);
		navigate("/Login"); // Navigate to Login page after logout
	};
	return (
		<div className="w-64 h-full bg-white border-r border-gray-200 p-4">
			<div className="flex flex-col items-center mb-6">
				<Avatar className="h-20 w-20 mb-2">
					<AvatarImage src="src/alt/notfound.jpg" alt={username} />
					<AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
				</Avatar>
				<span className="font-bold text-center">{username}</span>
			</div>
			
			<hr className="mb-4" />
			
			<nav className="flex flex-col space-y-1">
				<NavLink 
					to="/User/Profile" 
					className={({ isActive }) => 
						cn("px-4 py-2 rounded-md transition-colors", 
							isActive 
								? "bg-primary/10 text-primary font-medium" 
								: "text-gray-700 hover:bg-gray-100"
						)
					}
				>
					Profile
				</NavLink>
				<NavLink 
					to="/User/Children" 
					className={({ isActive }) => 
						cn("px-4 py-2 rounded-md transition-colors", 
							isActive 
								? "bg-primary/10 text-primary font-medium" 
								: "text-gray-700 hover:bg-gray-100"
						)
					}
				>
					Children Management
				</NavLink>
				<NavLink 
					to="/User/Scheduling" 
					className={({ isActive }) => 
						cn("px-4 py-2 rounded-md transition-colors", 
							isActive 
								? "bg-primary/10 text-primary font-medium" 
								: "text-gray-700 hover:bg-gray-100"
						)
					}
				>
					Booking Schedule
				</NavLink>
				<NavLink 
					to="/User/History" 
					className={({ isActive }) => 
						cn("px-4 py-2 rounded-md transition-colors", 
							isActive 
								? "bg-primary/10 text-primary font-medium" 
								: "text-gray-700 hover:bg-gray-100"
						)
					}
				>
					Vaccination History
				</NavLink>
				<NavLink 
					to="/User/Record" 
					className={({ isActive }) => 
						cn("px-4 py-2 rounded-md transition-colors", 
							isActive 
								? "bg-primary/10 text-primary font-medium" 
								: "text-gray-700 hover:bg-gray-100"
						)
					}
				>
					Health Record
				</NavLink>
				<button 
					onClick={handleLogout}
					className="text-left px-4 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
				>
					Log out
				</button>
			</nav>
		</div>
	);
}

export default SideMenu;
