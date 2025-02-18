import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import PriceListPage from "./pages/PriceListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPAge";
import AccountManage from "./admin/AccountManage";
import VaccineManage from "./admin/VaccineManage";
import ComboManage from "./admin/ComboManage";

function App() {
	return (
		<Routes>
			<Route path={"/"} element={<HomePage />} />
			<Route path={"/AboutUs"} element={<AboutUsPage />} />
			<Route path={"/PriceList"} element={<PriceListPage />} />
			<Route path={"/Login"} element={<LoginPage />} />
			<Route path={"/Register"} element={<RegisterPage />} />

			{/*Admin page*/}
			<Route path={"/ManageAccount"} element={<AccountManage />} />
			<Route path={"/ManageVaccine"} element={<VaccineManage />} />
			<Route path={"/ManageCombo"} element={<ComboManage />} />
		</Routes>
	);
}

export default App;
