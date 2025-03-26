import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { motion } from "framer-motion";
import { AlertCircle, Mail, Loader2, X } from "lucide-react";
import MainNav from "../components/MainNav";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const validation = Yup.object({
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Email là bắt buộc"),
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
                    navigate("/verify-otp", { state: { email: values.email } });
                }, 2000);
            } else {
                setError(data.message || "Không tìm thấy tài khoản với email này. Vui lòng kiểm tra lại.");
            }
        } catch (error) {
            console.error("Error requesting password reset:", error);
            setError("Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.");
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
        <div className="min-h-screen flex flex-col relative">
            <MainNav />
            
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-blue-900/60 z-10"></div> {/* Overlay */}
                <img 
                    src="/vaccination-background.jpg" 
                    alt="Vaccination Background" 
                    className="w-full h-full object-cover object-center"
                />
            </div>
            
            {/* Content */}
            <div className="flex-1 flex justify-center items-center relative z-20 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-md relative"
                >
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors duration-200"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-[#1B1B1B] mb-2">Quên mật khẩu</h2>
                        <p className="text-gray-600">
                            Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
                        </p>
                    </div>
                    
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                            <Mail className="h-4 w-4 text-green-600" />
                            <AlertDescription>
                                Mã OTP đã được gửi tới email của bạn. Bạn sẽ được chuyển đến trang nhập mã.
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`h-11 px-4 bg-white/80 transition-colors duration-200 ${
                                    formik.touched.email && formik.errors.email 
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                }`}
                                disabled={isLoading || success}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                            )}
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base transition-all duration-200 hover:shadow-lg hover:scale-[1.02]" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : "Gửi yêu cầu"}
                        </Button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => navigate("/login")}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-all duration-200 hover:underline"
                            disabled={isLoading}
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 