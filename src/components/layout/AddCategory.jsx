import { useFormik } from "formik";
import React, { useState } from "react";
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
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2 } from "lucide-react";

function AddCategory({ open, setIsOpen, onAddedCategory }) {
	const token = localStorage.getItem("token");
	const vaccineAPI = "http://localhost:8080/vaccine";
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const validation = Yup.object({
		categoryName: Yup.string().required("Category name is required."),
		description: Yup.string().required("Category description is required").min(10, "Description must be at least 10 characters"),
	});

	const formik = useFormik({
		initialValues: {
			categoryName: "",
			description: "",
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
			setLoading(true);
			setError("");
			
			const response = await fetch(`${vaccineAPI}/category/add`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});
			
			if (response.ok) {
				console.log("Adding category successful");
				const newCategory = await response.json();
				console.log(newCategory.result);
				handleClose();
				onAddedCategory(newCategory.result);
			} else {
				const errorData = await response.json();
				setError(errorData.message || "Failed to add category");
				console.error("Adding category failed: ", response.status);
			}
		} catch (err) {
			console.error("Adding category failed: ", err);
			setError(err.message || "An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Add New Category</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					<div className="space-y-2">
						<Label htmlFor="categoryName">Category Name</Label>
						<Input
							id="categoryName"
							name="categoryName"
							placeholder="Enter category name"
							value={formik.values.categoryName}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={formik.touched.categoryName && formik.errors.categoryName ? "border-red-500" : ""}
						/>
						{formik.touched.categoryName && formik.errors.categoryName && (
							<p className="text-sm text-red-500 mt-1">{formik.errors.categoryName}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							placeholder="Enter description"
							rows={3}
							value={formik.values.description}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className={formik.touched.description && formik.errors.description ? "border-red-500" : ""}
						/>
						{formik.touched.description && formik.errors.description && (
							<p className="text-sm text-red-500 mt-1">{formik.errors.description}</p>
						)}
					</div>

					<DialogFooter className="pt-2">
						<Button variant="outline" type="button" onClick={handleClose} disabled={loading}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								"Save Category"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddCategory;
