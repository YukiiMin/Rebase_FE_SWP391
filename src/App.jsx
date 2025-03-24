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
import VaccinationPage from "./staff/VaccinationPage";
import VaccinationManagement from "./staff/VaccinationManagement";
import DiagnosisPage from "./staff/DiagnosisPage";
// import StaffSignUp from "./staff/StaffSignUp";
// import StaffLogIn from "./staff/StaffLogIn";
// import StaffMenu from "./components/StaffMenu";
import ComboDetail from "./pages/ComboDetail";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";
import ProtocolManage from "./admin/ProtocolManage";
import TokenUtils from "./utils/TokenUtils";

function App() {
	const navigate = useNavigate();
	const api = "http://localhost:8080/auth/refresh";
	const [token, setToken] = useState(TokenUtils.getToken());
	const [decodedToken, setDecodedToken] = useState(null);
	const [stripePromise, setStripePromise] = useState(null);
	const [stripeError, setStripeError] = useState(null);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [authChecked, setAuthChecked] = useState(false);

	// Theo dõi thay đổi của localStorage - sử dụng sự kiện storage
	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === 'token' || e.key === null) {
				setToken(TokenUtils.getToken());
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	// Decode token khi token thay đổi
	useEffect(() => {
		if (token) {
			try {
				const decoded = TokenUtils.decodeToken(token);
				setDecodedToken(decoded);
			} catch (error) {
				console.error("Token decode error:", error);
				TokenUtils.removeToken();
				setToken(null);
				setDecodedToken(null);
			}
		} else {
			setDecodedToken(null);
		}
		setAuthChecked(true);
	}, [token]);

	useEffect(() => {
		// Initialize Stripe
		const initializeStripe = async () => {
			try {
				// const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
				// Get Stripe publishable key from environment variables
				const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
				console.log("Stripe key present:", !!stripeKey);
				
				if (!stripeKey) {
					setStripeError("Stripe key is missing. Check environment variables.");
					return;
				}
				
				// Initialize Stripe
				const stripe = await loadStripe(stripeKey);
				// if (!stripe) {
				// 	throw new Error('Failed to load Stripe');
				// }
				// setStripePromise(stripe);
				// console.log("Stripe initialized successfully");
								
				if (stripe) {
					console.log("Stripe initialized successfully");
				setStripePromise(stripe);
				} else {
					setStripeError("Failed to initialize Stripe. The loadStripe function returned null.");
				}
			} catch (error) {
				// console.error('Error initializing Stripe:', error);
				// // Handle error appropriately
				console.error("Error initializing Stripe:", error);
				setStripeError(`Failed to initialize Stripe: ${error.message}`);
			}
		};
		
		initializeStripe();
	}, []);

	// // Kiểm tra API
	// useEffect(() => {
	// 	const testAPI = async () => {
	// 		if (token && !isRefreshing && authChecked) {
	// 			try {
	// 				await axios.get("http://localhost:8080/test", {
	// 					headers: {
	// 						'Authorization': `Bearer ${token}`
	// 					}
	// 				});
	// 				console.log("API test successful");
	// 			} catch (error) {
	// 				console.log("API test error:", error);
	// 				// Không xử lý lỗi ở đây, để refresh token handler lo
	// 			}
	// 		}
	// 	};
		
	// 	testAPI();
	// }, [token, isRefreshing, authChecked]);

	// REMOVED: Đã xóa hàm testAPI vì gây lỗi 404 Not Found

	// Refresh token
	useEffect(() => {
		const refreshToken = async () => {
			     // Tạm bỏ qua việc refresh token khi dev
				 console.log("Skipping token refresh during development");
				 return;
				 
				 // ... phần code refresh token cũ
			// if (isRefreshing || !authChecked) return;
			
			// try {
			// 	if (token && decodedToken) {
			// 		// Kiểm tra token hết hạn
			// 		const currentTime = Date.now() / 1000;
			// 		if (decodedToken.exp < currentTime) {
			// 			console.log("Token expired, attempting to refresh");
			// 			setIsRefreshing(true);
						
			// 			const response = await axios.post(api, {}, {
			// 				headers: {
			// 					'Authorization': `Bearer ${token}`
			// 				}
			// 			});

			// 			if (response.data && response.data.token) {
			// 				TokenUtils.setToken(response.data.token);
			// 				setToken(response.data.token);
			// 				console.log("Token refreshed successfully");
			// 			} else {
			// 				throw new Error("Failed to refresh token");
			// 			}
			// 		}
			// 	}
			// } catch (error) {
			// 	console.error("Token refresh error:", error);
			// 	// Xử lý lỗi nhưng không tự động chuyển đến trang đăng nhập
			// 	if (error.message === "Unexpected end of JSON input") {
			// 		console.error("API responded with invalid JSON. Backend might be unavailable.");
			// 		// Thêm xử lý riêng cho lỗi parse JSON
			// 	}
				
			// 	if (window.location.pathname !== '/Login') {
			// 		TokenUtils.removeToken();
			// 		setToken(null);
			// 		setDecodedToken(null);
			// 	}
			// } finally {
			// 	setIsRefreshing(false);
			// }
		};

		refreshToken();
	}, [token, decodedToken, api, isRefreshing, authChecked]);

	const isLoggedIn = !!token && !!decodedToken;

	const ProtectedRoute = ({ element: Component, guestOnly, userOnly, adminOnly, doctorOnly, nurseOnly, ...rest }) => {
		if (!authChecked) {
			// Đang kiểm tra xác thực, hiển thị loading
			return <div>Loading...</div>;
		}
		
		if (guestOnly && isLoggedIn) {
			return <Navigate to="/" replace />;
		}
		
		if ((userOnly || adminOnly || doctorOnly || nurseOnly) && !isLoggedIn) {
			return <Navigate to="/login" replace />;
		}

		if (adminOnly && (decodedToken?.scope !== "ADMIN")) {
			console.log("Access denied: Admin role required, current role:", decodedToken?.scope);
			return <Navigate to="/" replace />;
		}

		if (doctorOnly && (decodedToken?.scope !== "DOCTOR")) {
			console.log("Access denied: Doctor role required, current role:", decodedToken?.scope);
			return <Navigate to="/" replace />;
		}

		if (nurseOnly && (decodedToken?.scope !== "NURSE")) {
			console.log("Access denied: Nurse role required, current role:", decodedToken?.scope);
			return <Navigate to="/" replace />;
		}

		return <Component {...rest} />;
	};

	// Cấu hình axios interceptor
	useEffect(() => {
		const interceptor = axios.interceptors.response.use(
			response => response,
			async error => {
				if (!error.response || isRefreshing) {
					console.log("Network error or already refreshing:", error.message);
					// Kiểm tra lỗi parse JSON
					if (error.message && error.message.includes("JSON")) {
						console.error("JSON parsing error, API might be unavailable");
					}
					return Promise.reject(error);
				}
				
				// Nếu token hết hạn (401) hoặc không có quyền (403)
				if (error.response.status === 401 || error.response.status === 403) {
					const originalRequest = error.config;
					
					// DEV MODE: Bỏ qua refresh token trong môi trường dev
					console.log("DEV MODE: Skipping token refresh in interceptor");
					return Promise.reject(error);
					
					// Tránh vòng lặp vô hạn
					/*
					if (!originalRequest._retry && token && decodedToken) {
						originalRequest._retry = true;
						
						try {
							setIsRefreshing(true);
							// Thử refresh token
							const response = await axios.post(api, {}, {
								headers: {
									'Authorization': `Bearer ${token}`
								}
							});
							
							if (response.data && response.data.token) {
								TokenUtils.setToken(response.data.token);
								setToken(response.data.token);
								
								// Sử dụng token mới cho request ban đầu
								axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
								originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
								
								return axios(originalRequest);
							}
						} catch (refreshError) {
							console.error("Failed to refresh token:", refreshError);
							// Xử lý lỗi nhưng không tự động chuyển đến trang đăng nhập
							if (window.location.pathname !== '/Login') {
								TokenUtils.removeToken();
								setToken(null);
								setDecodedToken(null);
							}
						} finally {
							setIsRefreshing(false);
						}
					} else if (window.location.pathname !== '/Login') {
						// Xóa token chỉ khi không phải đang ở trang Login
						TokenUtils.removeToken();
						setToken(null);
						setDecodedToken(null);
					}
					*/
				}
				
				return Promise.reject(error);
			}
		);
		
		return () => {
			axios.interceptors.response.eject(interceptor);
		};
	}, [token, decodedToken, api, isRefreshing]);

	return (
		<>
			{stripeError && (
				<div className="alert alert-danger m-3">
					<strong>Stripe Initialization Error:</strong> {stripeError}
				</div>
			)}
			
			<Elements stripe={stripePromise}>
				<Routes>
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
			<Route path={"/Staff/StaffPage"} element={<ProtectedRoute element={StaffHome} doctorOnly />} />
			<Route path={"/Staff/CheckIn"} element={<ProtectedRoute element={CheckIn} doctorOnly />} />
			<Route path={"/Staff/Schedule"} element={<ProtectedRoute element={Schedule} doctorOnly />} />
			 */}

					{/*Use this path only in developement. When role is OK, use the Admin and Staff only route */}
					<Route path={"/Admin/Dashboard"} element={<ProtectedRoute element={Dashboard} userOnly />} />
					<Route path={"/Admin/ManageAccount"} element={<ProtectedRoute element={AccountManage} userOnly />} />
					<Route path={"/Admin/VaccineManage"} element={<ProtectedRoute element={VaccineManage} userOnly />} />
					<Route path={"/Admin/ProtocolManage"} element={<ProtectedRoute element={ProtocolManage} userOnly />} />
					<Route path={"/Admin/ManageCombo"} element={<ProtectedRoute element={ComboManage} userOnly />} />
					<Route path={"/Admin/WorkSchedule"} element={<ProtectedRoute element={WorkSchedule} userOnly />} />

					{/* Staff routes - allow any authenticated user for development */}
					<Route path={"/Staff/StaffPage"} element={<ProtectedRoute element={StaffHome} userOnly />} />
					<Route path={"/Staff/CheckIn"} element={<ProtectedRoute element={CheckIn} userOnly />} />
					<Route path={"/Staff/Schedule"} element={<ProtectedRoute element={Schedule} userOnly />} />
					<Route path={"/Staff/Vaccination/:bookingId"} element={<ProtectedRoute element={VaccinationPage} userOnly />} />
					<Route path={"/Staff/Vaccination"} element={<ProtectedRoute element={VaccinationManagement} userOnly />} />
					<Route path={"/Staff/Diagnosis/:bookingId"} element={<ProtectedRoute element={DiagnosisPage} userOnly />} />
					{/* <Route path={"/StaffSignUp"} element={<StaffSignUp />} />
					<Route path={"/StaffLogIn"} element={<StaffLogIn />} />
					<Route path={"/Staff/Menu"} element={<ProtectedRoute element={StaffMenu} userOnly />} /> */}
				</Routes>
			</Elements>
		</>
	);
}

export default App;
