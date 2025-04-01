import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Shield, 
  Clock, 
  ExternalLink,
  Youtube
} from "lucide-react";

function Footer() {
	const { t } = useTranslation();
	
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-blue-900 text-white pt-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10">
					<div className="md:col-span-1">
						<div className="flex items-center mb-6">
							<div className="bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center mr-4">
								<Shield className="w-6 h-6 text-white" />
							</div>
							<div>
								<h3 className="text-xl font-bold text-white">VaccineCare</h3>
								<p className="text-xs text-white/70 uppercase tracking-wider font-medium">HỆ THỐNG TIÊM CHỦNG TOÀN QUỐC</p>
							</div>
						</div>
						<p className="text-white/70 text-sm leading-relaxed mb-6">
							Hệ thống tiêm chủng vắc xin chất lượng hàng đầu Việt Nam, cam kết mang đến dịch vụ tiêm chủng an toàn và chuyên nghiệp cho mọi lứa tuổi.
						</p>
						<div className="flex space-x-4">
							<a href="#" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 hover:-translate-y-1 transition-all">
								<Facebook className="w-5 h-5 text-white" />
							</a>
							<a href="#" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 hover:-translate-y-1 transition-all">
								<Twitter className="w-5 h-5 text-white" />
							</a>
							<a href="#" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 hover:-translate-y-1 transition-all">
								<Instagram className="w-5 h-5 text-white" />
							</a>
							<a href="#" className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 hover:-translate-y-1 transition-all">
								<Youtube className="w-5 h-5 text-white" />
							</a>
						</div>
					</div>
					
					<div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
						<div>
							<h4 className="text-base font-bold text-white mb-5 pb-2 border-b border-blue-700 relative">
								Liên Kết Nhanh
							</h4>
							<ul className="space-y-3">
								<li><Link to="/" className="text-white/70 hover:text-white text-sm">Trang chủ</Link></li>
								<li><Link to="/AboutUs" className="text-white/70 hover:text-white text-sm">Về chúng tôi</Link></li>
								<li><Link to="/VaccineList" className="text-white/70 hover:text-white text-sm">Vắc xin</Link></li>
								<li><Link to="/ComboList" className="text-white/70 hover:text-white text-sm">Gói combo</Link></li>
							</ul>
						</div>
						
						<div>
							<h4 className="text-base font-bold text-white mb-5 pb-2 border-b border-blue-700 relative">
								Dịch Vụ
							</h4>
							<ul className="space-y-3">
								<li><Link to="/Booking" className="text-white/70 hover:text-white text-sm">Đặt lịch tiêm</Link></li>
								<li><Link to="/PriceList" className="text-white/70 hover:text-white text-sm">Bảng giá</Link></li>
								<li><Link to="/User/Children" className="text-white/70 hover:text-white text-sm">Quản lý trẻ em</Link></li>
								<li><Link to="/User/History" className="text-white/70 hover:text-white text-sm">Lịch sử tiêm chủng</Link></li>
							</ul>
						</div>
						
						<div>
							<h4 className="text-base font-bold text-white mb-5 pb-2 border-b border-blue-700 relative">
								Liên Hệ
							</h4>
							<div className="space-y-4">
								<div className="flex items-start">
									<Phone className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
									<span className="text-white/70 text-sm">0903 731 347</span>
								</div>
								<div className="flex items-start">
									<Mail className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
									<span className="text-white/70 text-sm">contact@vaccinecare.vn</span>
								</div>
								<div className="flex items-start">
									<MapPin className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
									<span className="text-white/70 text-sm">600 Nguyễn Văn Cừ, Quận 5, TP. HCM</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div className="border-t border-blue-800 py-6 text-center">
					<p className="text-white/60 text-sm">© {currentYear} VaccineCare. Tất cả quyền được bảo lưu.</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
