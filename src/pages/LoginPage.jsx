import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TokenUtils from "../utils/TokenUtils";
import MainNav from "../components/MainNav";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Eye, EyeOff, X } from "lucide-react";
import * as Yup from "yup";
import { Alert, AlertDescription } from "../components/ui/alert";

function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const accountAPI = "http://localhost:8080/auth/login";
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const validation = Yup.object({
		username: Yup.string().required("Username is required"),
		password: Yup.string().required("Password is required"),
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
				navigate("/");
			} else {
				const errorData = await response.json().catch(() => null);
				console.error("Login failed:", response.status, errorData);
				setError("Login failed. Please check your username and password.");
			}
		} catch (error) {
			console.error("Login error:", error);
			setError("An error occurred during login. Please try again.");
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
		<div className="min-h-screen flex flex-col relative">
			<MainNav />
			
			{/* Background image */}
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-blue-900/60 z-10"></div> {/* Overlay */}
				<img 
					src="/vaccination-background.jpg" 
					alt="Vaccination Background" 
					className="w-full h-full object-cover object-center"
				/>
			</div>
			
			{/* Content */}
			<div className="flex-1 flex justify-center items-center relative z-20 px-4">
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-md relative"
				>
					{/* Close button */}
					<button onClick={handleClose} 
						className="absolute top-4 right-4 transition-colors">
					<X className="h-5 w-5 text-gray-500 hover:!text-red-800" />
					</button>

					<div className="text-center mb-6">
						<h2 className="text-2xl font-bold text-[#1B1B1B] mb-2">Log in</h2>
						<p className="text-gray-600">
							Don't have an account?{" "}
							<Link to="/register" className="text-blue-600 hover:text-blue-700">
								Create Account
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
							<label htmlFor="username" className="text-sm font-medium text-gray-700">
								Username
							</label>
							<Input
								id="username"
								name="username"
								type="text"
								placeholder="Enter your username"
								value={formik.values.username}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className={`h-11 ${formik.touched.username && formik.errors.username ? "border-red-500" : "border-gray-300"}`}
							/>
							{formik.touched.username && formik.errors.username && (
								<p className="text-red-500 text-sm">{formik.errors.username}</p>
							)}
						</div>
						
						<div className="space-y-2">
							<div className="flex justify-between">
								<label htmlFor="password" className="text-sm font-medium text-gray-700">
									Password
								</label>
								<Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
									Forgot Password?
								</Link>
							</div>
							<div className="relative">
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className={`h-11 pr-10 ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"}`}
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
								<p className="text-red-500 text-sm">{formik.errors.password}</p>
							)}
						</div>

						<div className="flex items-center gap-2">
							<input type="checkbox" id="remember" className="rounded border-gray-300" />
							<label htmlFor="remember" className="text-sm text-gray-600">Remember Me</label>
						</div>

						<Button 
							type="submit" 
							className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base transition-all duration-200 hover:shadow-lg hover:scale-[1.02]" 
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Đang xử lý...
								</>
							) : "Đăng nhập"}
						</Button>

						<div className="text-center">
							<Link to="#" className="text-sm text-blue-600 hover:text-blue-700">
								Advanced options
							</Link>
						</div>
					</form>
				</motion.div>
			</div>
		</div>
	);
}

export default LoginPage;

