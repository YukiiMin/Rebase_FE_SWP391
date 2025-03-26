import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, MailCheck, X } from "lucide-react";
import MainNav from "../components/MainNav";

export default function VerifyOTPPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    
    // Tạo mảng refs cho 6 ô input OTP
    const inputRefs = useRef([...Array(6)].map(() => React.createRef()));
    
    // Kiểm tra nếu không có email từ state, chuyển về trang quên mật khẩu
    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);
    
    // Đếm ngược thời gian cho phép gửi lại OTP
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);
    
    // Xử lý khi người dùng nhập OTP
    const handleOtpChange = (index, e) => {
        const value = e.target.value;
        
        // Chỉ cho phép nhập số
        if (!/^\d*$/.test(value)) return;
        
        // Cập nhật giá trị OTP
        const newOtp = [...otp];
        newOtp[index] = value.substring(0, 1); // Chỉ lấy 1 ký tự
        setOtp(newOtp);
        
        // Nếu đã nhập và không phải ô cuối cùng, di chuyển focus đến ô tiếp theo
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };
    
    // Xử lý khi nhấn phím trong input OTP
    const handleKeyDown = (index, e) => {
        // Nếu nhấn Backspace khi ô trống, di chuyển focus đến ô trước đó
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };
    
    // Xử lý khi paste OTP
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").trim();
        
        // Kiểm tra nếu dữ liệu dán là 6 số
        if (/^\d{6}$/.test(pastedData)) {
            const otpArray = pastedData.split("");
            setOtp(otpArray);
            
            // Focus vào ô cuối cùng
            inputRefs.current[5].focus();
        }
    };
    
    // Xử lý gửi lại OTP
    const handleResendOtp = async () => {
        if (!canResend) return;
        
        setIsLoading(true);
        setError("");
        
        try {
            const response = await fetch("http://localhost:8080/auth/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Reset timer và trạng thái gửi lại
                setTimer(60);
                setCanResend(false);
            } else {
                setError(data.message || "Không thể gửi lại OTP. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            setError("Đã xảy ra lỗi khi gửi lại OTP. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Xử lý xác thực OTP
    const handleVerify = async () => {
        // Kiểm tra xem đã nhập đủ 6 số chưa
        if (otp.some(digit => !digit)) {
            setError("Vui lòng nhập đầy đủ mã OTP 6 số");
            return;
        }
        
        setIsLoading(true);
        setError("");
        
        try {
            const otpValue = otp.join("");
            
            const response = await fetch("http://localhost:8080/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    email,
                    otp: otpValue
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Chuyển đến trang đặt lại mật khẩu với token
                navigate("/reset-password", { 
                    state: { 
                        email, 
                        token: data.result?.token || data.token || "" 
                    } 
                });
            } else {
                setError(data.message || "Mã OTP không hợp lệ hoặc đã hết hạn.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setError("Đã xảy ra lỗi khi xác thực OTP. Vui lòng thử lại.");
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

                    <div className="mb-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                            <MailCheck className="h-8 w-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1B1B1B] mb-2">Xác nhận OTP</h2>
                        <p className="text-gray-600">
                            Chúng tôi đã gửi mã 6 số đến email <span className="text-blue-700 font-semibold">{email}</span>
                        </p>
                    </div>
                    
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="mb-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    ref={el => inputRefs.current[index] = el}
                                    onChange={(e) => handleOtpChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : null}
                                    className="w-12 h-14 text-center text-xl font-bold bg-white/80 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <Button 
                        type="submit" 
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base transition-all duration-200 hover:shadow-lg hover:scale-[1.02]" 
                        disabled={isLoading || otp.some(digit => !digit)}
                        onClick={handleVerify}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : "Xác nhận"}
                    </Button>
                    
                    <div className="text-center text-sm">
                        <p className="text-gray-600 mb-2">
                            Không nhận được mã? 
                            {canResend ? (
                                <button 
                                    onClick={handleResendOtp}
                                    className={`text-sm text-blue-600 hover:text-blue-700 transition-all duration-200 hover:underline ${
                                        timer > 0 ? "text-gray-400 cursor-not-allowed" : ""
                                    }`}
                                    disabled={isLoading || timer > 0}
                                >
                                    {timer > 0 ? `Gửi lại mã sau ${timer}s` : "Gửi lại mã"}
                                </button>
                            ) : (
                                <span className="ml-1 text-gray-500">
                                    Gửi lại sau {timer}s
                                </span>
                            )}
                        </p>
                        
                        <button 
                            onClick={() => navigate("/forgot-password")}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            disabled={isLoading}
                        >
                            Quay lại
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 