import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCategory from "./AddCategory";
import AddProtocol from "./AddProtocol";
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
import { Textarea } from "./ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Loader2, Plus } from "lucide-react";

function AddVaccine({ setIsOpen, open, onAdded }) {
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	const vaccineAPI = "http://localhost:8080/vaccine";

	const [categories, setCategories] = useState([]);
	const [protocols, setProtocols] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
	const [selectedProtocol, setSelectedProtocol] = useState("");
	const [totalDose, setTotalDose] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleClose = () => setIsOpen(false);

	const validation = Yup.object({
		name: Yup.string().required("Vaccine Name is required"),
		description: Yup.string().required("Description is required").min(30, "Description must be at least 30 characters"),
		manufacturer: Yup.string().required("Manufacturer is required"),
		categoryId: Yup.string().required("Category is required"),
		dosage: Yup.string().required("Dosage is required"),
		contraindications: Yup.string().required("Contraindications are required").min(30, "Contraindications must be at least 30 characters"),
		precautions: Yup.string().required("Precautions are required").min(30, "Precautions must be at least 30 characters"),
		interactions: Yup.string().required("Interactions are required").min(30, "Interactions must be at least 30 characters"),
		adverseReaction: Yup.string().required("Adverse Reactions are required").min(30, "Adverse Reactions must be at least 30 characters"),
		storageConditions: Yup.string().required("Storage Conditions are required").min(30, "Storage Conditions must be at least 30 characters"),
		recommended: Yup.string().required("Recommended For is required").min(30, "Recommended For must be at least 30 characters"),
		preVaccination: Yup.string().required("Pre-Vaccination Information is required").min(30, "Pre-Vaccination Information must be at least 30 characters"),
		compatibility: Yup.string().required("Compatibility is required").min(30, "Compatibility must be at least 30 characters"),
		quantity: Yup.number().required("Quantity is required").min(0, "Quantity cannot be negative"),
		unitPrice: Yup.number().required("Unit price is required").min(0, "Unit price cannot be negative"),
		salePrice: Yup.number().required("Sale price is required").min(0, "Sale price cannot be negative").moreThan(Yup.ref("unitPrice"), "Sale price must be higher than Unit price"),
		status: Yup.boolean().required("Status is required"),
		totalDose: Yup.number().required("Total dose count is required").min(1, "Must have at least 1 dose").max(5, "Cannot exceed 5 doses"),
	});

	const formik = useFormik({
		initialValues: {
			name: "",
			description: "",
			manufacturer: "",
			categoryId: "",
			dosage: "",
			contraindications: "",
			precautions: "",
			interactions: "",
			adverseReaction: "",
			storageConditions: "",
			recommended: "",
			preVaccination: "",
			compatibility: "",
			imagineUrl: "https://vnvc.vn/wp-content/uploads/2024/09/vaccine-qdenga-1.jpg", // Using default image URL
			quantity: "",
			unitPrice: "",
			salePrice: "",
			status: true,
			totalDose: 1,
		},
		onSubmit: (values) => {
			handleAddVaccine(values);
		},
		validationSchema: validation,
	});

	useEffect(() => {
		fetchCategory();
		fetchProtocols();
	}, []);

	useEffect(() => {
		setTotalDose(formik.values.totalDose);
	}, [formik.values.totalDose]);

	const fetchCategory = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/categories`);
			if (response.ok) {
				const data = await response.json();
				setCategories(data.result);
			} else {
				setError("Failed to fetch categories");
			}
		} catch (err) {
			setError(`Error fetching categories: ${err.message}`);
		}
	};

	const fetchProtocols = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/protocols`);
			if (response.ok) {
				const data = await response.json();
				setProtocols(data.result);
			} else {
				setError("Failed to fetch protocols");
			}
		} catch (err) {
			setError(`Error fetching protocols: ${err.message}`);
		}
	};

	const handleAddVaccineToProtocol = async (vaccineId, protocolId) => {
		if (!protocolId) return;

		try {
			const response = await fetch(`${vaccineAPI}/protocol/${protocolId}/addVaccine/${vaccineId}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				await response.json();
				return true;
			} else {
				setError(`Failed to add vaccine to protocol: ${response.status}`);
				return false;
			}
		} catch (err) {
			setError(`Error adding vaccine to protocol: ${err.message}`);
			return false;
		}
	};

	const handleAddVaccine = async (values) => {
		setIsLoading(true);
		setError("");
		
		try {
			const categoryId = values.categoryId;
			const vaccineData = {
				name: values.name,
				description: values.description,
				manufacturer: values.manufacturer,
				dosage: values.dosage,
				contraindications: values.contraindications,
				precautions: values.precautions,
				interactions: values.interactions,
				adverseReaction: values.adverseReaction,
				storageConditions: values.storageConditions,
				recommended: values.recommended,
				preVaccination: values.preVaccination,
				compatibility: values.compatibility,
				imagineUrl: values.imagineUrl,
				quantity: values.quantity,
				unitPrice: values.unitPrice,
				salePrice: values.salePrice,
				status: values.status,
				totalDose: values.totalDose,
			};
			
			const response = await fetch(`${vaccineAPI}/add/${categoryId}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(vaccineData),
			});
			
			if (response.ok) {
				const newVaccine = await response.json();
				
				// If a protocol was selected, add the vaccine to the protocol
				if (selectedProtocol) {
					const vaccineId = newVaccine.result.id;
					const success = await handleAddVaccineToProtocol(vaccineId, selectedProtocol);
					
					if (success) {
						handleClose();
						onAdded(newVaccine.result);
					}
				} else {
					handleClose();
					onAdded(newVaccine.result);
				}
			} else {
				setError(`Failed to add vaccine: ${response.status}`);
			}
		} catch (err) {
			setError(`Error adding vaccine: ${err.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCategoryAdded = (newCategory) => {
		if (newCategory) {
			setCategories([newCategory, ...categories]);
		} else {
			fetchCategory();
		}
	};

	const handleProtocolAdded = (newProtocol) => {
		if (newProtocol) {
			setProtocols([newProtocol, ...protocols]);
			setSelectedProtocol(newProtocol.protocolId);
		} else {
			fetchProtocols();
		}
	};

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="max-w-[900px] h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Add New Vaccine</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={formik.handleSubmit} className="space-y-6">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					<Tabs defaultValue="basic" className="w-full">
						<TabsList className="grid grid-cols-4 mb-4">
							<TabsTrigger value="basic">Basic Info</TabsTrigger>
							<TabsTrigger value="details">Medical Details</TabsTrigger>
							<TabsTrigger value="recommendations">Recommendations</TabsTrigger>
							<TabsTrigger value="inventory">Inventory & Pricing</TabsTrigger>
						</TabsList>
						
						{/* Basic Info Tab */}
						<TabsContent value="basic" className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Vaccine Name *</Label>
									<Input
										id="name"
										name="name"
										placeholder="Enter Vaccine Name"
										value={formik.values.name}
										onChange={formik.handleChange}
										className={formik.touched.name && formik.errors.name ? "border-red-500" : ""}
									/>
									{formik.touched.name && formik.errors.name && (
										<p className="text-sm text-red-500">{formik.errors.name}</p>
									)}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="manufacturer">Manufacturer *</Label>
									<Input
										id="manufacturer"
										name="manufacturer"
										placeholder="Enter Manufacturer"
										value={formik.values.manufacturer}
										onChange={formik.handleChange}
										className={formik.touched.manufacturer && formik.errors.manufacturer ? "border-red-500" : ""}
									/>
									{formik.touched.manufacturer && formik.errors.manufacturer && (
										<p className="text-sm text-red-500">{formik.errors.manufacturer}</p>
									)}
								</div>
							</div>
							
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<Label htmlFor="categoryId">Category *</Label>
										<Button 
											type="button" 
											variant="outline" 
											size="sm" 
											onClick={() => setIsModalOpen(true)}
											className="flex items-center gap-1 text-xs h-7"
										>
											<Plus className="h-3 w-3" />
											Add category
										</Button>
									</div>
									<Select
										name="categoryId"
										value={formik.values.categoryId}
										onValueChange={(value) => formik.setFieldValue("categoryId", value)}
									>
										<SelectTrigger className={formik.touched.categoryId && formik.errors.categoryId ? "border-red-500" : ""}>
											<SelectValue placeholder="---Choose Category---" />
										</SelectTrigger>
										<SelectContent>
											{categories && categories.map((category) => (
												<SelectItem key={category.categoryId} value={category.categoryId.toString()}>
													{category.categoryName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{formik.touched.categoryId && formik.errors.categoryId && (
										<p className="text-sm text-red-500">{formik.errors.categoryId}</p>
									)}
									{isModalOpen && <AddCategory open={isModalOpen} setIsOpen={setIsModalOpen} onAddedCategory={handleCategoryAdded} />}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="totalDose">Total Dose Count *</Label>
									<Input
										id="totalDose"
										name="totalDose"
										type="number"
										min="1"
										max="5"
										placeholder="Enter total number of doses"
										value={formik.values.totalDose}
										onChange={formik.handleChange}
										className={formik.touched.totalDose && formik.errors.totalDose ? "border-red-500" : ""}
									/>
									<p className="text-xs text-gray-500">Number of vaccine doses required (max 5)</p>
									{formik.touched.totalDose && formik.errors.totalDose && (
										<p className="text-sm text-red-500">{formik.errors.totalDose}</p>
									)}
								</div>
							</div>
							
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<Label htmlFor="protocol">Protocol</Label>
										<Button 
											type="button" 
											variant="outline" 
											size="sm" 
											onClick={() => setIsProtocolModalOpen(true)}
											className="flex items-center gap-1 text-xs h-7"
										>
											<Plus className="h-3 w-3" />
											Add Protocol
										</Button>
									</div>
									<Select
										value={selectedProtocol}
										onValueChange={setSelectedProtocol}
									>
										<SelectTrigger>
											<SelectValue placeholder="---Choose Protocol---" />
										</SelectTrigger>
										<SelectContent>
											{protocols && protocols.map((protocol) => (
												<SelectItem 
													key={protocol.protocolId} 
													value={protocol.protocolId.toString()}
													disabled={protocol.details?.length < totalDose}
												>
													{protocol.name} ({protocol.details?.length || 0} doses)
													{protocol.details?.length < totalDose ? " - Not enough doses" : ""}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-xs text-gray-500">Select a protocol with at least {totalDose} doses</p>
									{isProtocolModalOpen && <AddProtocol open={isProtocolModalOpen} setIsOpen={setIsProtocolModalOpen} onAddedProtocol={handleProtocolAdded} />}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="dosage">Dosage *</Label>
									<Input
										id="dosage"
										name="dosage"
										placeholder="Enter Dosage (e.g. 0.5ml/dose)"
										value={formik.values.dosage}
										onChange={formik.handleChange}
										className={formik.touched.dosage && formik.errors.dosage ? "border-red-500" : ""}
									/>
									{formik.touched.dosage && formik.errors.dosage && (
										<p className="text-sm text-red-500">{formik.errors.dosage}</p>
									)}
								</div>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="description">Description *</Label>
								<Textarea
									id="description"
									name="description"
									placeholder="Enter Description"
									rows={3}
									value={formik.values.description}
									onChange={formik.handleChange}
									className={formik.touched.description && formik.errors.description ? "border-red-500" : ""}
								/>
								{formik.touched.description && formik.errors.description && (
									<p className="text-sm text-red-500">{formik.errors.description}</p>
								)}
							</div>
						</TabsContent>
						
						{/* Medical Details Tab */}
						<TabsContent value="details" className="space-y-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="contraindications">Contraindications *</Label>
									<Textarea
										id="contraindications"
										name="contraindications"
										placeholder="Enter Contraindications"
										rows={3}
										value={formik.values.contraindications}
										onChange={formik.handleChange}
										className={formik.touched.contraindications && formik.errors.contraindications ? "border-red-500" : ""}
									/>
									{formik.touched.contraindications && formik.errors.contraindications && (
										<p className="text-sm text-red-500">{formik.errors.contraindications}</p>
									)}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="precautions">Precautions *</Label>
									<Textarea
										id="precautions"
										name="precautions"
										placeholder="Enter Precautions"
										rows={3}
										value={formik.values.precautions}
										onChange={formik.handleChange}
										className={formik.touched.precautions && formik.errors.precautions ? "border-red-500" : ""}
									/>
									{formik.touched.precautions && formik.errors.precautions && (
										<p className="text-sm text-red-500">{formik.errors.precautions}</p>
									)}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="interactions">Interactions *</Label>
									<Textarea
										id="interactions"
										name="interactions"
										placeholder="Enter Interactions"
										rows={3}
										value={formik.values.interactions}
										onChange={formik.handleChange}
										className={formik.touched.interactions && formik.errors.interactions ? "border-red-500" : ""}
									/>
									{formik.touched.interactions && formik.errors.interactions && (
										<p className="text-sm text-red-500">{formik.errors.interactions}</p>
									)}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="adverseReaction">Adverse Reactions *</Label>
									<Textarea
										id="adverseReaction"
										name="adverseReaction"
										placeholder="Enter Adverse Reactions"
										rows={3}
										value={formik.values.adverseReaction}
										onChange={formik.handleChange}
										className={formik.touched.adverseReaction && formik.errors.adverseReaction ? "border-red-500" : ""}
									/>
									{formik.touched.adverseReaction && formik.errors.adverseReaction && (
										<p className="text-sm text-red-500">{formik.errors.adverseReaction}</p>
									)}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="storageConditions">Storage Conditions *</Label>
									<Textarea
										id="storageConditions"
										name="storageConditions"
										placeholder="Enter Storage Conditions"
										rows={3}
										value={formik.values.storageConditions}
										onChange={formik.handleChange}
										className={formik.touched.storageConditions && formik.errors.storageConditions ? "border-red-500" : ""}
									/>
									{formik.touched.storageConditions && formik.errors.storageConditions && (
										<p className="text-sm text-red-500">{formik.errors.storageConditions}</p>
									)}
								</div>
							</div>
						</TabsContent>
						
						{/* Recommendations Tab */}
						<TabsContent value="recommendations" className="space-y-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="recommended">Recommended For *</Label>
									<Textarea
										id="recommended"
										name="recommended"
										placeholder="Enter Recommended For"
										rows={3}
										value={formik.values.recommended}
										onChange={formik.handleChange}
										className={formik.touched.recommended && formik.errors.recommended ? "border-red-500" : ""}
									/>
									{formik.touched.recommended && formik.errors.recommended && (
										<p className="text-sm text-red-500">{formik.errors.recommended}</p>
									)}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="preVaccination">Pre-Vaccination Information *</Label>
									<Textarea
										id="preVaccination"
										name="preVaccination"
										placeholder="Enter Pre-Vaccination Information"
										rows={3}
										value={formik.values.preVaccination}
										onChange={formik.handleChange}
										className={formik.touched.preVaccination && formik.errors.preVaccination ? "border-red-500" : ""}
									/>
									{formik.touched.preVaccination && formik.errors.preVaccination && (
										<p className="text-sm text-red-500">{formik.errors.preVaccination}</p>
									)}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="compatibility">Compatibility *</Label>
									<Textarea
										id="compatibility"
										name="compatibility"
										placeholder="Enter Compatibility Information"
										rows={3}
										value={formik.values.compatibility}
										onChange={formik.handleChange}
										className={formik.touched.compatibility && formik.errors.compatibility ? "border-red-500" : ""}
									/>
									{formik.touched.compatibility && formik.errors.compatibility && (
										<p className="text-sm text-red-500">{formik.errors.compatibility}</p>
									)}
								</div>
							</div>
						</TabsContent>
						
						{/* Inventory & Pricing Tab */}
						<TabsContent value="inventory" className="space-y-6">
							<div className="grid grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="quantity">Quantity *</Label>
									<Input
										id="quantity"
										name="quantity"
										type="number"
										min="0"
										placeholder="Enter Quantity"
										value={formik.values.quantity}
										onChange={formik.handleChange}
										className={formik.touched.quantity && formik.errors.quantity ? "border-red-500" : ""}
									/>
									{formik.touched.quantity && formik.errors.quantity && (
										<p className="text-sm text-red-500">{formik.errors.quantity}</p>
									)}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="unitPrice">Unit Price ($) *</Label>
									<Input
										id="unitPrice"
										name="unitPrice"
										type="number"
										min="0"
										placeholder="Enter Unit Price"
										value={formik.values.unitPrice}
										onChange={formik.handleChange}
										className={formik.touched.unitPrice && formik.errors.unitPrice ? "border-red-500" : ""}
									/>
									{formik.touched.unitPrice && formik.errors.unitPrice && (
										<p className="text-sm text-red-500">{formik.errors.unitPrice}</p>
									)}
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="salePrice">Sale Price ($) *</Label>
									<Input
										id="salePrice"
										name="salePrice"
										type="number"
										min="0"
										placeholder="Enter Sale Price"
										value={formik.values.salePrice}
										onChange={formik.handleChange}
										className={formik.touched.salePrice && formik.errors.salePrice ? "border-red-500" : ""}
									/>
									{formik.touched.salePrice && formik.errors.salePrice && (
										<p className="text-sm text-red-500">{formik.errors.salePrice}</p>
									)}
								</div>
							</div>
							
							<div className="flex items-center space-x-2">
								<Switch
									id="status"
									name="status"
									checked={formik.values.status}
									onCheckedChange={(checked) => formik.setFieldValue("status", checked)}
								/>
								<Label htmlFor="status">Active Status</Label>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="imageUrl">Image URL</Label>
								<Input
									id="imageUrl"
									name="imageUrl"
									placeholder="Enter image URL or use default"
									value={formik.values.imagineUrl}
									onChange={(e) => formik.setFieldValue("imagineUrl", e.target.value)}
									disabled
									className="bg-gray-50"
								/>
								<p className="text-xs text-gray-500">Using default image URL (file upload to be implemented later)</p>
							</div>
						</TabsContent>
					</Tabs>
					
					<DialogFooter className="mt-6">
						<Button variant="outline" type="button" onClick={handleClose}>
							Cancel
						</Button>
						<Button 
							type="submit" 
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save Vaccine
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddVaccine;
