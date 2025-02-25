import "./App.css";
import { Route, Routes } from "react-router-dom";
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
	return (
		<Routes>
			<Route path={"/"} element={<HomePage />} />
			<Route path={"/AboutUs"} element={<AboutUsPage />} />
			<Route path={"/PriceList"} element={<PriceListPage />} />
			<Route path={"/Booking"} element={<BookingPage />} />
			<Route path={"/Login"} element={<LoginPage />} />
			<Route path={"/Register"} element={<RegisterPage />} />
			<Route path={"/VaccineList"} element={<VaccineList />} />
			<Route path={"/ComboList"} element={<ComboList />} />
			<Route path={"/VaccineDetail"} element={<VaccineDetail />} />

			<Route path={"/Profile"} element={<UserProfile />} />

			{/*Admin page*/}
			<Route path={"/ManageAccount"} element={<AccountManage />} />
			<Route path={"/ManageVaccine"} element={<VaccineManage />} />
			<Route path={"/ManageCombo"} element={<ComboManage />} />
			<Route path={"/WorkSchedule"} element={<WorkSchedule />} />
		</Routes>
	);
}

export default App;
