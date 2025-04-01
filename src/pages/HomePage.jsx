import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
	ChevronLeft, 
	ChevronRight, 
	Bell, 
	Calendar, 
	Clock,
	ArrowRight,
	Package
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TokenUtils from "../utils/TokenUtils";
import MainNav from "../components/layout/MainNav";
import Footer from "../components/layout/Footer";
import CTASection from "../components/layout/CTASection";

export default function HomePage() {
	const { t } = useTranslation();
	const [vaccineData, setVaccineData] = useState([]);
	const [comboData, setComboData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [activeTab, setActiveTab] = useState("vaccines");
	
	const apiURL = "http://localhost:8080/vaccine";

	useEffect(() => {
		// Check if user is logged in
		const token = TokenUtils.getToken();
		setIsLoggedIn(!!token);
		
		const fetchData = async () => {
			try {
				// Fetch vaccines
				const vaccineResponse = await fetch(`${apiURL}/get`);
				if (!vaccineResponse.ok) {
					throw new Error(`Vaccine API error: ${vaccineResponse.status}`);
				}
				
				// Kiểm tra và xử lý dữ liệu JSON an toàn hơn
				try {
					const vaccineText = await vaccineResponse.text();
					let vaccineResult = [];
					
					if (vaccineText && vaccineText.trim() !== '') {
						try {
							const parsedData = JSON.parse(vaccineText);
							if (Array.isArray(parsedData)) {
								vaccineResult = parsedData;
							} else {
								console.error("API didn't return an array for vaccines");
								throw new Error("Invalid vaccine data format");
							}
						} catch (parseError) {
							console.error("Error parsing vaccine JSON:", parseError);
							throw new Error("Failed to parse vaccine data");
						}
					}
					
					setVaccineData(vaccineResult.slice(0, 3)); // Get only first 3 items
				} catch (error) {
					console.error("Error processing vaccine data:", error);
					throw error; // Propagate error to the main catch block
				}

				// Fetch combos
				const comboResponse = await fetch(`${apiURL}/combo`);
				if (!comboResponse.ok) {
					throw new Error(`Combo API error: ${comboResponse.status}`);
				}
				
				// Kiểm tra và xử lý dữ liệu JSON an toàn hơn
				try {
					const comboText = await comboResponse.text();
					let comboResult = [];
					
					if (comboText && comboText.trim() !== '') {
						try {
							const parsedData = JSON.parse(comboText);
							if (Array.isArray(parsedData)) {
								comboResult = parsedData;
							} else {
								console.error("API didn't return an array for combos");
								throw new Error("Invalid combo data format");
							}
						} catch (parseError) {
							console.error("Error parsing combo JSON:", parseError);
							throw new Error("Failed to parse combo data");
						}
					}
					
					setComboData(comboResult.slice(0, 3)); // Get only first 3 items
				} catch (error) {
					console.error("Error processing combo data:", error);
					throw error; // Propagate error to the main catch block
				}

			} catch (error) {
				console.error("Error fetching data:", error);
				setError(error.message || "Failed to load data");
				
				// Always use demo data on any error
				setVaccineData([]);
				setComboData([]);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
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
			title: t('home.banner1.title'),
			description: t('home.banner1.description'),
			imageUrl: "https://vnvc.vn/wp-content/uploads/2023/11/Banner-Hexa-1920x700-1.jpg",
			cta: t('home.banner1.cta'),
			link: "/Booking"
		},
		{
			id: 2,
			title: t('home.banner2.title'),
			description: t('home.banner2.description'),
			imageUrl: "https://vnvc.vn/wp-content/uploads/2023/08/banner-web-VNVC-1920x700-2-1.webp",
			cta: t('home.banner2.cta'),
			link: "/VaccineList"
		},
		{
			id: 3,
			title: t('home.banner3.title'),
			description: t('home.banner3.description'),
			imageUrl: "https://vnvc.vn/wp-content/uploads/2018/06/banner-vnvc.jpg",
			cta: t('home.banner3.cta'),
			link: "/ComboList"
		}
	];

	// Demo data to use when API fails
	const demoVaccines = [
		{
			id: 1,
			name: "Vắc xin COVID-19",
			description: "Ngừa COVID-19 với hiệu quả bảo vệ cao",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2021/06/vac-xin-covid-astrazeneca-tai-vnvc-14.jpg",
			price: 850000
		},
		{
			id: 2,
			name: "Vắc xin Cúm mùa",
			description: "Bảo vệ hàng năm chống lại các chủng cúm theo mùa",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2018/06/banner-vnvc.jpg",
			price: 620000
		},
		{
			id: 3,
			name: "Vắc xin MMR",
			description: "Phòng ngừa Sởi, Quai bị và Rubella cho trẻ",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2021/05/MMR-VNVC.jpg",
			price: 580000
		}
	];

	const demoCombos = [
		{
			id: 1,
			name: "Gói vắc xin cho bé dưới 1 tuổi",
			description: "Tất cả vắc xin cần thiết cho năm đầu đời của bé",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2019/11/vacxin-tre-duoi-1-tuoi.jpg",
			price: 5500000
		},
		{
			id: 2,
			name: "Gói vắc xin cho trẻ 1-4 tuổi",
			description: "Vắc xin cần thiết cho trẻ từ 1-4 tuổi",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2019/11/vacxin-tre-1-5-tuoi.jpg",
			price: 4800000
		},
		{
			id: 3,
			name: "Gói vắc xin cho học sinh",
			description: "Vắc xin bắt buộc để chuẩn bị cho bé đi học",
			imageUrl: "https://vnvc.vn/wp-content/uploads/2019/11/vacxin-cho-tre-truoc-khi-di-hoc.jpg",
			price: 3200000
		}
	];

	// Use demo data if API fails
	const displayVaccines = error ? demoVaccines : (vaccineData.length > 0 ? vaccineData : demoVaccines);
	const displayCombos = error ? demoCombos : (comboData.length > 0 ? comboData : demoCombos);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
	};

	const services = [
		{
			id: 1,
			title: "Vaccination Booking",
			description: "Easy, quick and convenient vaccination scheduling",
			icon: <Calendar className="h-6 w-6 text-white" />,
			link: "/Booking",
			buttonText: "Book Now",
			color: "blue"
		},
		{
			id: 2,
			title: "Vaccine Packages",
			description: "Save costs with diverse disease prevention vaccine packages",
			icon: <Package className="h-6 w-6 text-white" />,
			link: "/ComboList",
			buttonText: "View Packages",
			color: "green"
		},
		{
			id: 3,
			title: "Vaccination Reminders",
			description: "Receive vaccination schedule notifications for you and your family",
			icon: <Bell className="h-6 w-6 text-white" />,
			link: "/Register",
			buttonText: "Register",
			color: "purple"
		},
		{
			id: 4,
			title: "Vaccination History",
			description: "Track children's vaccination history easily and conveniently",
			icon: <Clock className="h-6 w-6 text-white" />,
			link: "/User/History",
			buttonText: "View History",
			color: "orange"
		}
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<MainNav />
			
			{/* Banner/Hero Section */}
			<section className="relative w-full h-[500px] overflow-hidden">
				<div className="h-full w-full">
					{bannerSlides.map((slide, index) => (
						<div 
							key={slide.id}
							className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
							style={{ backgroundImage: `url(${slide.imageUrl || 'https://placehold.co/1200x600/0056B3/FFF?text=Vaccine+Care'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
						>
							<div className="absolute inset-0 bg-black bg-opacity-40"></div>
							<div className="relative z-20 h-full flex flex-col justify-center items-start max-w-7xl mx-auto px-6 sm:px-10">
								<h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{slide.title}</h2>
								<p className="text-lg sm:text-xl text-white mb-8 max-w-xl">{slide.description}</p>
								<Link to={slide.link} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors duration-300">
									{slide.cta}
								</Link>
							</div>
						</div>
					))}
				</div>
				
				<button className="absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm transition-colors duration-300" onClick={prevSlide}>
					<ChevronLeft className="h-6 w-6 text-white" />
				</button>
				<button className="absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm transition-colors duration-300" onClick={nextSlide}>
					<ChevronRight className="h-6 w-6 text-white" />
				</button>
				
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
					{bannerSlides.map((_, index) => (
						<button 
							key={index} 
							className={`h-2.5 w-2.5 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'} transition-colors duration-300`}
							onClick={() => setCurrentSlide(index)}
						/>
					))}
				</div>
			</section>

			{/* About Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-6 sm:px-10">
					<h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Safe Vaccination System</h2>
					
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
						<div className="space-y-6">
							<p className="text-lg text-gray-700">We provide high-quality vaccination services with professional medical staff and modern vaccine storage systems that meet Ministry of Health standards.</p>
							
							<div className="space-y-6">
								<div className="flex items-start space-x-4">
									<div className="bg-blue-100 p-3 rounded-full text-blue-600">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
											<path d="M17 7L7 17M7 7L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
									<div>
										<h3 className="text-xl font-semibold text-gray-900">Genuine Vaccines</h3>
										<p className="text-gray-600">100% imported genuine vaccines</p>
									</div>
								</div>
								
								<div className="flex items-start space-x-4">
									<div className="bg-green-100 p-3 rounded-full text-green-600">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
											<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
											<path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
									<div>
										<h3 className="text-xl font-semibold text-gray-900">International Standards</h3>
										<p className="text-gray-600">WHO vaccination protocol</p>
									</div>
								</div>
							</div>
						</div>
						
						<div className="relative rounded-xl overflow-hidden shadow-lg">
							<img src="/vaccination-center.jpg" alt="Vaccination center" className="w-full h-full object-cover aspect-video" />
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-6 sm:px-10">
					<h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{services.map((service) => (
							<div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
								<div className="flex justify-center pt-6">
									<div className={`w-16 h-16 rounded-full flex items-center justify-center ${
										service.color === 'blue' ? 'bg-blue-600' : 
										service.color === 'green' ? 'bg-green-600' : 
										service.color === 'purple' ? 'bg-purple-600' : 
										'bg-orange-600'
									}`}>
										{service.icon}
									</div>
								</div>
								
								<div className="p-6 text-center">
									<h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
									<p className="text-gray-600 mb-6">{service.description}</p>
									<Link 
										to={service.link} 
										className={`inline-flex items-center px-4 py-2 rounded text-sm font-medium ${
											service.color === 'blue' ? 'text-blue-600 hover:text-blue-800' : 
											service.color === 'green' ? 'text-green-600 hover:text-green-800' : 
											service.color === 'purple' ? 'text-purple-600 hover:text-purple-800' : 
											'text-orange-600 hover:text-orange-800'
										}`}
									>
										{service.buttonText}
										<ArrowRight className="h-4 w-4 ml-1" />
									</Link>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Vaccines & Combos */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-6 sm:px-10">
					<h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Featured Vaccines & Packages</h2>
					
					{error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">{error}</div>}
					
					<div className="flex justify-center mb-8">
						<div className="inline-flex bg-gray-100 rounded-lg p-1">
							<button 
								className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'vaccines' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
								onClick={() => setActiveTab('vaccines')}
							>
								Single Vaccines
							</button>
							<button 
								className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'combos' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
								onClick={() => setActiveTab('combos')}
							>
								Vaccine Packages
							</button>
						</div>
					</div>
					
					<div>
						{loading ? (
							<div className="flex flex-col items-center justify-center py-12">
								<div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
								<p className="text-gray-600">Loading {activeTab === 'vaccines' ? 'vaccine' : 'package'} data...</p>
							</div>
						) : (
							<>
								{activeTab === 'vaccines' && (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
										{displayVaccines.map((vaccine) => (
											<div key={vaccine.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
												<div className="relative h-48 overflow-hidden">
													<img 
														src={vaccine.imageUrl || 'https://placehold.co/400x300/0056B3/FFF?text=Vaccine'} 
														alt={vaccine.name} 
														className="w-full h-full object-cover" 
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
												</div>
												
												<div className="p-6">
													<h3 className="text-xl font-semibold text-gray-900 mb-2">{vaccine.name}</h3>
													<p className="text-gray-600 mb-4">{vaccine.description}</p>
													
													<div className="flex items-center justify-between">
														<span className="text-lg font-bold text-blue-600">
															{new Intl.NumberFormat('vi-VN').format(vaccine.price)} VNĐ
														</span>
														<Link to={`/Vaccine/${vaccine.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
															View Details
															<ArrowRight className="h-4 w-4 ml-1" />
														</Link>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
								
								{activeTab === 'combos' && (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
										{displayCombos.map((combo) => (
											<div key={combo.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
												<div className="relative h-48 overflow-hidden">
													<img 
														src={combo.imageUrl || 'https://placehold.co/400x300/00A86B/FFF?text=Combo'} 
														alt={combo.name} 
														className="w-full h-full object-cover" 
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
												</div>
												
												<div className="p-6">
													<h3 className="text-xl font-semibold text-gray-900 mb-2">{combo.name}</h3>
													<p className="text-gray-600 mb-4">{combo.description}</p>
													
													<div className="flex items-center justify-between">
														<span className="text-lg font-bold text-green-600">
															{new Intl.NumberFormat('vi-VN').format(combo.price)} VNĐ
														</span>
														<Link to={`/Combo/${combo.id}`} className="inline-flex items-center text-green-600 hover:text-green-800 font-medium">
															View Package
															<ArrowRight className="h-4 w-4 ml-1" />
														</Link>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
								
								<div className="flex justify-center mt-10">
									<Link 
										to={activeTab === 'vaccines' ? '/VaccineList' : '/ComboList'} 
										className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-300"
									>
										View All {activeTab === 'vaccines' ? 'Vaccines' : 'Packages'}
										<ArrowRight className="h-4 w-4 ml-2" />
									</Link>
								</div>
							</>
						)}
					</div>
				</div>
			</section>
			
			{/* CTA Section */}
			<CTASection />
			
			<Footer />
		</div>
	);
}
