import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Menu, Transition } from "@headlessui/react";
import { 
  User, 
  ChevronDown, 
  Home, 
  Info, 
  Calendar, 
  DollarSign,
  Shield,
  LogOut,
  Phone,
  Search,
  LayoutDashboard,
  Users,
  Stethoscope,
  ClipboardList
} from "lucide-react";
import TokenUtils from "../utils/TokenUtils";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

function MainNav() {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const userInfo = TokenUtils.getUserInfo();
          if (userInfo) {
            setUserRole(userInfo.role);
          }
        } catch (error) {
          console.error("Error getting user info:", error);
        }
      } else {
        setToken(null);
        setUserRole(null);
      }
    };

    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLogout = () => {
    TokenUtils.removeToken();
    setToken(null);
    setUserRole(null);
    navigate("/Login");
  };

  return (
    <header className="w-full">
      {/* Top bar with contact info and flags */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex justify-between items-center">
          <div className="flex items-center">
            <Phone className="h-4 w-4 text-orange-500 mr-1" />
            <a href="tel:0903731347" className="text-sm font-medium text-gray-700 hover:text-orange-500">
              0903 731 347
            </a>
            <span className="mx-2 text-gray-500">|</span>
            <Link to="/Booking" className="text-sm font-medium text-gray-700 hover:text-orange-500">
              {t('nav.orderVaccine')}
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main header with logo and menu */}
      <div className="bg-blue-700 text-white py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center">
          <Link to="/" className="flex-shrink-0 flex items-center mr-10">
            <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div className="ml-3">
              <span className="font-bold text-2xl text-white tracking-tight">VaccineCare</span>
              <div className="text-xs text-blue-100 font-medium">
                HỆ THỐNG TIÊM CHỦNG TOÀN QUỐC
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between">
            <div className="flex space-x-6">
              <NavLink to="/" icon={<Home className="w-4 h-4" />}>
                {t('nav.home')}
              </NavLink>
              <NavLink to="/AboutUs" icon={<Info className="w-4 h-4" />}>
                {t('nav.about')}
              </NavLink>
              <NavLink to="/VaccineList" icon={<Shield className="w-4 h-4" />}>
                {t('nav.vaccines')}
              </NavLink>
              <NavLink to="/ComboList" icon={<Shield className="w-4 h-4" />}>
                {t('nav.combos')}
              </NavLink>
              <NavLink to="/PriceList" icon={<DollarSign className="w-4 h-4" />}>
                {t('nav.prices')}
              </NavLink>
              <NavLink to="/Booking" icon={<Calendar className="w-4 h-4" />}>
                {t('nav.booking')}
              </NavLink>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Search className="h-5 w-5" />
              </button>
              
              {token ? (
                <Menu as="div" className="relative ml-3">
                  <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">User </span>
                    <User className="h-5 w-5 text-gray-500" />
                    <ChevronDown className="h-3 w-3 ml-1 text-gray-500" />
                  </Menu.Button>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        {/* Common menu items for all roles */}
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/User/Profile"
                              className={cn(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              {t('nav.profile')}
                            </Link>
                          )}
                        </Menu.Item>

                        {/* Admin specific menu items */}
                        {userRole === "ADMIN" && (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/Admin/Dashboard"
                                  className={cn(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <div className="flex items-center">
                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                    Dashboard
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/Admin/ManageAccount"
                                  className={cn(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Manage Accounts
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}

                        {/* Staff (Doctor/Nurse) specific menu items */}
                        {(userRole === "DOCTOR" || userRole === "NURSE") && (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/Staff/StaffPage"
                                  className={cn(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <div className="flex items-center">
                                    <Stethoscope className="h-4 w-4 mr-2" />
                                    Staff Portal
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/Staff/Vaccination"
                                  className={cn(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <div className="flex items-center">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Vaccination
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}

                        {/* User specific menu items */}
                        {userRole === "USER" && (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/User/Children"
                                  className={cn(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    {t('nav.children')}
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/User/Scheduling"
                                  className={cn(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {t('nav.schedule')}
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/User/History"
                                  className={cn(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <div className="flex items-center">
                                    <ClipboardList className="h-4 w-4 mr-2" />
                                    {t('nav.history')}
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}

                        {/* Logout button for all roles */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={cn(
                                active ? "bg-gray-100" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              <div className="flex items-center">
                                <LogOut className="h-4 w-4 mr-2" />
                                {t('nav.signout')}
                              </div>
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/Login">{t('nav.login')}</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-orange-500 hover:bg-orange-600">
                    <Link to="/Register">{t('nav.signup')}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

const NavLink = ({ to, children, icon }) => {
  return (
    <Link
      to={to}
      className="nav-link inline-flex items-center py-4 px-3 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
    >
      {icon}
      <span className="ml-1">{children}</span>
    </Link>
  );
};

export default MainNav; 