import React, { useEffect, useState } from "react";
import { Card, Table, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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
		<div className="bg-gray-100 min-h-screen">
			{/* {console.log(accountList, vaccineList, comboList)} */}
			<Row>
				<Sidebar />
				<Col>
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Dashboard</h1>
						<hr className="mb-4" />

						{/* Statistic cards */}
						<Row className="mb-4">
							{[
								{ title: "Total Accounts", value: userList.length + staffList.length + 1, color: "bg-blue-200" },
								{ title: "Total Vaccines", value: vaccineList.length, color: "bg-green-200" },
								{ title: "Total Bookings", value: 520, color: "bg-yellow-200" },
								{ title: "Total Sales ($)", value: "$50,000", color: "bg-red-200" },
							].map((stat, index) => (
								<Col md={3} key={index}>
									<Card className="shadow-md rounded-lg border-0">
										<div className={`p-3 text-center ${stat.color} rounded-lg`}>
											<h5 className="text-lg font-bold text-gray-700">{stat.title}</h5>
											<p className="text-2xl font-semibold text-blue-600">{stat.value}</p>
										</div>
									</Card>
								</Col>
							))}
						</Row>

						{/* Users & Staff Tables */}
						<Row className="mb-4">
							<Col md={6}>
								<Card className="shadow-md p-3">
									<div className="flex justify-between items-center mb-3">
										<h5 className="text-lg font-bold">Registered Account</h5>
										<Link to="/Admin/ManageAccount" className="text-blue-600 hover:underline">
											Manage Accounts
										</Link>
									</div>
									<Table hover className="w-full border border-gray-200 rounded-lg overflow-hidden">
										<thead className="bg-gray-100 text-gray-600 text-sm uppercase">
											<tr>
												<th className="px-2 py-2 text-left">#</th>
												<th className="px-2 py-2 text-left">Fullname</th>
												<th className="px-2 py-2 text-left">Username</th>
												<th className="px-2 py-2 text-left">Email</th>
											</tr>
										</thead>
										<tbody className="text-gray-700">
											{userList.length > 0 ? (
												randomUser.map((user, index) => (
													<tr key={user.accountId}>
														<td className="px-2 py-2 text-left">{index + 1}</td>
														<td className="px-2 py-2 text-left">{`${user.firstName} ${user.lastName}`}</td>
														<td className="px-2 py-2 text-left">{user.username}</td>
														<td className="px-2 py-2 text-left">{user.email}</td>
													</tr>
												))
											) : (
												<tr>
													<td colSpan={4}>
														<p className="text-red-500 text-center">{accountError}</p>
													</td>
												</tr>
											)}
										</tbody>
									</Table>
								</Card>
							</Col>
							<Col md={6}>
								<Card className="shadow-md p-3">
									<div className="flex justify-between items-center mb-3">
										<h5 className="text-lg font-bold">Staff Table</h5>
										<Link to="/Admin/WorkSchedule" className="text-blue-600 hover:underline">
											Scheduling
										</Link>
									</div>
									<Table hover className="w-full border border-gray-200 rounded-lg overflow-hidden">
										<thead className="bg-gray-100 text-gray-600 text-sm uppercase">
											<tr>
												<th className="px-2 py-2 text-left">ID</th>
												<th className="px-2 py-2 text-left">Fullname</th>
												<th className="px-2 py-2 text-left">Email</th>
											</tr>
										</thead>
										<tbody className="text-gray-700">
											{staffList.length > 0 ? (
												randomStaff.map((user, index) => (
													<tr key={user.accountId}>
														<td className="px-2 py-2 text-left">{user.accountId}</td>
														<td className="px-2 py-2 text-left">{`${user.firstName} ${user.lastName}`}</td>
														<td className="px-2 py-2 text-left">{user.email}</td>
													</tr>
												))
											) : (
												<tr>
													<td colSpan={4}>
														<p className="text-red-500 text-center">No data</p>
													</td>
												</tr>
											)}
										</tbody>
									</Table>
									{accountError && <p className="text-red-500 text-center">{accountError}</p>}
								</Card>
							</Col>
						</Row>

						{/* Vaccine Table */}
						<Row>
							<Col md={9}>
								<Card className="shadow-md p-3 mb-4">
									<div className="flex justify-between items-center mb-3">
										<h5 className="text-lg font-bold">Vaccine Inventory</h5>
										<Link to="/Admin/ManageVaccine" className="text-blue-600 hover:underline">
											Manage Vaccines
										</Link>
									</div>
									<Table hover className="w-full border border-gray-200 rounded-lg overflow-hidden">
										<thead className="bg-gray-100 text-gray-600 text-sm uppercase">
											<tr>
												<th className="px-4 py-2 text-left">ID</th>
												<th className="px-4 py-2 text-left">Vaccine Name</th>
												<th className="px-4 py-2 text-left">Quantity</th>
												<th className="px-4 py-2 text-left">Unit Price ($)</th>
												<th className="px-4 py-2 text-left">Sale Price ($)</th>
											</tr>
										</thead>
										<tbody className="text-gray-700">
											{vaccineList.length > 0 ? (
												randomVaccine.map((vaccine) => (
													<tr key={vaccine.id}>
														<td className="px-4 py-2 text-left">{vaccine.id}</td>
														<td className="px-4 py-2 text-left">{vaccine.name}</td>
														<td className="px-4 py-2 text-left">{vaccine.quantity}</td>
														<td className="px-4 py-2 text-left">{vaccine.unitPrice}</td>
														<td className="px-4 py-2 text-left">{vaccine.salePrice}</td>
													</tr>
												))
											) : (
												<tr>
													<td colSpan={5}>
														<p className="text-red-500 text-center">{vaccineError}</p>
													</td>
												</tr>
											)}
										</tbody>
									</Table>
								</Card>
							</Col>
							<Col md={3}>
								<Card className="shadow-md p-3 mb-4 items-center">
									<div className="flex justify-between items-center mb-3">
										<h5 className="text-lg font-bold">Top Vaccine</h5>
									</div>
									<p className="text-red-500">No data</p>
								</Card>
							</Col>
						</Row>

						{/* Combo Table */}
						{/* {console.log(randomCombo)} */}
						<Card className="shadow-md p-3">
							<div className="flex justify-between items-center mb-3">
								<h5 className="text-lg font-bold">Combo Table</h5>
								<Link to="/Admin/ManageCombo" className="text-blue-600 hover:underline">
									Manage Combos
								</Link>
							</div>
							<Table hover className="w-full border border-gray-200 rounded-lg overflow-hidden">
								<thead className="bg-gray-100 text-gray-600 text-sm uppercase">
									<tr>
										<th className="px-4 py-2 text-left">ID</th>
										<th className="px-4 py-2 text-left">Combo Name</th>
										<th className="px-4 py-2 text-left">Included Vaccine</th>
										<th className="px-4 py-2 text-left">Sale Off</th>
										<th className="px-4 py-2 text-left">Price</th>
									</tr>
								</thead>
								<tbody className="text-gray-700">
									{comboList.length > 0 ? (
										randomCombo.map((combo) => (
											<tr key={combo.comboId}>
												<td className="px-4 py-2 text-left">{combo.comboId}</td>
												<td className="px-4 py-2 text-left">{combo.comboName}</td>
												<td className="px-4 py-2 text-left">
													{combo.vaccines.map((vaccine) => (
														<>
															{vaccine.name}
															<br />
														</>
													))}
												</td>
												<td className="px-4 py-2 text-left">{`${combo.saleOff}%`}</td>
												<td className="px-4 py-2 text-left">{`${combo.total}$`}</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={5}>
												<p className="text-red-500 text-center">{comboError}</p>
											</td>
										</tr>
									)}
								</tbody>
							</Table>
						</Card>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default Dashboard;