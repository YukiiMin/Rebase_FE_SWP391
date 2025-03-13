import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

function AddShift({ setIsOpen, open }) {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const userAPI = "http://localhost:8080/users";
	const shiftAPI = "http://localhost:8080/working";

	const [staffs, setStaffs] = useState([]);

	const [repeat, setRepeat] = useState(false);

	const validation = Yup.object({
		scheduleName: Yup.string().required("Schedule name is required"),
		shiftType: Yup.string().required("Choose a shift type"),
		startDate: Yup.date()
			.transform((currentValue, originalValue) => {
				return originalValue ? new Date(originalValue) : null;
			})
			.nullable()
			.required("Start date is required")
			.min(new Date(new Date().setDate(new Date().getDate())), "Start date cannot be today or before"),
		endDate: Yup.date()
			.transform((currentValue, originalValue) => {
				return originalValue ? new Date(originalValue) : null;
			})
			.nullable()
			.required("End date is required")
			.when("startDate", (startDate, schema) => {
				return schema.test("endDate-after-startDate", "End date cannot be sooner than start date", function (endDate) {
					const { startDate: startDateValue } = this.parent; // Access startDate from form values
					if (!startDateValue || !endDate) {
						return true; // Skip validation if either date is empty
					}
					return new Date(endDate) >= new Date(startDateValue);
				});
			}),
	});

	const formik = useFormik({
		initialValues: {
			scheduleName: "",
			shiftType: "",
			startDate: "",
			endDate: "",
			repeat: false,
			repeatDays: [],
		},
		onSubmit: (values) => {
			handleAddShift(values);
		},
		validationSchema: validation,
	});

	const handleClose = () => setIsOpen(false); //Close modal

	const handleRepeat = (e) => {
		setRepeat(e.target.checked);
		formik.setFieldValue("repeat", e.target.checked);
	};

	//Handle format date error
	const handleStartDateChange = (e) => {
		formik.setFieldValue("startDate", e.target.value);
	};

	const handleEndDateChange = (e) => {
		formik.setFieldValue("endDate", e.target.value);
	};

	//Function handle changing repeat day for formik
	const handleDayChange = (day) => {
		const repeatDays = [...formik.values.repeatDays];
		const index = repeatDays.indexOf(day);
		if (index === -1) {
			repeatDays.push(day);
		} else {
			repeatDays.splice(index, 1);
		}
		formik.setFieldValue("repeatDays", repeatDays);
	};

	const handleAddShift = async (values) => {
		try {
			console.log(values);
			const response = await fetch(`${shiftAPI}/schedule/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify(values),
			});
			if (response.ok) {
				alert("Adding shift successful! Now adding staffs to shift");
				const data = await response.json();
				console.log(data);
				// handleClose()
			} else {
				console.log("Adding shift error: ", response.status);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleAddStaff = async (values) => {
		try {
			const response = await fetch(`${shiftAPI}/`);
		} catch (err) {
			console.error("Something went wrong when adding staffs to schedule: ", err);
		}
	};

	const fetchStaff = async () => {
		try {
			const response = await fetch(`${userAPI}/getAllUser`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setStaffs(data.result);
			} else {
				console.error("Fetching account failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong while fetching accounts: ", err);
		}
	};

	useEffect(() => {
		fetchStaff();
	}, []);

	return (
		<div>
			<Modal show={open} onHide={handleClose} size="xl">
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Add Schedule</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3" controlId="Shift name">
							<Form.Label>Schedule name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter shift name"
								name="scheduleName"
								value={formik.values.scheduleName}
								onChange={formik.handleChange}
								isInvalid={formik.touched.scheduleName && formik.errors.scheduleName}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.scheduleName}</Form.Control.Feedback>
						</Form.Group>
						<Row>
							<Col>
								<Form.Group className="mb-3" controlId="startDate">
									<Form.Label>Start</Form.Label>
									<Form.Control type="date" name="startDate" value={formik.values.startDate} onChange={handleStartDateChange} isInvalid={formik.touched.startDate && formik.errors.startDate} />
									<Form.Control.Feedback type="invalid">{formik.errors.startDate}</Form.Control.Feedback>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3" controlId="endDate">
									<Form.Label>End</Form.Label>
									<Form.Control type="date" name="endDate" value={formik.values.endDate} onChange={handleEndDateChange} isInvalid={formik.touched.endDate && formik.errors.endDate} />
									<Form.Control.Feedback type="invalid">{formik.errors.endDate}</Form.Control.Feedback>
								</Form.Group>
							</Col>
							{/* <Col>
								<Form.Group className="mb-3" controlId="endDate">
									<Form.Label>Start time</Form.Label>
									<Form.Control type="time" />
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3" controlId="endDate">
									<Form.Label>End time</Form.Label>
									<Form.Control type="time" />
								</Form.Group>
							</Col> */}
							<Col>
								<Form.Group className="mb-3">
									<Form.Label>Shift type</Form.Label>
									<Form.Select aria-label="Type" name="shiftType" value={formik.values.shiftType} onChange={formik.handleChange} isInvalid={formik.touched.shiftType && formik.errors.shiftType}>
										<option>---Select---</option>
										<option value="HC">Hanh Chinh</option>
									</Form.Select>
									<Form.Control.Feedback type="invalid">{formik.errors.shiftType}</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>

						<Form.Check type="switch" id="custom-switch" label="Repeat" checked={repeat} onChange={handleRepeat} />
						{repeat && (
							<>
								<Form.Group className="mb-3">
									<Form.Label>Repeat every</Form.Label>
									<Form.Select>
										<option value="week">Week</option>
									</Form.Select>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Repeat on</Form.Label>
									<Row>
										{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
											<Col key={day}>
												<Form.Check type="checkbox" label={day} checked={formik.values.repeatDays.includes(day)} onChange={() => handleDayChange(day)} />
											</Col>
										))}
									</Row>
									{formik.touched.repeatDays && formik.errors.repeatDays && <div className="text-danger">{formik.errors.repeatDays}</div>}
								</Form.Group>
							</>
						)}
						<hr />
						<h3>Choose Staff</h3>
						{console.log(staffs)}
						<Row>
							<Col>
								<Table striped bordered hover responsive>
									<thead>
										<tr>
											<th>#</th>
											<th>Staff ID</th>
											<th>Staff name</th>
										</tr>
									</thead>
									<tbody>
										{staffs.length > 0 ? (
											staffs.map((staff) => (
												<tr>
													<td>
														<Form.Check />
													</td>
													<td>{staff.accountId}</td>
													<td>{`${staff.firstName} ${staff.lastName}`}</td>
												</tr>
											))
										) : (
											<></>
										)}
									</tbody>
								</Table>
							</Col>
							<Col>
								<p>Chosen Staff:</p>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button type="submit" variant="primary">
							Add
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default AddShift;
