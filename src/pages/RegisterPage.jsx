import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Eye, EyeOff, Loader2, X } from "lucide-react";
import MainNav from "../components/MainNav";
import { useTranslation } from "react-i18next";

function RegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();
	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState("weak");

	const validation = Yup.object({
		firstName: Yup.string()
			.required(t('register.errors.required'))
			.max(100, t('register.errors.firstNameLength')),
		lastName: Yup.string()
			.required(t('register.errors.required'))
			.max(100, t('register.errors.lastNameLength')),
		dob: Yup.date().required(t('register.errors.required')),
		phone: Yup.string()
			.required(t('register.errors.required'))
			.matches(/^0[0-9]{9}$/, t('register.errors.phoneFormat')),
		email: Yup.string()
			.email(t('register.errors.invalidEmail'))
			.required(t('register.errors.required'))
			.max(50, t('register.errors.emailLength'))
			.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, t('register.errors.invalidEmail')),
		username: Yup.string()
			.required(t('register.errors.required'))
			.min(6, t('register.errors.usernameLength'))
			.max(30, t('register.errors.usernameLength'))
			.matches(/^[a-zA-Z0-9]+$/, t('register.errors.invalidUsername')),
		gender: Yup.string()
			.required(t('register.errors.required'))
			.oneOf(["MALE", "FEMALE", "OTHER"], t('register.errors.invalidGender')),
		password: Yup.string()
			.required(t('register.errors.required'))
			.min(8, t('register.errors.passwordLength'))
			.matches(/(?=.*[a-z])/, t('register.errors.lowercase'))
			.matches(/(?=.*[A-Z])/, t('register.errors.uppercase'))
			.matches(/(?=.*\d)/, t('register.errors.number'))
			.matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, t('register.errors.special')),
		confirmPassword: Yup.string()
			.required(t('register.errors.required'))
			.oneOf([Yup.ref("password"), null], t('register.errors.passwordMatch')),
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			dob: "",
			phone: "",
			email: "",
			username: "",
			gender: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: validation,
		onSubmit: (values) => {
			if (passwordStrength === "weak") {
				setErrorMsg("Vui lòng tạo mật khẩu mạnh hơn");
				return;
			}
			handleRegister(values);
		},
	});

	// Đánh giá độ mạnh của mật khẩu
	useEffect(() => {
		const password = formik.values.password;
		if (!password) {
			setPasswordStrength("weak");
			return;
		}
		
		let score = 0;
		// Kiểm tra độ dài
		if (password.length >= 8) score++;
		// Kiểm tra chữ thường
		if (/[a-z]/.test(password)) score++;
		// Kiểm tra chữ hoa
		if (/[A-Z]/.test(password)) score++;
		// Kiểm tra số
		if (/\d/.test(password)) score++;
		// Kiểm tra ký tự đặc biệt
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
		
		if (score <= 2) setPasswordStrength("weak");
		else if (score <= 4) setPasswordStrength("medium");
		else setPasswordStrength("strong");
	}, [formik.values.password]);

	// Render progress bar dựa trên độ mạnh của mật khẩu
	const renderPasswordStrength = () => {
		let width = "0%";
		let color = "bg-gray-200";
		let text = "";
		
		if (passwordStrength === "weak") {
			width = "33%";
			color = "bg-red-500";
			text = t('register.passwordStrength.weak');
		} else if (passwordStrength === "medium") {
			width = "66%";
			color = "bg-yellow-500";
			text = t('register.passwordStrength.medium');
		} else if (passwordStrength === "strong") {
			width = "100%";
			color = "bg-green-500";
			text = t('register.passwordStrength.strong');
		}
		
		return (
			<div className="mt-2">
				<div className="flex justify-between text-sm mb-1">
					<span>{t('register.passwordStrength.title')}</span>
					<span className={`font-medium ${
						passwordStrength === "weak" ? "text-red-500" : 
						passwordStrength === "medium" ? "text-yellow-500" : "text-green-500"
					}`}>{text}</span>
				</div>
				<div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
					<div className={`h-full ${color}`} style={{ width }} />
				</div>
				
				{formik.values.password && (
					<div className="mt-3 text-sm">
						<p className="font-medium mb-1">{t('register.passwordStrength.requirements')}</p>
						<ul className="space-y-1">
							<li className={`flex items-center ${formik.values.password.length >= 8 ? "text-green-500" : "text-gray-500"}`}>
								<CheckCircle2 className={`h-4 w-4 mr-2 ${formik.values.password.length >= 8 ? "text-green-500" : "text-gray-300"}`} />
								{t('register.passwordStrength.length')}
							</li>
							<li className={`flex items-center ${/[a-z]/.test(formik.values.password) ? "text-green-500" : "text-gray-500"}`}>
								<CheckCircle2 className={`h-4 w-4 mr-2 ${/[a-z]/.test(formik.values.password) ? "text-green-500" : "text-gray-300"}`} />
								{t('register.passwordStrength.lowercase')}
							</li>
							<li className={`flex items-center ${/[A-Z]/.test(formik.values.password) ? "text-green-500" : "text-gray-500"}`}>
								<CheckCircle2 className={`h-4 w-4 mr-2 ${/[A-Z]/.test(formik.values.password) ? "text-green-500" : "text-gray-300"}`} />
								{t('register.passwordStrength.uppercase')}
							</li>
							<li className={`flex items-center ${/\d/.test(formik.values.password) ? "text-green-500" : "text-gray-500"}`}>
								<CheckCircle2 className={`h-4 w-4 mr-2 ${/\d/.test(formik.values.password) ? "text-green-500" : "text-gray-300"}`} />
								{t('register.passwordStrength.number')}
							</li>
							<li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password) ? "text-green-500" : "text-gray-500"}`}>
								<CheckCircle2 className={`h-4 w-4 mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password) ? "text-green-500" : "text-gray-300"}`} />
								{t('register.passwordStrength.special')}
							</li>
						</ul>
					</div>
				)}
			</div>
		);
	};

	const handleRegister = async (values) => {
		setLoading(true);
		setErrorMsg("");

		try {
			const response = await fetch("http://localhost:8080/users/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: values.firstName,
					lastName: values.lastName,
					dob: values.dob,
					phoneNumber: values.phone,
					email: values.email,
					username: values.username,
					password: values.password,
					gender: values.gender,
					status: true,
					roleName: "USER"
				}),
			});

			const data = await response.json();

			if (response.ok) { 
				setSuccess(true);
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			} else {
				setErrorMsg(data.message || t('register.errors.registerFailed'));
			}
		} catch (error) {
			setErrorMsg(t('register.errors.serverError'));
		} finally {
			setLoading(false);
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
			<div className="flex-1 flex justify-center items-center relative z-20 px-4 py-8">
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-2xl relative"
				>
					{/* Close button */}
					<button onClick={handleClose} 
						className="absolute top-4 right-4 transition-colors">
					<X className="h-5 w-5 text-gray-500 hover:!text-red-800" />
					</button>

					<div className="text-center mb-6">
						<h2 className="text-2xl font-bold text-[#1B1B1B] mb-2">
							{t('register.title')}
						</h2>
						<p className="text-gray-600">
							{t('register.haveAccount')}{" "}
							<Link to="/login" className="text-blue-600 hover:text-blue-700">
								{t('register.login')}
							</Link>
						</p>
					</div>

					{errorMsg && (
						<Alert variant="destructive" className="mb-6">
							<AlertTriangle className="h-4 w-4" />
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
							<CheckCircle2 className="h-5 w-5 mr-2 text-green-400" />
							<div>
								<p className="font-medium">{t('register.success.title')}</p>
								<p className="text-sm">{t('register.success.redirecting')}</p>
							</div>
						</motion.div>
					)}

					<form onSubmit={formik.handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="firstName" className="text-gray-700">{t('register.firstName')}</Label>
								<Input
									id="firstName"
									name="firstName"
									value={formik.values.firstName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder={t('register.firstName')}
									className={`h-11 ${formik.touched.firstName && formik.errors.firstName ? "border-red-500" : "border-gray-300"}`}
								/>
								{formik.touched.firstName && formik.errors.firstName && (
									<p className="text-red-500 text-sm">{formik.errors.firstName}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName" className="text-gray-700">{t('register.lastName')}</Label>
								<Input
									id="lastName"
									name="lastName"
									value={formik.values.lastName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder={t('register.lastName')}
									className={`h-11 ${formik.touched.lastName && formik.errors.lastName ? "border-red-500" : "border-gray-300"}`}
								/>
								{formik.touched.lastName && formik.errors.lastName && (
									<p className="text-red-500 text-sm">{formik.errors.lastName}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="gender" className="text-gray-700">{t('register.gender')}</Label>
								<select
									id="gender"
									name="gender"
									value={formik.values.gender}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className={`w-full h-11 px-3 py-2 rounded-md border ${
										formik.touched.gender && formik.errors.gender 
											? "border-red-500" 
											: "border-gray-300"
									} focus:outline-none focus:ring-2 focus:ring-blue-500`}
								>
									<option value="">{t('register.selectGender')}</option>
									<option value="MALE">{t('register.male')}</option>
									<option value="FEMALE">{t('register.female')}</option>
									<option value="OTHER">{t('register.other')}</option>
								</select>
								{formik.touched.gender && formik.errors.gender && (
									<p className="text-red-500 text-sm">{formik.errors.gender}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="dob" className="text-gray-700">{t('register.dob')}</Label>
								<Input
									id="dob"
									name="dob"
									type="date"
									value={formik.values.dob}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className={`h-11 ${formik.touched.dob && formik.errors.dob ? "border-red-500" : "border-gray-300"}`}
								/>
								{formik.touched.dob && formik.errors.dob && (
									<p className="text-red-500 text-sm">{formik.errors.dob}</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="phone" className="text-gray-700">{t('register.phone')}</Label>
								<Input
									id="phone"
									name="phone"
									value={formik.values.phone}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder="10 digit phone number"
									className={`h-11 ${formik.touched.phone && formik.errors.phone ? "border-red-500" : "border-gray-300"}`}
								/>
								{formik.touched.phone && formik.errors.phone && (
									<p className="text-red-500 text-sm">{formik.errors.phone}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-gray-700">{t('register.email')}</Label>
								<Input
									id="email"
									name="email"
									type="email"
									value={formik.values.email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder={t('register.email')}
									className={`h-11 ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"}`}
								/>
								{formik.touched.email && formik.errors.email && (
									<p className="text-red-500 text-sm">{formik.errors.email}</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="username" className="text-gray-700">{t('register.username')}</Label>
							<Input
								id="username"
								name="username"
								value={formik.values.username}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder={t('register.username')}
								className={`h-11 ${formik.touched.username && formik.errors.username ? "border-red-500" : "border-gray-300"}`}
							/>
							{formik.touched.username && formik.errors.username && (
								<p className="text-red-500 text-sm">{formik.errors.username}</p>
							)}
						</div>

						<div className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="password" className="text-gray-700">{t('register.password')}</Label>
								<div className="relative">
									<Input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										value={formik.values.password}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder={t('register.createPassword')}
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
								{renderPasswordStrength()}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword" className="text-gray-700">{t('register.confirmPassword')}</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										name="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										value={formik.values.confirmPassword}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder={t('register.confirmYourPassword')}
										className={`h-11 pr-10 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
										tabIndex="-1"
									>
										{showConfirmPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
								{formik.touched.confirmPassword && formik.errors.confirmPassword && (
									<p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
								)}
							</div>
						</div>

						<Button 
							type="submit" 
							className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base transition-all duration-200 hover:shadow-lg hover:scale-[1.02]" 
							disabled={loading || success || passwordStrength === "weak"}
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('register.processing')}
								</>
							) : t('register.register')}
						</Button>

						<p className="text-sm text-gray-600 text-center">
							{t('register.terms')}{" "}
							<Link to="#" className="text-blue-600 hover:text-blue-700">
								{t('register.termsLink')}
							</Link>{" "}
							{t('register.and')}{" "}
							<Link to="#" className="text-blue-600 hover:text-blue-700">
								{t('register.privacyLink')}
							</Link>
						</p>
					</form>
				</motion.div>
			</div>
		</div>
	);
}

export default RegisterPage;
