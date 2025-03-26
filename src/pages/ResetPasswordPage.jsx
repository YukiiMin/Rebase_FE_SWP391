import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2, LockKeyhole, CheckCircle2, X } from "lucide-react";
import MainNav from "../components/MainNav";

export default function ResetPasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, token } = location.state || {};
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("weak");
    
    // Kiểm tra nếu không có email hoặc token, chuyển về trang quên mật khẩu
    useEffect(() => {
        if (!email || !token) {
            navigate("/forgot-password");
        }
    }, [email, token, navigate]);
    
    const validation = Yup.object({
        password: Yup.string()
            .required("Mật khẩu là bắt buộc")
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .matches(/(?=.*[a-z])/, "Mật khẩu phải có ít nhất 1 chữ thường")
            .matches(/(?=.*[A-Z])/, "Mật khẩu phải có ít nhất 1 chữ hoa")
            .matches(/(?=.*\d)/, "Mật khẩu phải có ít nhất 1 số")
            .matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
        confirmPassword: Yup.string()
            .required("Vui lòng xác nhận mật khẩu")
            .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
    });
    
    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: validation,
        onSubmit: (values) => {
            if (passwordStrength === "weak") {
                setError("Vui lòng tạo mật khẩu mạnh hơn");
                return;
            }
            handleResetPassword(values);
        },
    });
    
    // Đánh giá độ mạnh của mật khẩu
    useEffect(() => {
        const password = formik.values.password;
        if (!password) {
            setPasswordStrength("weak");
            return;
        }
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        
        if (score <= 2) setPasswordStrength("weak");
        else if (score <= 4) setPasswordStrength("medium");
        else setPasswordStrength("strong");
    }, [formik.values.password]);
    
    const handleResetPassword = async (values) => {
        setIsLoading(true);
        setError("");
        
        try {
            const response = await fetch("http://localhost:8080/auth/reset-password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email,
                    password: values.password
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setError(data.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setError("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.");
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
    
    // Render progress bar dựa trên độ mạnh của mật khẩu
    const renderPasswordStrength = () => {
        let width = "0%";
        let color = "bg-gray-200";
        let text = "";
        
        if (passwordStrength === "weak") {
            width = "33%";
            color = "bg-red-500";
            text = "Yếu";
        } else if (passwordStrength === "medium") {
            width = "66%";
            color = "bg-yellow-500";
            text = "Trung bình";
        } else if (passwordStrength === "strong") {
            width = "100%";
            color = "bg-green-500";
            text = "Mạnh";
        }
        
        return (
            <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                    <span>Độ mạnh mật khẩu:</span>
                    <span className={`font-medium ${
                        passwordStrength === "weak" ? "text-red-500" : 
                        passwordStrength === "medium" ? "text-yellow-500" : "text-green-500"
                    }`}>{text}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${color} transition-all duration-300`} style={{ width }} />
                </div>
                
                {formik.values.password && (
                    <div className="mt-3 text-sm">
                        <p className="font-medium mb-1">Mật khẩu phải có:</p>
                        <ul className="space-y-1">
                            <li className={`flex items-center ${formik.values.password.length >= 8 ? "text-green-500" : "text-gray-500"}`}>
                                <CheckCircle2 className={`h-4 w-4 mr-2 ${formik.values.password.length >= 8 ? "text-green-500" : "text-gray-300"}`} />
                                Ít nhất 8 ký tự
                            </li>
                            <li className={`flex items-center ${/[a-z]/.test(formik.values.password) ? "text-green-500" : "text-gray-500"}`}>
                                <CheckCircle2 className={`h-4 w-4 mr-2 ${/[a-z]/.test(formik.values.password) ? "text-green-500" : "text-gray-300"}`} />
                                Ít nhất 1 chữ thường
                            </li>
                            <li className={`flex items-center ${/[A-Z]/.test(formik.values.password) ? "text-green-500" : "text-gray-500"}`}>
                                <CheckCircle2 className={`h-4 w-4 mr-2 ${/[A-Z]/.test(formik.values.password) ? "text-green-500" : "text-gray-300"}`} />
                                Ít nhất 1 chữ hoa
                            </li>
                            <li className={`flex items-center ${/\d/.test(formik.values.password) ? "text-green-500" : "text-gray-500"}`}>
                                <CheckCircle2 className={`h-4 w-4 mr-2 ${/\d/.test(formik.values.password) ? "text-green-500" : "text-gray-300"}`} />
                                Ít nhất 1 số
                            </li>
                            <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password) ? "text-green-500" : "text-gray-500"}`}>
                                <CheckCircle2 className={`h-4 w-4 mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password) ? "text-green-500" : "text-gray-300"}`} />
                                Ít nhất 1 ký tự đặc biệt
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        );
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
                    className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-xl relative"
                >
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors duration-200"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {success ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-700 mb-2">Mật khẩu đã được đặt lại!</h2>
                            <p className="text-gray-600 mb-6">
                                Mật khẩu của bạn đã được cập nhật thành công. Bạn sẽ được chuyển đến trang đăng nhập trong giây lát.
                            </p>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-green-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3 }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                    <LockKeyhole className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#1B1B1B] mb-2">Đặt lại mật khẩu</h2>
                                <p className="text-gray-600">
                                    Tạo mật khẩu mới cho tài khoản <span className="text-blue-700 font-semibold">{email}</span>
                                </p>
                            </div>
                            
                            {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            
                            <form onSubmit={formik.handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Nhập mật khẩu mới"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`h-11 px-4 bg-white/80 pr-10 transition-colors duration-200 ${
                                                formik.touched.password && formik.errors.password 
                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            }`}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                                    )}
                                    
                                    {renderPasswordStrength()}
                                </div>
                                
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Xác nhận mật khẩu mới"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`h-11 px-4 bg-white/80 pr-10 transition-colors duration-200 ${
                                                formik.touched.confirmPassword && formik.errors.confirmPassword 
                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            }`}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                                    )}
                                </div>
                                
                                <div className="pt-2">
                                    <Button 
                                        type="submit" 
                                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base transition-all duration-200 hover:shadow-lg hover:scale-[1.02]" 
                                        disabled={isLoading || passwordStrength === "weak"}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : "Đặt lại mật khẩu"}
                                    </Button>
                                </div>
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
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
} 