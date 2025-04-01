import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

function Diagnosis({ open, setIsOpen, booking, onDiagnosisComplete }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [diagnosisData, setDiagnosisData] = useState({
		diagnosisResults: [],
		recommendedVaccines: ""
	});
	const token = localStorage.getItem("token");

	useEffect(() => {
		// Initialize diagnosis results based on ordered vaccines
		if (booking && booking.vaccineOrders) {
			const initialResults = booking.vaccineOrders.map(order => ({
				vaccineOrderId: order.id,
				vaccineName: order.vaccine?.name || "Unknown Vaccine",
				doseNumber: 1, // Default value, can be adjusted based on child's history
				result: "",
				note: ""
			}));
			setDiagnosisData({
				...diagnosisData,
				diagnosisResults: initialResults
			});
		}
	}, [booking]);

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleDiagnosisChange = (index, field, value) => {
		const updatedResults = [...diagnosisData.diagnosisResults];
		updatedResults[index] = {
			...updatedResults[index],
			[field]: value
		};
		setDiagnosisData({
			...diagnosisData,
			diagnosisResults: updatedResults
		});
	};

	const handleSubmitDiagnosis = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");

		// Validate form
		const isValid = diagnosisData.diagnosisResults.every(result => 
			result.result && result.result.trim() !== ""
		);

		if (!isValid) {
			setError("Please provide a diagnosis result for each vaccine");
			setLoading(false);
			return;
		}

		try {
			// Submit diagnosis to backend
			const response = await fetch(`http://localhost:8080/diagnosis/${booking.bookingId}/create`, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					diagnosisResults: diagnosisData.diagnosisResults,
					recommendedVaccines: diagnosisData.recommendedVaccines
				})
			});

			const data = await response.json();
			
			if (response.ok) {
				setSuccess("Diagnosis submitted successfully");
				setTimeout(() => {
					if (onDiagnosisComplete) {
						onDiagnosisComplete();
					}
				}, 1500);
			} else {
				setError(data.message || "Failed to submit diagnosis");
			}
		} catch (error) {
			console.error("Error submitting diagnosis:", error);
			setError("An error occurred while submitting the diagnosis");
		} finally {
			setLoading(false);
		}
	};

	// If no booking is selected, don't render
	if (!booking) return null;

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle>Medical Diagnosis - Enroll #{booking.bookingId}</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={handleSubmitDiagnosis} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					{success && (
						<Alert>
							<CheckCircle className="h-4 w-4" />
							<AlertTitle>Success</AlertTitle>
							<AlertDescription>{success}</AlertDescription>
						</Alert>
					)}
					
					<div>
						<Label htmlFor="childName">Child Name</Label>
						<Input 
							id="childName" 
							value={booking.child?.name || "N/A"} 
							readOnly 
						/>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="parentName">Parent Name</Label>
							<Input 
								id="parentName" 
								value={booking.child?.account ? 
									`${booking.child.account.firstName} ${booking.child.account.lastName}` : 
									"N/A"} 
								readOnly 
							/>
						</div>
						<div>
							<Label htmlFor="appointmentDate">Appointment Date</Label>
							<Input 
								id="appointmentDate" 
								value={booking.appointmentDate || "N/A"} 
								readOnly 
							/>
						</div>
					</div>
					
					<div>
						<Label htmlFor="bookingStatus">Booking Status</Label>
						<Input 
							id="bookingStatus" 
							value={booking.status || "N/A"} 
							readOnly 
						/>
					</div>
					
					<div className="mt-4">
						<h3 className="text-lg font-medium mb-2">Diagnosis Details</h3>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>#</TableHead>
									<TableHead>Vaccine name</TableHead>
									<TableHead>Dose No.</TableHead>
									<TableHead>Diagnosis Result</TableHead>
									<TableHead>Note</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{diagnosisData.diagnosisResults.length > 0 ? (
									diagnosisData.diagnosisResults.map((vaccine, index) => (
										<TableRow key={index}>
											<TableCell>{index + 1}</TableCell>
											<TableCell className="font-medium">{vaccine.vaccineName}</TableCell>
											<TableCell>{vaccine.doseNumber}</TableCell>
											<TableCell>
												<Select
													value={vaccine.result}
													onValueChange={(value) => handleDiagnosisChange(index, "result", value)}
													required
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select result" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="NORMAL">Normal - Can proceed with vaccination</SelectItem>
														<SelectItem value="CAUTION">Caution - Proceed with extra monitoring</SelectItem>
														<SelectItem value="POSTPONE">Postpone - Minor issues require delay</SelectItem>
														<SelectItem value="CONTRAINDICATED">Contraindicated - Cannot vaccinate</SelectItem>
													</SelectContent>
												</Select>
											</TableCell>
											<TableCell>
												<Textarea 
													placeholder="Additional notes" 
													value={vaccine.note}
													onChange={(e) => handleDiagnosisChange(index, "note", e.target.value)}
													className="min-h-[60px]"
												/>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={5} className="text-center">No vaccines found in this booking</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					
					<div>
						<Label htmlFor="recommendedVaccines">Recommended Future Vaccines</Label>
						<Textarea 
							id="recommendedVaccines"
							placeholder="Enter recommended vaccines for future appointments" 
							value={diagnosisData.recommendedVaccines}
							onChange={(e) => setDiagnosisData({...diagnosisData, recommendedVaccines: e.target.value})}
							className="min-h-[100px]"
						/>
					</div>
					
					<DialogFooter>
						<Button 
							type="button" 
							variant="outline" 
							onClick={handleClose}
							disabled={loading}
						>
							Close
						</Button>
						<Button 
							type="submit" 
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : "Submit Diagnosis"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default Diagnosis;
