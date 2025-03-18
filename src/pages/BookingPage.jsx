import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import AddChild from "../components/AddChild";
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
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
	const [vaccinesList, setVaccinesList] = useState([]); //List vaccine to show to user
	const [comboList, setComboList] = useState([]); //List combo to show to user
	const [childs, setChilds] = useState([]); //List of user's children

	const [selectedVaccine, setSelectedVaccine] = useState([]); //List of user chosen vaccine
	const [selectedCombo, setSelectedCombo] = useState([]); //List of user chosen combo

	const [bookingError, setBookingError] = useState("");

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
				// console.log(data.result);
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

	//Get the new child to the top of the list
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
					comboCategory: combo.comboCategory,
					saleOff: combo.saleOff,
					total: combo.total,
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

	const handleSubmit = async (values) => {
		if (type === "single" && selectedVaccine.length === 0) {
			setBookingError("Please choose at least 1 vaccine to proceed!");
			return;
		}

		if (type === "combo" && selectedCombo.length === 0) {
			setBookingError("Please choose at least 1 combo to proceed!");
			return;
		}

		try {
			// Create booking first
			const bookingResponse = await fetch(`http://localhost:8080/booking/${values.childId}/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					appointmentDate: values.vaccinationDate,
					status: true,
				}),
			});

			if (!bookingResponse.ok) {
				throw new Error("Failed to create booking");
			}

			const bookingData = await bookingResponse.json();
			const bookingId = bookingData.result.bookingId;

			// Create order
			const orderResponse = await fetch(`http://localhost:8080/order/${bookingId}/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderDate: new Date().toISOString(),
				}),
			});

			if (!orderResponse.ok) {
				throw new Error("Failed to create order");
			}

			const orderData = await orderResponse.json();
			const orderId = orderData.result.id;

			// Add vaccine details to order
			if (type === "single") {
				for (const v of selectedVaccine) {
					await fetch(`http://localhost:8080/order/${orderId}/addDetail/${v.vaccine.id}`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							quantity: v.quantity,
						}),
					});
				}
			} else if (type === "combo") {
				// Handle combo vaccines here
				for (const combo of selectedCombo) {
					// Add combo vaccines to order
					// This part needs to be implemented based on your combo structure
					await fetch(``, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(combo),
					});
				}
			}

			const selectedChild = childs.find((child) => child.id === parseInt(values.childId));
			navigate("/Transaction", {
				state: {
					selectedVaccine: selectedVaccine,
					selectedCombo: selectedCombo,
					child: selectedChild,
					vaccinationDate: values.vaccinationDate,
					payment: values.payment,
					type: type,
					orderId: orderId,
				},
			});
		} catch (error) {
			setBookingError(error.message);
		}
	};

	const handleVaccineSelection = (vaccine) => {
		const index = selectedVaccine.findIndex((v) => v.vaccine.id === vaccine.id);
		if (index !== -1) {
			// Vaccine already selected, remove it
			const newSelectedVaccine = [...selectedVaccine];
			newSelectedVaccine.splice(index, 1);
			setSelectedVaccine(newSelectedVaccine);
		} else {
			// Vaccine not selected, add it
			setSelectedVaccine([...selectedVaccine, { vaccine, quantity: 1 }]);
		}
	};

	const handleComboSelection = (combo) => {
		const index = selectedCombo.findIndex((c) => c.comboId === combo.comboId);
		if (index !== -1) {
			const newSelectedCombo = [...selectedCombo];
			newSelectedCombo.splice(index, 1);
			setSelectedCombo(newSelectedCombo);
		} else {
			setSelectedCombo([...selectedCombo, combo]);
		}
	};

	return (
		<>
			<Navigation />
			<Container className="mt-4">
				{console.log(childs, comboList)}
				<h2 className="mb-4 text-center">Vaccination Booking</h2>
				<br />
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<InputGroup className="mb-3">
						<Form.Select aria-label="childId" name="childId" value={formik.values.childId} onChange={formik.handleChange} isInvalid={formik.touched.childId && formik.errors.childId}>
							{childs.length > 0 ? (
								<>
									<option>---Choose child---</option>
									{childs.map((child) => (
										<option key={child.id} value={child.id}>
											{child.name}
										</option>
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
						<Col md={6}>
							<b>Choose vaccine type:</b>
							<ul className="list-unstyled">
								<li>
									<Form.Check label="Single" name="vaccineType" type="radio" id="single" checked={type === "single"} onChange={() => handleTypeChange("single")} />
								</li>
								<li>
									<Form.Check label="Combo" name="vaccineType" type="radio" id="combo" checked={type === "combo"} onChange={() => handleTypeChange("combo")} />
								</li>
							</ul>

							{/* Show vaccine list if chosen single */}
							{type === "single" && (
								<div className="mt-3">
									<b>Choose vaccines:</b>
									{vaccinesList.length > 0 ? (
										<Table>
											<thead>
												<tr>
													<th></th>
													<th>Vaccine name</th>
													<th>Price($)</th>
												</tr>
											</thead>
											<tbody>
												{vaccinesList.map((vaccine) => (
													<tr key={vaccine.id}>
														<td>
															<Form.Check checked={selectedVaccine.some((v) => v.vaccine.id === vaccine.id)} onChange={() => handleVaccineSelection(vaccine)} />
														</td>
														<td>{vaccine.name}</td>
														<td>{vaccine.salePrice}</td>
													</tr>
												))}
											</tbody>
										</Table>
									) : (
										<>No vaccine data found. Check your network connection</>
									)}
								</div>
							)}

							{/* Show combo list if chosen combo */}
							{type === "combo" && (
								<div className="mt-3">
									<b>Choose combo:</b>
									{comboList.length > 0 ? (
										<Table>
											<thead>
												<tr>
													<th></th>
													<th>Combo name</th>
													<th>Included vaccine</th>
													<th>Price($)</th>
												</tr>
											</thead>
											<tbody>
												{comboList.map((combo) => (
													<tr key={combo.id}>
														<td>
															<Form.Check checked={selectedCombo.some((c) => c.comboId === combo.comboId)} onChange={() => handleComboSelection(combo)} />
														</td>
														<td>{combo.comboName}</td>
														<td>
															{combo.vaccines.map((vaccine, index, array) => (
																<div key={index}>
																	{vaccine}
																	{index < array.length - 1 && <br />}
																</div>
															))}
														</td>
														<td>{combo.total}</td>
													</tr>
												))}
											</tbody>
										</Table>
									) : (
										<>No combo data found. Check your network connection</>
									)}
								</div>
							)}
						</Col>
						<Col md={6}>
							<b>Your order:</b>
							{/* Show chosen single vaccine if type is single */}
							{type === "single" && (
								<>
									{selectedVaccine.length > 0 ? (
										<Table borderless>
											<thead>
												<tr>
													<th>Vaccine name</th>
													<th>Order quantity</th>
												</tr>
											</thead>
											<tbody>
												{selectedVaccine.map((v) => (
													<tr key={v.vaccine.id}>
														<td>{v.vaccine.name}</td>
														<td>{v.quantity}</td>
													</tr>
												))}
											</tbody>
										</Table>
									) : (
										<>
											No vaccine chosen
											<br />
											{selectedVaccine.length === 0 && bookingError && <p className="text-danger">{bookingError}</p>}
										</>
									)}
								</>
							)}

							{/* Show chosen combo vaccine if type is combo */}
							{type === "combo" && (
								<>
									{selectedCombo.length > 0 ? (
										<Table borderless>
											<thead>
												<tr>
													<th>Combo name</th>
													<th>Included Vaccine</th>
												</tr>
											</thead>
											<tbody>
												{selectedCombo.map((c) => (
													<tr key={c.comboId}>
														<td>{c.comboName}</td>
														<td>
															{c.vaccines.map((v, index) => (
																<li key={index}>{v}</li>
															))}
														</td>
													</tr>
												))}
											</tbody>
										</Table>
									) : (
										// selectedCombo.map((combo) => <li key={combo.id}>{combo.comboName}</li>)
										<>
											No combo chosen
											<br />
											{selectedCombo.length === 0 && bookingError && <p className="text-danger">{bookingError}</p>}
										</>
									)}
								</>
							)}

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

							<Form.Group className="mb-3" controlId="paymentMethod">
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
