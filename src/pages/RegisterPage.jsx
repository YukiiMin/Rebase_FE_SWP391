import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Loader2, Shield, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import Footer from '../components/layout/Footer';
import StepOne from "../components/ui/RegisterSteps/StepOne";
import StepTwo from "../components/ui/RegisterSteps/StepTwo";
import ProgressIndicator from "../components/ui/RegisterSteps/ProgressIndicator";

function RegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();
	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
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
			handleRegister(values);
		},
	});

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
					navigate("/login", { state: { from: location.state?.from } });
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
		if (location.state?.from) {
			navigate(location.state.from);
		} else {
			navigate("/");
		}
	};

	const nextStep = () => {
		// Check if step one inputs are valid before proceeding
		const stepOneFields = ['username', 'password', 'confirmPassword'];
		let hasErrors = false;
		
		// Touch all fields in this step to trigger validation
		stepOneFields.forEach(field => {
			formik.setFieldTouched(field, true);
			if (formik.errors[field]) {
				hasErrors = true;
			}
		});
		
		// If there are validation errors, don't proceed
		if (hasErrors) {
			return;
		}
		
		// Additional check for password strength
		if (passwordStrength === "weak") {
			setErrorMsg(t('register.errors.weakPassword'));
			return;
		}
		
		// If we get here, everything is valid
		setCurrentStep(2);
		setErrorMsg("");  // Clear any error messages
	};

	const previousStep = () => {
		setCurrentStep(1);
		setErrorMsg("");
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
				<h1 className="text-3xl font-bold text-blue-900 mb-8">{t('register.createAccount')}</h1>
				
				{/* Register Form */}
				<div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">{t('register.title')}</h2>
						<p className="text-gray-600">
							{t('register.subtitle')}
						</p>
						<p className="text-gray-600 mt-4">
							{t('register.haveAccount')}{" "}
							<Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium" state={{ from: location.state?.from }}>
								{t('register.loginLink')}
							</Link>
						</p>
					</div>

					{errorMsg && (
						<Alert variant="destructive" className="mb-6 bg-red-50 border border-red-200 text-red-900">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>{errorMsg}</AlertDescription>
						</Alert>
					)}

					{success ? (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center text-center"
						>
							<CheckCircle2 className="text-green-500 h-12 w-12 mb-4" />
							<h3 className="text-xl font-bold text-green-800 mb-2">{t('register.success.title')}</h3>
							<p className="text-green-700">{t('register.success.message')}</p>
							<p className="text-sm text-green-600 mt-4">{t('register.success.redirect')}</p>
						</motion.div>
					) : (
						<form onSubmit={formik.handleSubmit} className="space-y-6">
							{/* Progress indicator */}
							<div className="mb-8">
								<ProgressIndicator currentStep={currentStep} totalSteps={2} />
							</div>

							{currentStep === 1 ? (
								<StepOne 
									formik={formik} 
									passwordStrength={passwordStrength} 
									setPasswordStrength={setPasswordStrength} 
								/>
							) : (
								<StepTwo 
									formik={formik} 
								/>
							)}

							{/* Form actions */}
							<div className="flex justify-between mt-8">
								{currentStep === 2 ? (
									<button 
										type="button" 
										onClick={previousStep}
										className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
									>
										{t('register.previous')}
									</button>
								) : (
									<button 
										type="button" 
										onClick={handleClose}
										className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
									>
										{t('register.cancel')}
									</button>
								)}
								
								{currentStep === 1 ? (
									<button 
										type="button" 
										onClick={nextStep}
										className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
									>
										{t('register.next')}
									</button>
								) : (
									<button 
										type="submit" 
										disabled={loading}
										className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70"
									>
										{loading ? (
											<>
												<Loader2 className="animate-spin h-4 w-4 mr-2" />
												{t('register.submitting')}
											</>
										) : (
											t('register.createAccount')
										)}
									</button>
								)}
							</div>
						</form>
					)}
				</div>
			</main>
			
			<Footer />
		</div>
	);
}

export default RegisterPage;
