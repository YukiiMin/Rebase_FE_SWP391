import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import UpdateRole from "../../components/layout/UpdateRole";
import AddAccount from "../../components/layout/AddAccount";
import Navigation from "../../components/layout/Navbar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Plus, Edit, Check, X, Settings, User, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { useTranslation } from "react-i18next";

function AccountManage() {
	const token = localStorage.getItem("token");
	const [accountList, setAccountList] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isUpdateOpen, setIsUpdateOpen] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [error, setError] = useState("");
	const { t } = useTranslation();

	// const accountAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/account";
	const accountAPI = "http://localhost:8080/users/getAllUser";

	useEffect(() => {
		fetchAccount();
	}, [accountAPI, token]);

	const fetchAccount = async () => {
		try {
			const response = await fetch(accountAPI, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setAccountList(data.result);
			} else {
				throw new Error("Failed to fetch users");
			}
		} catch (err) {
			setError(err.message);
		}
	};

	const handleUpdateClick = (accountId) => {
		setSelectedAccount(accountId);
		setIsUpdateOpen(true);
	};

	const handleAddAccount = (newAccount) => {
		if (newAccount) {
			setAccountList([newAccount, ...accountList]);
		} else {
			fetchAccount();
		}
	};

	//Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6; // Number of items per page
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentsAccounts = accountList && accountList.length > 0 ? accountList.slice(indexOfFirstItems, indexOfLastItems) : []; //Ensure list not empty
	const totalPages = Math.ceil(accountList.length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
		setCurrentPage(1);
	};

	const handleDeactivate = async (accountId, currentStatus) => {
		try {
			const confirmMessage = currentStatus 
				? "Are you sure you want to deactivate this account?" 
				: "Are you sure you want to activate this account?";
			
			if (!window.confirm(confirmMessage)) return;

			const response = await fetch(`http://localhost:8080/users/account/${accountId}/status`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					status: !currentStatus
				}),
			});

			if (response.ok) {
				// Cập nhật trạng thái tài khoản trong danh sách
				const updatedAccounts = accountList.map(account => 
					account.accountId === accountId 
						? {...account, status: !currentStatus} 
						: account
				);
				setAccountList(updatedAccounts);
				
				alert(`Account ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
			} else {
				const errorData = await response.json();
				alert(`Failed to update account status: ${errorData.message || "Unknown error"}`);
			}
		} catch (err) {
			console.error("Error updating account status: ", err);
			alert("An error occurred while updating account status.");
		}
	};

	const filteredUsers = () => {
		return accountList.filter((user) => {
			const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
			return (
				searchQuery === "" ||
				fullName.includes(searchQuery.toLowerCase()) ||
				user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.email.toLowerCase().includes(searchQuery.toLowerCase())
			);
		});
	};

	const getCurrentPageData = () => {
		const filtered = filteredUsers();
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filtered.slice(startIndex, startIndex + itemsPerPage);
	};

	return (
		<>
			<Navigation />
			<div className="admin-layout">
				<Sidebar />
				<main className="admin-content">
					<div className="admin-header flex justify-between items-center">
						<h1 className="admin-title flex items-center gap-2">
							<User size={24} className="text-blue-600" />
							{t('admin.account.title')}
						</h1>
						<Button 
							className="flex items-center gap-2"
							onClick={() => setIsOpen(true)}
						>
							<Plus size={16} />
							{t('admin.account.addAccount')}
						</Button>
					</div>
					
					{isOpen && <AddAccount setIsOpen={setIsOpen} open={isOpen} onAccountAdded={handleAddAccount} />}
					
					<Card className="mb-8">
						<CardHeader className="pb-0">
							<div className="flex justify-between items-center">
								<CardTitle className="text-lg font-semibold text-gray-700">{t('admin.account.manageAccounts')}</CardTitle>
								<Button className="bg-green-600 hover:bg-green-700 gap-1.5">
									<Plus className="h-4 w-4" />
									{t('admin.account.addAccount')}
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="mt-4">
								<div className="relative">
									<Input
										type="text"
										placeholder={t('admin.account.searchPlaceholder')}
										className="pl-4"
										value={searchQuery}
										onChange={handleSearchChange}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
					
					<Card>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[80px]">{t('admin.account.id')}</TableHead>
											<TableHead>{t('admin.account.fullName')}</TableHead>
											<TableHead>{t('admin.account.username')}</TableHead>
											<TableHead>{t('admin.account.email')}</TableHead>
											<TableHead>{t('admin.account.role')}</TableHead>
											<TableHead className="text-center">{t('admin.account.status')}</TableHead>
											<TableHead className="text-center">{t('admin.account.actions')}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{accountList.length > 0 ? (
											getCurrentPageData().map((user) => (
												<TableRow 
													key={user.accountId} 
													className={!user.status ? "bg-gray-100" : ""}
												>
													<TableCell>{user.accountId}</TableCell>
													<TableCell>
														{user.firstName} {user.lastName}
													</TableCell>
													<TableCell>{user.username}</TableCell>
													<TableCell>{user.email}</TableCell>
													<TableCell>
														<Badge variant="outline" className={`
															${user.roleName === "ADMIN" ? "bg-purple-100 text-purple-800 border-purple-200" : ""} 
															${user.roleName === "USER" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
															${user.roleName === "STAFF" ? "bg-green-100 text-green-800 border-green-200" : ""}
														`}>
															{user.roleName}
														</Badge>
													</TableCell>
													<TableCell className="text-center">
														{user.status ? (
															<Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
																{t('admin.account.active')}
															</Badge>
														) : (
															<Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
																{t('admin.account.inactive')}
															</Badge>
														)}
													</TableCell>
													<TableCell>
														<div className="flex items-center justify-center gap-2">
															{user.roleName !== "ADMIN" && (
																<Button 
																	variant="outline" 
																	size="icon" 
																	className="h-8 w-8" 
																	onClick={() => handleUpdateClick(user.accountId)}
																	title={t('admin.account.makeAdmin')}
																>
																	<Settings className="h-4 w-4" />
																</Button>
															)}
															{user.roleName !== "STAFF" && user.roleName !== "ADMIN" && (
																<Button 
																	variant="outline" 
																	size="icon" 
																	className="h-8 w-8" 
																	onClick={() => handleUpdateClick(user.accountId)}
																	title={t('admin.account.makeStaff')}
																>
																	<Edit className="h-4 w-4" />
																</Button>
															)}
															<Button 
																variant="outline" 
																size="icon" 
																className={`h-8 w-8 ${user.status ? "text-red-500 hover:text-red-700 hover:border-red-200" : "text-green-500 hover:text-green-700 hover:border-green-200"}`}
																onClick={() => handleDeactivate(user.accountId, user.status)}
																title={user.status ? t('admin.account.deactivate') : t('admin.account.activate')}
															>
																{user.status ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
															</Button>
														</div>
														{isUpdateOpen && <UpdateRole setIsOpen={setIsUpdateOpen} open={isUpdateOpen} userId={selectedAccount} />}
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={7} className="text-center text-red-500">
													{error || t('admin.dashboard.noData')}
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>

							{/* Pagination */}
							{accountList.length > 0 && (
								<div className="flex items-center justify-between p-4 border-t">
									<div className="text-sm text-gray-500">
										{t('admin.common.showing')} {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers().length)} - {Math.min(currentPage * itemsPerPage, filteredUsers().length)} {t('admin.common.of')} {filteredUsers().length} {t('admin.common.items')}
									</div>
									<div className="flex gap-1">
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8"
											onClick={() => handlePageChange(1)}
											disabled={currentPage === 1}
										>
											<ChevronLeft className="h-4 w-4" />
											<ChevronLeft className="h-4 w-4 -ml-2" />
										</Button>
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8"
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage === 1}
										>
											<ChevronLeft className="h-4 w-4" />
										</Button>
										{Array.from({ length: totalPages }, (_, i) => i + 1)
											.filter(page => 
												page === 1 || 
												page === totalPages || 
												(page >= currentPage - 1 && page <= currentPage + 1)
											)
											.map((page, i, arr) => (
												<React.Fragment key={page}>
													{i > 0 && arr[i - 1] !== page - 1 && (
														<Button
															variant="outline"
															size="icon"
															className="h-8 w-8"
															disabled
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													)}
													<Button
														variant={page === currentPage ? "default" : "outline"}
														onClick={() => handlePageChange(page)}
														className="h-8 w-8"
													>
														{page}
													</Button>
												</React.Fragment>
											))}
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8"
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage === totalPages}
										>
											<ChevronRight className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8"
											onClick={() => handlePageChange(totalPages)}
											disabled={currentPage === totalPages}
										>
											<ChevronRight className="h-4 w-4" />
											<ChevronRight className="h-4 w-4 -ml-2" />
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</main>
			</div>
		</>
	);
}

export default AccountManage;
