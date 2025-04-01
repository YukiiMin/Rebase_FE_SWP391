import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import AddCombo from "../../components/layout/AddCombo";
import Navigation from "../../components/layout/Navbar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search, Plus, Filter, Package } from "lucide-react";

function ComboManage() {
	const [comboList, setComboList] = useState([]);
	const comboAPI = "http://localhost:8080/vaccine/comboDetails";
	const [isOpen, setIsOpen] = useState(false);
	const [searchName, setSearchName] = useState("");
	const [searchCategory, setSearchCategory] = useState("");
	const [sortOption, setSortOption] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of items per page

	useEffect(() => {
		getCombo();
	}, []);

	const getCombo = async () => {
		try {
			const response = await fetch(`${comboAPI}`);
			if (response.ok) {
				const data = await response.json();
				const groupedCombos = groupCombos(data.result);
				setComboList(groupedCombos);
			} else {
				console.error("Getting combo list failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when getting combo list: ", err);
		}
	};

	//Group vaccine with the same comboId
	const groupCombos = (combosData) => {
		const grouped = {};
		combosData.forEach((combo) => {
			if (!grouped[combo.comboId]) {
				grouped[combo.comboId] = {
					comboId: combo.comboId,
					comboName: combo.comboName,
					description: combo.description,
					comboCategory: combo.comboCategory,
					saleOff: combo.saleOff,
					total: combo.total,
					vaccines: [], // Initialize vaccines array
				};
			}
			grouped[combo.comboId].vaccines.push({ name: combo.vaccineName, manufacturer: combo.manufacturer, dose: combo.dose });
		});
		// Convert grouped object to array
		return Object.values(grouped);
	};

	const searchCombo = () => {
		let filtered = comboList.filter((combo) => {
			const sName = combo.comboName.toLowerCase().includes(searchName.toLowerCase());
			const sCategory = combo.comboCategory.toLowerCase().includes(searchCategory.toLowerCase());
			return sName && sCategory;
		});
		if (sortOption) {
			filtered = [...filtered].sort((a, b) => {
				if (sortOption === "priceAsc") return a.total - b.total;
				if (sortOption === "priceDes") return b.total - a.total;
				return 0;
			});
		}
		return filtered;
	};

	//Pagination
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentCombos = searchCombo().slice(indexOfFirstItems, indexOfLastItems); //Ensure list not empty
	const totalPages = Math.ceil(searchCombo().length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	return (
		<>
			<Navigation />
			<div className="admin-layout">
				<Sidebar />
				<main className="admin-content">
					<div className="admin-header flex justify-between items-center">
						<h1 className="admin-title flex items-center gap-2">
							<Package size={24} className="text-blue-600" />
							Combo Vaccine Management
						</h1>
						<Button 
							className="flex items-center gap-2"
							onClick={() => setIsOpen(true)}
						>
							<Plus size={16} />
							Add New Combo
						</Button>
					</div>
					
					{isOpen && <AddCombo setIsOpen={setIsOpen} open={isOpen} />}
					
					{/* Search and Filters */}
					<div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
						<div className="flex flex-col md:flex-row gap-4 items-end">
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 mb-1">Combo Name</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										type="text"
										placeholder="Search by name"
										value={searchName}
										onChange={(e) => setSearchName(e.target.value)}
										className="pl-9"
									/>
								</div>
							</div>
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
								<div className="relative">
									<Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<select
										value={searchCategory}
										onChange={(e) => setSearchCategory(e.target.value)}
										className="pl-9 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									>
										<option value="">---Category---</option>
										<option value="kids">Combo for kids</option>
										<option value="preschool">Combo for preschool children</option>
									</select>
								</div>
							</div>
							<div className="w-full md:w-auto">
								<label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
								<div className="relative">
									<Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<select
										value={sortOption}
										onChange={(e) => setSortOption(e.target.value)}
										className="pl-9 h-9 w-full md:w-52 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									>
										<option value="">---Sort---</option>
										<option value="priceAsc">Price (Low to High)</option>
										<option value="priceDes">Price (High to Low)</option>
									</select>
								</div>
							</div>
						</div>
					</div>
					
					{/* Combos Table */}
					<div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>#</TableHead>
									<TableHead>Combo Name</TableHead>
									<TableHead>Combo Category</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Included Vaccine</TableHead>
									<TableHead>Vaccine Manufacturer</TableHead>
									<TableHead>Vaccine Dose</TableHead>
									<TableHead>Sale Off</TableHead>
									<TableHead>Total Price</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentCombos.length > 0 ? (
									currentCombos.map((combo) => (
										<TableRow key={combo.comboId}>
											<TableCell>{combo.comboId}</TableCell>
											<TableCell>{combo.comboName}</TableCell>
											<TableCell>
												<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
													combo.comboCategory === "kids" 
														? "bg-blue-100 text-blue-800" 
														: "bg-green-100 text-green-800"
												}`}>
													{combo.comboCategory}
												</span>
											</TableCell>
											<TableCell className="max-w-[180px] truncate">
												{combo.description}
											</TableCell>
											<TableCell>
												{combo.vaccines.map((v, index, array) => (
													<div key={index} className={index < array.length - 1 ? "mb-1" : ""}>
														{v.name}
													</div>
												))}
											</TableCell>
											<TableCell>
												{combo.vaccines.map((v, index, array) => (
													<div key={index} className={index < array.length - 1 ? "mb-1" : ""}>
														{v.manufacturer}
													</div>
												))}
											</TableCell>
											<TableCell>
												{combo.vaccines.map((v, index, array) => (
													<div key={index} className={index < array.length - 1 ? "mb-1" : ""}>
														{v.dose}
													</div>
												))}
											</TableCell>
											<TableCell>
												<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
													{combo.saleOff}%
												</span>
											</TableCell>
											<TableCell>
												<span className="font-semibold text-blue-600">
													${parseFloat(combo.total).toFixed(2)}
												</span>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={9} className="text-center py-6 text-gray-500">
											No Result
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
						
						{/* Custom Pagination */}
						{totalPages > 0 && (
							<div className="flex items-center justify-center mt-6">
								<nav className="flex items-center space-x-2">
									<Button 
										variant="outline"
										size="sm"
										disabled={currentPage === 1}
										onClick={() => handlePageChange(1)}
										className="px-3 py-1"
									>
										First
									</Button>
									<Button 
										variant="outline"
										size="sm"
										disabled={currentPage === 1}
										onClick={() => handlePageChange(currentPage - 1)}
										className="px-3 py-1"
									>
										&laquo; Prev
									</Button>
									
									<div className="flex items-center space-x-1">
										{[...Array(totalPages)].map((_, index) => {
											const pageNum = index + 1;
											// Show limited page numbers
											if (
												pageNum === 1 ||
												pageNum === totalPages ||
												(pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
											) {
												return (
													<Button
														key={pageNum}
														variant={pageNum === currentPage ? "default" : "outline"}
														size="sm"
														onClick={() => handlePageChange(pageNum)}
														className="px-3 py-1"
													>
														{pageNum}
													</Button>
												);
											} else if (
												pageNum === currentPage - 2 ||
												pageNum === currentPage + 2
											) {
												return <span key={pageNum}>...</span>;
											}
											return null;
										})}
									</div>
									
									<Button 
										variant="outline"
										size="sm"
										disabled={currentPage === totalPages}
										onClick={() => handlePageChange(currentPage + 1)}
										className="px-3 py-1"
									>
										Next &raquo;
									</Button>
									<Button 
										variant="outline"
										size="sm"
										disabled={currentPage === totalPages}
										onClick={() => handlePageChange(totalPages)}
										className="px-3 py-1"
									>
										Last
									</Button>
								</nav>
							</div>
						)}
					</div>
				</main>
			</div>
		</>
	);
}

export default ComboManage;
