import "./App.css";
import Navigation from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPAge";
import PriceListPage from "./pages/PriceListPage";

function App() {
	return (
		<div>
			<Navigation />
			<Routes>
				<Route path={"/"} element={<HomePage />} />
				<Route path={"/AboutUs"} element={<AboutUsPage />} />
				<Route path={"/PriceList"} element={<PriceListPage />} />
			</Routes>
		</div>
	);
}

export default App;
