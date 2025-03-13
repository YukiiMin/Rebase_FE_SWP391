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
import ComboDetail from "./pages/ComboDetail";

function App() {
	const navigate = useNavigate();
	const api = "http://localhost:8080/auth/refresh";
	const token = localStorage.getItem("token");
	const decodedToken = token ? jwtDecode(token) : null;

	// const refreshToken = async (token) => {
	// 	try {
	// 		const response = await fetch(`${api}`, {
	// 			method: "POST",
	// 			body: JSON.stringify(token),
	// 		});
	// 		if (response.ok) {
	// 			console.log("Refreshing token complete");
	// 			const data = response.json();
	// 			const newToken = data.result;
	// 			console.log(newToken);
	// 		} else {
	// 			console.error("Refreshing token failed: ", response.status);
	// 		}
	// 	} catch (err) {
	// 		console.log("Something went wrong when refreshing token: ", err);
	// 	}
	// };

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
			<Route path={"/ComboDetail/:id"} element={<ComboDetail />} />

			{/*Guest only*/}
			<Route path={"/Login"} element={<ProtectedRoute element={LoginPage} guestOnly />} />
			<Route path={"/Register"} element={<ProtectedRoute element={RegisterPage} guestOnly />} />

			{/*User only */}
			<Route path={"/User/Profile"} element={<ProtectedRoute element={UserProfile} userOnly />} />
			<Route path={"/User/Children"} element={<ProtectedRoute element={UserChildren} userOnly />} />
			<Route path={"/User/Scheduling"} element={<ProtectedRoute element={UserScheduling} userOnly />} />
			<Route path={"/User/History"} element={<ProtectedRoute element={UserHistory} userOnly />} />
			<Route path={"/User/Record"} element={<ProtectedRoute element={HealthRecord} userOnly />} />

			<Route path={"/Transaction"} element={<ProtectedRoute element={TransactionPage} userOnly />} />

			{/*Admin only*/}
			{/* 
			<Route path={"/Admin/Dashboard"} element={<ProtectedRoute element={Dashboard} adminOnly />} />
			<Route path={"/Admin/ManageAccount"} element={<ProtectedRoute element={AccountManage} adminOnly />} />
			<Route path={"/Admin/ManageVaccine"} element={<ProtectedRoute element={VaccineManage} adminOnly />} />
			<Route path={"/Admin/ManageCombo"} element={<ProtectedRoute element={ComboManage} adminOnly />} />
			<Route path={"/Admin/WorkSchedule"} element={<ProtectedRoute element={WorkSchedule} adminOnly />} />
			 */}

			{/*Staff only */}
			{/* 
			<Route path={"/Staff/StaffPage"} element={<ProtectedRoute element={StaffHome} staffOnly />} />
			<Route path={"/Staff/CheckIn"} element={<ProtectedRoute element={CheckIn} staffOnly />} />
			<Route path={"/Staff/Schedule"} element={<ProtectedRoute element={Schedule} staffOnly />} />
			 */}

			{/*Use this path only in developement. When role is OK, use the Admin and Staff only route */}
			<Route path={"/Admin/Dashboard"} element={<ProtectedRoute element={Dashboard} userOnly />} />
			<Route path={"/Admin/ManageAccount"} element={<ProtectedRoute element={AccountManage} userOnly />} />
			<Route path={"/Admin/ManageVaccine"} element={<ProtectedRoute element={VaccineManage} userOnly />} />
			<Route path={"/Admin/ManageCombo"} element={<ProtectedRoute element={ComboManage} userOnly />} />
			<Route path={"/Admin/WorkSchedule"} element={<ProtectedRoute element={WorkSchedule} userOnly />} />
			<Route path={"/Staff/StaffPage"} element={<ProtectedRoute element={StaffHome} userOnly />} />
			<Route path={"/Staff/CheckIn"} element={<ProtectedRoute element={CheckIn} userOnly />} />
			<Route path={"/Staff/Schedule"} element={<ProtectedRoute element={Schedule} userOnly />} />
		</Routes>
	);
}

export default App;
