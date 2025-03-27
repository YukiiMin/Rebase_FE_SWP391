import React from "react";
import { NavLink } from "react-router-dom";
import { 
	LayoutDashboard,
	Users,
	Syringe,
	Package,
	Calendar,
	ClipboardList,
	Home
} from "lucide-react";
import { cn } from "../lib/utils";
import { useTranslation } from "react-i18next";

function Sidebar() {
	const { t } = useTranslation();
	
	return (
		<aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm flex-shrink-0 fixed left-0 top-0 z-10 overflow-y-auto">
			<div className="px-6 py-4">
				<NavLink to="/" className="flex items-center gap-2 text-primary-foreground mb-6">
					<Syringe className="h-5 w-5 text-blue-600" />
					<span className="text-xl font-semibold text-blue-600">Vaccine Schedule</span>
				</NavLink>
				
				<nav className="space-y-1">
					<NavItem to="/Admin/Dashboard" icon={<LayoutDashboard size={18} />} label={t('admin.sidebar.dashboard')} />
					<NavItem to="/Admin/ManageAccount" icon={<Users size={18} />} label={t('admin.sidebar.account')} />
					<NavItem to="/Admin/VaccineManage" icon={<Syringe size={18} />} label={t('admin.sidebar.vaccine')} />
					<NavItem to="/Admin/ManageCombo" icon={<Package size={18} />} label={t('admin.sidebar.combo')} />
					<NavItem to="/Admin/WorkSchedule" icon={<Calendar size={18} />} label={t('admin.sidebar.workSchedule')} />
					<NavItem to="/Admin/ProtocolManage" icon={<ClipboardList size={18} />} label={t('admin.sidebar.protocol')} />
					<NavItem to="/" icon={<Home size={18} />} label={t('admin.sidebar.returnHome')} />
				</nav>
			</div>
		</aside>
	);
}

const NavItem = ({ to, icon, label }) => {
	return (
		<NavLink
			to={to}
			className={({ isActive }) => cn(
				"flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
				isActive 
					? "bg-blue-50 text-blue-700"
					: "text-gray-700 hover:bg-gray-100"
			)}
		>
			{icon}
			<span>{label}</span>
		</NavLink>
	);
};

export default Sidebar;
