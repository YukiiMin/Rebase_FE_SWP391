import { useFormik } from "formik";
// import React from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

// ShadCN Components
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";

function AddAccount({ setIsOpen, open, onAccountAdded }) {
	const userAPI = "http://localhost:8080/users/register";
	const staffAPI = "http://localhost:8080/users/staff";
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const validation = Yup.object().shape({
		firstName: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
		lastName: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
		username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters").max(50, "Username must be at most 50 characters"),

		// DON'T need these field because password is a fixed value
		// password: Yup.string().required("Password is required").min(3, "Password must be at least 2 characters").max(50, "Password must be at most 16 characters"),
		// confirmPassword: Yup.string()
		// 	.oneOf([Yup.ref("password"), null], "Passwords must match")
		// 	.required("Confirm password is required"),

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
		
		// Chỉ cho phép 3 role: ADMIN, DOCTOR, NURSE
		roleName: Yup.string()
			.oneOf(["ADMIN", "DOCTOR", "NURSE"], "Invalid role")
			.required("Role is required"),
	});

	// Mới thêm vào 
	const [isStaff, setIsStaff] = useState(false);

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			gender: "MALE",
			username: "",
			password: "123456", // Default password of any accounts added by ADMIN
			email: "",
			phoneNumber: "",
			address: "",
			roleName: "", // Mặc định để trống
		},
		onSubmit: (values) => {
			handleAddAccount(values);
		},
		validationSchema: validation,
	});

	// const handleClose = () => setIsOpen(false); //Close modal
	// Mới thêm vào
	const handleRoleChange = (value) => {
		formik.setFieldValue("roleName", value);
		setIsStaff(value === "DOCTOR" || value === "NURSE");
	};

	const handleClose = () => setIsOpen(false); // Close modal

	const handleAddAccount = async (values) => {
		try {
			setLoading(true);
			setError("");
			
			// Chọn API endpoint dựa trên role
			const apiEndpoint = 
				["DOCTOR", "NURSE"].includes(values.roleName) 
					? staffAPI 
					: userAPI;
			
			// Make API request
			const response = await fetch(apiEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Mới thêm vào
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify(values), // Không cần thêm default role nữa
			});
			
			if (response.ok) {
				const data = await response.json();
				const newAccount = data.result;
				// console.log(newAccount);
				// const newAccount = await response.json();
				// console.log("Hien tai do cai Register tra ve 1 chuoi vo nghia nen ko lay ra duoc thang moi tao. Khi lam cai add account BE can tra ve dung");
				// Mới thêm vàovào
				console.log("Account created:", newAccount);
				handleClose();
				onAccountAdded(newAccount);
			} else {
				// Xử lý lỗi chi tiết hơn
				const errorData = await response.json();
				setError(errorData.message || "Account creation failed");
			}
		} catch (err) {
			console.error("Account creation failed:", err);
			setError(err.message || "An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Add New Account</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								name="firstName"
								placeholder="Enter first name"
								value={formik.values.firstName}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className={formik.touched.firstName && formik.errors.firstName ? "border-red-500" : ""}
							/>
							{formik.touched.firstName && formik.errors.firstName && (
								<p className="text-sm text-red-500 mt-1">{formik.errors.firstName}</p>
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
								onBlur={formik.handleBlur}
								className={formik.touched.lastName && formik.errors.lastName ? "border-red-500" : ""}
							/>
							{formik.touched.lastName && formik.errors.lastName && (
								<p className="text-sm text-red-500 mt-1">{formik.errors.lastName}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Gender</Label>
						<RadioGroup
							name="gender"
							value={formik.values.gender}
							onValueChange={(value) => formik.setFieldValue("gender", value)}
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

					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							name="username"
							placeholder="Enter username"
							value={formik.values.username}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={formik.touched.username && formik.errors.username ? "border-red-500" : ""}
						/>
						{formik.touched.username && formik.errors.username && (
							<p className="text-sm text-red-500 mt-1">{formik.errors.username}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							disabled
							value={formik.values.password}
						/>
						{/* <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback> */}
						{/* Mới thêm vàovào */}
						<p className="text-xs text-muted-foreground">
							Default password is "123456". User should change it after first login.
						</p>
					</div>
					{/* 
					<Form.Group className="mb-3" controlId="txtConfirm">
						<Form.Label>Confirm password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Confirm password"
							name="confirmPassword"
							value={formik.values.confirmPassword}
							onChange={formik.handleChange}
							isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
						/>
						<Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
					</Form.Group> */}

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="Enter email"
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
							/>
							{formik.touched.email && formik.errors.email && (
								<p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
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
								onBlur={formik.handleBlur}
								className={formik.touched.phoneNumber && formik.errors.phoneNumber ? "border-red-500" : ""}
							/>
							{formik.touched.phoneNumber && formik.errors.phoneNumber && (
								<p className="text-sm text-red-500 mt-1">{formik.errors.phoneNumber}</p>
							)}
						</div>
					</div>
					{/* Mới thêm vào */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="address">Address</Label>
							<Input
								id="address"
								name="address"
								placeholder="Enter address"
								value={formik.values.address}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className={formik.touched.address && formik.errors.address ? "border-red-500" : ""}
							/>
							{/* {/*  */}
							<Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
						</div>
						{/* {/*  */}
						<div className="space-y-2">
							<Label htmlFor="roleName">Role</Label>
							{/* <Form.Select aria-label="Role" name="role" value={formik.values.role} onChange={formik.handleChange} isInvalid={formik.touched.role && formik.errors.role}>
								<option value="">---Choose Role---</option> */}
								
							<Select
								name="roleName"
								value={formik.values.roleName}
								onValueChange={handleRoleChange}
							>
								<SelectTrigger
									className={formik.touched.roleName && formik.errors.roleName ? "border-red-500" : ""}
								>
									<SelectValue placeholder="Select Role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ADMIN">Admin</SelectItem>
									<SelectItem value="DOCTOR">Doctor</SelectItem>
									<SelectItem value="NURSE">Nurse</SelectItem>									
								</SelectContent>
							</Select>
							<Form.Control.Feedback type="invalid">{formik.errors.roleName}</Form.Control.Feedback>
						</div>
					</div>

					<DialogFooter className="pt-4">
						<Button variant="outline" type="button" onClick={handleClose} disabled={loading}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Account"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddAccount;
