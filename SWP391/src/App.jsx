import "./App.css";
import Navigation from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import PriceListPage from "./pages/PriceListPage";
import LoginPage from "./pages/LoginPage";

function App() {
	return (
		<div>
			<Routes>
				<Route path={"/"} element={<HomePage />} />
				<Route path={"/AboutUs"} element={<AboutUsPage />} />
				<Route path={"/PriceList"} element={<PriceListPage />} />
				<Route path={"/Login"} element={<LoginPage />} />
			</Routes>
		</div>
	);
}

export default App;
