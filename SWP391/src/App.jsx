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

function App() {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user"));
	const isLoggedIn = !!user;

	const ProtectedRoute = ({ element: Component, guestOnly, userOnly, adminOnly, ...rest }) => {
		if (guestOnly && isLoggedIn) {
			return <Navigate to="/" replace />;
		}
		if (userOnly && !isLoggedIn) {
			return <Navigate to="/login" replace />;
		}

		if (adminOnly && (!isLoggedIn || user.roleid !== "0")) {
			// Assuming admin roleid is "0"
			return <Navigate to="/" replace />;
		}

		return <Component {...rest} />;
	};

	return (
		<Routes>
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

			{/*Admin only*/}
			<Route path={"/ManageAccount"} element={<ProtectedRoute element={AccountManage} adminOnly />} />
			<Route path={"/ManageVaccine"} element={<ProtectedRoute element={VaccineManage} adminOnly />} />
			<Route path={"/ManageCombo"} element={<ProtectedRoute element={ComboManage} adminOnly />} />
			<Route path={"/WorkSchedule"} element={<ProtectedRoute element={WorkSchedule} adminOnly />} />
		</Routes>
	);
}

export default App;
