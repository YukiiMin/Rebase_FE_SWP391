import { useFormik } from "formik";
import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";

function AddCombo({ setIsOpen, open }) {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const searchVaccAPI = "http://localhost:8080/vaccine";
	const comboAPI = "http://localhost:8080/vaccine/combo";

	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [selectedVaccs, setSelectedVaccs] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleClose = () => setIsOpen(false);

	const validation = Yup.object({
		comboName: Yup.string().required("Combo Name is required"),
		description: Yup.string().required("Description is required").min(30, "Description must be at least 30 characters"),
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

	const handleSelectVaccine = (vaccine) => {
		const isSelected = selectedVaccs.some((vac) => vac.vaccine.id === vaccine.id);
		if (isSelected) {
			setSelectedVaccs(selectedVaccs.filter((vac) => vac.vaccine.id !== vaccine.id));
		} else {
			setSelectedVaccs([...selectedVaccs, { vaccine, dose: 0 }]);
		}
	};

	const handleDoseChange = (vaccineId, dose) => {
		setSelectedVaccs(selectedVaccs.map((v) => (v.vaccine.id === vaccineId ? { ...v, dose: parseInt(dose, 10) || 0 } : v)));
	};

	const handleAddCombo = async (values) => {
		setIsLoading(true);
		setError("");
		try {
			const comboData = {
				comboName: values.comboName,
				description: values.description,
			};
			const response = await fetch(`${comboAPI}/add`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(comboData),
			});
			if (response.ok) {
				const data = await response.json();
				const comboId = data.result.id;
				console.log("ComboId: ", comboId, ". Next is adding combo detail");
				handleAddComboDetail(values, comboId);
			} else {
				setError("Adding combo failed. Please try again.");
				setIsLoading(false);
			}
		} catch (err) {
			setError("An error occurred while adding the combo: " + err.message);
			setIsLoading(false);
		}
	};

	const handleAddComboDetail = async (values, comboId) => {
		try {
			let success = true;
			for (const item of selectedVaccs) {
				const detailData = {
					dose: item.dose,
					comboCategory: values.comboCategory,
					saleOff: values.saleOff,
				};
				const response = await fetch(`${comboAPI}/detail/${comboId}/${item.vaccine.id}`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(detailData),
				});
				if (!response.ok) {
					setError(`Failed to add vaccine ${item.vaccine.name} to combo.`);
					success = false;
				}
			}
			if (success) {
				handleClose();
				navigate("/Admin/ManageCombo");
				window.location.reload();
			}
		} catch (err) {
			setError("An error occurred while adding combo details: " + err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = async (search) => {
		if (!search.trim()) return;
		
		setIsLoading(true);
		setError("");
		try {
			const response = await fetch(`${searchVaccAPI}/${search}`);
			if (response.ok) {
				const data = await response.json();
				setSearchResult(data.result);
			} else {
				setError("Failed to search for vaccines. Please try again.");
			}
		} catch (err) {
			setError("Search error: " + err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[900px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Add New Combo Vaccine</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
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
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Input
									placeholder="Vaccine name..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="flex-1"
								/>
								<Button 
									type="button" 
									variant="outline" 
									onClick={() => handleSearch(search)}
									disabled={isLoading}
								>
									{isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
									Search
								</Button>
							</div>
							
							<div className="border rounded-md overflow-hidden">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[50px]"></TableHead>
											<TableHead className="w-[50px]">#</TableHead>
											<TableHead>Vaccine name</TableHead>
											<TableHead>Unit Price</TableHead>
											<TableHead>Dose</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{searchResult.length > 0 ? (
											searchResult.map((vaccine) => (
												<TableRow key={vaccine.id}>
													<TableCell>
														<Checkbox
															checked={selectedVaccs.some((vac) => vac.vaccine.id === vaccine.id)}
															onCheckedChange={() => handleSelectVaccine(vaccine)}
														/>
													</TableCell>
													<TableCell>{vaccine.id}</TableCell>
													<TableCell>{vaccine.name}</TableCell>
													<TableCell>{vaccine.price}</TableCell>
													<TableCell>
														<Input
															type="number"
															placeholder="Enter dose"
															value={selectedVaccs.find((v) => v.vaccine.id === vaccine.id)?.dose || 0}
															onChange={(e) => handleDoseChange(vaccine.id, e.target.value)}
															disabled={!selectedVaccs.some((vac) => vac.vaccine.id === vaccine.id)}
															className="w-20"
														/>
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={5} className="text-center">
													{isLoading ? "Searching..." : "No results found"}
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</div>
						
						<div className="space-y-4">
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
							
							<div className="mt-6">
								<h3 className="text-lg font-medium">Selected Vaccines: {selectedVaccs.length}</h3>
								<div className="mt-2 p-2 border rounded-md bg-gray-50 min-h-[100px]">
									{selectedVaccs.length > 0 ? (
										<ul className="list-disc pl-5 space-y-1">
											{selectedVaccs.map((item) => (
												<li key={item.vaccine.id}>
													{item.vaccine.name} - {item.dose} dose(s)
												</li>
											))}
										</ul>
									) : (
										<p className="text-sm text-gray-500 italic">No vaccines selected</p>
									)}
								</div>
							</div>
						</div>
					</div>
					
					<DialogFooter>
						<Button variant="outline" type="button" onClick={handleClose}>
							Cancel
						</Button>
						<Button 
							type="submit" 
							disabled={isLoading || selectedVaccs.length === 0}
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
