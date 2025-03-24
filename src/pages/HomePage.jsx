import React, { useEffect, useState } from "react";
import MainNav from "../components/MainNav";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
	ChevronLeft, 
	ChevronRight, 
	ClipboardList, 
	Shield, 
	Bell, 
	Loader2, 
	Syringe, 
	BadgeCheck, 
	Calendar, 
	Clock
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
	const { t } = useTranslation();
	const [vaccineData, setVaccineData] = useState([]);
	const [comboData, setComboData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch vaccines
				const vaccineResponse = await fetch("http://localhost:8080/vaccines");
				if (!vaccineResponse.ok) {
					throw new Error(`Vaccine API error: ${vaccineResponse.status}`);
				}
				const vaccineResult = await vaccineResponse.json();
				setVaccineData(vaccineResult.slice(0, 3)); // Get only first 3 items

				// Fetch combos
				const comboResponse = await fetch("http://localhost:8080/combos");
				if (!comboResponse.ok) {
					throw new Error(`Combo API error: ${comboResponse.status}`);
				}
				const comboResult = await comboResponse.json();
				setComboData(comboResult.slice(0, 3)); // Get only first 3 items
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("Failed to load data. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		// Set a timeout to simulate loading and then fetch data
		const timeoutId = setTimeout(() => {
			fetchData();
		}, 500);

		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		// Auto-rotate slides every 5 seconds
		const intervalId = setInterval(() => {
			setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	// Banner slide data
	const bannerSlides = [
		{
			id: 1,
			title: "Tiêm chủng an toàn cho trẻ em",
			description: "Bảo vệ sức khỏe trẻ em từ những ngày đầu đời",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2023/11/Banner-Hexa-1920x700-1.jpg",
			cta: "Đặt lịch tiêm ngay",
			link: "/Booking"
		},
		{
			id: 2,
			title: "Phòng ngừa bệnh sốt xuất huyết",
			description: "Tiêm vắc xin Qdenga ngừa sốt xuất huyết hiệu quả đến 80%",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2023/08/banner-web-VNVC-1920x700-2-1.webp",
			cta: "Tìm hiểu thêm",
			link: "/VaccineList"
		},
		{
			id: 3,
			title: "Gói vắc xin tiết kiệm",
			description: "Tiết kiệm đến 25% với các gói vắc xin combo",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2018/06/banner-vnvc.jpg",
			cta: "Xem gói vắc xin",
			link: "/ComboList"
		}
	];

	// Demo data to use when API fails
	const demoVaccines = [
		{
			id: 1,
			name: "Vắc xin COVID-19",
			description: "Ngừa COVID-19 với hiệu quả bảo vệ cao",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2021/06/vac-xin-covid-astrazeneca-tai-vnvc-14.jpg"
		},
		{
			id: 2,
			name: "Vắc xin Cúm mùa",
			description: "Bảo vệ hàng năm chống lại các chủng cúm theo mùa",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2018/06/banner-vnvc.jpg"
		},
		{
			id: 3,
			name: "Vắc xin MMR",
			description: "Phòng ngừa Sởi, Quai bị và Rubella cho trẻ",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2021/05/MMR-VNVC.jpg"
		}
	];

	const demoCombos = [
		{
			id: 1,
			name: "Gói vắc xin cho bé dưới 1 tuổi",
			description: "Tất cả vắc xin cần thiết cho năm đầu đời của bé",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2019/11/vacxin-tre-duoi-1-tuoi.jpg"
		},
		{
			id: 2,
			name: "Gói vắc xin cho trẻ 1-4 tuổi",
			description: "Vắc xin cần thiết cho trẻ từ 1-4 tuổi",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2019/11/vacxin-tre-1-5-tuoi.jpg"
		},
		{
			id: 3,
			name: "Gói vắc xin cho học sinh",
			description: "Vắc xin bắt buộc để chuẩn bị cho bé đi học",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2019/11/vacxin-cho-tre-truoc-khi-di-hoc.jpg"
		}
	];

	// Use demo data if API fails
	const displayVaccines = error ? demoVaccines : vaccineData;
	const displayCombos = error ? demoCombos : comboData;

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<MainNav />
			
			{/* Hero Carousel/Banner */}
			<section className="relative w-full bg-blue-700 h-80 md:h-96 overflow-hidden">
				<div className="absolute inset-0">
					{bannerSlides.map((slide, index) => (
						<div 
							key={slide.id}
							className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
						>
							<div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
							<img 
								src={slide.imageUrl} 
								alt={slide.title} 
								className="w-full h-full object-cover"
							/>
							<div className="absolute bottom-0 left-0 right-0 top-0 flex items-center z-20">
								<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
									<div className="max-w-xl text-white">
										<h1 className="text-2xl md:text-4xl font-bold mb-2">{slide.title}</h1>
										<p className="text-sm md:text-base text-gray-100 mb-4">{slide.description}</p>
										<Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600">
											<Link to={slide.link}>{slide.cta}</Link>
										</Button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Carousel controls */}
				<button 
					onClick={prevSlide}
					className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full text-white z-30 hover:bg-opacity-30"
				>
					<ChevronLeft className="h-6 w-6" />
				</button>
				<button 
					onClick={nextSlide}
					className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full text-white z-30 hover:bg-opacity-30"
				>
					<ChevronRight className="h-6 w-6" />
				</button>

				{/* Carousel indicators */}
				<div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
					{bannerSlides.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`h-2 rounded-full transition-all ${
								index === currentSlide ? 'w-6 bg-orange-500' : 'w-2 bg-white bg-opacity-50'
							}`}
						/>
					))}
				</div>
			</section>

			{/* About Us Banner */}
			<section className="w-full py-8 bg-blue-50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="md:w-1/2">
							<h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-3">
								Hệ Thống Tiêm Chủng An Toàn
							</h2>
							<p className="text-sm text-gray-700 mb-4">
								Chúng tôi cung cấp dịch vụ tiêm chủng chất lượng cao với đội ngũ y bác sĩ chuyên nghiệp và 
								hệ thống bảo quản vắc xin hiện đại đạt chuẩn của Bộ Y tế.
							</p>
							<div className="flex flex-wrap gap-4">
								<div className="flex items-start">
									<div className="bg-blue-100 p-2 rounded-lg mr-3">
										<Syringe className="h-5 w-5 text-blue-700" />
									</div>
									<div>
										<h3 className="text-sm font-semibold text-gray-900">Vắc xin chính hãng</h3>
										<p className="text-xs text-gray-600">100% vắc xin nhập khẩu chính hãng</p>
									</div>
								</div>
								<div className="flex items-start">
									<div className="bg-green-100 p-2 rounded-lg mr-3">
										<BadgeCheck className="h-5 w-5 text-green-700" />
									</div>
									<div>
										<h3 className="text-sm font-semibold text-gray-900">Đạt chuẩn quốc tế</h3>
										<p className="text-xs text-gray-600">Quy trình tiêm chủng WHO</p>
									</div>
								</div>
							</div>
						</div>
						<div className="md:w-1/2 flex justify-end">
							<img 
								src="https://vnvc.vn/wp-content/uploads/2020/10/VNVC_co-so-tiem-chung.jpg" 
								alt="Trung tâm tiêm chủng" 
								className="rounded-lg w-full max-w-md h-52 object-cover shadow-md"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="w-full py-8 bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<h2 className="text-xl font-bold text-center mb-8 text-blue-900">Dịch Vụ Của Chúng Tôi</h2>
					
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100 text-center">
							<div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
								<Calendar className="h-6 w-6 text-blue-600" />
							</div>
							<h3 className="text-base font-semibold mb-2 text-blue-900">Đặt Lịch Tiêm Chủng</h3>
							<p className="text-gray-600 text-sm mb-3">
								Đặt lịch tiêm chủng dễ dàng, nhanh chóng và thuận tiện
							</p>
							<Button asChild variant="outline" size="sm" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
								<Link to="/Booking">Đặt lịch ngay</Link>
							</Button>
						</div>
						
						<div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100 text-center">
							<div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
								<Shield className="h-6 w-6 text-green-600" />
							</div>
							<h3 className="text-base font-semibold mb-2 text-green-900">Gói Vắc Xin</h3>
							<p className="text-gray-600 text-sm mb-3">
								Tiết kiệm chi phí với các gói vắc xin phòng ngừa bệnh đa dạng
							</p>
							<Button asChild variant="outline" size="sm" className="w-full border-green-300 text-green-600 hover:bg-green-50">
								<Link to="/ComboList">Xem gói vắc xin</Link>
							</Button>
						</div>
						
						<div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 text-center">
							<div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
								<Bell className="h-6 w-6 text-purple-600" />
							</div>
							<h3 className="text-base font-semibold mb-2 text-purple-900">Nhắc Lịch Tiêm</h3>
							<p className="text-gray-600 text-sm mb-3">
								Nhận thông báo nhắc lịch tiêm chủng cho bạn và gia đình
							</p>
							<Button asChild variant="outline" size="sm" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
								<Link to="/Register">Đăng ký nhận</Link>
							</Button>
						</div>
						
						<div className="bg-amber-50 p-6 rounded-lg shadow-sm border border-amber-100 text-center">
							<div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
								<Clock className="h-6 w-6 text-amber-600" />
							</div>
							<h3 className="text-base font-semibold mb-2 text-amber-900">Lịch Sử Tiêm Chủng</h3>
							<p className="text-gray-600 text-sm mb-3">
								Theo dõi lịch sử tiêm chủng của trẻ dễ dàng và thuận tiện
							</p>
							<Button asChild variant="outline" size="sm" className="w-full border-amber-300 text-amber-600 hover:bg-amber-50">
								<Link to="/Login">Xem lịch sử</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Vaccines & Combos */}
			<section className="w-full py-10 bg-gray-50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<h2 className="text-xl font-bold text-center mb-8 text-blue-900">Vắc Xin & Gói Tiêm Nổi Bật</h2>
					
					{error && (
						<Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
							<AlertDescription>
								{error} Hiển thị dữ liệu demo cho mục đích trình bày.
							</AlertDescription>
						</Alert>
					)}
					
					<Tabs defaultValue="vaccines" className="w-full">
						<TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
							<TabsTrigger value="vaccines" className="text-base">Vắc Xin Đơn Lẻ</TabsTrigger>
							<TabsTrigger value="combos" className="text-base">Gói Vắc Xin</TabsTrigger>
						</TabsList>
						
						<TabsContent value="vaccines">
							{loading ? (
								<div className="text-center py-6">
									<Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
									<p className="text-sm text-gray-500">Đang tải dữ liệu vắc xin...</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{displayVaccines.map((vaccine) => (
										<Card key={vaccine.id} className="overflow-hidden hover:shadow-md transition-shadow">
											<div className="bg-gray-200 h-44 flex items-center justify-center">
												<img 
													src={vaccine.imageUrl || "https://placehold.co/300x150/e2e8f0/1e293b?text=Vaccine"}
													alt={vaccine.name} 
													className="w-full h-44 object-cover"
												/>
											</div>
											<CardContent className="p-4">
												<h3 className="text-lg font-semibold mb-2 text-blue-900">{vaccine.name}</h3>
												<p className="text-gray-600 text-sm mb-4 line-clamp-2">{vaccine.description}</p>
												<Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
													<Link to={`/VaccineDetail/${vaccine.id}`}>Xem Chi Tiết</Link>
												</Button>
											</CardContent>
										</Card>
									))}
								</div>
							)}
							<div className="text-center mt-6">
								<Button asChild variant="outline" size="sm" className="px-6 border-blue-300 text-blue-700">
									<Link to="/VaccineList">Xem Tất Cả Vắc Xin</Link>
								</Button>
							</div>
						</TabsContent>
						
						<TabsContent value="combos">
							{loading ? (
								<div className="text-center py-6">
									<Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
									<p className="text-sm text-gray-500">Đang tải dữ liệu gói vắc xin...</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{displayCombos.map((combo) => (
										<Card key={combo.id} className="overflow-hidden hover:shadow-md transition-shadow">
											<div className="bg-gray-200 h-44 flex items-center justify-center">
												<img 
													src={combo.imageUrl || "https://placehold.co/300x150/e2e8f0/1e293b?text=Combo"}
													alt={combo.name} 
													className="w-full h-44 object-cover"
												/>
											</div>
											<CardContent className="p-4">
												<h3 className="text-lg font-semibold mb-2 text-blue-900">{combo.name}</h3>
												<p className="text-gray-600 text-sm mb-4 line-clamp-2">{combo.description}</p>
												<Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
													<Link to={`/ComboDetail/${combo.id}`}>Xem Chi Tiết</Link>
												</Button>
											</CardContent>
										</Card>
									))}
								</div>
							)}
							<div className="text-center mt-6">
								<Button asChild variant="outline" size="sm" className="px-6 border-green-300 text-green-700">
									<Link to="/ComboList">Xem Tất Cả Gói Vắc Xin</Link>
								</Button>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>
			
			{/* CTA Section */}
			<section className="w-full py-10 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
					<h2 className="text-2xl font-bold mb-3">Bảo Vệ Sức Khỏe Cho Bé Yêu</h2>
					<p className="text-base mb-6 max-w-2xl mx-auto">
						Đặt lịch tiêm chủng ngay hôm nay và cung cấp cho con bạn sự bảo vệ tốt nhất trước các bệnh nguy hiểm.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 font-medium">
							<Link to="/Booking">Đặt Lịch Ngay</Link>
						</Button>
						<Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 font-medium">
							<Link to="/Register">Đăng Ký Tài Khoản</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Footer information */}
			<footer className="w-full py-6 bg-gray-800 text-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<div className="flex flex-col md:flex-row justify-between">
						<div className="mb-6 md:mb-0">
							<h3 className="text-lg font-bold mb-3">VaccineCare</h3>
							<p className="text-sm text-gray-300 max-w-md">
								Hệ thống tiêm chủng vắc xin chất lượng hàng đầu Việt Nam, cam kết mang đến dịch vụ tiêm chủng an toàn và chuyên nghiệp.
							</p>
						</div>
						<div>
							<h4 className="text-base font-semibold mb-2">Liên Hệ</h4>
							<p className="text-sm text-gray-300">Hotline: 0903 731 347</p>
							<p className="text-sm text-gray-300">Email: contact@vaccinecare.vn</p>
						</div>
					</div>
					<div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
						© 2023 VaccineCare. Tất cả quyền được bảo lưu.
					</div>
				</div>
			</footer>
		</div>
	);
}
