import HomePage from "../pages/HomePage";
import AboutUs from "../pages/AboutUs";
import PriceListPage from "../pages/PriceListPage";
import BookingPage from "../pages/BookingPage";
import VaccineList from "../pages/VaccineList";
import ComboList from "../pages/ComboList";
import VaccineDetail from "../pages/VaccineDetail";
import ComboDetail from "../pages/ComboDetail";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import VerifyOTPPage from "../pages/VerifyOTPPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

const publicRoutes = [
  { path: "/", element: HomePage },
  { path: "/AboutUs", element: AboutUs },
  { path: "/PriceList", element: PriceListPage },
  { path: "/Booking", element: BookingPage },
  { path: "/VaccineList", element: VaccineList },
  { path: "/ComboList", element: ComboList },
  { path: "/VaccineDetail/:id", element: VaccineDetail },
  { path: "/ComboDetail/:id", element: ComboDetail },
];

// Routes chỉ dành cho khách (chưa đăng nhập)
const guestOnlyRoutes = [
  { path: "/Login", element: LoginPage },
  { path: "/Register", element: RegisterPage },
  { path: "/ForgotPassword", element: ForgotPasswordPage },
  { path: "/VerifyOTP", element: VerifyOTPPage },
  { path: "/ResetPassword", element: ResetPasswordPage },
];

export { publicRoutes, guestOnlyRoutes };
