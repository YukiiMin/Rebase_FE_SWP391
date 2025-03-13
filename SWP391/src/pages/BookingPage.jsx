import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import AddChild from "../components/AddChild";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as Yup from "yup";

function BookingPage() {
	const vaccineAPI = "http://localhost:8080/vaccine";
	const comboAPI = "http://localhost:8080/vaccine/get/comboDetail";
	const userAPI = "http://localhost:8080/users";
	const token = localStorage.getItem("token");
	const decodedToken = token ? jwtDecode(token) : null;

	const navigate = useNavigate();
	const [vaccinesList, setVaccinesList] = useState([]);
	const [comboList, setComboList] = useState([]);
	const [childs, setChilds] = useState([]);

	const [type, setType] = useState("single");

	const [isOpen, setIsOpen] = useState(false);

	const validation = Yup.object({
		childId: Yup.number().required("Choose your child."),
		vaccinationDate: Yup.date().required("Choose a vaccination date."),
		payment: Yup.string().required("Choose your payment method"),
	});

	const formik = useFormik({
		initialValues: {
			childId: "",
			vaccinationDate: "",
			payment: "credit",
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
		validationSchema: validation,
	});

	useEffect(() => {
		//User must login to use this feature
		if (!token) {
			navigate("/Login");
			alert("You must login to use this feature");
			return;
		}
		getChild();
		getVaccines();
		getCombo();
	}, [navigate, token]);

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

	//Get list of Combo Vaccine
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

	//Get account's children
	const getChild = async () => {
		try {
			const accountId = decodedToken.sub;
			const response = await fetch(`${userAPI}/${accountId}/children`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				setChilds(data.children);
			} else {
				console.error("Get children failed: ", response.status);
			}
		} catch (err) {
			console.log(err);
		}
	};

	//Get the new child
	const handleChildAdd = (newChild) => {
		if (newChild) {
			setChilds([newChild, ...childs]);
		} else {
			getChild();
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

	const handleSubmit = (values) => {
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
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<InputGroup className="mb-3">
						<Form.Select aria-label="childId" name="childId" value={formik.values.childId} onChange={formik.handleChange} isInvalid={formik.touched.childId && formik.errors.childId}>
							{childs.length > 0 ? (
								<>
									<option>---Choose child---</option>
									{childs.map((child) => (
										<option value={child.id}>{child.name}</option>
									))}
								</>
							) : (
								<option>No data</option>
							)}
						</Form.Select>
						<Button
							variant="outline-dark"
							onClick={() => {
								setIsOpen(true);
							}}>
							Add child
						</Button>
						<Form.Control.Feedback type="invalid">{formik.errors.childId}</Form.Control.Feedback>
						{isOpen && <AddChild setIsOpen={setIsOpen} open={isOpen} onAdded={handleChildAdd} />}
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
								<Form.Control
									type="date"
									placeholder="Choose Date"
									name="vaccinationDate"
									value={formik.values.vaccinationDate}
									onChange={formik.handleChange}
									isInvalid={formik.touched.vaccinationDate && formik.errors.vaccinationDate}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.vaccinationDate}</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>
									<b>Choose payment method: </b>
								</Form.Label>
								<br />
								<Form.Check defaultChecked label="Payment by credit card." name="payment" type="radio" id="credit" value="credit" />
								<Form.Check label="Cash payment at the cashier." name="payment" type="radio" id="cash" value="cash" disabled />
								<Form.Check label="Payment via e-commerce applications, mobile payment services, VNPAY-QR e-wallets, Momo,..." name="payment" type="radio" id="app" value="app" disabled />
								<Form.Control.Feedback type="invalid">{formik.errors.payment}</Form.Control.Feedback>
							</Form.Group>
							<Button type="submit">Proceed</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default BookingPage;
