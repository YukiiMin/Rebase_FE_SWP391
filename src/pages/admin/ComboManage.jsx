import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MainNav from "../../components/layout/MainNav";
import AddCombo from "../../components/layout/AddCombo";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search, Plus, Filter, Package, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import apiService from "../../api/apiService";

function ComboManage() {
	const [comboList, setComboList] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [searchName, setSearchName] = useState("");
	const [searchCategory, setSearchCategory] = useState("");
	const [sortOption, setSortOption] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		getCombo();
	}, []);

	const getCombo = async () => {
		try {
			setLoading(true);
			const response = await apiService.vaccine.getComboDetails();
			const data = response.data;
			if (data && data.result) {
				const groupedCombos = groupCombos(data.result);
				setComboList(groupedCombos);
			} else {
				setError("Invalid data format received from API");
				setComboList([]);
			}
		} catch (err) {
			console.error("Error fetching combo list:", err);
			setError("Failed to fetch combo list: " + (err.response?.data?.message || err.message));
		} finally {
			setLoading(false);
		}
	};

	//Group vaccine with the same comboId
	const groupCombos = (combosData) => {
		if (!Array.isArray(combosData)) {
			console.error("Expected combosData to be an array but got:", typeof combosData);
			return [];
		}
		
		const grouped = {};
		combosData.forEach((combo) => {
			if (!combo.comboId) {
				console.warn("Combo missing comboId:", combo);
				return;
			}
			
			if (!grouped[combo.comboId]) {
				grouped[combo.comboId] = {
					comboId: combo.comboId,
					comboName: combo.comboName || "Unnamed Combo",
					description: combo.description || "",
					comboCategory: combo.comboCategory || "",
					saleOff: combo.saleOff || 0,
					total: combo.total || 0,
					vaccines: [],
				};
			}
			
			// Add vaccine to combo only if it has necessary data
			if (combo.vaccineName) {
				grouped[combo.comboId].vaccines.push({ 
					name: combo.vaccineName, 
					manufacturer: combo.manufacturer || "Unknown", 
					dose: combo.dose || 1 
				});
			}
		});
		return Object.values(grouped);
	};

	const searchCombo = () => {
		let filtered = comboList.filter((combo) => {
			const sName = combo.comboName?.toLowerCase().includes(searchName.toLowerCase()) ?? true;
			const sCategory = combo.comboCategory?.toLowerCase().includes(searchCategory.toLowerCase()) ?? true;
			return sName && sCategory;
		});
		if (sortOption) {
			filtered = [...filtered].sort((a, b) => {
				if (sortOption === "priceAsc") return (a.total || 0) - (b.total || 0);
				if (sortOption === "priceDes") return (b.total || 0) - (a.total || 0);
				return 0;
			});
		}
		return filtered;
	};

	//Pagination
	const filteredCombos = searchCombo();
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentCombos = filteredCombos.slice(indexOfFirstItems, indexOfLastItems);
	const totalPages = Math.ceil(filteredCombos.length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<MainNav isAdmin={true} />
			<div className="flex">
				<Sidebar />
				<main className="flex-1 p-8 ml-64">
					<div className="max-w-7xl mx-auto">
						<div className="flex justify-between items-center mb-8">
							<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
								<Package className="h-8 w-8 text-blue-600" />
								Combo Vaccine Management
							</h1>
							<Button 
								onClick={() => setIsOpen(true)}
								className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
							>
								<Plus className="h-5 w-5" />
								Add New Combo
							</Button>
						</div>
						
						{isOpen && <AddCombo setIsOpen={setIsOpen} open={isOpen} />}
						
						{error && (
							<Alert variant="destructive" className="mb-6">
								<AlertCircle className="h-5 w-5" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						
						{/* Search and Filters */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Combo Name</label>
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<Input
											type="text"
											placeholder="Search by name"
											value={searchName}
											onChange={(e) => setSearchName(e.target.value)}
											className="pl-9 h-10"
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
									<div className="relative">
										<Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<select
											value={searchCategory}
											onChange={(e) => setSearchCategory(e.target.value)}
											className="w-full h-10 pl-9 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
										>
											<option value="">---Category---</option>
											<option value="kids">Combo for kids</option>
											<option value="preschool">Combo for preschool children</option>
										</select>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
									<div className="relative">
										<Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<select
											value={sortOption}
											onChange={(e) => setSortOption(e.target.value)}
											className="w-full h-10 pl-9 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
							{loading ? (
								<div className="p-8 text-center">
									<div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mx-auto"></div>
									<p className="mt-4 text-gray-600">Loading combos...</p>
								</div>
							) : currentCombos.length > 0 ? (
								<>
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="w-20">#</TableHead>
													<TableHead className="min-w-[200px]">Combo Name</TableHead>
													<TableHead className="w-32">Category</TableHead>
													<TableHead className="min-w-[200px]">Description</TableHead>
													<TableHead className="min-w-[200px]">Included Vaccine</TableHead>
													<TableHead className="min-w-[200px]">Vaccine Manufacturer</TableHead>
													<TableHead className="w-32">Vaccine Dose</TableHead>
													<TableHead className="w-32">Sale Off</TableHead>
													<TableHead className="w-32">Total Price</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{currentCombos.map((combo) => (
													<TableRow key={combo.comboId}>
														<TableCell>{combo.comboId}</TableCell>
														<TableCell className="font-medium">{combo.comboName}</TableCell>
														<TableCell>
															<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
																combo.comboCategory?.toLowerCase().includes("kids") 
																	? "bg-blue-100 text-blue-800" 
																	: "bg-green-100 text-green-800"
															}`}>
																{combo.comboCategory || "Unknown"}
															</span>
														</TableCell>
														<TableCell className="max-w-[200px] truncate">
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
																{combo.saleOff || 0}%
															</span>
														</TableCell>
														<TableCell>
															<span className="font-semibold text-blue-600">
																${parseFloat(combo.total || 0).toFixed(2)}
															</span>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>

									{/* Pagination */}
									{totalPages > 0 && (
										<div className="flex items-center justify-center py-4 border-t border-gray-200">
											<nav className="flex items-center gap-2">
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
													Previous
												</Button>
												
												<div className="flex items-center gap-1">
													{[...Array(totalPages)].map((_, index) => {
														const pageNum = index + 1;
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
															return <span key={pageNum} className="px-1">...</span>;
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
													Next
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
								</>
							) : (
								<div className="p-8 text-center">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
										<Package className="h-8 w-8 text-gray-400" />
									</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">No Combos Found</h3>
									<p className="text-gray-500">
										No results match your search criteria.
									</p>
								</div>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default ComboManage;
