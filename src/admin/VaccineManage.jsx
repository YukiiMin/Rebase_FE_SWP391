import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddVaccine from "../components/AddVaccine";
import Navigation from "../components/Navbar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Plus, Edit, Trash, FileText, Filter, Syringe, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

function VaccineManage() {
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const [vaccines, setVaccines] = useState([]);
	const apiUrl = "http://localhost:8080/vaccine/get";
	const token = localStorage.getItem("token");
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false); //Form Add Vaccine
	const [searchName, setSearchName] = useState("");
	const [searchManufacturer, setSearchManufacturer] = useState("");
	const [sortOption, setSortOption] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // Number of items per page

	useEffect(() => {
		fetchVaccine();
	}, []);

	const fetchVaccine = async () => {
		try {
			const response = await fetch(apiUrl, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Vaccines:", data);
				setVaccines(data.result || []);
			} else {
				console.error("Fetching vaccine failed: ", response.status);
				alert("Failed to fetch vaccines. Please try again.");
			}
		} catch (err) {
			console.error("Error fetching vaccine: ", err);
			alert("An error occurred while fetching vaccines.");
		}
	};

	const searchVaccine = () => {
		let filtered = vaccines.filter((vaccine) => {
			const sName = vaccine.name.toLowerCase().includes(searchName.toLowerCase());
			const sManufacturer = vaccine.manufacturer.toLowerCase().includes(searchManufacturer.toLowerCase());
			return sName && sManufacturer;
		});
		
		if (sortOption) {
			filtered = [...filtered].sort((a, b) => {
				if (sortOption === "quantityAsc") return a.quantity - b.quantity;
				if (sortOption === "unitPriceAsc") return a.unitPrice - b.unitPrice;
				if (sortOption === "salePriceAsc") return a.salePrice - b.salePrice;
				if (sortOption === "quantityDes") return b.quantity - a.quantity;
				if (sortOption === "unitPriceDes") return b.unitPrice - a.unitPrice;
				if (sortOption === "salePriceDes") return b.salePrice - a.salePrice;
				return 0;
			});
		}
		return filtered;
	};

	//Pagination
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentVaccines = searchVaccine().slice(indexOfFirstItems, indexOfLastItems);
	const totalPages = Math.ceil(searchVaccine().length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleVaccineAdded = (newVaccine) => {
		if (newVaccine) {
			setVaccines([newVaccine, ...vaccines]);
		} else {
			fetchVaccine();
		}
	};

	return (
		<>
			<Navigation />
			<div className="admin-layout">
				<Sidebar />
				<main className="admin-content">
					<div className="admin-header flex justify-between items-center">
						<h1 className="admin-title flex items-center gap-2">
							<Syringe size={24} className="text-blue-600" />
							{t('admin.vaccine.title')}
						</h1>
						<Button 
							className="flex items-center gap-2"
							onClick={() => setIsOpen(true)}
						>
							<Plus size={16} />
							{t('admin.vaccine.addVaccine')}
						</Button>
					</div>
					
					{isOpen && <AddVaccine setIsOpen={setIsOpen} open={isOpen} onAdded={handleVaccineAdded} />}
					
					{/* Search and Filters */}
					<div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
						<div className="flex flex-col md:flex-row gap-4 items-end">
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.vaccine.searchPlaceholder')}</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										type="text"
										placeholder={t('admin.vaccine.searchPlaceholder')}
										value={searchName}
										onChange={(e) => setSearchName(e.target.value)}
										className="pl-9"
									/>
								</div>
							</div>
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.vaccine.manufacturer')}</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										type="text"
										placeholder={t('admin.vaccine.manufacturer')}
										value={searchManufacturer}
										onChange={(e) => setSearchManufacturer(e.target.value)}
										className="pl-9"
									/>
								</div>
							</div>
							<div className="w-full md:w-auto">
								<label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.vaccine.sortBy')}</label>
								<div className="relative">
									<Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<select
										value={sortOption}
										onChange={(e) => setSortOption(e.target.value)}
										className="pl-9 h-9 w-full md:w-52 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									>
										<option value="">---{t('admin.vaccine.sortBy')}---</option>
										<option value="quantityAsc">{t('admin.vaccine.quantityAsc')}</option>
										<option value="quantityDes">{t('admin.vaccine.quantityDes')}</option>
										<option value="unitPriceAsc">{t('admin.vaccine.unitPriceAsc')}</option>
										<option value="unitPriceDes">{t('admin.vaccine.unitPriceDes')}</option>
										<option value="salePriceAsc">{t('admin.vaccine.salePriceAsc')}</option>
										<option value="salePriceDes">{t('admin.vaccine.salePriceDes')}</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					{/* Vaccines Table */}
					<div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t('admin.vaccine.id')}</TableHead>
									<TableHead>{t('admin.vaccine.vaccineName')}</TableHead>
									<TableHead>{t('admin.vaccine.manufacturer')}</TableHead>
									<TableHead>{t('admin.vaccine.quantity')}</TableHead>
									<TableHead>{t('admin.vaccine.unitPrice')}</TableHead>
									<TableHead>{t('admin.vaccine.salePrice')}</TableHead>
									<TableHead>{t('admin.vaccine.status')}</TableHead>
									<TableHead>{t('admin.vaccine.actions')}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentVaccines.length > 0 ? (
									currentVaccines.map((vaccine) => (
										<TableRow key={vaccine.id}>
											<TableCell>{vaccine.id}</TableCell>
											<TableCell>{vaccine.name}</TableCell>
											<TableCell>{vaccine.manufacturer}</TableCell>
											<TableCell>{vaccine.quantity}</TableCell>
											<TableCell>${vaccine.unitPrice}</TableCell>
											<TableCell>${vaccine.salePrice}</TableCell>
											<TableCell>
												{vaccine.quantity > 0 
													? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{t('admin.vaccine.inStock')}</span> 
													: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{t('admin.vaccine.outOfStock')}</span>}
											</TableCell>
											<TableCell>
												<div className="flex flex-col gap-1">
													<Button 
														variant="outline" 
														size="sm" 
														className="flex items-center justify-center gap-1 w-full py-1"
													>
														<FileText size={14} />
														Protocol
													</Button>
													<Button 
														variant="default" 
														size="sm" 
														className="flex items-center justify-center gap-1 w-full py-1"
													>
														<Edit size={14} />
														Edit
													</Button>
													<Button 
														variant="destructive" 
														size="sm" 
														className="flex items-center justify-center gap-1 w-full py-1"
													>
														<Trash size={14} />
														Delete
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={8} className="text-center py-6 text-gray-500">
											{t('admin.dashboard.noData')}
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
										{t('admin.common.first')}
									</Button>
									<Button 
										variant="outline"
										size="sm"
										disabled={currentPage === 1}
										onClick={() => handlePageChange(currentPage - 1)}
										className="px-3 py-1"
									>
										{t('admin.common.prev')}
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
										{t('admin.common.next')}
									</Button>
									<Button 
										variant="outline"
										size="sm"
										disabled={currentPage === totalPages}
										onClick={() => handlePageChange(totalPages)}
										className="px-3 py-1"
									>
										{t('admin.common.last')}
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

export default VaccineManage;
