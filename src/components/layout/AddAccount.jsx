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
import StepTwo from "../ui/RegisterSteps/StepTwo";

const AddAccount = ({ open, setIsOpen, onAccountAdded }) => {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const validation = Yup.object({
		firstName: Yup.string()
			.required(t('register.errors.required'))
			.max(100, t('register.errors.firstNameLength')),
		lastName: Yup.string()
			.required(t('register.errors.required'))
			.max(100, t('register.errors.lastNameLength')),
		username: Yup.string()
			.required(t('register.errors.required'))
			.min(3, t('register.errors.usernameLength'))
			.max(30, t('register.errors.usernameLength'))
			.matches(/^[a-zA-Z0-9]+$/, t('register.errors.invalidUsername')),
		dob: Yup.date()
			.required(t('register.errors.required'))
			.max(new Date(), "Date of birth cannot be in the future")
			.typeError("Please enter a valid date"),
		phoneNumber: Yup.string()
			.required(t('register.errors.required'))
			.matches(/^0[0-9]{9}$/, t('register.errors.phoneFormat')),
		email: Yup.string()
			.email(t('register.errors.invalidEmail'))
			.required(t('register.errors.required'))
			.max(50, t('register.errors.emailLength')),
		gender: Yup.string()
			.required(t('register.errors.required'))
			.oneOf(["MALE", "FEMALE", "OTHER"], t('register.errors.invalidGender')),
		address: Yup.string()
			.required(t('register.errors.required'))
			.max(100, "Address must not exceed 100 characters"),
		roleName: Yup.string()
			.required(t('register.errors.required'))
			.oneOf(["DOCTOR", "NURSE"], "Please select a valid role"),
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			username: "",
			dob: "",
			phoneNumber: "",
			email: "",
			gender: "",
			password: "123456", // Default password
			address: "",
			roleName: "",
		},
		validationSchema: validation,
		onSubmit: (values) => {
			handleAddStaff(values);
		},
	});

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
					if (onAccountAdded) onAccountAdded(data.result);
					setIsOpen(false);
					// Reset form
					formik.resetForm();
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
		setError("");
		setSuccess(false);
		setIsOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t('admin.account.addAccount') || "Add New Staff Account"}</DialogTitle>
					<DialogDescription>
						{t('admin.account.createDescription') || "Create a new account for staff members with appropriate role access."}
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
					<StepTwo 
						formik={formik} 
						isLoading={loading}
						isStaffForm={true}
					/>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddAccount;
