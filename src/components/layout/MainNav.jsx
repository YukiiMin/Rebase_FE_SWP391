import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  ChevronDown, 
  Shield,
  LogOut,
  Calendar,
  LayoutDashboard,
  Stethoscope
} from "lucide-react";
import TokenUtils from "../../utils/TokenUtils";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

function MainNav() {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dropdownRef = useRef(null);

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

  // Effect để đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    TokenUtils.removeToken();
    setToken(null);
    setUserRole(null);
    setIsDropdownOpen(false); // Đóng dropdown khi logout
    navigate("/Login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-blue-800 sticky top-0 z-50 w-full">
      {/* Main navigation */}
      <nav className="relative bg-blue-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">VaccineCare</h1>
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">{t('nav.tagline')}</span>
            </div>
          </Link>

          <button className="md:hidden flex items-center text-white" onClick={toggleMenu}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center justify-between">
            <ul className={`fixed md:static top-16 left-0 bg-blue-800 md:bg-transparent w-full md:w-auto md:flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-6 p-4 md:p-0 ${isMenuOpen ? 'block' : 'hidden md:flex'} shadow-md md:shadow-none`}>
              <li className="w-full md:w-auto">
                <Link to="/" className={`block py-2 md:py-1 w-full md:w-auto text-white hover:text-blue-200 relative ${location.pathname === '/' ? 'font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : ''}`}>
                  {t('nav.home')}
                </Link>
              </li>
              <li className="w-full md:w-auto">
                <Link to="/AboutUs" className={`block py-2 md:py-1 w-full md:w-auto text-white hover:text-blue-200 relative ${location.pathname === '/AboutUs' ? 'font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : ''}`}>
                  {t('nav.about')}
                </Link>
              </li>
              <li className="w-full md:w-auto">
                <Link to="/VaccineList" className={`block py-2 md:py-1 w-full md:w-auto text-white hover:text-blue-200 relative ${location.pathname === '/VaccineList' ? 'font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : ''}`}>
                  {t('nav.vaccines')}
                </Link>
              </li>
              <li className="w-full md:w-auto">
                <Link to="/ComboList" className={`block py-2 md:py-1 w-full md:w-auto text-white hover:text-blue-200 relative ${location.pathname === '/ComboList' ? 'font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : ''}`}>
                  {t('nav.combos')}
                </Link>
              </li>
              <li className="w-full md:w-auto">
                <Link to="/PriceList" className={`block py-2 md:py-1 w-full md:w-auto text-white hover:text-blue-200 relative ${location.pathname === '/PriceList' ? 'font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : ''}`}>
                  {t('nav.prices')}
                </Link>
              </li>
              <li className="w-full md:w-auto">
                <Link to="/Booking" className={`block py-2 md:py-1 w-full md:w-auto text-white hover:text-blue-200 relative ${location.pathname === '/Booking' ? 'font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : ''}`}>
                  {t('nav.booking')}
                </Link>
              </li>
              <li className="w-full md:w-auto md:hidden lg:block">
                <Link to="/Booking" className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Calendar className="w-5 h-5 mr-2" />
                  {t('nav.bookingAppointment')}
                </Link>
              </li>
            </ul>

            <div className="flex items-center space-x-3">
              <div className="mr-3">
                <LanguageSwitcher />
              </div>
              {!token && (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="px-3 py-1.5 text-white hover:text-blue-200">
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
                  >
                    {t('nav.register', 'Register')}
                  </Link>
                </div>
              )}
              {token && (
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className="flex items-center space-x-1 cursor-pointer bg-blue-700 rounded-full py-1 px-2" 
                    onClick={toggleDropdown}
                  >
                    <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white/70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ${isDropdownOpen ? 'block' : 'hidden'}`}>
                    <Link 
                      to="/User/Profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3 text-blue-600" />
                      {t('nav.profile')}
                    </Link>
                    
                    {userRole === "ADMIN" && (
                      <>
                        <Link 
                          to="/Admin/Dashboard" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-3 text-blue-600" />
                          {t('nav.dashboard')}
                        </Link>
                      </>
                    )}
                    
                    {(userRole === "DOCTOR" || userRole === "NURSE") && (
                      <Link 
                        to="/Staff/StaffPage" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Stethoscope className="w-4 h-4 mr-3 text-blue-600" />
                        {t('nav.staffPortal')}
                      </Link>
                    )}
                    
                    <button onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left">
                      <LogOut className="w-4 h-4 mr-3 text-blue-600" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default MainNav; 