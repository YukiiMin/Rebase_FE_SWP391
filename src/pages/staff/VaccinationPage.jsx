import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainNav from "../../components/layout/MainNav";
import StaffMenu from "../../components/layout/StaffMenu";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
import { User, Calendar, Clock, ShieldCheck, CheckCircle, AlertCircle, Loader2, Syringe, FileText } from "lucide-react";
import { apiService } from "../../api";
import TokenUtils from "../../utils/TokenUtils";

function VaccinationPage() {
    const { t } = useTranslation();
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState(null);
    const [diagnosis, setDiagnosis] = useState(null);
    const [vaccineResults, setVaccineResults] = useState([]);
    const [vaccineNotes, setVaccineNotes] = useState({});
    const [confirmModal, setConfirmModal] = useState(false);
    const [generalNotes, setGeneralNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (!token) {
            navigate("/Login");
            return;
        }
        
        fetchBookingAndDiagnosis();
    }, [bookingId, token, navigate]);

    const fetchBookingAndDiagnosis = async () => {
        try {
            setLoading(true);
            
            if (!TokenUtils.isLoggedIn()) {
                navigate("/login");
                return;
            }
            
            // Get booking details
            const response = await apiService.bookings.getById(bookingId);
            
            if (response.status === 200) {
                const bookingData = response.data.result;
                setBooking(bookingData);
                
                // Get user info to determine role
                const userInfo = TokenUtils.getUserInfo();
                
                // Check if child information exists
                if (bookingData.child) {
                    setChildData(bookingData.child);
                }
                
                // Check if diagnosis exists
                if (bookingData.diagnosis) {
                    setDiagnosis(bookingData.diagnosis);
                } else {
                    setError("No diagnosis record found for this booking");
                }
                
                // Get vaccine details from order
                if (bookingData.orders && bookingData.orders.length > 0) {
                    // Find the active order
                    const activeOrder = bookingData.orders.find(order => 
                        order.status === "ACTIVE" || order.status === "PAID"
                    );
                    
                    if (activeOrder && activeOrder.orderDetails) {
                        // Format vaccine data for the form
                        const formattedVaccines = activeOrder.orderDetails.map(detail => ({
                            orderId: detail.id,
                            vaccineName: detail.vaccine.name,
                            vaccineId: detail.vaccine.id,
                            administered: false,
                            notes: ""
                        }));
                        
                        setVaccines(formattedVaccines);
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
            console.error("Error fetching booking and diagnosis:", err);
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

    const handleVaccineToggle = (vaccineOrderId) => {
        setVaccineResults(prev => ({
            ...prev,
            [vaccineOrderId]: !prev[vaccineOrderId]
        }));
    };

    const handleNoteChange = (vaccineOrderId, note) => {
        setVaccineNotes(prev => ({
            ...prev,
            [vaccineOrderId]: note
        }));
    };

    const validateForm = () => {
        // Check if at least one vaccine is marked as injected
        const hasInjected = Object.values(vaccineResults).some(value => value === true);
        
        if (!hasInjected) {
            setError("Please mark at least one vaccine as injected");
            return false;
        }
        
        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setConfirmModal(true);
        }
    };

    const submitVaccinationResults = async () => {
        try {
            setSubmitting(true);
            
            if (!TokenUtils.isLoggedIn()) {
                navigate("/login");
                return;
            }
            
            // Get user info
            const userInfo = TokenUtils.getUserInfo();
            const nurseId = userInfo.userId;
            
            // Prepare vaccination data
            const vaccineData = vaccines
                .filter(v => v.administered)
                .map(v => ({
                    vaccineId: v.vaccineId,
                    notes: v.notes || "No special observations"
                }));
            
            if (vaccineData.length === 0) {
                setError("No vaccines marked as administered");
                setSubmitting(false);
                return;
            }
            
            // Record injection
            const response = await apiService.vaccination.recordInjection(bookingId, nurseId, {
                vaccines: vaccineData,
                injectionTime: new Date().toISOString()
            });
            
            if (response.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/staff/vaccination-management");
                }, 2000);
            } else {
                setError(response.data.message || "Failed to record vaccination results");
            }
        } catch (err) {
            console.error("Error submitting vaccination results:", err);
            setError(err.response?.data?.message || "An error occurred while recording vaccination results");
            
            // Handle token expiration
            if (err.response?.status === 401) {
                TokenUtils.removeToken();
                navigate("/login");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Helper function to get diagnosis result text
    const getDiagnosisResultText = (result) => {
        switch(result) {
            case "CAN_INJECT": return "Can Inject";
            case "CANNOT_INJECT": return "Cannot Inject";
            case "DELAY_INJECTION": return "Delay Injection";
            default: return result;
        }
    };

    // Helper function to render the badge for diagnosis result
    const renderDiagnosisBadge = (result) => {
        const variantMap = {
            "CAN_INJECT": "bg-green-100 text-green-800",
            "CANNOT_INJECT": "bg-red-100 text-red-800",
            "DELAY_INJECTION": "bg-yellow-100 text-yellow-800"
        };
        
        const className = variantMap[result] || "bg-gray-100 text-gray-800";
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
                {getDiagnosisResultText(result)}
            </span>
        );
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
                                <p className="mt-4 text-lg">Loading booking and diagnosis details...</p>
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

    // Filter only vaccines that can be injected based on diagnosis
    const injectableVaccines = diagnosis?.diagnosisResults?.filter(item => item.result === "CAN_INJECT") || [];
    const nonInjectableVaccines = diagnosis?.diagnosisResults?.filter(item => item.result !== "CAN_INJECT") || [];

    return (
        <div className="min-h-screen bg-gray-100">
            <MainNav isAdmin={true} />
            <div className="flex">
                <StaffMenu />
                <main className="flex-grow p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Vaccination Administration</h1>
                        <p className="text-gray-600">
                            Record vaccine administration results for the patient
                        </p>
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
                            <AlertDescription>
                                Vaccination results have been successfully recorded. Redirecting...
                            </AlertDescription>
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
                                
                                <Separator />
                                
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Diagnosis Summary</h3>
                                    <p className="text-sm">{diagnosis?.generalComment || "No general comments provided."}</p>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Vaccination Form */}
                        <Card className="md:col-span-7">
                            <CardHeader>
                                <CardTitle>Vaccination Record</CardTitle>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                                {injectableVaccines.length > 0 ? (
                                    <div>
                                        <h3 className="font-medium mb-3">Vaccines to Administer</h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Vaccine</TableHead>
                                                    <TableHead>Diagnosis</TableHead>
                                                    <TableHead>Administered</TableHead>
                                                    <TableHead>Notes</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {injectableVaccines.map((item) => (
                                                    <TableRow key={item.vaccineOrderId}>
                                                        <TableCell className="font-medium">
                                                            {item.vaccineName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {renderDiagnosisBadge(item.result)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`vaccine-${item.vaccineOrderId}`}
                                                                    checked={vaccineResults[item.vaccineOrderId] || false}
                                                                    onCheckedChange={() => handleVaccineToggle(item.vaccineOrderId)}
                                                                />
                                                                <label 
                                                                    htmlFor={`vaccine-${item.vaccineOrderId}`}
                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    Injected
                                                                </label>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Textarea
                                                                placeholder="Administration notes..."
                                                                value={vaccineNotes[item.vaccineOrderId] || ""}
                                                                onChange={(e) => handleNoteChange(item.vaccineOrderId, e.target.value)}
                                                                className="min-h-[80px]"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500">No vaccines approved for injection in the diagnosis.</p>
                                    </div>
                                )}
                                
                                {nonInjectableVaccines.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-3">Vaccines Not Approved for Injection</h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Vaccine</TableHead>
                                                    <TableHead>Diagnosis</TableHead>
                                                    <TableHead>Diagnosis Notes</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {nonInjectableVaccines.map((item) => (
                                                    <TableRow key={item.vaccineOrderId}>
                                                        <TableCell className="font-medium">
                                                            {item.vaccineName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {renderDiagnosisBadge(item.result)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.note || "No notes provided."}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                                
                                <Separator />
                                
                                <div>
                                    <Label htmlFor="generalNotes" className="block mb-2">General Notes</Label>
                                    <Textarea
                                        id="generalNotes"
                                        placeholder="Enter any general notes about the vaccination session..."
                                        value={generalNotes}
                                        onChange={(e) => setGeneralNotes(e.target.value)}
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
                                    type="button" 
                                    onClick={handleSubmit}
                                    disabled={injectableVaccines.length === 0 || submitting || success}
                                >
                                    <Syringe className="mr-2 h-4 w-4" />
                                    Record Vaccination
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
            
            {/* Confirmation Modal */}
            <Dialog open={confirmModal} onOpenChange={setConfirmModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Vaccination Record</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <p>Are you sure you want to submit the vaccination record?</p>
                        <p className="text-gray-500 mt-2">
                            This will mark the following vaccines as administered:
                        </p>
                        <ul className="mt-2 space-y-1">
                            {injectableVaccines
                                .filter(item => vaccineResults[item.vaccineOrderId])
                                .map(item => (
                                    <li key={item.vaccineOrderId} className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        {item.vaccineName}
                                    </li>
                                ))}
                        </ul>
                        
                        {injectableVaccines
                            .filter(item => !vaccineResults[item.vaccineOrderId])
                            .length > 0 && (
                                <>
                                    <p className="text-gray-500 mt-4">
                                        The following vaccines will be marked as NOT administered:
                                    </p>
                                    <ul className="mt-2 space-y-1">
                                        {injectableVaccines
                                            .filter(item => !vaccineResults[item.vaccineOrderId])
                                            .map(item => (
                                                <li key={item.vaccineOrderId} className="flex items-center">
                                                    <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                                    {item.vaccineName}
                                                </li>
                                            ))}
                                    </ul>
                                </>
                            )}
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={submitVaccinationResults}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default VaccinationPage; 