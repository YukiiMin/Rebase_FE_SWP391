import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navigation from "../../components/layout/Navbar";
import { 
	Users, 
	Syringe, 
	Calendar, 
	DollarSign,
	Table as TableIcon, 
	Package,
	User,
	ArrowRight,
	LayoutDashboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useTranslation } from "react-i18next";

function Dashboard() {
	const api = "http://localhost:8080";
	const token = localStorage.getItem("token");
	const [accountError, setAccountError] = useState("");
	const [userList, setUserList] = useState([]);
	const [staffList, setStaffList] = useState([]);
	const [vaccineError, setVaccineError] = useState("");
	const [vaccineList, setVaccineList] = useState([]);
	const [comboError, setComboError] = useState("");
	const [comboList, setComboList] = useState([]);
	const { t } = useTranslation();

	useEffect(() => {
		getAccount();
		getVaccine();
		getCombo();
	}, [token]);

	const getAccount = async () => {
		try {
			const response = await fetch(`${api}/users/getAllUser`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (!response.ok) {
				console.error("Failed to get accounts");
				throw new Error("Failed to get accounts");
			}
			const data = await response.json();
			const users = data.result.filter((account) => account.roleName === "USER");
			const staffs = data.result.filter((account) => account.roleName === "STAFF");
			setUserList(users);
			setStaffList(staffs);
		} catch (err) {
			setAccountError(err.message);
		}
	};

	const getVaccine = async () => {
		try {
			const response = await fetch(`${api}/vaccine/get`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (!response.ok) {
				console.error("Failed to get vaccines");
				throw new Error("Failed to get vaccines");
			}
			const data = await response.json();
			setVaccineList(data.result);
			getRandomVaccines(data.result);
		} catch (err) {
			setVaccineError(err.message);
		}
	};

	const getCombo = async () => {
		try {
			const response = await fetch(`${api}/vaccine/get/comboDetail`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (!response.ok) {
				console.error("Failed to get combos");
				throw new Error("Failed to get combos");
			}
			const data = await response.json();
			const groupedCombos = groupCombos(data.result);
			setComboList(groupedCombos);
		} catch (err) {
			setComboError(err.message);
		}
	};

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

	const getRandomUsers = (users, count) => {
		const shuffled = users.sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};
	const getRandomStaffs = (staffs, count) => {
		const shuffled = staffs.sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};
	const getRandomVaccines = (vaccines, count) => {
		const shuffled = vaccines.sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};
	const getRandomCombos = (combos, count) => {
		const shuffled = combos.sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};
	const randomUser = getRandomUsers(userList, 4);
	const randomStaff = getRandomStaffs(staffList, 4);
	const randomVaccine = getRandomVaccines(vaccineList, 3);
	const randomCombo = getRandomCombos(comboList, 3);

	return (
		<>
			<Navigation />
			<div className="admin-layout">
				<Sidebar />
				<main className="admin-content">
					<div className="admin-header flex items-center gap-2">
						<LayoutDashboard size={28} className="text-blue-600" />
						<h1 className="admin-title">{t('admin.dashboard.title')}</h1>
					</div>

					{/* Statistics Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<StatCard 
							title={t('admin.dashboard.totalAccounts')} 
							value={userList.length + staffList.length + 1} 
							icon={<Users className="h-8 w-8 text-blue-500" />}
							color="bg-blue-50"
						/>
						<StatCard 
							title={t('admin.dashboard.totalVaccines')} 
							value={vaccineList.length}
							icon={<Syringe className="h-8 w-8 text-green-500" />}
							color="bg-green-50"
						/>
						<StatCard 
							title={t('admin.dashboard.totalBookings')} 
							value={520}
							icon={<Calendar className="h-8 w-8 text-amber-500" />}
							color="bg-amber-50"
						/>
						<StatCard 
							title={t('admin.dashboard.totalSales')} 
							value="$50,000"
							icon={<DollarSign className="h-8 w-8 text-red-500" />}
							color="bg-red-50"
						/>
					</div>

					{/* Users & Staff Tables */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						<Card>
							<CardHeader className="pb-3">
								<div className="flex justify-between items-center">
									<CardTitle className="text-lg font-semibold text-gray-700">{t('admin.dashboard.registeredAccounts')}</CardTitle>
									<Link to="/Admin/ManageAccount" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
										{t('admin.dashboard.manageAccounts')}
										<ArrowRight className="ml-1 h-4 w-4" />
									</Link>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>#</TableHead>
											<TableHead>{t('admin.account.fullName')}</TableHead>
											<TableHead>{t('admin.account.username')}</TableHead>
											<TableHead>{t('admin.account.email')}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{userList.length > 0 ? (
											randomUser.map((user, index) => (
												<TableRow key={user.accountId}>
													<TableCell>{index + 1}</TableCell>
													<TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
													<TableCell>{user.username}</TableCell>
													<TableCell>{user.email}</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={4} className="text-center text-red-500">
													{accountError || t('admin.dashboard.noData')}
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-3">
								<div className="flex justify-between items-center">
									<CardTitle className="text-lg font-semibold text-gray-700">{t('admin.dashboard.staffTable')}</CardTitle>
									<Link to="/Admin/WorkSchedule" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
										{t('admin.dashboard.scheduling')}
										<ArrowRight className="ml-1 h-4 w-4" />
									</Link>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>{t('admin.vaccine.id')}</TableHead>
											<TableHead>{t('admin.account.fullName')}</TableHead>
											<TableHead>{t('admin.account.email')}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{staffList.length > 0 ? (
											randomStaff.map((user) => (
												<TableRow key={user.accountId}>
													<TableCell>{user.accountId}</TableCell>
													<TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
													<TableCell>{user.email}</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={3} className="text-center text-red-500">
													{accountError || t('admin.dashboard.noData')}
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>

					{/* Vaccine Table */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
						<Card className="md:col-span-3">
							<CardHeader className="pb-3">
								<div className="flex justify-between items-center">
									<CardTitle className="text-lg font-semibold text-gray-700">{t('admin.dashboard.vaccineInventory')}</CardTitle>
									<Link to="/Admin/ManageVaccine" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
										{t('admin.dashboard.manageVaccines')}
										<ArrowRight className="ml-1 h-4 w-4" />
									</Link>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>{t('admin.vaccine.id')}</TableHead>
											<TableHead>{t('admin.vaccine.vaccineName')}</TableHead>
											<TableHead>{t('admin.vaccine.quantity')}</TableHead>
											<TableHead>{t('admin.vaccine.unitPrice')}</TableHead>
											<TableHead>{t('admin.vaccine.salePrice')}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{vaccineList.length > 0 ? (
											randomVaccine.map((vaccine) => (
												<TableRow key={vaccine.id}>
													<TableCell>{vaccine.id}</TableCell>
													<TableCell>{vaccine.name}</TableCell>
													<TableCell>{vaccine.quantity}</TableCell>
													<TableCell>{vaccine.unitPrice}</TableCell>
													<TableCell>{vaccine.salePrice}</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={5} className="text-center text-red-500">
													{vaccineError || t('admin.dashboard.noData')}
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>

						<Card className="flex flex-col items-center justify-center p-6">
							<CardTitle className="text-lg font-semibold text-gray-700 mb-4">{t('admin.dashboard.topVaccine')}</CardTitle>
							<p className="text-red-500">{t('admin.dashboard.noData')}</p>
						</Card>
					</div>

					{/* Combo Table */}
					<Card>
						<CardHeader className="pb-3">
							<div className="flex justify-between items-center">
								<CardTitle className="text-lg font-semibold text-gray-700">{t('admin.dashboard.comboTable')}</CardTitle>
								<Link to="/Admin/ManageCombo" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
									{t('admin.dashboard.manageCombos')}
									<ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</div>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t('admin.combo.id')}</TableHead>
										<TableHead>{t('admin.combo.comboName')}</TableHead>
										<TableHead>{t('admin.combo.includedVaccine')}</TableHead>
										<TableHead>{t('admin.combo.saleOff')}</TableHead>
										<TableHead>{t('admin.combo.totalPrice')}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{comboList.length > 0 ? (
										randomCombo.map((combo) => (
											<TableRow key={combo.comboId}>
												<TableCell>{combo.comboId}</TableCell>
												<TableCell>{combo.comboName}</TableCell>
												<TableCell>
													{combo.vaccines.map((vaccine, idx) => (
														<div key={idx}>
															{vaccine.name}
														</div>
													))}
												</TableCell>
												<TableCell>
													<Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
														{combo.saleOff}%
													</Badge>
												</TableCell>
												<TableCell>
													<span className="font-semibold text-blue-600">${combo.total}</span>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={5} className="text-center text-red-500">
												{comboError || t('admin.dashboard.noData')}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</main>
			</div>
		</>
	);
}

const StatCard = ({ title, value, icon, color }) => {
	return (
		<Card className={`${color} border-none shadow-sm`}>
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-3xl font-bold">{value}</p>
						<p className="text-sm text-gray-600 mt-1">{title}</p>
					</div>
					<div className="rounded-full p-3 bg-white/80 shadow-sm">
						{icon}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default Dashboard;