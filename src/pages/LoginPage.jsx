import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TokenUtils from "../utils/TokenUtils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Eye, EyeOff, X, Phone, Shield } from "lucide-react";
import * as Yup from "yup";
import { Alert, AlertDescription } from "../components/ui/alert";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";

function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const accountAPI = "http://localhost:8080/auth/login";
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { t } = useTranslation();
	
	// Lưu lại trang trước đó khi component mount
	useEffect(() => {
		// Không lưu lại các trang auth khác
		if (!location.pathname.includes("/login") && 
			!location.pathname.includes("/register") && 
			!location.pathname.includes("/forgot-password") && 
			!location.pathname.includes("/verify-otp") && 
			!location.pathname.includes("/reset-password")) {
			sessionStorage.setItem("redirectUrl", location.pathname + location.search);
		}
	}, [location]);

	const validation = Yup.object({
		username: Yup.string().required(t('register.errors.required')),
		password: Yup.string().required(t('register.errors.required')),
	});

	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		validationSchema: validation,
		onSubmit: (values) => {
			handleLogin(values);
		},
	});

	const handleLogin = async (values) => {
		setIsLoading(true);
		setError("");
		try {
			const response = await fetch(accountAPI, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (response.ok) {
				const data = await response.json();
				const token = data.result.token;
				
				// Sử dụng TokenUtils để lưu token
				TokenUtils.setToken(token);
				
				console.log("Login successful");
				
				// Điều hướng đến trang trước đó hoặc trang chủ
				const redirectUrl = sessionStorage.getItem("redirectUrl") || "/";
				navigate(redirectUrl);
				
				// Xóa redirectUrl sau khi đã sử dụng
				sessionStorage.removeItem("redirectUrl");
			} else {
				const errorData = await response.json().catch(() => null);
				console.error("Login failed:", response.status, errorData);
				setError(t('login.errors.invalidCredentials'));
			}
		} catch (error) {
			console.error("Login error:", error);
			setError(t('login.errors.serverError'));
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		// Nếu có state.from, quay lại trang đó, nếu không thì về homepage
		if (location.state?.from) {
			navigate(location.state.from);
		} else {
			navigate("/");
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			{/* Header */}
			<header className="bg-blue-800 py-4 px-6">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<Link to="/" className="flex items-center space-x-2">
						<div className="bg-blue-700 p-2 rounded-full flex items-center justify-center">
							<Shield className="h-5 w-5 text-white" />
							<span className="text-lg font-bold text-white ml-2">VaccineCare</span>
						</div>
					</Link>
					
					<a href="tel:0903731347" className="flex items-center text-white hover:text-blue-200 transition-colors">
						<Phone className="h-5 w-5 mr-2" />
						<span>0903731347</span>
					</a>
				</div>
			</header>
			
			{/* Main content */}
			<main className="flex-1 flex flex-col items-center justify-center py-10 px-4">
				<h1 className="text-3xl font-bold text-blue-900 mb-8">{t('login.title')}</h1>
				
				{/* Login Form */}
				<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
					<div className="text-center mb-6">
						<h2 className="text-2xl font-bold text-gray-900">{t('login.heading')}</h2>
						<p className="text-gray-600 mt-2">
							{t('login.noAccount')}{" "}
							<Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
								{t('login.createAccount')}
							</Link>
						</p>
					</div>

					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={formik.handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label htmlFor="username" className="block text-sm font-medium text-gray-700">
								{t('login.username')}
							</label>
							<Input
								id="username"
								name="username"
								type="text"
								placeholder={t('login.usernamePlaceholder')}
								value={formik.values.username}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className={`w-full h-11 px-3 py-2 ${formik.touched.username && formik.errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
							/>
							{formik.touched.username && formik.errors.username && (
								<p className="text-sm text-red-600">{formik.errors.username}</p>
							)}
						</div>
						
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="block text-sm font-medium text-gray-700">
									{t('login.password')}
								</label>
								<Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
									{t('login.forgotPassword')}
								</Link>
							</div>
							<div className="relative">
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder={t('login.passwordPlaceholder')}
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className={`w-full h-11 px-3 py-2 pr-10 ${formik.touched.password && formik.errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
									tabIndex="-1"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
							{formik.touched.password && formik.errors.password && (
								<p className="text-sm text-red-600">{formik.errors.password}</p>
							)}
						</div>

						<div className="flex items-center justify-between mt-6">
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
							>
								{isLoading ? (
									<>
										<Loader2 className="animate-spin h-4 w-4 mr-2" />
										{t('login.loggingIn')}
									</>
								) : (
									t('login.login')
								)}
							</Button>
						</div>
					</form>
				</div>
			</main>
			
			<Footer />
		</div>
	);
}

export default LoginPage;

