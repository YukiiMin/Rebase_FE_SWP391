import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";
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
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2, Baby } from "lucide-react";
import { format } from "date-fns";

function AddChild({ setIsOpen, open, onAdded }) {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const decodedToken = token ? jwtDecode(token) : null;
	const childAPI = "http://localhost:8080/children";
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleClose = () => setIsOpen(false);

	const validation = Yup.object().shape({
		firstName: Yup.string()
			.required("First name is required")
			.min(2, "First name must be at least 2 characters"),
		lastName: Yup.string()
			.required("Last name is required")
			.min(2, "Last name must be at least 2 characters"),
		dob: Yup.date().required("Date of birth is required"),
		height: Yup.number()
			.required("Height is required")
			.positive("Height must be positive"),
		weight: Yup.number()
			.required("Weight is required")
			.positive("Weight must be positive"),
		gender: Yup.string()
			.oneOf(["MALE", "FEMALE"])
			.required("Gender is required"),
		imageUrl: Yup.string().url("Invalid URL"),
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			dob: "",
			height: "",
			weight: "",
			gender: "MALE",
			imageUrl:
				"https://media.npr.org/assets/img/2013/03/11/istock-4306066-baby_custom-00a02f589803ea4cb7b723dd1df6981d77e7cdc7.jpg",
		},
		onSubmit: (values) => {
			handleAddChild(values);
		},
		validationSchema: validation,
	});

	const handleAddChild = async (values) => {
		try {
			setLoading(true);
			setError("");
			setSuccess("");
			
			const childData = {
				name: `${values.firstName} ${values.lastName}`,
				dob: values.dob,
				height: values.height,
				weight: values.weight,
				gender: values.gender,
				urlImage: values.imageUrl,
			};
			
			const accountId = decodedToken.sub;
			console.log(accountId);
			
			const response = await fetch(`${childAPI}/${accountId}/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(childData),
			});
			
			if (response.ok) {
				console.log("Adding child successful");
				setSuccess("Child added successfully!");
				setTimeout(() => {
					handleClose();
					const newChild = response.json().then((data) => {
						onAdded(data);
						console.log(data);
					});
				}, 1500);
			} else {
				const errorData = await response.json();
				setError(errorData.message || "Failed to add child. Please try again.");
				console.error("Something went wrong when adding child: ", response.status);
			}
		} catch (err) {
			console.error("Add child error:", err);
			setError(err.message || "An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center text-xl font-semibold">
						<Baby className="mr-2 h-5 w-5" />
						Add New Child
					</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					{success && (
						<Alert className="bg-green-50 text-green-800 border-green-200">
							<AlertDescription>{success}</AlertDescription>
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
						{formik.touched.gender && formik.errors.gender && (
							<p className="text-sm text-red-500 mt-1">{formik.errors.gender}</p>
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
							max={format(new Date(), "yyyy-MM-dd")}
						/>
						{formik.touched.dob && formik.errors.dob && (
							<p className="text-sm text-red-500 mt-1">{formik.errors.dob}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="weight">Weight (kg)</Label>
							<Input
								id="weight"
								name="weight"
								type="number"
								placeholder="Weight"
								value={formik.values.weight}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className={formik.touched.weight && formik.errors.weight ? "border-red-500" : ""}
								step="0.1"
								min="0"
							/>
							{formik.touched.weight && formik.errors.weight && (
								<p className="text-sm text-red-500 mt-1">{formik.errors.weight}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="height">Height (cm)</Label>
							<Input
								id="height"
								name="height"
								type="number"
								placeholder="Height"
								value={formik.values.height}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								className={formik.touched.height && formik.errors.height ? "border-red-500" : ""}
								step="0.1"
								min="0"
							/>
							{formik.touched.height && formik.errors.height && (
								<p className="text-sm text-red-500 mt-1">{formik.errors.height}</p>
							)}
						</div>
					</div>

					<DialogFooter className="pt-2">
						<Button variant="outline" type="button" onClick={handleClose} disabled={loading}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Adding...
								</>
							) : (
								"Add Child"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddChild;
