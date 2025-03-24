import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TokenUtils from "../utils/TokenUtils";
import MainNav from "../components/MainNav";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";

function LoginPage() {
	const navigate = useNavigate();
	// const accountAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/account";
	const accountAPI = "http://localhost:8080/auth/login";
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
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
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			
			<div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-center"
				>
					<Card className="w-full max-w-md">
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
							<CardDescription className="text-center">
								Enter your credentials to access your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={formik.handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="username" className="text-sm font-medium">
										Username
									</label>
									<Input
										id="username"
										name="username"
										type="text"
										placeholder="Enter your username"
										value={formik.values.username}
										onChange={formik.handleChange}
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="password" className="text-sm font-medium">
										Password
									</label>
									<Input
										id="password"
										name="password"
										type="password"
										placeholder="••••••••"
										value={formik.values.password}
										onChange={formik.handleChange}
									/>
								</div>
								{error && (
									<div className="text-sm text-red-500">{error}</div>
								)}
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Logging in..." : "Log in"}
								</Button>
							</form>
							
							<div className="relative my-6">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-muted-foreground" style={{ clipPath: "inset(0 0 -2px 0)" }}>
								Or continue with
									</span>
								</div>
							</div>

							
							<Button variant="outline" className="w-full" type="button">
								<svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
									<path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
								</svg>
								Google
							</Button>
						</CardContent>
						<CardFooter className="flex flex-col items-center">
							<p className="text-sm text-center mt-2">
								New to our website?{" "}
								<Link to="/Register" className="font-medium text-primary hover:underline">
									Register
								</Link>
							</p>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}

export default LoginPage;
