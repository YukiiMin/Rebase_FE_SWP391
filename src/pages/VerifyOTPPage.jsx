import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, X, Phone, Shield } from "lucide-react";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";
import { apiService } from "../api";

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(60);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const email = location.state?.email || "";
    const { t } = useTranslation();

    // Verify location state has email, otherwise redirect
    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [email, navigate]);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Handle OTP input change
    const handleChange = (e, index) => {
        const value = e.target.value;
        
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;
        
        // Update OTP array
        const newOtp = [...otp];
        newOtp[index] = value.slice(0, 1); // Only take first character
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        // Auto submit when all fields are filled
        if (value && index === 5) {
            const completeOtp = newOtp.join("");
            if (completeOtp.length === 6) {
                handleVerifyOtp(completeOtp);
            }
        }
    };

    // Handle key down for backspace and navigation
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1].focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            // Move to previous input on left arrow
            inputRefs.current[index - 1].focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            // Move to next input on right arrow
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle paste event
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").trim();
        
        if (/^\d+$/.test(pastedData)) {
            const pastedOtp = pastedData.slice(0, 6).split("");
            const newOtp = [...otp];
            
            for (let i = 0; i < pastedOtp.length; i++) {
                if (i < 6) newOtp[i] = pastedOtp[i];
            }
            
            setOtp(newOtp);
            
            // Focus the appropriate input
            if (pastedOtp.length < 6) {
                inputRefs.current[pastedOtp.length].focus();
            } else {
                inputRefs.current[5].focus();
                // Auto submit when all fields are filled by paste
                handleVerifyOtp(newOtp.join(""));
            }
        }
    };

    // Handle verify OTP submission
    const handleVerifyOtp = async (otpValue) => {
        const otpCode = otpValue || otp.join("");
        if (otpCode.length !== 6) {
            setError(t('verifyOTP.errors.required'));
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await apiService.auth.verifyOtp({
                email: email,
                otp: otpCode,
            });

            console.log("OTP verification response:", response.data);

            if (response.status === 200) {
                console.log("OTP verification successful");
                // Extract token from response - could be in different formats based on your API
                const tokenValue = response.data.token || response.data.data?.token || response.data.resetToken || response.data;
                
                console.log("Token extracted:", tokenValue);
                
                // Navigate to reset password page with token
                navigate("/ResetPassword", { 
                    state: { 
                        email,
                        token: tokenValue,
                        from: location.state?.from
                    } 
                });
            } else {
                setError(response.data.message || t('verifyOTP.errors.invalidOTP'));
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setError(error.response?.data?.message || t('verifyOTP.errors.serverError'));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;
        
        setResendLoading(true);
        setError("");

        try {
            const response = await apiService.auth.resendOtp({ email });

            if (response.status === 200) {
                setCountdown(60);
            } else {
                setError(response.data.message || t('verifyOTP.errors.resendFailed'));
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            setError(error.response?.data?.message || t('verifyOTP.errors.resendFailed'));
        } finally {
            setResendLoading(false);
        }
    };

    const handleClose = () => {
        if (location.state?.from) {
            navigate(location.state.from);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-blue-800 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-blue-700 p-2 rounded-full flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                            <span className="text-lg font-bold text-white ml-2">VaccineCare</span>
                        </div>
                    </Link>
                    
                    <a href="tel:0903731347" className="flex items-center text-white hover:text-blue-200 transition-colors">
                        <Phone className="h-5 w-5 mr-2" />
                        <span>0903731347</span>
                    </a>
                </div>
            </header>
            
            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center py-10 px-4">
                <h1 className="text-3xl font-bold text-blue-900 mb-8">{t('verifyOTP.title', 'Verify OTP Code')}</h1>
                
                {/* OTP Verification Form */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('verifyOTP.heading', 'Enter OTP Code')}</h2>
                        <p className="text-gray-600">
                            {t('verifyOTP.subtitle', `We've sent a verification code to ${email}`)}
                        </p>
                    </div>
                    
                    {error && (
                        <Alert variant="destructive" className="mb-6 bg-red-50 border border-red-200 text-red-900">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    <form className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex justify-center space-x-3">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={otp[index]}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 text-center text-xl font-bold border-2 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                            
                            <Button 
                                type="button" 
                                onClick={() => handleVerifyOtp()}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors" 
                                disabled={isLoading || otp.join("").length !== 6}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        {t('verifyOTP.verifying', 'Verifying...')}
                                    </>
                                ) : t('verifyOTP.verifyButton', 'Verify OTP')}
                            </Button>
                            
                            <div className="text-center w-full">
                                <div className="flex justify-center items-center space-x-2">
                                    <span className="text-sm text-gray-600">{t('verifyOTP.didntReceive', 'Didn\'t receive code?')}</span>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={countdown > 0 || resendLoading}
                                        className={`text-sm font-medium ${countdown > 0 || resendLoading ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
                                    >
                                        {resendLoading ? (
                                            <span className="flex items-center">
                                                <Loader2 className="animate-spin h-3 w-3 mr-1" />
                                                {t('verifyOTP.resending', 'Resending...')}
                                            </span>
                                        ) : countdown > 0 ? (
                                            `${t('verifyOTP.resendIn', 'Resend in')} ${countdown}s`
                                        ) : (
                                            t('verifyOTP.resend', 'Resend OTP')
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="w-full pt-4 border-t border-gray-200 mt-4">
                                <div className="flex justify-center">
                                    <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">
                                        {t('verifyOTP.backToLogin', 'Back to Login')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default VerifyOtpPage; 