import React, { useEffect, useState } from "react";
import StaffMenu from "../../components/layout/StaffMenu";
import { useNavigate } from "react-router-dom";
import MainNav from "../../components/layout/MainNav";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Search, Filter, CalendarClock, UserCheck, Stethoscope, Syringe, ListFilter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useTranslation } from "react-i18next";
import { apiService } from "../../api";
import TokenUtils from "../../utils/TokenUtils";

function VaccinationManagement() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [bookingList, setBookingList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchName, setSearchName] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageAlert, setMessageAlert] = useState({ show: false, type: "", message: "" });
    const [loadingAction, setLoadingAction] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [allBookings, setAllBookings] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    // Theo dõi thay đổi của localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const currentToken = localStorage.getItem('token');
            setToken(currentToken);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        // Kiểm tra token
        if (!token) {
            console.warn("No token found, redirecting to login");
            navigate('/Login');
            return;
        }
        
        getVaccinationBookings();
        
        // Add direct API test
        testDirectApiCall();
    }, [token, navigate]);

    useEffect(() => {
        handleSearch();
    }, [bookingList, searchName, statusFilter]);

    const getVaccinationBookings = async () => {
        try {
            setLoading(true);
            
            if (!TokenUtils.isLoggedIn()) {
                navigate("/login");
                return;
            }
            
            console.log("Fetching all bookings for vaccination management...");
            const response = await apiService.bookings.getAll();
            
            if (response.status === 200) {
                // Get all bookings
                const bookings = response.data.result || [];
                console.log("API Response:", response);
                console.log("Raw bookings data:", bookings);
                console.log("Booking statuses:", bookings.map(b => ({ id: b.bookingId, status: b.status, date: b.appointmentDate })));
                
                // Count bookings by status
                const statusCounts = bookings.reduce((acc, booking) => {
                    acc[booking.status] = (acc[booking.status] || 0) + 1;
                    return acc;
                }, {});
                console.log("Booking status counts:", statusCounts);
                
                // Show bookings with status PAID or any other status except PENDING
                const filteredBookings = bookings.filter(booking => {
                    const shouldInclude = booking.status === "PAID" || booking.status !== "PENDING";
                    console.log(`Booking ${booking.bookingId} with status ${booking.status}: ${shouldInclude ? 'INCLUDE' : 'EXCLUDE'}`);
                    return shouldInclude;
                });
                
                console.log("Filtered bookings for vaccination management:", filteredBookings);
                console.log("Filtered statuses:", filteredBookings.map(b => b.status));
                
                // Check if filtered list contains PAID bookings
                const filteredPaidBookings = filteredBookings.filter(b => b.status === "PAID");
                console.log("PAID bookings after filtering:", filteredPaidBookings.length, filteredPaidBookings);
                
                // Set allBookings with filtered booking list
                const sorted = sortBookings(filteredBookings);
                setAllBookings(sorted);
                
                // Update bookingList for filtration
                setBookingList(sorted);
                
                // Apply initial filtering
                handleSearch();
            } else {
                console.error("API returned non-200 status:", response.status, response.data);
                setError(response.data.message || "Failed to fetch vaccination bookings");
            }
        } catch (err) {
            console.error("Error fetching vaccination bookings:", err);
            if (err.response) {
                console.error("Error response:", err.response.status, err.response.data);
            }
            setError(err.response?.data?.message || "An error occurred while fetching vaccination bookings");
            
            // Handle token expiration
            if (err.response?.status === 401) {
                TokenUtils.removeToken();
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAssignStaff = async (bookingId) => {
        try {
            setLoadingAction(bookingId);
            
            if (!TokenUtils.isLoggedIn()) {
                navigate("/login");
                return;
            }
            
            // Get user info to determine role
            const userInfo = TokenUtils.getUserInfo();
            const userRole = userInfo.role;
            
            // Format the booking date for the API
            const booking = allBookings.find(b => b.id === bookingId);
            if (!booking) {
                throw new Error("Booking not found");
            }
            
            const bookingDate = new Date(booking.appointmentDate).toISOString().split('T')[0];
            
            // Map user role to API role parameter
            let role;
            if (userRole.includes("DOCTOR")) {
                role = "doctor";
            } else if (userRole.includes("NURSE")) {
                role = "nurse";
            } else {
                throw new Error("Invalid staff role for vaccination");
            }
            
            const response = await apiService.bookings.assignStaff(bookingId, role, bookingDate);
            
            if (response.status === 200) {
                // Show success message and refresh booking list
                setSuccessMessage(`Successfully assigned as ${role} for booking #${bookingId}`);
                setTimeout(() => {
                    setSuccessMessage("");
                    getVaccinationBookings();
                }, 2000);
            } else {
                setError(response.data.message || `Failed to assign staff as ${role} for booking #${bookingId}`);
            }
        } catch (err) {
            console.error("Error assigning staff:", err);
            setError(err.response?.data?.message || "An error occurred while assigning staff");
            
            // Handle token expiration
            if (err.response?.status === 401) {
                TokenUtils.removeToken();
                navigate("/login");
            }
        } finally {
            setLoadingAction(null);
        }
    };

    // Function to display booking status with appropriate badge
    const renderStatusBadge = (status) => {
        if (!status || status === "n/a") return <Badge variant="outline">Pending</Badge>;
        
        const statusVariants = {
            "PENDING": "outline",
            "PAID": "default",
            "CHECKED_IN": "primary",
            "ASSIGNED": "success",
            "DIAGNOSED": "info",
            "VACCINE_INJECTED": "secondary",
            "COMPLETED": "success",
            "CANCELLED": "destructive"
        };
        
        const variant = statusVariants[status] || "default";
        return <Badge variant={variant}>{status}</Badge>;
    };

    // Sort bookings by appointment date
    const sortBookings = (bookings) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureBookings = [];
        const pastBookings = [];

        bookings.forEach((booking) => {
            const bookingDate = new Date(booking.appointmentDate);
            bookingDate.setHours(0, 0, 0, 0);

            if (bookingDate >= today) {
                futureBookings.push(booking);
            } else {
                pastBookings.push(booking);
            }
        });

        futureBookings.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        pastBookings.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

        return [...futureBookings, ...pastBookings];
    };

    // Search and filter function
    const handleSearch = () => {
        if (!allBookings || !Array.isArray(allBookings)) {
            setFilteredList([]);
            return;
        }
        
        // Start with all bookings
        let filtered = [...allBookings];
        
        // Apply status filter
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }
        
        // Apply name search if search term exists
        if (searchName.trim()) {
            filtered = filtered.filter(booking => {
                const childName = (booking.child?.name || "").toLowerCase();
                const parentFirstName = (booking.child?.account?.firstName || "").toLowerCase();
                const parentLastName = (booking.child?.account?.lastName || "").toLowerCase();
                const searchLower = searchName.toLowerCase();
                
                return childName.includes(searchLower) || 
                       parentFirstName.includes(searchLower) || 
                       parentLastName.includes(searchLower);
            });
        }
        
        // Sort filtered bookings
        filtered = sortBookings(filtered);
        
        setFilteredList(filtered);
        setCurrentPage(1); // Reset to first page when filtering changes
    };
    
    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    // Change page function
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate enrollment number
    const generateEnrollNumber = (bookingId, appointmentDate) => {
        const dateStr = appointmentDate ? new Date(appointmentDate).toISOString().slice(0, 10).replace(/-/g, '') : '00000000';
        return `${dateStr}-${bookingId.toString().padStart(4, '0')}`;
    };

    // Handle action button click
    const handleActionClick = (booking) => {
        if (booking.status === "CHECKED_IN") {
            // Assign staff
            handleAssignStaff(booking.bookingId);
        } else if (booking.status === "ASSIGNED") {
            // Navigate to diagnosis page
            navigate(`/Staff/Diagnosis/${booking.bookingId}`);
        } else if (booking.status === "DIAGNOSED") {
            // Navigate to vaccination page
            navigate(`/Staff/Vaccination/${booking.bookingId}`);
        } else if (booking.status === "VACCINE_INJECTED" || booking.status === "COMPLETED") {
            // Navigate to vaccination details page
            navigate(`/Staff/VaccinationDetails/${booking.bookingId}`);
        } else if (booking.status === "CANCELLED") {
            alert("This booking has been cancelled and cannot be processed.");
        } else {
            // For other statuses like PENDING or PAID
            alert("This booking is not ready for vaccination process yet. It needs to be checked in first.");
        }
    };

    // Render action button based on status
    const renderActionButton = (booking) => {
        if (booking.status === "CHECKED_IN") {
            return (
                <Button size="sm" className="w-full" disabled={loadingAction === booking.bookingId} onClick={() => handleActionClick(booking)}>
                    <UserCheck className="h-4 w-4 mr-1" />
                    Assign Staff
                </Button>
            );
        } else if (booking.status === "ASSIGNED") {
            return (
                <Button size="sm" className="w-full" variant="secondary" onClick={() => handleActionClick(booking)}>
                    <Stethoscope className="h-4 w-4 mr-1" />
                    Diagnose
                </Button>
            );
        } else if (booking.status === "DIAGNOSED") {
            return (
                <Button size="sm" className="w-full" variant="success" onClick={() => handleActionClick(booking)}>
                    <Syringe className="h-4 w-4 mr-1" />
                    Vaccinate
                </Button>
            );
        } else if (booking.status === "VACCINE_INJECTED" || booking.status === "COMPLETED") {
            return (
                <Button size="sm" className="w-full" variant="outline" onClick={() => handleActionClick(booking)}>
                    View Details
                </Button>
            );
        } else if (booking.status === "CANCELLED") {
            return (
                <Button size="sm" className="w-full" variant="destructive" disabled>
                    Cancelled
                </Button>
            );
        } else if (booking.status === "PENDING") {
            return (
                <Button size="sm" className="w-full" variant="outline" disabled>
                    Pending Payment
                </Button>
            );
        } else if (booking.status === "PAID") {
            return (
                <Button size="sm" className="w-full" variant="outline" disabled>
                    Awaiting Check-in
                </Button>
            );
        } else {
            // For unknown status
            return (
                <Button size="sm" className="w-full" variant="outline" disabled>
                    {booking.status || "Unknown Status"}
                </Button>
            );
        }
    };

    // Render pagination controls
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
                onClick={() => handlePageChange(1)}
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
                    onClick={() => handlePageChange(i)}
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
        
        // Add last page if needed
        if (totalPages > 1) {
            pageButtons.push(
                <Button
                    key="last"
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePageChange(totalPages)}
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
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
            console.log("Direct API call response for VaccinationManagement:", data);
            
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
                        <h1 className="text-2xl font-bold text-gray-800">Vaccination Management</h1>
                        <p className="text-gray-600">
                            Manage vaccination appointments, diagnosis, and vaccination administration
                        </p>
                    </div>
                    
                    {messageAlert.show && (
                        <Alert 
                            variant={messageAlert.type === "success" ? "default" : messageAlert.type} 
                            className="mb-4"
                        >
                            <AlertTitle>{messageAlert.type === "success" ? "Success" : "Error"}</AlertTitle>
                            <AlertDescription>{messageAlert.message}</AlertDescription>
                        </Alert>
                    )}
                    
                    <Card className="mb-6">
                        <CardHeader className="pb-3">
                            <CardTitle>Search & Filter</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-8">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search by child or parent name..."
                                            value={searchName}
                                            onChange={(e) => setSearchName(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-4">
                                    <div className="relative">
                                        <ListFilter className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Select 
                                            value={statusFilter} 
                                            onValueChange={setStatusFilter}
                                        >
                                            <SelectTrigger className="pl-9">
                                                <SelectValue placeholder="Filter by status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Statuses</SelectItem>
                                                <SelectItem value="PAID">Paid</SelectItem>
                                                <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                                                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                                                <SelectItem value="DIAGNOSED">Diagnosed</SelectItem>
                                                <SelectItem value="VACCINE_INJECTED">Vaccine Injected</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                        <p className="mt-2 text-gray-500">Loading vaccination bookings...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {filteredList.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500">No vaccination bookings found matching your criteria</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[100px]">Enroll #</TableHead>
                                                        <TableHead>Child Name</TableHead>
                                                        <TableHead>Parent Name</TableHead>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {currentItems.map((booking) => (
                                                        <TableRow key={booking.bookingId}>
                                                            <TableCell className="font-medium">
                                                                {generateEnrollNumber(booking.bookingId, booking.appointmentDate)}
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
                                                                <div className="flex items-center">
                                                                    <CalendarClock className="h-4 w-4 mr-1 text-gray-500" />
                                                                    {booking.appointmentDate || "N/A"}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {renderStatusBadge(booking.status)}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {renderActionButton(booking)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            {renderPagination()}
                                        </>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}

export default VaccinationManagement; 