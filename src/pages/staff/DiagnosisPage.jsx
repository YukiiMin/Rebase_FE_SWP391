import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainNav from "../../components/layout/MainNav";
import StaffMenu from "../../components/layout/StaffMenu";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Separator } from "../../components/ui/separator";
import { User, Calendar, Clock, ShieldCheck, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { apiService } from "../../api";
import TokenUtils from "../../utils/TokenUtils";

function DiagnosisPage() {
    const { t } = useTranslation();
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState(null);
    const [diagnosisResults, setDiagnosisResults] = useState([]);
    const [generalComment, setGeneralComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (!token) {
            navigate("/Login");
            return;
        }
        
        fetchBookingDetails();
    }, [bookingId, token, navigate]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            
            if (!TokenUtils.isLoggedIn()) {
                navigate("/login");
                return;
            }
            
            const response = await apiService.bookings.getById(bookingId);
            
            if (response.status === 200) {
                const bookingData = response.data.result;
                setBooking(bookingData);
                
                // Check if child information exists
                if (bookingData.child) {
                    setChild(bookingData.child);
                }
                
                // Get vaccine details from order
                if (bookingData.orders && bookingData.orders.length > 0) {
                    // Find the active order
                    const activeOrder = bookingData.orders.find(order => 
                        order.status === "ACTIVE" || order.status === "PAID"
                    );
                    
                    if (activeOrder && activeOrder.orderDetails) {
                        // Format vaccine data for the diagnosis form
                        const initialVaccines = activeOrder.orderDetails.map(detail => ({
                            orderId: detail.id,
                            vaccineId: detail.vaccine.id,
                            vaccineName: detail.vaccine.name,
                            result: "CAN_INJECT", // Default result
                            reason: "" // Default reason (empty)
                        }));
                        
                        setVaccines(initialVaccines);
                    } else {
                        setError("No active order or vaccine details found");
                    }
                } else {
                    setError("No orders found for this booking");
                }
            } else {
                setError(response.data.message || "Failed to fetch booking details");
            }
        } catch (err) {
            console.error("Error fetching booking details:", err);
            setError(err.response?.data?.message || "An error occurred while fetching booking details");
            
            // Handle token expiration
            if (err.response?.status === 401) {
                TokenUtils.removeToken();
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDiagnosisChange = (vaccineOrderId, field, value) => {
        setDiagnosisResults(prevResults => 
            prevResults.map(item => 
                item.vaccineOrderId === vaccineOrderId 
                ? { ...item, [field]: value } 
                : item
            )
        );
    };

    const validateForm = () => {
        // Check if all vaccines have diagnosis results
        const isValid = diagnosisResults.every(item => item.result);
        
        if (!isValid) {
            setError("Please provide diagnosis results for all vaccines");
            return false;
        }
        
        return true;
    };

    const handleSubmitDiagnosis = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setSubmitting(true);
            
            if (!TokenUtils.isLoggedIn()) {
                navigate("/login");
                return;
            }
            
            // Get user info
            const userInfo = TokenUtils.getUserInfo();
            const doctorId = userInfo.userId;
            
            // Create diagnosis data
            const diagnosisData = {
                notes: generalComment,
                vaccineResults: vaccines.map(vaccine => ({
                    vaccineId: vaccine.vaccineId,
                    result: vaccine.result,
                    reason: vaccine.reason || "No specific concerns"
                }))
            };
            
            const response = await apiService.vaccination.recordDiagnosis(
                bookingId,
                doctorId,
                diagnosisData
            );
            
            if (response.status === 200) {
                setSuccess(true);
                
                // Navigate back after successful submission
                setTimeout(() => {
                    navigate("/staff/vaccination-management");
                }, 2000);
            } else {
                setError(response.data.message || "Failed to submit diagnosis");
            }
        } catch (err) {
            console.error("Error submitting diagnosis:", err);
            setError(err.response?.data?.message || "An error occurred while submitting diagnosis");
            
            // Handle token expiration
            if (err.response?.status === 401) {
                TokenUtils.removeToken();
                navigate("/login");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <MainNav isAdmin={true} />
                <div className="flex">
                    <StaffMenu />
                    <main className="flex-grow p-6">
                        <div className="flex justify-center items-center min-h-[80vh]">
                            <div className="flex flex-col items-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="mt-4 text-lg">Loading booking details...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div className="min-h-screen bg-gray-50">
                <MainNav isAdmin={true} />
                <div className="flex">
                    <StaffMenu />
                    <main className="flex-grow p-6">
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        <Button variant="outline" onClick={() => navigate("/Staff/VaccinationManagement")}>
                            Return to Vaccination Management
                        </Button>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <MainNav isAdmin={true} />
            <div className="flex">
                <StaffMenu />
                <main className="flex-grow p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Patient Diagnosis</h1>
                        <p className="text-gray-600">Review patient information and provide diagnosis results</p>
                    </div>
                    
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert className="mb-6">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Diagnosis has been successfully submitted. Redirecting...</AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Patient Information Card */}
                        <Card className="md:col-span-5">
                            <CardHeader>
                                <CardTitle>Patient Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Child Name</Label>
                                        <p className="font-medium">{booking?.child?.name || "N/A"}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Parent Name</Label>
                                        <p className="font-medium">
                                            {booking?.child?.account 
                                                ? `${booking.child.account.firstName} ${booking.child.account.lastName}`
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Appointment Date</Label>
                                        <p className="font-medium">{booking?.appointmentDate || "N/A"}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Appointment Time</Label>
                                        <p className="font-medium">{booking?.appointmentTime || "N/A"}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <ShieldCheck className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Booking Status</Label>
                                        <p className="font-medium">{booking?.status || "N/A"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Diagnosis Form */}
                        <Card className="md:col-span-7">
                            <CardHeader>
                                <CardTitle>Diagnosis Form</CardTitle>
                            </CardHeader>
                            <form onSubmit={handleSubmitDiagnosis}>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="font-medium mb-3">Vaccine Diagnosis Results</h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Vaccine</TableHead>
                                                    <TableHead>Diagnosis Result</TableHead>
                                                    <TableHead>Notes</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {diagnosisResults.map((item) => (
                                                    <TableRow key={item.vaccineOrderId}>
                                                        <TableCell className="font-medium">
                                                            {item.vaccineName}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                value={item.result}
                                                                onValueChange={(value) => handleDiagnosisChange(item.vaccineOrderId, "result", value)}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select result" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="CAN_INJECT">Can Inject</SelectItem>
                                                                    <SelectItem value="CANNOT_INJECT">Cannot Inject</SelectItem>
                                                                    <SelectItem value="DELAY_INJECTION">Delay Injection</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Textarea
                                                                placeholder="Additional notes (optional)"
                                                                value={item.note}
                                                                onChange={(e) => handleDiagnosisChange(item.vaccineOrderId, "note", e.target.value)}
                                                                className="min-h-[80px]"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div>
                                        <Label htmlFor="generalComment" className="mb-2 block">General Comments</Label>
                                        <Textarea
                                            id="generalComment"
                                            placeholder="Add any general comments about the patient's condition..."
                                            value={generalComment}
                                            onChange={(e) => setGeneralComment(e.target.value)}
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => navigate("/Staff/VaccinationManagement")}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={submitting || success}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : "Submit Diagnosis"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DiagnosisPage; 