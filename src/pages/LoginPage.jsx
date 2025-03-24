import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TokenUtils from "../utils/TokenUtils";
import MainNav from "../components/MainNav";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import * as Yup from "yup";

function LoginPage() {
	const navigate = useNavigate();
	const accountAPI = "http://localhost:8080/auth/login";
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

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

	return (
		<div className="min-h-screen flex flex-col relative">
			<MainNav />
			
			{/* Background image */}
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-blue-900/60 z-10"></div> {/* Overlay */}
				<img 
					src="https://th.bing.com/th/id/OIP.6PZQuYOccPCKkGIyNl2ZiQHaFj?rs=1&pid=ImgDetMain" 
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
					className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-md"
				>
					<div className="mb-6 text-center">
						<h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome,</h1>
						<p className="text-gray-700">Sign in to continue!</p>
					</div>
					
					<form onSubmit={formik.handleSubmit} className="space-y-5">
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
								className={`h-12 px-4 bg-white/80 ${formik.touched.username && formik.errors.username ? "border-red-500" : "border-gray-300"}`}
							/>
							{formik.touched.username && formik.errors.username && (
								<p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
							)}
						</div>
						
						<div className="space-y-2">
							<div className="flex justify-between">
								<label htmlFor="password" className="text-sm font-medium text-gray-700">
									Password
								</label>
								<Link to="/forget-password" className="text-sm text-blue-600 hover:text-blue-500">
									Forgot Password?
								</Link>
							</div>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								value={formik.values.password}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className={`h-12 px-4 bg-white/80 ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"}`}
							/>
							{formik.touched.password && formik.errors.password && (
								<p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
							)}
						</div>
						
						{error && (
							<div className="bg-red-50 p-3 rounded-md flex items-start gap-2">
								<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
								<p className="text-sm text-red-700">{error}</p>
							</div>
						)}
						
						<Button 
							type="submit" 
							className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base" 
							disabled={isLoading}
						>
							{isLoading ? "Logging in..." : "Login"}
						</Button>
					</form>
					
					<p className="mt-8 text-center text-sm text-gray-700">
						I'm a new user, <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Sign Up</Link>
					</p>
				</motion.div>
			</div>
		</div>
	);
}

export default LoginPage;

