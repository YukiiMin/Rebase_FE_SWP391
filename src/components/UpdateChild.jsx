import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { FormItem, FormLabel, FormControl, FormMessage, FormField, Form } from "./ui/form";

function UpdateChild({ setIsOpen, child, open, onUpdate }) {
	const token = localStorage.getItem("token");
	const childAPI = "http://localhost:8080/children";

	const validation = Yup.object().shape({
		firstName: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
		lastName: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
		dob: Yup.date().required("Date of birth is required"),
		height: Yup.number().required("Height is required").positive("Height must be positive"),
		weight: Yup.number().required("Weight is required").positive("Weight must be positive"),
		gender: Yup.string().oneOf(["MALE", "FEMALE"]).required("Gender is required"),
		imageUrl: Yup.string().url("Invalid URL"), // optional, but if present, must be a valid URL
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			dob: "",
			height: "",
			weight: "",
			gender: "MALE",
			imageUrl: "https://media.npr.org/assets/img/2013/03/11/istock-4306066-baby_custom-00a02f589803ea4cb7b723dd1df6981d77e7cdc7.jpg",
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
		validationSchema: validation,
	});

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleSubmit = async (values) => {
		try {
			const response = await fetch(`${childAPI}/${child.id}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify(values),
			});
			if (response.ok) {
				console.log("Update child successful");
				const data = await response.json();
				handleClose();
				onUpdate(data);
			} else {
				console.error("Updating child failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when updating child: ", err);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Update Child</DialogTitle>
				</DialogHeader>
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
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
								<p className="text-sm text-red-500">{formik.errors.firstName}</p>
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
								<p className="text-sm text-red-500">{formik.errors.lastName}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Gender</Label>
						<div className="flex items-center space-x-4">
							<label className="flex items-center space-x-2 cursor-pointer">
								<input 
									type="radio" 
									name="gender" 
									value="MALE" 
									checked={formik.values.gender === "MALE"}
									onChange={formik.handleChange}
									className="h-4 w-4 text-primary"
								/>
								<span>Male</span>
							</label>
							<label className="flex items-center space-x-2 cursor-pointer">
								<input 
									type="radio" 
									name="gender" 
									value="FEMALE" 
									checked={formik.values.gender === "FEMALE"}
									onChange={formik.handleChange}
									className="h-4 w-4 text-primary"
								/>
								<span>Female</span>
							</label>
						</div>
						{formik.touched.gender && formik.errors.gender && (
							<p className="text-sm text-red-500">{formik.errors.gender}</p>
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
							className={formik.touched.dob && formik.errors.dob ? "border-red-500" : ""}
						/>
						{formik.touched.dob && formik.errors.dob && (
							<p className="text-sm text-red-500">{formik.errors.dob}</p>
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
								className={formik.touched.weight && formik.errors.weight ? "border-red-500" : ""}
							/>
							{formik.touched.weight && formik.errors.weight && (
								<p className="text-sm text-red-500">{formik.errors.weight}</p>
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
								className={formik.touched.height && formik.errors.height ? "border-red-500" : ""}
							/>
							{formik.touched.height && formik.errors.height && (
								<p className="text-sm text-red-500">{formik.errors.height}</p>
							)}
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose}>
							Close
						</Button>
						<Button type="submit">
							Update
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default UpdateChild;
