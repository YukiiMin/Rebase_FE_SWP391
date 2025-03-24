import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { User, Calendar, History } from "lucide-react";

const UserSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4 px-4">User Menu</h3>
      <div className="flex flex-col space-y-2">
        <SidebarLink 
          path="/User/Profile" 
          icon={<User className="h-5 w-5" />} 
          label="Profile" 
          active={isActive("/User/Profile")} 
        />
        <SidebarLink 
          path="/User/Scheduling" 
          icon={<Calendar className="h-5 w-5" />} 
          label="Appointments" 
          active={isActive("/User/Scheduling")} 
        />
        <SidebarLink 
          path="/User/History" 
          icon={<History className="h-5 w-5" />} 
          label="History" 
          active={isActive("/User/History")} 
        />
      </div>
    </div>
  );
};

const SidebarLink = ({ path, icon, label, active }) => (
  <Link to={path}>
    <Button
      variant={active ? "default" : "ghost"}
      className={`w-full justify-start ${active ? "bg-primary text-primary-foreground" : "text-gray-600 hover:text-gray-900"}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  </Link>
);

export default UserSidebar; 