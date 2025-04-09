import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNav from "../../components/layout/MainNav";
import StaffMenu from "../../components/layout/StaffMenu";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../../components/ui/dialog";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Search, CalendarIcon, RefreshCw, CheckCircle, X, ClipboardCheck, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { apiService } from "../../api";
import TokenUtils from "../../utils/TokenUtils";

function CheckIn() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [bookingList, setBookingList] = useState([]);
	const [filteredList, setFilteredList] = useState([]);
	const [activeTab, setActiveTab] = useState("upcoming");
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDate, setSelectedDate] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	
	// Check-in modal state
	const [showCheckInModal, setShowCheckInModal] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [temperature, setTemperature] = useState("");
	const [weight, setWeight] = useState("");
	const [height, setHeight] = useState("");
	const [note, setNote] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!token) {
			navigate('/Login');
			return;
		}
		
		fetchBookings();
		
		// Add direct API test
		testDirectApiCall();
	}, [navigate, token]);

	useEffect(() => {
		// Only run filterBookings if bookingList is populated
		if (bookingList.length > 0) {
			applyFilters();
		}
	}, [searchTerm, selectedDate, activeTab]); // Remove bookingList from dependencies

	const applyFilters = () => {
		console.log("applyFilters called, activeTab:", activeTab);
		console.log("bookingList before filtering:", bookingList);
		
		// Start with the entire booking list
		let filtered = [...bookingList];
		console.log("Starting with", filtered.length, "bookings");
		
		// Filter by tab
		if (activeTab === "upcoming") {
			console.log("Filtering for 'upcoming' tab - should show PAID bookings");
			const preFilterCount = filtered.length;
			
			// Now only showing PAID bookings in the 'upcoming' tab
			filtered = filtered.filter(booking => booking.status === "PAID");
			
			console.log(`Filtered from ${preFilterCount} to ${filtered.length} bookings`);
			console.log("PAID bookings:", filtered);
		} else if (activeTab === "checkedin") {
			console.log("Filtering for 'checkedin' tab");
			const preFilterCount = filtered.length;
			
			filtered = filtered.filter(booking => 
				booking.status === "CHECKED_IN" || booking.status === "ASSIGNED" || 
				booking.status === "DIAGNOSED"
			);
			
			console.log(`Filtered from ${preFilterCount} to ${filtered.length} bookings`);
		} else if (activeTab === "completed") {
			console.log("Filtering for 'completed' tab");
			const preFilterCount = filtered.length;
			
			filtered = filtered.filter(booking => 
				booking.status === "COMPLETED" || booking.status === "CANCELLED" || 
				booking.status === "VACCINE_INJECTED"
			);
			
			console.log(`Filtered from ${preFilterCount} to ${filtered.length} bookings`);
		}
		
		// Filter by search term (child or parent name)
		if (searchTerm) {
			console.log("Applying search term filter:", searchTerm);
			const preFilterCount = filtered.length;
			
			const term = searchTerm.toLowerCase();
			filtered = filtered.filter(booking => {
				const childName = (booking.child?.name || "").toLowerCase();
				const parentFirstName = (booking.child?.account?.firstName || "").toLowerCase();
				const parentLastName = (booking.child?.account?.lastName || "").toLowerCase();
				
				return childName.includes(term) || 
					   parentFirstName.includes(term) || 
					   parentLastName.includes(term);
			});
			
			console.log(`Filtered from ${preFilterCount} to ${filtered.length} bookings after applying search term`);
		}
		
		// Filter by selected date
		if (selectedDate) {
			console.log("Applying date filter:", selectedDate);
			const preFilterCount = filtered.length;
			
			const dateStr = format(selectedDate, "yyyy-MM-dd");
			filtered = filtered.filter(booking => booking.appointmentDate === dateStr);
			
			console.log(`Filtered from ${preFilterCount} to ${filtered.length} bookings after applying date filter`);
		}
		
		// Sort by appointment date, recent first
		filtered.sort((a, b) => {
			const dateA = new Date(a.appointmentDate);
			const dateB = new Date(b.appointmentDate);
			return dateB - dateA;
		});
		
		console.log("Final filtered list:", filtered);
		setFilteredList(filtered);
		setCurrentPage(1); // Reset to first page when filter changes
	};

	const fetchBookings = async () => {
		try {
			setLoading(true);
			
			if (!TokenUtils.isLoggedIn()) {
				navigate("/login");
				return;
			}
			
			console.log("Fetching all bookings...");
			const response = await apiService.bookings.getAll();
			
			if (response.status === 200) {
				// Get all bookings without filtering
				const bookings = response.data.result || [];
				
				// Log the full response and detailed status information
				console.log("API Response:", response);
				console.log("Raw bookings data:", bookings);
				console.log("Booking statuses:", bookings.map(b => ({ id: b.bookingId, status: b.status, date: b.appointmentDate })));
				
				// Count bookings by status
				const statusCounts = bookings.reduce((acc, booking) => {
					acc[booking.status] = (acc[booking.status] || 0) + 1;
					return acc;
				}, {});
				console.log("Booking status counts:", statusCounts);
				
				// Check if there are any PAID bookings
				const paidBookings = bookings.filter(b => b.status === "PAID");
				console.log("PAID bookings:", paidBookings.length, paidBookings);
				
				// Store all bookings unfiltered
				setBookingList(bookings);
				
				// Apply filters to the new booking list
				setTimeout(() => {
					applyFilters();
				}, 0);
			} else {
				console.error("API returned non-200 status:", response.status, response.data);
				setErrorMessage(response.data.message || "Failed to fetch bookings");
			}
		} catch (err) {
			console.error("Error fetching bookings:", err);
			if (err.response) {
				console.error("Error response:", err.response.status, err.response.data);
			}
			setErrorMessage(err.response?.data?.message || "An error occurred while fetching bookings");
			
			// Handle token expiration
			if (err.response?.status === 401) {
				TokenUtils.removeToken();
				navigate("/login");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCheckIn = async (e) => {
		e.preventDefault();
		
		if (!selectedBooking) {
			setErrorMessage("No booking selected for check-in");
			return;
		}
		
		try {
			setSubmitting(true);
			
			if (!TokenUtils.isLoggedIn()) {
				navigate("/login");
				return;
			}
			
			const response = await apiService.bookings.checkIn(selectedBooking.bookingId);
			
			if (response.status === 200) {
				setSuccessMessage(`Patient ${selectedBooking.child?.name} has been checked in successfully!`);
				resetCheckInForm();
				setShowCheckInModal(false);
				
				// Reset form and refresh bookings
				fetchBookings();
				
				// Clear success message after 3 seconds
				setTimeout(() => {
					setSuccessMessage(null);
				}, 3000);
			} else {
				setErrorMessage(response.data.message || "Failed to check in. Please try again");
			}
		} catch (err) {
			console.error("Error during check-in:", err);
			setErrorMessage(err.response?.data?.message || "An error occurred during the check-in process");
			
			// Handle token expiration
			if (err.response?.status === 401) {
				TokenUtils.removeToken();
				navigate("/login");
			}
		} finally {
			setSubmitting(false);
		}
	};

	const handleOpenCheckIn = (booking) => {
		setSelectedBooking(booking);
		setShowCheckInModal(true);
	};

	const resetCheckInForm = () => {
		setTemperature("");
		setWeight("");
		setHeight("");
		setNote("");
		setSelectedBooking(null);
	};

	// Pagination calculations
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredList.length / itemsPerPage);

	// Render status badge with appropriate styling
	const renderStatusBadge = (status) => {
		const statusStyles = {
			"PENDING": "bg-yellow-100 text-yellow-800",
			"PAID": "bg-green-100 text-green-800",
			"CANCELLED": "bg-red-100 text-red-800",
			"COMPLETED": "bg-blue-100 text-blue-800",
			"CHECKED_IN": "bg-purple-100 text-purple-800",
			"ASSIGNED": "bg-indigo-100 text-indigo-800",
			"DIAGNOSED": "bg-cyan-100 text-cyan-800",
			"VACCINE_INJECTED": "bg-emerald-100 text-emerald-800"
		};
		
		const style = statusStyles[status] || "bg-gray-100 text-gray-800";
		
		return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
				{status}
			</span>
		);
	};

	// Pagination controls
	const renderPagination = () => {
		if (totalPages <= 1) return null;
		
		const pageButtons = [];
		
		// Add first page
		pageButtons.push(
			<Button
				key="first"
				variant={currentPage === 1 ? "default" : "outline"}
				size="sm"
				className="h-8 w-8 p-0"
				onClick={() => setCurrentPage(1)}
			>
				1
			</Button>
		);
		
		// Add ellipsis if needed
		if (currentPage > 3) {
			pageButtons.push(
				<span key="ellipsis1" className="px-2">...</span>
			);
		}
		
		// Add pages around current page
		for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
			pageButtons.push(
				<Button
					key={i}
					variant={currentPage === i ? "default" : "outline"}
					size="sm"
					className="h-8 w-8 p-0"
					onClick={() => setCurrentPage(i)}
				>
					{i}
				</Button>
			);
		}
		
		// Add ellipsis if needed
		if (currentPage < totalPages - 2) {
			pageButtons.push(
				<span key="ellipsis2" className="px-2">...</span>
			);
		}
		
		// Add last page if there are more than 1 page
		if (totalPages > 1) {
			pageButtons.push(
				<Button
					key="last"
					variant={currentPage === totalPages ? "default" : "outline"}
					size="sm"
					className="h-8 w-8 p-0"
					onClick={() => setCurrentPage(totalPages)}
				>
					{totalPages}
				</Button>
			);
		}
		
		return (
			<div className="flex justify-center space-x-2 mt-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
				>
					Previous
				</Button>
				
				<div className="flex items-center space-x-1">
					{pageButtons}
				</div>
				
				<Button
					variant="outline"
					size="sm"
					onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
				>
					Next
				</Button>
			</div>
		);
	};

	// Function to test API directly
	const testDirectApiCall = async () => {
		try {
			const token = localStorage.getItem('token');
			console.log("Testing direct API call with token", token ? "exists" : "missing");
			
			const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/bookings/`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			
			const data = await response.json();
			console.log("Direct API call response:", data);
			
			if (data && data.result) {
				// Log all booking statuses
				const statuses = data.result.map(b => ({ id: b.bookingId, status: b.status }));
				console.log("All booking statuses from direct API call:", statuses);
				
				// Count statuses
				const counts = data.result.reduce((acc, booking) => {
					acc[booking.status] = (acc[booking.status] || 0) + 1;
					return acc;
				}, {});
				console.log("Status counts from direct API call:", counts);
				
				// Check PAID bookings specifically
				const paidBookings = data.result.filter(b => b.status === "PAID");
				console.log("PAID bookings from direct API call:", paidBookings);
			}
		} catch (err) {
			console.error("Error in direct API call:", err);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<MainNav isAdmin={true} />
			<div className="flex">
				<StaffMenu />
				<main className="flex-grow p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-800">Patient Check-In</h1>
						<p className="text-gray-600">
							Process patient arrivals, check-in, and view appointment status
						</p>
					</div>
					
					{errorMessage && (
						<Alert variant="destructive" className="mb-4">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{errorMessage}</AlertDescription>
						</Alert>
					)}
					
					{successMessage && (
						<Alert className="mb-4">
							<CheckCircle className="h-4 w-4" />
							<AlertTitle>Success</AlertTitle>
							<AlertDescription>{successMessage}</AlertDescription>
						</Alert>
					)}
					
					{/* Filters and Search */}
					<Card className="mb-6">
						<CardContent className="pt-6">
							<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
								<div className="md:col-span-5">
									<div className="relative">
										<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
										<Input
											type="text"
											placeholder="Search by name..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="pl-9"
										/>
									</div>
								</div>
								
								<div className="md:col-span-4">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!selectedDate && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{selectedDate ? format(selectedDate, "PPP") : "Filter by date"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={selectedDate}
												onSelect={setSelectedDate}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
								
								<div className="md:col-span-3 flex items-center space-x-2">
									<Button 
										variant="outline" 
										className="flex-1"
										onClick={() => {
											setSearchTerm("");
											setSelectedDate(null);
										}}
									>
										<X className="mr-2 h-4 w-4" />
										Clear
									</Button>
									<Button 
										variant="outline" 
										className="flex-1"
										onClick={fetchBookings}
									>
										<RefreshCw className="mr-2 h-4 w-4" />
										Refresh
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
					
					{/* Tabs and Content */}
					<Card>
						<CardContent className="p-0">
							<Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
									<TabsTrigger value="checkedin">Checked In</TabsTrigger>
									<TabsTrigger value="completed">Completed</TabsTrigger>
								</TabsList>
								
								{loading ? (
									<div className="flex items-center justify-center h-64">
										<div className="flex flex-col items-center">
											<Loader2 className="h-8 w-8 animate-spin text-primary" />
											<p className="mt-2 text-gray-500">Loading bookings...</p>
										</div>
									</div>
								) : (
									<>
										{filteredList.length === 0 ? (
											<div className="text-center py-12">
												<p className="text-gray-500">No bookings found matching your criteria</p>
											</div>
										) : (
											<TabsContent value={activeTab} className="p-1">
												<ScrollArea className="h-[60vh]">
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead>Appointment</TableHead>
																<TableHead>Child</TableHead>
																<TableHead>Parent</TableHead>
																<TableHead>Status</TableHead>
																<TableHead className="text-right">Action</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{currentItems.map((booking) => (
																<TableRow key={booking.bookingId}>
																	<TableCell>
																		<div className="font-medium mb-1">
																			{booking.appointmentDate}
																		</div>
																		<div className="text-sm text-gray-500">
																			{booking.appointmentTime}
																		</div>
																	</TableCell>
																	<TableCell>
																		{booking.child?.name || "N/A"}
																	</TableCell>
																	<TableCell>
																		{booking.child?.account 
																			? `${booking.child.account.firstName} ${booking.child.account.lastName}`
																			: "N/A"}
																	</TableCell>
																	<TableCell>
																		{renderStatusBadge(booking.status)}
																	</TableCell>
																	<TableCell className="text-right">
																		{(booking.status === "PAID" || booking.status === "PENDING") && (
																			<Button
																				onClick={() => handleOpenCheckIn(booking)}
																				size="sm"
																			>
																				<ClipboardCheck className="h-4 w-4 mr-1" />
																				Check In
																			</Button>
																		)}
																	</TableCell>
																</TableRow>
															))}
														</TableBody>
													</Table>
												</ScrollArea>
												{renderPagination()}
											</TabsContent>
										)}
									</>
								)}
							</Tabs>
						</CardContent>
					</Card>
				</main>
			</div>
			
			{/* Check-in Modal */}
			<Dialog open={showCheckInModal} onOpenChange={(open) => {
				if (!open) resetCheckInForm();
				setShowCheckInModal(open);
			}}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Patient Check-In</DialogTitle>
					</DialogHeader>
					
					<form onSubmit={handleCheckIn} className="space-y-4 mt-4">
						<div className="grid gap-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="childName">Child Name</Label>
									<Input 
										id="childName" 
										value={selectedBooking?.child?.name || ""} 
										disabled 
									/>
								</div>
								<div>
									<Label htmlFor="appointmentDate">Appointment Date</Label>
									<Input 
										id="appointmentDate" 
										value={selectedBooking?.appointmentDate || ""} 
										disabled 
									/>
								</div>
							</div>
							
							<div className="grid grid-cols-3 gap-4">
								<div>
									<Label htmlFor="temperature">Temperature (°C)</Label>
									<Input
										id="temperature"
										type="number"
										step="0.1"
										placeholder="36.5"
										value={temperature}
										onChange={(e) => setTemperature(e.target.value)}
										required
									/>
								</div>
								<div>
									<Label htmlFor="weight">Weight (kg)</Label>
									<Input
										id="weight"
										type="number"
										step="0.1"
										placeholder="15.0"
										value={weight}
										onChange={(e) => setWeight(e.target.value)}
										required
									/>
								</div>
								<div>
									<Label htmlFor="height">Height (cm)</Label>
									<Input
										id="height"
										type="number"
										step="0.1"
										placeholder="100.0"
										value={height}
										onChange={(e) => setHeight(e.target.value)}
										required
									/>
								</div>
							</div>
							
							<div>
								<Label htmlFor="note">Notes</Label>
								<Textarea
									id="note"
									placeholder="Enter any relevant observations or notes..."
									value={note}
									onChange={(e) => setNote(e.target.value)}
									className="min-h-[100px]"
								/>
							</div>
						</div>
						
						<DialogFooter className="sm:justify-end">
							<Button variant="outline" type="button" onClick={() => setShowCheckInModal(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={submitting}>
								{submitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<CheckCircle className="mr-2 h-4 w-4" />
										Complete Check-In
									</>
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default CheckIn;
