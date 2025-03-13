import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import AddChild from "../components/AddChild";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function BookingPage() {
	const vaccineAPI = "http://localhost:8080/vaccine";
	const comboAPI = "http://localhost:8080/vaccine/get/comboDetail";
	const childAPI = "http://localhost:8080/children";
	const token = localStorage.getItem("token");

	const navigate = useNavigate();
	const [vaccinesList, setVaccinesList] = useState([]);
	const [comboList, setComboList] = useState([]);
	const [childs, setChilds] = useState([]);

	const [type, setType] = useState("single");

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		getChild();
		getVaccines();
		getCombo();
	}, []);

	//Get list of single Vaccine
	const getVaccines = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/get`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setVaccinesList(data.result);
			} else {
				console.error("Get vaccine error: ", response.status);
			}
		} catch (err) {
			console.error(err);
		}
	};

	//Get list of Combo
	const getCombo = async () => {
		try {
			const response = await fetch(`${comboAPI}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				// setComboList(data.result);
				const groupedCombos = groupCombos(data.result);
				setComboList(groupedCombos);
			} else {
				console.error("Get combo error: ", response.status);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const getChild = async () => {
		try {
			const response = await fetch(`${childAPI}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setChilds(data);
			}
		} catch (err) {
			console.log(err);
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
					ageGroup: combo.ageGroup,
					saleOff: combo.saleOff,
					vaccines: [], // Initialize vaccines array
				};
			}
			grouped[combo.comboId].vaccines.push(combo.vaccineName);
		});
		// Convert grouped object to array
		return Object.values(grouped);
	};

	//Change list depend on type (single or combo)
	const handleTypeChange = (type) => {
		setType(type);
	};

	const handleSubmit = () => {
		navigate("/Transaction");
	};

	return (
		<>
			<Navigation />
			<br />
			<Container>
				{console.log(childs, comboList)}
				<h2>Vaccination Booking</h2>
				<br />
				<Form method="POST">
					<InputGroup className="mb-3">
						<Form.Select aria-label="Default select example">
							{childs.length > 0 ? (
								<>
									<option>---Choose child---</option>
									{childs.map((child) => (
										<option value={child.child_id}>{child.name}</option>
									))}
								</>
							) : (
								<option>No data</option>
							)}
						</Form.Select>
						<Button
							onClick={() => {
								setIsOpen(true);
							}}>
							Add child
						</Button>
						{isOpen && <AddChild setIsOpen={setIsOpen} open={isOpen} />}
					</InputGroup>
					<Row>
						<Col>
							<b>Choose vaccine type:</b>
							<ul>
								<li>
									<Form.Check label="Single" name="vaccineType" type="radio" id="single" checked={type === "single"} onChange={() => handleTypeChange("single")} />
								</li>
								<li>
									<Form.Check label="Combo" name="vaccineType" type="radio" id="combo" checked={type === "combo"} onChange={() => handleTypeChange("combo")} />
								</li>
							</ul>
							{type === "single" && (
								<div className="mt-3">
									<b>Choose vaccines:</b>
									{vaccinesList.map((vaccine) => (
										<Card key={vaccine.id} className="mb-2">
											<Card.Body>
												<Form.Check
													label={vaccine.name}
													// onChange={(e) => handleVaccineSelection(vaccine, e.target.checked)}
												/>
												<Card.Text>{vaccine.salePrice}$</Card.Text>
											</Card.Body>
										</Card>
									))}
								</div>
							)}
							{type === "combo" && (
								<div className="mt-3">
									<b>Choose combo:</b>
									{comboList.map((combo) => (
										<Card key={combo.id} className="mb-2">
											<Card.Body>
												<Form.Check
													label={combo.comboName}
													// onChange={(e) => handleVaccineSelection(vaccine, e.target.checked)}
												/>
												<Card.Text>{combo.vaccines.join(", ")}</Card.Text>
												{/* <Card.Text>{combo.total}$</Card.Text> */}
											</Card.Body>
										</Card>
									))}
								</div>
							)}
						</Col>
						<Col>
							<Form.Group className="mb-3" controlId="vaccinationDate">
								<Form.Label>
									<b>Choose vaccination date:</b>
								</Form.Label>
								<Form.Control type="date" placeholder="Choose Date" />
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>
									<b>Choose payment method: </b>
								</Form.Label>
								<br />
								<Form.Check defaultChecked label="Payment by credit card." name="payment" type="radio" id="credit" value="credit" />
								<Form.Check label="Cash payment at the cashier." name="payment" type="radio" id="cash" value="cash" disabled />
								<Form.Check label="Payment via e-commerce applications, mobile payment services, VNPAY-QR e-wallets, Momo,..." name="payment" type="radio" id="app" value="app" disabled />
							</Form.Group>
							<Button onClick={handleSubmit}>Proceed</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default BookingPage;
