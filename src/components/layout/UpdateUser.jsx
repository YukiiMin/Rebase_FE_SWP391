import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { apiService } from "../../api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { X } from "lucide-react";

function UpdateUser({ setIsOpen, open, user }) {
	const navigate = useNavigate();
	const [error, setError] = React.useState(null);
	const [success, setSuccess] = React.useState(false);

	const validation = Yup.object().shape({
		firstName: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
		lastName: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
		username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters").max(50, "Username must be at most 50 characters"),
		email: Yup.string()
			.email("Invalid email")
			.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must have a '.' after '@'")
			.required("Email is required")
			.max(50, "Email must be at most 50 characters"),
		phoneNumber: Yup.string()
			.required("Phone number is required")
			.matches(/^0\d+$/, "Phone number must start with 0 and contain only digits")
			.min(10, "Phone number must be at least 10 digits")
			.max(12, "Phone number cannot be longer than 12 digits"),
		address: Yup.string().required("Address is required").min(5, "Address must be at least 5 characters").max(100, "Address must be at most 100 characters"),
	});

	const formik = useFormik({
		initialValues: {
			accountId: user.accountId,
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
			password: user.password,
			confirmPassword: "",
			gender: user.gender,
			email: user.email,
			phoneNumber: user.phoneNumber,
			address: user.address,
			urlImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIFYgpCPMtvHYo7rQ8fFSEgLa1BO78b_9hHA&s",
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
		validationSchema: validation,
	});
	
	const handleClose = () => setIsOpen(false); //Close modal

	const handleSubmit = async (values) => {
		try {
			const userData = {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				phoneNumber: values.phoneNumber,
				address: values.address,
				gender: values.gender,
				urlImage: values.urlImage,
			};
			const userId = values.accountId;
			
			const response = await apiService.users.update(userId, userData);
			
			setSuccess(true);
			setError(null);
			setTimeout(() => {
				handleClose();
				navigate("/User/Profile");
			}, 2000);
		} catch (err) {
			setError(err.response?.data?.message || "Update profile failed. Please try again.");
			setSuccess(false);
			console.error("Update profile error:", err);
		}
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
			<Card className="w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Update Profile</CardTitle>
					<Button variant="ghost" size="sm" onClick={handleClose} className="rounded-full p-2">
						<X className="h-4 w-4" />
					</Button>
				</CardHeader>
				
				<form onSubmit={formik.handleSubmit}>
					<CardContent className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						
						{success && (
							<Alert>
								<AlertDescription>Update profile successful!</AlertDescription>
							</Alert>
						)}
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									name="firstName"
									placeholder="Enter first name"
									value={formik.values.firstName}
									onChange={formik.handleChange}
									className={formik.touched.firstName && formik.errors.firstName ? "border-red-500" : ""}
								/>
								{formik.touched.firstName && formik.errors.firstName && (
									<p className="text-red-500 text-sm">{formik.errors.firstName}</p>
								)}
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									name="lastName"
									placeholder="Enter last name"
									value={formik.values.lastName}
									onChange={formik.handleChange}
									className={formik.touched.lastName && formik.errors.lastName ? "border-red-500" : ""}
								/>
								{formik.touched.lastName && formik.errors.lastName && (
									<p className="text-red-500 text-sm">{formik.errors.lastName}</p>
								)}
							</div>
						</div>
						
						<div className="space-y-2">
							<Label>Gender</Label>
							<RadioGroup 
								name="gender" 
								value={formik.values.gender}
								onValueChange={(value) => formik.setFieldValue('gender', value)}
								className="flex space-x-4"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="MALE" id="MALE" />
									<Label htmlFor="MALE">Male</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="FEMALE" id="FEMALE" />
									<Label htmlFor="FEMALE">Female</Label>
								</div>
							</RadioGroup>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Enter email"
									value={formik.values.email}
									onChange={formik.handleChange}
									className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
								/>
								{formik.touched.email && formik.errors.email && (
									<p className="text-red-500 text-sm">{formik.errors.email}</p>
								)}
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="phoneNumber">Phone Number</Label>
								<Input
									id="phoneNumber"
									name="phoneNumber"
									type="tel"
									placeholder="Enter phone number"
									value={formik.values.phoneNumber}
									onChange={formik.handleChange}
									className={formik.touched.phoneNumber && formik.errors.phoneNumber ? "border-red-500" : ""}
								/>
								{formik.touched.phoneNumber && formik.errors.phoneNumber && (
									<p className="text-red-500 text-sm">{formik.errors.phoneNumber}</p>
								)}
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="address">Address</Label>
								<Input
									id="address"
									name="address"
									placeholder="Enter address"
									value={formik.values.address}
									onChange={formik.handleChange}
									className={formik.touched.address && formik.errors.address ? "border-red-500" : ""}
								/>
								{formik.touched.address && formik.errors.address && (
									<p className="text-red-500 text-sm">{formik.errors.address}</p>
								)}
							</div>
						</div>
					</CardContent>
					
					<CardFooter className="flex justify-end space-x-2">
						<Button variant="outline" type="button" onClick={handleClose}>
							Cancel
						</Button>
						<Button type="submit">
							Save Changes
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export default UpdateUser;
