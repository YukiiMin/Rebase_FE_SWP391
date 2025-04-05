import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertTriangle, Loader2, Shield, Phone } from "lucide-react";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";
import PasswordStrengthMeter from "../components/ui/PasswordStrengthMeter";
import { apiService } from "../api";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("weak");
    const { t } = useTranslation();
    
    const email = location.state?.email || "";
    const token = location.state?.token || "";

    // Verify location state has email and token, otherwise redirect
    useEffect(() => {
        console.log("ResetPasswordPage - location state:", location.state);
        console.log("ResetPasswordPage - email:", email);
        console.log("ResetPasswordPage - token:", token);
        console.log("ResetPasswordPage - token type:", typeof token);
        
        if (!email) {
            console.log("Missing email, redirecting to forgot-password");
            navigate("/forgot-password");
            return;
        }
        
        // More permissive check for token existence
        if (!token && token !== 0 && token !== "" && token !== false) {
            console.log("Missing token, redirecting to forgot-password");
            navigate("/forgot-password");
        }
    }, [email, token, navigate, location]);

    const validationSchema = Yup.object({
        password: Yup.string()
            .required(t('resetPassword.errors.required'))
            .min(8, t('resetPassword.errors.passwordLength'))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                t('resetPassword.errors.passwordRequirements')
            ),
        confirmPassword: Yup.string()
            .required(t('resetPassword.errors.required'))
            .oneOf([Yup.ref("password"), null], t('resetPassword.errors.passwordMatch')),
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: (values) => {
            handleResetPassword(values);
        },
    });

    const handleResetPassword = async (values) => {
        setIsLoading(true);
        setError("");

        // Safety check to ensure we have a token
        if (!token) {
            setError(t('resetPassword.errors.tokenMissing') || "Reset token is missing. Please try again.");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Sending reset password request with:", {
                email,
                password: "********"
            });
            
            const response = await apiService.auth.resetPassword({
                email,
                password: values.password,
            });
            
            setSuccess(true);
            setTimeout(() => {
                navigate("/login", { 
                    state: { 
                        passwordResetSuccess: true,
                        from: location.state?.from
                    } 
                });
            }, 2000);
        } catch (error) {
            console.error("Error resetting password:", error);
            setError(error.response?.data?.message || t('resetPassword.errors.serverError'));
        } finally {
            setIsLoading(false);
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
                <h1 className="text-3xl font-bold text-blue-900 mb-8">{t('resetPassword.title')}</h1>
                
                {/* Reset Password Form */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('resetPassword.heading')}</h2>
                        <p className="text-gray-600">
                            {t('resetPassword.subtitle')}
                        </p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-6 bg-red-50 border border-red-200 text-red-900">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="mb-6 bg-green-50 border border-green-200 text-green-800">
                            <Shield className="h-4 w-4 text-green-600" />
                            <AlertDescription>
                                {t('resetPassword.success')}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <PasswordStrengthMeter 
                            formik={formik}
                            passwordStrength={passwordStrength}
                            setPasswordStrength={setPasswordStrength}
                            showConfirmPassword={true}
                            disabled={isLoading || success}
                        />

                        <Button 
                            type="submit" 
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors" 
                            disabled={isLoading || success || passwordStrength === "weak"}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    {t('resetPassword.processing', 'Processing...')}
                                </>
                            ) : t('resetPassword.resetButton', 'Reset Password')}
                        </Button>
                        
                        <div className="text-center mt-4">
                            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">
                                {t('resetPassword.backToLogin', 'Back to Login')}
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default ResetPasswordPage; 