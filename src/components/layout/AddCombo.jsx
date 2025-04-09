import { useFormik } from "formik";
import React, { useState, useCallback, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableHeader,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2, Search, Plus, Package } from "lucide-react";
import { cn } from "../../lib/utils";
import apiService from "../../api/apiService";

function AddCombo({ setIsOpen, open }) {
	const navigate = useNavigate();
	
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [selectedVaccs, setSelectedVaccs] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [allVaccines, setAllVaccines] = useState([]);

	const handleClose = () => setIsOpen(false);

	const validation = Yup.object({
		comboName: Yup.string().required("Combo Name is required"),
		description: Yup.string().required("Description is required").min(3, "Description must be at least 3 characters"),
		saleOff: Yup.number().min(0, "Sale cannot be negative"),
		comboCategory: Yup.string().required("Combo category is required"),
	});

	const formik = useFormik({
		initialValues: {
			comboName: "",
			description: "",
			saleOff: 0,
			comboCategory: "",
		},
		onSubmit: (values) => {
			handleAddCombo(values);
		},
		validationSchema: validation,
	});

	// Fetch all vaccines when component mounts
	useEffect(() => {
		fetchAllVaccines();
	}, []);

	const fetchAllVaccines = async () => {
		setIsLoading(true);
		setError("");
		try {
			const response = await apiService.vaccine.getAll();
			const data = response.data;
			console.log("API response:", data);
			
			if (!data || !data.result || !Array.isArray(data.result)) {
				setError("Invalid data format received from API");
				setAllVaccines([]);
				setSearchResult([]);
				setIsLoading(false);
				return;
			}
			
			// Filter only active vaccines with quantity > 0
			const activeVaccines = data.result.filter(vaccine => vaccine.quantity > 0);
			setAllVaccines(activeVaccines);
			setSearchResult(activeVaccines);
		} catch (err) {
			console.error("Fetch error:", err);
			setError("Error fetching vaccines: " + (err.response?.data?.message || err.message));
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelectVaccine = useCallback((vaccine) => {
		setSelectedVaccs((prevSelected) => {
			const existingIndex = prevSelected.findIndex((vac) => vac.vaccine.id === vaccine.id);
			if (existingIndex !== -1) {
				// Remove vaccine if already selected
				return prevSelected.filter((_, index) => index !== existingIndex);
			}
			// Add new vaccine with dose 1
			return [...prevSelected, { vaccine, dose: 1 }];
		});
	}, []);

	const handleDoseChange = useCallback((vaccineId, dose) => {
		if (dose < 1) return; // Prevent negative doses
		setSelectedVaccs((prevSelected) => 
			prevSelected.map((item) => 
				item.vaccine.id === vaccineId 
					? { ...item, dose: parseInt(dose, 10) || 1 }
					: item
			)
		);
	}, []);

	const handleAddCombo = async (values) => {
		setIsLoading(true);
		setError("");
		
		// Validate selected vaccines
		if (selectedVaccs.length === 0) {
			setError("Vui lòng chọn ít nhất một vaccine cho combo");
			setIsLoading(false);
			return;
		}
		
		// Validate doses
		const invalidDoses = selectedVaccs.filter(item => !item.dose || item.dose <= 0);
		if (invalidDoses.length > 0) {
			setError("Vui lòng nhập số liều cho tất cả vaccine đã chọn (phải lớn hơn 0)");
			setIsLoading(false);
			return;
		}
		
		try {
			// Create combo data according to backend expectations
			const comboData = {
				comboName: values.comboName,
				description: values.description,
				comboCategory: values.comboCategory,
				saleOff: values.saleOff,
				// Note: dose isn't used at combo level in this context
			};
			
			console.log("Sending combo data:", comboData);
			
			const response = await apiService.vaccine.addCombo(comboData);
			const responseData = response.data;
			console.log("Add combo response:", responseData);
			
			if (response.status >= 200 && response.status < 300) {
				const comboId = responseData.result.id;
				console.log("ComboId: ", comboId, ". Next is adding combo detail");
				await handleAddComboDetail(values, comboId);
			} else {
				setError(`Adding combo failed: ${responseData.message || "Unknown error"}`);
				setIsLoading(false);
			}
		} catch (err) {
			console.error("Error adding combo:", err);
			setError("An error occurred while adding the combo: " + (err.response?.data?.message || err.message));
			setIsLoading(false);
		}
	};

	const handleAddComboDetail = async (values, comboId) => {
		try {
			let success = true;
			let failedVaccines = [];
			
			for (const item of selectedVaccs) {
				const detailData = {
					dose: item.dose,
					comboCategory: values.comboCategory,
					saleOff: values.saleOff,
				};
				
				console.log("Adding detail for vaccine:", item.vaccine.id, "to combo:", comboId, "data:", detailData);
				
				try {
					const response = await apiService.vaccine.addComboDetail(
						item.vaccine.id, 
						comboId, 
						detailData
					);
					console.log("Add detail response:", response.data);
					
					if (response.status < 200 || response.status >= 300) {
						failedVaccines.push(item.vaccine.name || item.vaccine.vaccineName || `ID: ${item.vaccine.id}`);
						success = false;
					}
				} catch (detailErr) {
					console.error("Error adding combo detail:", detailErr);
					failedVaccines.push(item.vaccine.name || item.vaccine.vaccineName || `ID: ${item.vaccine.id}`);
					success = false;
				}
			}
			
			if (success) {
				handleClose();
				navigate("/Admin/ManageCombo");
				window.location.reload();
			} else {
				setError(`Failed to add vaccines to combo: ${failedVaccines.join(", ")}`);
			}
		} catch (err) {
			console.error("Error adding combo details:", err);
			setError("An error occurred while adding combo details: " + (err.response?.data?.message || err.message));
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = () => {
		if (!search.trim()) {
			setSearchResult(allVaccines);
			return;
		}
		
		const searchTerm = search.toLowerCase();
		const filteredResults = allVaccines.filter(vaccine => {
			return (
				(vaccine.name && vaccine.name.toLowerCase().includes(searchTerm)) ||
				(vaccine.vaccineName && vaccine.vaccineName.toLowerCase().includes(searchTerm)) ||
				(vaccine.manufacturer && vaccine.manufacturer.toLowerCase().includes(searchTerm)) ||
				(vaccine.categoryName && vaccine.categoryName.toLowerCase().includes(searchTerm))
			);
		});
		
		setSearchResult(filteredResults);
		
		if (filteredResults.length === 0) {
			setError(`No vaccines found matching "${search}"`);
		} else {
			setError("");
		}
	};

	// Format currency
	const formatCurrency = (price) => {
		return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
	};

	// Render vaccine item
	const renderVaccineItem = useCallback((vaccine) => {
		const isSelected = selectedVaccs.some((vac) => vac.vaccine.id === vaccine.id);
		return (
			<div
				key={vaccine.id}
				className={cn(
					"p-4 rounded-lg border transition-all mb-3",
					isSelected
						? "border-blue-300 bg-blue-50 shadow-sm"
						: "border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
				)}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Checkbox
							checked={isSelected}
							onCheckedChange={() => handleSelectVaccine(vaccine)}
							className="h-5 w-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
						/>
						<div>
							<p className="font-medium text-gray-900 text-lg">{vaccine.name}</p>
							<div className="flex flex-col gap-2 mt-2">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-gray-600">Manufacturer:</span>
									<span className="text-sm text-gray-600">{vaccine.manufacturer}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-gray-600">Category:</span>
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										{vaccine.categoryName || "Unknown"}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="text-right">
						<div className="flex flex-col items-end gap-1">
							<p className="font-semibold text-blue-700 bg-blue-50 px-4 py-2 rounded-full text-base border border-blue-200">
								{formatCurrency(vaccine.price || 0)}
							</p>
							{isSelected && (
								<div className="mt-2">
									<div className="flex items-center gap-2">
										<label className="text-sm text-gray-600">Dose:</label>
										<Input
											type="number"
											min="1"
											value={selectedVaccs.find(v => v.vaccine.id === vaccine.id)?.dose || 1}
											onChange={(e) => handleDoseChange(vaccine.id, parseInt(e.target.value))}
											className="w-20 text-center"
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}, [selectedVaccs, handleSelectVaccine, handleDoseChange]);

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold flex items-center">
						<Package className="h-5 w-5 mr-2 text-blue-600" />
						Add New Combo Vaccine
					</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<div className="space-y-2">
							<Label htmlFor="comboName">Combo Name *</Label>
							<Input
								id="comboName"
								name="comboName"
								placeholder="Enter Combo Name"
								value={formik.values.comboName}
								onChange={formik.handleChange}
								className={formik.touched.comboName && formik.errors.comboName ? "border-red-500" : ""}
							/>
							{formik.touched.comboName && formik.errors.comboName && (
								<p className="text-sm text-red-500">{formik.errors.comboName}</p>
							)}
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="comboCategory">Combo Category *</Label>
							<Select
								name="comboCategory"
								value={formik.values.comboCategory}
								onValueChange={(value) => formik.setFieldValue("comboCategory", value)}
							>
								<SelectTrigger className={formik.touched.comboCategory && formik.errors.comboCategory ? "border-red-500" : ""}>
									<SelectValue placeholder="---Choose Category---" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Combo for kids">Combo for kids</SelectItem>
									<SelectItem value="Combo for preschool children">Combo for preschool children</SelectItem>
								</SelectContent>
							</Select>
							{formik.touched.comboCategory && formik.errors.comboCategory && (
								<p className="text-sm text-red-500">{formik.errors.comboCategory}</p>
							)}
						</div>
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="description">Description *</Label>
						<Textarea
							id="description"
							name="description"
							placeholder="Enter Combo Description"
							rows={3}
							value={formik.values.description}
							onChange={formik.handleChange}
							className={formik.touched.description && formik.errors.description ? "border-red-500" : ""}
						/>
						{formik.touched.description && formik.errors.description && (
							<p className="text-sm text-red-500">{formik.errors.description}</p>
						)}
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="saleOff">Sale off (%)</Label>
						<Input
							id="saleOff"
							name="saleOff"
							type="number"
							placeholder="Enter sale percentage"
							value={formik.values.saleOff}
							onChange={formik.handleChange}
							className={formik.touched.saleOff && formik.errors.saleOff ? "border-red-500" : ""}
						/>
						{formik.touched.saleOff && formik.errors.saleOff && (
							<p className="text-sm text-red-500">{formik.errors.saleOff}</p>
						)}
					</div>

					<div className="border-t border-gray-200 pt-6 mt-6">
						<h3 className="text-lg font-medium mb-4 flex items-center">
							<Package className="h-5 w-5 mr-2 text-blue-600" />
							Select Vaccines for Combo
						</h3>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<div className="mb-4">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Search vaccines..."
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										className="pl-9"
									/>
								</div>
								<div className="flex justify-end mt-2">
									<Button 
										type="button" 
										variant="outline" 
										onClick={handleSearch}
										disabled={isLoading}
										size="sm"
										className="text-xs"
									>
										{isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
										Search
									</Button>
								</div>
							</div>
							
							<div className="border rounded-md overflow-hidden">
								<h4 className="p-3 bg-gray-100 font-medium border-b">Available Vaccines</h4>
								<div className="p-3 max-h-[400px] overflow-y-auto">
									{isLoading ? (
										<div className="flex justify-center items-center py-8">
											<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
										</div>
									) : searchResult.length > 0 ? (
										searchResult.map(renderVaccineItem)
									) : (
										<div className="text-center py-8 text-gray-500">
											{error || "No vaccines found"}
										</div>
									)}
								</div>
							</div>
						</div>
						
						<div>
							<div className="border rounded-md overflow-hidden">
								<h4 className="p-3 bg-gray-100 font-medium border-b flex justify-between items-center">
									<span>Selected Vaccines: {selectedVaccs.length}</span>
									{selectedVaccs.length > 0 && (
										<span className="text-sm text-blue-600">
											Total Items: {selectedVaccs.reduce((sum, item) => sum + item.dose, 0)}
										</span>
									)}
								</h4>
								<div className="p-3 bg-gray-50 min-h-[400px]">
									{selectedVaccs.length > 0 ? (
										<div className="space-y-3">
											{selectedVaccs.map((item) => (
												<div 
													key={item.vaccine.id} 
													className="p-4 rounded-lg border-2 border-blue-300 bg-white shadow-sm"
												>
													<div className="flex justify-between items-start">
														<div>
															<p className="font-medium text-gray-900">{item.vaccine.name}</p>
															<div className="mt-1 text-sm text-gray-600">
																<div className="flex items-center gap-1">
																	<span>Dose:</span>
																	<span className="font-medium">{item.dose}</span>
																</div>
															</div>
														</div>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-1 h-8 w-8 p-0 rounded-full"
															onClick={() => handleSelectVaccine(item.vaccine)}
														>
															×
														</Button>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-full py-8">
											<Package className="h-12 w-12 text-gray-300 mb-3" />
											<p className="text-gray-500">No vaccines selected</p>
											<p className="text-sm text-gray-400 mt-1">
												Select vaccines from the list to include in your combo
											</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					
					<DialogFooter className="mt-8 pt-4 border-t">
						<Button variant="outline" type="button" onClick={handleClose}>
							Cancel
						</Button>
						<Button 
							type="submit" 
							disabled={isLoading || selectedVaccs.length === 0}
							className="bg-blue-600 hover:bg-blue-700"
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save Changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddCombo;
