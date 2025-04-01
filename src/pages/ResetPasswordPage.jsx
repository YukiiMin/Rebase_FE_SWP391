import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { motion } from "framer-motion";
import { AlertTriangle, Eye, EyeOff, Loader2, Shield, Phone } from "lucide-react";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            
            const response = await fetch("http://localhost:8080/auth/reset-password", {
                method: "POST", // Use POST instead of PATCH
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password: values.password,
                }),
            });

            console.log("Response status:", response.status, response.statusText);
            
            let data;
            try {
                const textResponse = await response.text();
                console.log("Raw response:", textResponse);
                
                if (textResponse) {
                    data = JSON.parse(textResponse);
                } else {
                    data = {};
                }
            } catch (parseError) {
                console.error("Error parsing response:", parseError);
                data = { message: "Error parsing server response" };
            }
            
            console.log("Reset password response data:", data);

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login", { 
                        state: { 
                            passwordResetSuccess: true,
                            from: location.state?.from
                        } 
                    });
                }, 2000);
            } else {
                setError(data.message || t('resetPassword.errors.resetFailed'));
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setError(t('resetPassword.errors.serverError'));
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
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {t('resetPassword.newPassword', 'New Password')}
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('resetPassword.newPasswordPlaceholder', 'Enter new password')}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full h-11 px-3 py-2 pr-10 ${
                                        formik.touched.password && formik.errors.password
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                    disabled={isLoading || success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex="-1"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-sm text-red-600">{formik.errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                {t('resetPassword.confirmPassword', 'Confirm Password')}
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder={t('resetPassword.confirmPasswordPlaceholder', 'Confirm your password')}
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full h-11 px-3 py-2 pr-10 ${
                                        formik.touched.confirmPassword && formik.errors.confirmPassword
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                    disabled={isLoading || success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex="-1"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-sm text-red-600">{formik.errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors mt-6" 
                            disabled={isLoading || success}
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