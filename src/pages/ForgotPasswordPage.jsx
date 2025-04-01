import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { motion } from "framer-motion";
import { AlertTriangle, Mail, Loader2, X, Phone, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import Footer from "../components/layout/Footer";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const validation = Yup.object({
        email: Yup.string()
            .email(t('resetPassword.errors.invalidEmail'))
            .required(t('resetPassword.errors.required')),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: validation,
        onSubmit: async (values) => {
            handleForgotPassword(values);
        },
    });

    const handleForgotPassword = async (values) => {
        setIsLoading(true);
        setError("");
        
        try {
            const response = await fetch("http://localhost:8080/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: values.email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/VerifyOTP", { 
                        state: { 
                            email: values.email,
                            fromForgotPassword: true,
                            from: location.state?.from
                        } 
                    });
                }, 2000);
            } else {
                setError(data.message || t('resetPassword.errors.emailNotFound'));
            }
        } catch (error) {
            console.error("Error requesting password reset:", error);
            setError(t('resetPassword.errors.serverError'));
        } finally {
            setIsLoading(false);
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
                <h1 className="text-3xl font-bold text-blue-900 mb-8">{t('resetPassword.title', 'Reset your Password')}</h1>
                
                {/* Forgot Password Form */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('resetPassword.heading', 'Reset Password')}</h2>
                        <p className="text-gray-600">
                            {t('resetPassword.subtitle', 'Enter your email and we\'ll send you an OTP code to reset your password')}
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
                            <Mail className="h-4 w-4 text-green-600" />
                            <AlertDescription>
                                {t('resetPassword.otpSent', 'OTP code sent to your email')}
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t('register.email', 'Email Address')}
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t('resetPassword.emailPlaceholder', 'Enter your email address')}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full h-11 px-3 py-2 ${
                                    formik.touched.email && formik.errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                                }`}
                                disabled={isLoading || success}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-sm text-red-600">{formik.errors.email}</p>
                            )}
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    {t('resetPassword.processing', 'Processing...')}
                                </>
                            ) : t('resetPassword.sendButton', 'Send Request')}
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
} 