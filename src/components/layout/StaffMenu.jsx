import React from "react";
import { NavLink } from "react-router-dom";
import { Home, UserCheck, Calendar, Syringe } from "lucide-react";
import { cn } from "../../lib/utils";

function StaffMenu() {
	return (
		<div className="h-screen w-64 bg-gray-100 border-r p-4">
			<div className="mb-8">
				<a href="/" className="text-xl font-bold text-primary">
					Vaccine Schedule
				</a>
			</div>
			
			<nav className="space-y-1">
				<NavItem to="/Staff/StaffPage" icon={<Home className="w-5 h-5" />} label="Staff Home" />
				<NavItem to="/Staff/CheckIn" icon={<UserCheck className="w-5 h-5" />} label="Customer Check-In" />
				<NavItem to="/Staff/Schedule" icon={<Calendar className="w-5 h-5" />} label="Work Schedule" />
				<NavItem to="/Staff/Vaccination" icon={<Syringe className="w-5 h-5" />} label="Vaccination Management" />
			</nav>
		</div>
	);
}

const NavItem = ({ to, icon, label }) => {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				cn(
					"flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
					isActive
						? "bg-primary/10 text-primary"
						: "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
				)
			}
		>
			<span className="mr-3">{icon}</span>
			{label}
		</NavLink>
	);
};

export default StaffMenu;
