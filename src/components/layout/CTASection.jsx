import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";

function CTASection() {
  const isLoggedIn = localStorage.getItem("token") !== null;

  return (
    <section className="bg-blue-700 py-16 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Bảo Vệ Sức Khỏe Cho Bé Yêu</h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Đặt lịch tiêm chủng ngay hôm nay và cung cấp cho con bạn sự bảo vệ tốt nhất trước các bệnh nguy hiểm.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/Booking" className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md font-medium">
            <Calendar className="w-5 h-5 mr-2" />
            Đặt Lịch Ngay
          </Link>
          {!isLoggedIn && (
            <Link to="/Register" className="inline-flex items-center px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-md font-medium">
              <User className="w-5 h-5 mr-2" />
              Đăng Ký Tài Khoản
            </Link>
          )}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-20 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full opacity-20 -ml-32 -mb-32"></div>
    </section>
  );
}

export default CTASection; 