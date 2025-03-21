import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Image, Modal, Pagination, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddVaccine from "../components/AddVaccine";
import Navigation from "../components/Navbar";

function VaccineManage() {
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const [vaccineList, setVaccineList] = useState([]);
	const vaccineAPI = "http://localhost:8080/vaccine/get";
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
			<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
				<Row>
					<Sidebar />
					<Col lg={10}>
						<Container className="py-4">
							<Row className="mb-4 align-items-center">
								<Col>
									<h1 className="text-primary">Vaccine Management</h1>
								</Col>
								<Col className="text-end">
									<Button variant="primary" onClick={() => setIsOpen(true)}>
										Add New Vaccine
									</Button>
								</Col>
							</Row>
							{isOpen && <AddVaccine setIsOpen={setIsOpen} open={isOpen} onAdded={handleVaccineAdded} />}
							<hr className="mb-4"></hr>
							<Container>
								<Row className="mb-3">
									<Col md={4}>
										<h4>Search:</h4>
									</Col>
									<Col md={3}>
										<Form.Control type="text" placeholder="Search Vaccine Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
									</Col>
									<Col md={3}>
										<Form.Control type="text" placeholder="Search Manufacturer" value={searchManufacturer} onChange={(e) => setSearchManufacturer(e.target.value)} />
									</Col>
									<Col md={2}>
										<Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
											<option value="">---Sort---</option>
											<option value="quantityAsc">Sort by Quantity Ascending</option>
											<option value="quantityDes">Sort by Quantity Descending</option>
											<option value="unitPriceAsc">Sort by Unit Price Ascending</option>
											<option value="unitPriceDes">Sort by Unit Price Descending</option>
											<option value="salePriceAsc">Sort by Sale Price Ascending</option>
											<option value="salePriceDes">Sort by Sale Price Descending</option>
										</Form.Select>
									</Col>
								</Row>
							</Container>

							<Table striped bordered hover responsive>
								<thead>
									<tr>
										<th>ID</th>
										<th>Vaccine Name</th>
										<th>Image</th>
										<th>Description</th>
										<th>Manufacturer</th>
										<th>Quantity</th>
										<th>Unit Price ($)</th>
										<th>Sale Price ($)</th>
										<th>Total Doses</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{currentVaccines.length > 0 ? (
									currentVaccines.map((vaccine) => (
										<tr key={vaccine.id}>
											<td>{vaccine.id}</td>
											<td>{vaccine.name}</td>
											<td>
												<Image src={vaccine.imagineUrl} alt={`${vaccine.name} image`} thumbnail style={{ maxWidth: '100px' }}/>
											</td>
											<td>
												{vaccine.description && vaccine.description.length > 100 
													? `${vaccine.description.substring(0, 100)}...` 
													: vaccine.description}
											</td>
											<td>{vaccine.manufacturer}</td>
											<td>{vaccine.quantity}</td>
											<td>${vaccine.unitPrice}</td>
											<td>${vaccine.salePrice}</td>
											<td>
												<Badge bg="info">{vaccine.totalDose}</Badge>
											</td>
											<td>
												{vaccine.status 
													? (vaccine.quantity > 0 
														? <Badge bg="success">Available</Badge> 
														: <Badge bg="warning">Out of Stock</Badge>)
													: <Badge bg="danger">Disabled</Badge>}
											</td>
											<td>
												<Button variant="info" size="sm" className="me-2 mb-1">
													Protocol
												</Button>
												<Button variant="primary" size="sm" className="me-2 mb-1">
													Edit
												</Button>
												<Button variant="danger" size="sm" className="mb-1">
													Delete
												</Button>
											</td>
										</tr>
									))
								) : (
									<>
										<tr>
											<td colSpan={12} align="center">
												No Result
											</td>
										</tr>
									</>
								)}
							</tbody>
						</Table>
						{pagination}
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default VaccineManage;
