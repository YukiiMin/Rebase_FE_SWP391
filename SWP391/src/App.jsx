import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import PriceListPage from "./pages/PriceListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VaccineDetail from "./pages/VaccineDetail";
import AccountManage from "./admin/AccountManage";
import VaccineManage from "./admin/VaccineManage";
import ComboManage from "./admin/ComboManage";
import WorkSchedule from "./admin/WorkSchedule";
import BookingPage from "./pages/BookingPage";
import VaccineList from "./pages/VaccineList";
import ComboList from "./pages/ComboList";
import UserProfile from "./pages/UserProfile";
import UserChildren from "./pages/UserChildren";
import UserScheduling from "./pages/UserScheduling";
import UserHistory from "./pages/UserHistory";
import HealthRecord from "./pages/HealthRecord";
import Dashboard from "./admin/Dashboard";
import StaffHome from "./staff/StaffHome";
import CheckIn from "./staff/CheckIn";
import Schedule from "./staff/Schedule";
import TransactionPage from "./pages/TransactionPage";
import { jwtDecode } from "jwt-decode";

function App() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	let decodedToken = "";
	if (token) {
		decodedToken = jwtDecode(token);
	}

	const isLoggedIn = !!token;

	const ProtectedRoute = ({ element: Component, guestOnly, userOnly, adminOnly, staffOnly, ...rest }) => {
		if (guestOnly && isLoggedIn) {
			return <Navigate to="/" replace />;
		}
		if (userOnly && !isLoggedIn) {
			return <Navigate to="/login" replace />;
		}

		if (adminOnly && (!isLoggedIn || decodedToken.scope !== "ADMIN")) {
			// Admin roleid is "ADMIN"
			return <Navigate to="/" replace />;
		}

		if (staffOnly && (!isLoggedIn || decodedToken.scope !== "STAFF")) {
			// Staff roleid is "STAFF"
			return <Navigate to="/" replace />;
		}

		return <Component {...rest} />;
	};

	return (
		<Routes>
			{console.log(decodedToken)}
			<Route path={"/"} element={<HomePage />} />
			<Route path={"/AboutUs"} element={<AboutUsPage />} />
			<Route path={"/PriceList"} element={<PriceListPage />} />
			<Route path={"/Booking"} element={<BookingPage />} />
			<Route path={"/VaccineList"} element={<VaccineList />} />
			<Route path={"/ComboList"} element={<ComboList />} />
			<Route path={"/VaccineDetail/:id"} element={<VaccineDetail />} />

			{/*Guest only*/}
			<Route path={"/Login"} element={<ProtectedRoute element={LoginPage} guestOnly />} />
			<Route path={"/Register"} element={<ProtectedRoute element={RegisterPage} guestOnly />} />

			{/*User only */}
			<Route path={"/Profile"} element={<ProtectedRoute element={UserProfile} userOnly />} />
			<Route path={"/Children"} element={<ProtectedRoute element={UserChildren} userOnly />} />
			<Route path={"/Scheduling"} element={<ProtectedRoute element={UserScheduling} userOnly />} />
			<Route path={"/History"} element={<ProtectedRoute element={UserHistory} userOnly />} />
			<Route path={"/Record"} element={<ProtectedRoute element={HealthRecord} userOnly />} />
			<Route path={"/Transaction"} element={<ProtectedRoute element={TransactionPage} userOnly />} />

			{/*Admin only*/}
			{/* 
			<Route path={"/Dashboard"} element={<ProtectedRoute element={Dashboard} adminOnly />} />
			<Route path={"/ManageAccount"} element={<ProtectedRoute element={AccountManage} adminOnly />} />
			<Route path={"/ManageVaccine"} element={<ProtectedRoute element={VaccineManage} adminOnly />} />
			<Route path={"/ManageCombo"} element={<ProtectedRoute element={ComboManage} adminOnly />} />
			<Route path={"/WorkSchedule"} element={<ProtectedRoute element={WorkSchedule} adminOnly />} />
			 */}

			{/*Staff only */}
			{/* 
			<Route path={"/StaffPage"} element={<ProtectedRoute element={StaffHome} staffOnly />} />
			<Route path={"/CheckIn"} element={<ProtectedRoute element={CheckIn} staffOnly />} />
			<Route path={"/Schedule"} element={<ProtectedRoute element={Schedule} staffOnly />} />
			 */}

			{/*Use this path only in developement. When role is OK, use the Admin and Staff only route */}
			<Route path={"/Dashboard"} element={<ProtectedRoute element={Dashboard} userOnly />} />
			<Route path={"/ManageAccount"} element={<ProtectedRoute element={AccountManage} userOnly />} />
			<Route path={"/ManageVaccine"} element={<ProtectedRoute element={VaccineManage} userOnly />} />
			<Route path={"/ManageCombo"} element={<ProtectedRoute element={ComboManage} userOnly />} />
			<Route path={"/WorkSchedule"} element={<ProtectedRoute element={WorkSchedule} userOnly />} />
			<Route path={"/StaffPage"} element={<ProtectedRoute element={StaffHome} userOnly />} />
			<Route path={"/CheckIn"} element={<ProtectedRoute element={CheckIn} userOnly />} />
			<Route path={"/Schedule"} element={<ProtectedRoute element={Schedule} userOnly />} />
		</Routes>
	);
}

export default App;
