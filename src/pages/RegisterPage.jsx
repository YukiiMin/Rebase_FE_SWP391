import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { motion } from "framer-motion";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

function RegisterPage() {
	const navigate = useNavigate();
	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const validation = Yup.object({
		name: Yup.string().required("Name is required"),
		dob: Yup.date().required("Date of birth is required"),
		phone: Yup.string()
			.required("Phone number is required")
			.matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
		email: Yup.string().email("Invalid email format").required("Email is required"),
		username: Yup.string()
			.required("Username is required")
			.min(4, "Username must be at least 4 characters")
			.matches(/^[a-zA-Z0-9]+$/, "Username must not contain special characters"),
		password: Yup.string()
			.required("Password is required")
			.min(8, "Password must be at least 8 characters")
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: Yup.string()
			.required("Please confirm your password")
			.oneOf([Yup.ref("password"), null], "Passwords must match"),
	});

	const formik = useFormik({
		initialValues: {
			name: "",
			dob: "",
			phone: "",
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: validation,
		onSubmit: (values) => {
			handleRegister(values);
		},
	});

	const handleRegister = async (values) => {
		setLoading(true);
		setErrorMsg("");

		try {
			const response = await fetch("http://localhost:8080/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: values.name,
					dob: values.dob,
					phone: values.phone,
					email: values.email,
					username: values.username,
					password: values.password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setSuccess(true);
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			} else {
				setErrorMsg(data.message || "Registration failed. Please try again.");
			}
		} catch (error) {
			setErrorMsg("Server error. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Create your account
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Already have an account?{" "}
					<Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
						Sign in
					</Link>
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<Card>
					<CardHeader>
						<CardTitle>Register</CardTitle>
						<CardDescription>Fill out the form below to create your account</CardDescription>
					</CardHeader>
					<CardContent>
						{errorMsg && (
							<Alert variant="destructive" className="mb-6">
								<ExclamationTriangleIcon className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{errorMsg}</AlertDescription>
							</Alert>
						)}

						{success && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mb-6 p-4 rounded-md bg-green-50 text-green-800 flex items-center"
							>
								<CheckCircleIcon className="h-5 w-5 mr-2 text-green-400" />
								<div>
									<p className="font-medium">Registration successful!</p>
									<p className="text-sm">Redirecting you to login...</p>
								</div>
							</motion.div>
						)}

						<form onSubmit={formik.handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input
										id="name"
										name="name"
										value={formik.values.name}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder="Enter your full name"
										className={formik.touched.name && formik.errors.name ? "border-red-500" : ""}
									/>
									{formik.touched.name && formik.errors.name && (
										<p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="dob">Date of Birth</Label>
									<Input
										id="dob"
										name="dob"
										type="date"
										value={formik.values.dob}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className={formik.touched.dob && formik.errors.dob ? "border-red-500" : ""}
									/>
									{formik.touched.dob && formik.errors.dob && (
										<p className="text-red-500 text-sm mt-1">{formik.errors.dob}</p>
									)}
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input
										id="phone"
										name="phone"
										value={formik.values.phone}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder="10 digit phone number"
										className={formik.touched.phone && formik.errors.phone ? "border-red-500" : ""}
									/>
									{formik.touched.phone && formik.errors.phone && (
										<p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										name="email"
										type="email"
										value={formik.values.email}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder="Enter your email"
										className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
									/>
									{formik.touched.email && formik.errors.email && (
										<p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									name="username"
									value={formik.values.username}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder="Choose a username"
									className={formik.touched.username && formik.errors.username ? "border-red-500" : ""}
								/>
								{formik.touched.username && formik.errors.username && (
									<p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder="Create a password"
									className={formik.touched.password && formik.errors.password ? "border-red-500" : ""}
								/>
								{formik.touched.password && formik.errors.password && (
									<p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									value={formik.values.confirmPassword}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder="Confirm your password"
									className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""}
								/>
								{formik.touched.confirmPassword && formik.errors.confirmPassword && (
									<p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
								)}
							</div>

							<div className="pt-2">
								<Button type="submit" className="w-full" disabled={loading || success}>
									{loading ? "Registering..." : "Register"}
								</Button>
							</div>
						</form>
					</CardContent>
					<CardFooter className="flex justify-center border-t pt-6">
						<p className="text-sm text-gray-600">
							By creating an account, you agree to our{" "}
							<Link to="#" className="font-medium text-blue-600 hover:text-blue-500">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link to="#" className="font-medium text-blue-600 hover:text-blue-500">
								Privacy Policy
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

export default RegisterPage;
