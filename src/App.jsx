// Using Tailwind CSS for styling instead of custom CSS
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import PriceListPage from "./pages/PriceListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VaccineDetail from "./pages/VaccineDetail";
import AccountManage from "./pages/admin/AccountManage";
import VaccineManage from "./pages/admin/VaccineManage";
import ComboManage from "./pages/admin/ComboManage";
import WorkSchedule from "./pages/admin/WorkSchedule";
import BookingPage from "./pages/BookingPage";
import VaccineList from "./pages/VaccineList";
import ComboList from "./pages/ComboList";
import UserProfile from "./pages/UserProfile";
import UserChildren from "./pages/UserChildren";
import UserScheduling from "./pages/UserScheduling";
import UserHistory from "./pages/UserHistory";
import HealthRecord from "./pages/HealthRecord";
import Dashboard from "./pages/admin/Dashboard";
import StaffHome from "./pages/staff/StaffHome";
import CheckIn from "./pages/staff/CheckIn";
import Schedule from "./pages/staff/Schedule";
import TransactionPage from "./pages/TransactionPage";
import VaccinationPage from "./pages/staff/VaccinationPage";
import VaccinationManagement from "./pages/staff/VaccinationManagement";
import DiagnosisPage from "./pages/staff/DiagnosisPage";
import ComboDetail from "./pages/ComboDetail";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtocolManage from "./pages/admin/ProtocolManage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
// Import API từ cấu trúc mới
import { apiService, API_ENDPOINTS } from "./api";
import TokenUtils from "./utils/TokenUtils";
import axios from "axios";

// Create ErrorBoundary component for error handling
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, errorMessage: "" };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.log('Error caught by boundary:', error, errorInfo);
		this.setState({ 
			errorMessage: error.message || "An unexpected error occurred"
		});
	}

	render() {
		// if (this.state.hasError) {
		// 	return (
		// 		<div style={{ padding: "20px", textAlign: "center" }}>
		// 			<h2>Something went wrong</h2>
		// 			<p>{this.state.errorMessage}</p>
		// 			<button 
		// 				onClick={() => window.location.reload()} 
		// 				style={{ 
		// 					padding: "8px 16px", 
		// 					backgroundColor: "#0066cc", 
		// 					color: "white", 
		// 					border: "none", 
		// 					borderRadius: "4px",
		// 					cursor: "pointer", 
		// 					marginTop: "10px" 
		// 				}}
		// 			>
		// 				Refresh Page
		// 			</button>
		// 		</div>
		// 	);
		// }
		return this.props.children;
	}
}

function App() {
	const navigate = useNavigate();
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
				const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
				console.log("Stripe key present:", !!stripeKey);
				
				if (!stripeKey) {
					setStripeError("Stripe key is missing. Check environment variables.");
					return;
				}
				
				// Initialize Stripe
				const stripe = await loadStripe(stripeKey);
								
				if (stripe) {
					console.log("Stripe initialized successfully");
				    setStripePromise(stripe);
				} else {
					setStripeError("Failed to initialize Stripe. The loadStripe function returned null.");
				}
			} catch (error) {
				console.error("Error initializing Stripe:", error);
				setStripeError(`Failed to initialize Stripe: ${error.message}`);
			}
		};
		
		initializeStripe();
	}, []);

	// Refresh token - sử dụng TokenUtils
	useEffect(() => {
		const checkAuthentication = async () => {
			// Tạm bỏ qua việc refresh token khi dev
			console.log("Skipping token refresh during development");
			return;
			
			// Khi muốn bật refresh token, dùng code dưới đây
			/*
			if (isRefreshing || !authChecked) return;
			
			try {
				if (token) {
					setIsRefreshing(true);
					
					// Sử dụng TokenUtils để kiểm tra và refresh token
					const authCheck = await TokenUtils.checkAndRefreshToken();
					
					if (authCheck.success && authCheck.needsRefresh) {
						console.log("Token refreshed successfully");
						setToken(authCheck.accessToken);
					} else if (!authCheck.success && window.location.pathname !== '/Login') {
						console.error("Token refresh failed:", authCheck.message);
						TokenUtils.removeToken();
						setToken(null);
						setDecodedToken(null);
					}
				}
			} catch (error) {
				console.error("Auth check error:", error);
				if (window.location.pathname !== '/Login') {
					TokenUtils.removeToken();
					setToken(null);
					setDecodedToken(null);
				}
			} finally {
				setIsRefreshing(false);
			}
			*/
		};

		checkAuthentication();
	}, [token, authChecked, isRefreshing]);

	const isLoggedIn = !!token && !!decodedToken;

	const ProtectedRoute = ({ element: Component, guestOnly, userOnly, adminOnly, doctorOnly, nurseOnly, ...rest }) => {
		if (!authChecked) {
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
					
					// Khi muốn bật refresh token, dùng code dưới đây
					/*
					if (!originalRequest._retry && token) {
						originalRequest._retry = true;
						
						try {
							setIsRefreshing(true);
							
							// Sử dụng TokenUtils để refresh token
							const refreshResult = await TokenUtils.refreshToken();
							
							if (refreshResult.success) {
								// Cập nhật token và retry request
								axios.defaults.headers.common['Authorization'] = `Bearer ${refreshResult.accessToken}`;
								originalRequest.headers['Authorization'] = `Bearer ${refreshResult.accessToken}`;
								
								setToken(refreshResult.accessToken);
								return axios(originalRequest);
							} else {
								// Refresh token thất bại, đăng xuất
								if (window.location.pathname !== '/Login') {
									TokenUtils.removeToken();
									setToken(null);
									setDecodedToken(null);
								}
							}
						} catch (refreshError) {
							console.error("Failed to refresh token:", refreshError);
							if (window.location.pathname !== '/Login') {
								TokenUtils.removeToken();
								setToken(null);
								setDecodedToken(null);
							}
						} finally {
							setIsRefreshing(false);
						}
					} else if (window.location.pathname !== '/Login') {
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
	}, [token, decodedToken, isRefreshing]);

	return (
		<ErrorBoundary>
			{stripeError && (
				<div className="alert alert-danger m-3">
					<strong>Stripe Initialization Error:</strong> {stripeError}
				</div>
			)}
			
			<Elements stripe={stripePromise}>
				<Routes>
					<Route path={"/"} element={<HomePage />} />
					<Route path={"/AboutUs"} element={<AboutUs />} />
					<Route path={"/PriceList"} element={<PriceListPage />} />
					<Route path={"/Booking"} element={<BookingPage />} />
					<Route path={"/VaccineList"} element={<VaccineList />} />
					<Route path={"/ComboList"} element={<ComboList />} />
					<Route path={"/VaccineDetail/:id"} element={<VaccineDetail />} />
					<Route path={"/ComboDetail/:id"} element={<ComboDetail />} />

					{/*Guest only*/}
					<Route path={"/Login"} element={<ProtectedRoute element={LoginPage} guestOnly />} />
					<Route path={"/Register"} element={<ProtectedRoute element={RegisterPage} guestOnly />} />
					<Route path={"/forgot-password"} element={<ProtectedRoute element={ForgotPasswordPage} guestOnly />} />
					<Route path={"/VerifyOTP"} element={<ProtectedRoute element={VerifyOTPPage} guestOnly />} />
					<Route path={"/ResetPassword"} element={<ProtectedRoute element={ResetPasswordPage} guestOnly />} />

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
				</Routes>
			</Elements>
		</ErrorBoundary>
	);
}

export default App;