import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription
} from "../ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import StepOne from "../ui/RegisterSteps/StepOne";
import StepTwo from "../ui/RegisterSteps/StepTwo";
import ProgressIndicator from "../ui/RegisterSteps/ProgressIndicator";

const AddAccount = ({ open, onOpenChange, onSuccess }) => {
	const { t } = useTranslation();
	const [currentStep, setCurrentStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState("weak");

	const validation = Yup.object({
		firstName: Yup.string()
			.required(t('register.errors.required'))
			.max(100, t('register.errors.firstNameLength')),
		lastName: Yup.string()
			.required(t('register.errors.required'))
			.max(100, t('register.errors.lastNameLength')),
		dob: Yup.date().required(t('register.errors.required')),
		phoneNumber: Yup.string()
			.required(t('register.errors.required'))
			.matches(/^0[0-9]{9}$/, t('register.errors.phoneFormat')),
		email: Yup.string()
			.email(t('register.errors.invalidEmail'))
			.required(t('register.errors.required'))
			.max(50, t('register.errors.emailLength')),
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
		address: Yup.string().required(t('register.errors.required')),
		roleName: Yup.string()
			.required(t('register.errors.required'))
			.oneOf(["ADMIN", "DOCTOR", "NURSE"], "Please select a valid role"),
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			dob: "",
			phoneNumber: "",
			email: "",
			username: "",
			gender: "",
			password: "",
			confirmPassword: "",
			address: "",
			roleName: "",
		},
		validationSchema: validation,
		onSubmit: (values) => {
			handleAddStaff(values);
		},
	});

	const nextStep = () => {
		// Check if step one inputs are valid before proceeding
		const stepOneFields = ['username', 'password', 'confirmPassword'];
		const errors = {};
		
		stepOneFields.forEach(field => {
			try {
				validation.fields[field].validateSync(formik.values[field]);
			} catch (error) {
				errors[field] = error.message;
			}
		});
		
		// Additional check for password strength
		if (passwordStrength === "weak") {
			setError(t('register.errors.weakPassword'));
			return;
		}
		
		if (Object.keys(errors).length === 0) {
			setCurrentStep(2);
			setError("");
		} else {
			// Update formik touched and errors
			stepOneFields.forEach(field => {
				formik.setFieldTouched(field, true);
			});
		}
	};

	const previousStep = () => {
		setCurrentStep(1);
		setError("");
	};

	const handleAddStaff = async (values) => {
		setLoading(true);
		setError("");

		try {
			// Get token from localStorage
			const token = localStorage.getItem("token");
			if (!token) {
				setError("Authentication required. Please log in again.");
				setLoading(false);
				return;
			}

			const response = await fetch("http://localhost:8080/users/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					firstName: values.firstName,
					lastName: values.lastName,
					dob: values.dob,
					phoneNumber: values.phoneNumber,
					email: values.email,
					username: values.username,
					password: values.password,
					gender: values.gender,
					address: values.address,
					status: true,
					roleName: values.roleName
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setSuccess(true);
				setTimeout(() => {
					if (onSuccess) onSuccess();
					onOpenChange(false);
					// Reset form
					formik.resetForm();
					setCurrentStep(1);
					setSuccess(false);
				}, 2000);
			} else {
				setError(data.message || "Failed to create account");
			}
		} catch (error) {
			setError("Server error. Please try again later.");
			console.error("Error creating staff account:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		formik.resetForm();
		setCurrentStep(1);
		setError("");
		setSuccess(false);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md md:max-w-xl">
				<DialogHeader>
					<DialogTitle>Add New Staff Account</DialogTitle>
					<DialogDescription>
						Create a new account for staff members with appropriate role access.
					</DialogDescription>
				</DialogHeader>

				{error && (
					<Alert variant="destructive">
						<AlertTriangle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{success && (
					<Alert variant="success" className="bg-green-50 border-green-200">
						<CheckCircle2 className="h-4 w-4 text-green-500" />
						<AlertTitle className="text-green-700">Success</AlertTitle>
						<AlertDescription className="text-green-600">
							Staff account created successfully!
						</AlertDescription>
					</Alert>
				)}

				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<ProgressIndicator currentStep={currentStep} />

					{currentStep === 1 && (
						<StepOne 
							formik={formik} 
							nextStep={nextStep} 
							passwordStrength={passwordStrength}
							setPasswordStrength={setPasswordStrength}
						/>
					)}

					{currentStep === 2 && (
						<StepTwo 
							formik={formik} 
							previousStep={previousStep} 
							isLoading={loading}
							isStaffForm={true}
						/>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddAccount;
