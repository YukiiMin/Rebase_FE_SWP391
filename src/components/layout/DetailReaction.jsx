import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2 } from "lucide-react";
import { apiService } from "../../api";

function DetailReaction({ open, setIsOpen, booking }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [vaccineRecords, setVaccineRecords] = useState([]);
	const [reactionData, setReactionData] = useState({
		reaction: ""
	});
	const token = localStorage.getItem("token");

	useEffect(() => {
		if (booking && booking.bookingId) {
			fetchVaccinationRecords();
		}
	}, [booking]);

	const fetchVaccinationRecords = async () => {
		try {
			setLoading(true);
			const response = await fetch(`http://localhost:8080/vaccination/records/${booking.bookingId}`, {
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setVaccineRecords(data.result || []);
			} else {
				console.error("Failed to fetch vaccination records");
			}
		} catch (error) {
			console.error("Error fetching vaccination records:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleReactionSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Only submit if there's reaction text
			if (!reactionData.reaction.trim()) {
				setError("Please enter reaction details");
				setLoading(false);
				return;
			}

			const response = await apiService.bookings.recordReaction(booking.bookingId, {
				reaction: reactionData.reaction
			});

			// Close modal after successful submission
			setTimeout(() => {
				handleClose();
			}, 1500);
		} catch (error) {
			console.error("Error recording reaction:", error);
			setError(error.response?.data?.message || "An error occurred while recording the reaction");
		} finally {
			setLoading(false);
		}
	};

	// If no booking is selected, don't render
	if (!booking) return null;

	// Check if reaction is already recorded
	const hasReaction = booking.reaction && booking.reaction.trim() !== "";

	// Determine if bookings is in a state where reactions can be recorded
	const canRecordReaction = booking.status === "VACCINE_INJECTED" && !hasReaction;

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[90%] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Vaccination Details - Enroll #{booking.bookingId}</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={handleReactionSubmit} className="space-y-6">
					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="space-y-2">
						<Label htmlFor="childName">Child Name</Label>
						<Input id="childName" value={booking.child?.name || "N/A"} readOnly />
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="appointmentDate">Appointment Date</Label>
							<Input id="appointmentDate" value={booking.appointmentDate || "N/A"} readOnly />
						</div>
						<div className="space-y-2">
							<Label htmlFor="bookingStatus">Booking Status</Label>
							<Input id="bookingStatus" value={booking.status || "N/A"} readOnly />
						</div>
						<div className="space-y-2">
							<Label htmlFor="parentName">Parent Name</Label>
							<Input 
								id="parentName" 
								value={booking.child?.account ? 
									`${booking.child.account.firstName} ${booking.child.account.lastName}` : 
									"N/A"} 
								readOnly 
							/>
						</div>
					</div>
					
					<div className="space-y-2">
						<h3 className="text-lg font-medium">Vaccination Records</h3>
						
						{loading ? (
							<div className="flex flex-col items-center justify-center py-6">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
								<p className="mt-2 text-sm text-muted-foreground">Loading vaccination records...</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>#</TableHead>
										<TableHead>Vaccine Name</TableHead>
										<TableHead>Dose</TableHead>
										<TableHead>Date Administered</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Notes</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{vaccineRecords.length > 0 ? (
										vaccineRecords.map((record, index) => (
											<TableRow key={index}>
												<TableCell>{index + 1}</TableCell>
												<TableCell>{record.vaccineName || "N/A"}</TableCell>
												<TableCell>{record.doseNumber || "1"}</TableCell>
												<TableCell>{record.administeredDate || "N/A"}</TableCell>
												<TableCell>
													<Badge className={record.status === "COMPLETED" ? "bg-green-500" : "bg-yellow-500"}>
														{record.status || "PENDING"}
													</Badge>
												</TableCell>
												<TableCell>{record.notes || "No notes"}</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} className="text-center">
												No vaccination records found
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
					</div>
					
					<div className="space-y-2">
						<h3 className="text-lg font-medium">Post-Vaccination Reaction</h3>
						
						{hasReaction ? (
							<Alert className="mt-2 border-blue-200 bg-blue-50">
								<div className="space-y-2">
									<p className="font-medium">Recorded Reaction:</p>
									<p>{booking.reaction}</p>
								</div>
							</Alert>
						) : (
							<div className="space-y-2">
								<Label htmlFor="reaction">Reaction Details</Label>
								<Textarea 
									id="reaction" 
									rows={3} 
									placeholder={canRecordReaction ? 
										"Enter any reaction details observed after vaccination" : 
										"Reaction can only be recorded after vaccination is completed"}
									value={reactionData.reaction}
									onChange={(e) => setReactionData({...reactionData, reaction: e.target.value})}
									disabled={!canRecordReaction}
									className="resize-none"
								/>
								{!canRecordReaction && booking.status !== "VACCINE_INJECTED" && (
									<p className="text-sm text-muted-foreground">
										Reactions can only be recorded for completed vaccinations.
									</p>
								)}
							</div>
						)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose}>
							Close
						</Button>
						{canRecordReaction && (
							<Button type="submit" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										<span>Processing...</span>
									</>
								) : "Record Reaction"}
							</Button>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default DetailReaction;
