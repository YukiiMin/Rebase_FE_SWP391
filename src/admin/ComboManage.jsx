import React, { useState, useEffect } from "react";
import { Accordion, Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddCombo from "../components/AddCombo";

function ComboManage() {
	const [comboList, setComboList] = useState([]);
	const comboAPI = "http://localhost:8080/vaccine/get/comboDetail";
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

	let items = [];
	for (let number = 1; number <= totalPages; number++) {
		items.push(
			<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
				{number}
			</Pagination.Item>
		);
	}

	const pagination = (
		<Pagination>
			<Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
			<Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
			{items}
			<Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
			<Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
		</Pagination>
	);

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col lg={10}>
					<Container className="py-4">
						{/* {console.log(combos)} */}
						<Row className="mb-4 align-items-center">
							<Col>
								<h1 className="text-primary">Combo Vaccine Management</h1>
							</Col>
							<Col className="text-end">
								<Button variant="primary" onClick={() => setIsOpen(true)}>
									Add New Combo
								</Button>
							</Col>
						</Row>
						{isOpen && <AddCombo setIsOpen={setIsOpen} open={isOpen} />}
						<hr className="mb-4"></hr>
						<Container>
							<Row className="mb-3">
								<Col md={4}>
									<h4>Search:</h4>
								</Col>
								<Col md={3}>
									<Form.Control type="text" placeholder="Search Combo Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
								</Col>
								<Col md={3}>
									<Form.Select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
										<option value="">---Category---</option>
										<option value="kids">Combo for kids</option>
										<option value="preschool">Combo for preschool children</option>
									</Form.Select>
								</Col>
								<Col md={2}>
									<Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
										<option value="">---Sort---</option>
										<option value="priceAsc">Price Ascending</option>
										<option value="priceDes">Price Descending</option>
									</Form.Select>
								</Col>
							</Row>
						</Container>
						<Table striped hover responsive bordered>
							<thead>
								<tr>
									<th>#</th>
									<th>Combo Name</th>
									<th>Combo Category</th>
									<th>Description</th>
									<th>Included Vaccine</th>
									<th>Vaccine Manufacturer</th>
									<th>Vaccine Dose</th>
									<th>Sale Off</th>
									<th>Total Price</th>
								</tr>
							</thead>
							<tbody>
								{currentCombos.length > 0 ? (
									currentCombos.map((combo) => (
										<tr key={combo.comboId}>
											<td>{combo.comboId}</td>
											<td>{combo.comboName}</td>
											<td>{combo.comboCategory}</td>
											<td>{combo.description}</td>
											<td>
												{combo.vaccines.map((v, index, array) => (
													<React.Fragment key={index}>
														{v.name}
														{index < array.length - 1 && <br />}
													</React.Fragment>
												))}
											</td>
											<td>
												{combo.vaccines.map((v, index, array) => (
													<React.Fragment key={index}>
														{v.manufacturer}
														{index < array.length - 1 && <br />}
													</React.Fragment>
												))}
											</td>
											<td>
												{combo.vaccines.map((v, index, array) => (
													<React.Fragment key={index}>
														{v.dose}
														{index < array.length - 1 && <br />}
													</React.Fragment>
												))}
											</td>
											<td>{combo.saleOff}</td>
											<td>{parseFloat(combo.total).toFixed(2)}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={9} align="center">
											No Result
										</td>
									</tr>
								)}
							</tbody>
						</Table>
						{pagination}
					</Container>
				</Col>
			</Row>
			{/* 			
			<Accordion alwaysOpen>
							{combos.length > 0 ? (
								combos.map((combo) => (
									<Accordion.Item eventKey={combo.comboId} key={combo.comboId} className="mb-3">
										<Accordion.Header className="bg-light">
											<div className="d-flex justify-content-between w-100">
												<span className="fw-bold">{combo.comboName}</span>
												<span>
													<b>Total Price: </b> {parseFloat(combo.total).toFixed(2)}
												</span>
											</div>
										</Accordion.Header>
										<Accordion.Body>
											<p>
												<b>Description:</b> {combo.description}
											</p>
											<p>
												<b>Combo category:</b> {combo.comboCategory}
											</p>
											<p>
												<b>Sale off:</b> {combo.saleOff}
											</p>
											<Table striped bordered hover responsive className="table-sm">
												<thead>
													<tr>
														<th>#</th>
														<th>Vaccine name</th>
														<th>Manufacturer</th>
														<th>Dose</th>
													</tr>
												</thead>
												<tbody>
													{combo.vaccines.map((vaccine, index) => (
														<tr key={index}>
															<td>{index + 1}</td>
															<td>{vaccine.name}</td>
															<td>{vaccine.manufacturer}</td>
															<td>{vaccine.dose}</td>
														</tr>
													))}
												</tbody>
											</Table>
										</Accordion.Body>
									</Accordion.Item>
								))
							) : (
								<p className="text-center mt-3">No data</p>
							)}
						</Accordion> */}
		</div>
	);
}

export default ComboManage;
