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
	Clock,
	AlertCircle,
	User,
	Phone,
	Mail,
	MapPin,
	AlertTriangle
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
	const { t } = useTranslation();
	const [vaccineData, setVaccineData] = useState([]);
	const [comboData, setComboData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	
	const apiURL = "http://localhost:8080/vaccine";

	useEffect(() => {
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
							}
						} catch (parseError) {
							console.error("Error parsing vaccine JSON:", parseError);
						}
					}
					
					setVaccineData(vaccineResult.slice(0, 3)); // Get only first 3 items
				} catch (error) {
					console.error("Error processing vaccine data:", error);
					setVaccineData([]);
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
							}
						} catch (parseError) {
							console.error("Error parsing combo JSON:", parseError);
						}
					}
					
					setComboData(comboResult.slice(0, 3)); // Get only first 3 items
				} catch (error) {
					console.error("Error processing combo data:", error);
					setComboData([]);
				}

			} catch (error) {
				console.error("Error fetching data:", error);
				setError(error.message);
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
			<section className="relative w-full h-96 md:h-[500px] overflow-hidden">
				<div className="absolute inset-0">
					{bannerSlides.map((slide, index) => (
						<div 
							key={slide.id}
							className={`absolute inset-0 transition-all duration-1000 transform ${
								index === currentSlide 
									? 'opacity-100 scale-100' 
									: 'opacity-0 scale-105 pointer-events-none'
							}`}
						>
							{/* Gradient overlay to ensure text is readable */}
							<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
							<img 
								src={slide.imageUrl} 
								alt={slide.title} 
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 flex items-center z-20">
								<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
									<div className="max-w-xl text-white backdrop-blur-sm bg-black/10 p-6 rounded-lg border border-white/10 shadow-xl">
										<h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{slide.title}</h1>
										<p className="text-base md:text-lg text-gray-100 mb-6">{slide.description}</p>
										<Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 shadow-lg transform transition-transform hover:scale-105">
											<Link to={slide.link} className="flex items-center">
												{slide.cta}
												<ChevronRight className="ml-2 h-5 w-5" />
											</Link>
										</Button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Enhanced carousel controls */}
				<button 
					onClick={prevSlide}
					className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white z-30 transition-all duration-200 backdrop-blur-sm shadow-lg"
				>
					<ChevronLeft className="h-6 w-6" />
				</button>
				<button 
					onClick={nextSlide}
					className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white z-30 transition-all duration-200 backdrop-blur-sm shadow-lg"
				>
					<ChevronRight className="h-6 w-6" />
				</button>

				{/* Enhanced carousel indicators */}
				<div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-30">
					{bannerSlides.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`h-2.5 rounded-full transition-all shadow-md ${
								index === currentSlide 
									? 'w-10 bg-orange-500' 
									: 'w-2.5 bg-white/60 hover:bg-white/80'
							}`}
							aria-label={`Go to slide ${index + 1}`}
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
								{t('home.about.title')}
							</h2>
							<p className="text-sm text-gray-700 mb-4">
								{t('home.about.description')}
							</p>
							<div className="flex flex-wrap gap-4">
								<div className="flex items-start">
									<div className="bg-blue-100 p-2 rounded-lg mr-3">
										<Syringe className="h-5 w-5 text-blue-700" />
									</div>
									<div>
										<h3 className="text-sm font-semibold text-gray-900">{t('home.about.feature1.title')}</h3>
										<p className="text-xs text-gray-600">{t('home.about.feature1.description')}</p>
									</div>
								</div>
								<div className="flex items-start">
									<div className="bg-green-100 p-2 rounded-lg mr-3">
										<BadgeCheck className="h-5 w-5 text-green-700" />
									</div>
									<div>
										<h3 className="text-sm font-semibold text-gray-900">{t('home.about.feature2.title')}</h3>
										<p className="text-xs text-gray-600">{t('home.about.feature2.description')}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="md:w-1/2 flex justify-end">
							<img 
								src="https://vnvc.vn/wp-content/uploads/2020/10/VNVC_co-so-tiem-chung.jpg" 
								alt={t('home.about.image_alt')} 
								className="rounded-lg w-full max-w-md h-52 object-cover shadow-md"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="w-full py-16 bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<div className="text-center mb-12">
						<h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900">{t('home.services.title')}</h2>
						<div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-sm border border-blue-100 text-center group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
							<div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:bg-blue-600 transition-colors">
								<Calendar className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold mb-3 text-blue-900 group-hover:text-blue-700">{t('home.services.booking.title')}</h3>
							<p className="text-gray-600 text-sm mb-5 group-hover:text-gray-700">
								{t('home.services.booking.description')}
							</p>
							<Button asChild size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
								<Link to="/Booking" className="flex justify-center items-center">
									{t('home.services.booking.button')}
									<ChevronRight className="ml-1 h-4 w-4" />
								</Link>
							</Button>
						</div>
						
						<div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-sm border border-green-100 text-center group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
							<div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:bg-green-600 transition-colors">
								<Shield className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold mb-3 text-green-900 group-hover:text-green-700">{t('home.services.combos.title')}</h3>
							<p className="text-gray-600 text-sm mb-5 group-hover:text-gray-700">
								{t('home.services.combos.description')}
							</p>
							<Button asChild size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white">
								<Link to="/ComboList" className="flex justify-center items-center">
									{t('home.services.combos.button')}
									<ChevronRight className="ml-1 h-4 w-4" />
								</Link>
							</Button>
						</div>
						
						<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-sm border border-purple-100 text-center group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
							<div className="mx-auto w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:bg-purple-600 transition-colors">
								<Bell className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold mb-3 text-purple-900 group-hover:text-purple-700">{t('home.services.reminders.title')}</h3>
							<p className="text-gray-600 text-sm mb-5 group-hover:text-gray-700">
								{t('home.services.reminders.description')}
							</p>
							<Button asChild size="sm" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
								<Link to="/Register" className="flex justify-center items-center">
									{t('home.services.reminders.button')}
									<ChevronRight className="ml-1 h-4 w-4" />
								</Link>
							</Button>
						</div>
						
						<div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-xl shadow-sm border border-amber-100 text-center group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
							<div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:bg-amber-600 transition-colors">
								<Clock className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-lg font-semibold mb-3 text-amber-900 group-hover:text-amber-700">{t('home.services.history.title')}</h3>
							<p className="text-gray-600 text-sm mb-5 group-hover:text-gray-700">
								{t('home.services.history.description')}
							</p>
							<Button asChild size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
								<Link to="/Login" className="flex justify-center items-center">
									{t('home.services.history.button')}
									<ChevronRight className="ml-1 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Vaccines & Combos */}
			<section className="w-full py-16 bg-gray-50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<div className="text-center mb-12">
						<h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900">{t('home.featured.title')}</h2>
						<div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
					</div>
					
					{error && (
						<Alert className="mb-8 bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-2 max-w-2xl mx-auto">
							<div className="p-1 rounded-full bg-amber-200">
								<AlertTriangle className="h-4 w-4 text-amber-600" />
							</div>
							<AlertDescription>
								{error} {t('home.featured.error_message')}
							</AlertDescription>
						</Alert>
					)}
					
					<Tabs defaultValue="vaccines" className="w-full">
						<TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
							<TabsTrigger value="vaccines" className="text-base rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white">{t('home.featured.single_vaccines')}</TabsTrigger>
							<TabsTrigger value="combos" className="text-base rounded-md data-[state=active]:bg-green-600 data-[state=active]:text-white">{t('home.featured.combo_packages')}</TabsTrigger>
						</TabsList>
						
						<TabsContent value="vaccines">
							{loading ? (
								<div className="text-center py-12 bg-white rounded-xl shadow-sm">
									<Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
									<p className="text-gray-500">{t('home.featured.loading_vaccines')}</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
									{displayVaccines.map((vaccine) => (
										<Card key={vaccine.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-blue-100">
											<div className="relative h-52 overflow-hidden">
												<div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
												<img 
													src={vaccine.imageUrl || "https://placehold.co/300x150/e2e8f0/1e293b?text=Vaccine"}
													alt={vaccine.name} 
													className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
												/>
											</div>
											<CardContent className="p-6">
												<div className="flex justify-between items-start mb-3">
													<h3 className="text-xl font-semibold text-blue-900 group-hover:text-blue-700 transition-colors">{vaccine.name}</h3>
													<div className="bg-blue-100 p-1.5 rounded-full">
														<Shield className="h-5 w-5 text-blue-600" />
													</div>
												</div>
												<p className="text-gray-600 text-sm mb-6 line-clamp-2">{vaccine.description}</p>
												<div className="pt-2 border-t border-blue-100">
													<Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700 shadow group-hover:shadow-md transition-all">
														<Link to={`/VaccineDetail/${vaccine.id}`} className="flex justify-center items-center">
															{t('home.featured.view_details')}
															<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
														</Link>
													</Button>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</TabsContent>
						
						<TabsContent value="combos">
							{loading ? (
								<div className="text-center py-12 bg-white rounded-xl shadow-sm">
									<Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-green-600" />
									<p className="text-gray-500">{t('home.featured.loading_combos')}</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
									{displayCombos.map((combo) => (
										<Card key={combo.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-green-100">
											<div className="relative h-52 overflow-hidden">
												<div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
												<img 
													src={combo.imageUrl || "https://placehold.co/300x150/e2e8f0/1e293b?text=Combo"}
													alt={combo.name} 
													className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
												/>
											</div>
											<CardContent className="p-6">
												<div className="flex justify-between items-start mb-3">
													<h3 className="text-xl font-semibold text-green-900 group-hover:text-green-700 transition-colors line-clamp-2">{combo.name}</h3>
													<div className="bg-green-100 p-1.5 rounded-full">
														<ClipboardList className="h-5 w-5 text-green-600" />
													</div>
												</div>
												<p className="text-gray-600 text-sm mb-6 line-clamp-2">{combo.description}</p>
												<div className="pt-2 border-t border-green-100">
													<Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700 shadow group-hover:shadow-md transition-all">
														<Link to={`/ComboDetail/${combo.id}`} className="flex justify-center items-center">
															{t('home.featured.view_package')}
															<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
														</Link>
													</Button>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</TabsContent>
					</Tabs>
					
					<div className="text-center mt-16">
						<Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
							<Link to="/VaccineList" className="flex items-center">
								{t('home.featured.view_all_vaccines')}
								<ChevronRight className="ml-1 h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</section>
			
			{/* CTA Section */}
			<section className="w-full py-16 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white relative overflow-hidden">
				{/* Background decorative elements */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
					<div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white"></div>
					<div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-white"></div>
					<div className="absolute bottom-10 left-1/4 w-56 h-56 rounded-full bg-white"></div>
				</div>
				
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center relative z-10">
					<div className="max-w-3xl mx-auto">
						<h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Bảo Vệ Sức Khỏe Cho Bé Yêu</h2>
						<div className="w-20 h-1 bg-orange-500 mx-auto rounded-full mb-6"></div>
						<p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
							Đặt lịch tiêm chủng ngay hôm nay và cung cấp cho con bạn sự bảo vệ tốt nhất trước các bệnh nguy hiểm.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
								<Link to="/Booking" className="flex items-center px-8">
									<Calendar className="mr-2 h-5 w-5" />
									Đặt Lịch Ngay
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
								<Link to="/Register" className="flex items-center px-8">
									<User className="mr-2 h-5 w-5" />
									Đăng Ký Tài Khoản
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer information */}
			<footer className="w-full py-12 bg-gray-900 text-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<div className="flex flex-col md:flex-row justify-between gap-10">
						<div className="md:w-2/5">
							<div className="flex items-center mb-6">
								<div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
									<Shield className="h-6 w-6 text-white" />
								</div>
								<div>
									<h3 className="text-xl font-bold text-white">VaccineCare</h3>
									<p className="text-xs text-gray-400">HỆ THỐNG TIÊM CHỦNG TOÀN QUỐC</p>
								</div>
							</div>
							<p className="text-gray-300 text-sm max-w-md mb-6">
								Hệ thống tiêm chủng vắc xin chất lượng hàng đầu Việt Nam, cam kết mang đến dịch vụ tiêm chủng an toàn và chuyên nghiệp cho mọi lứa tuổi.
							</p>
							<div className="flex space-x-4">
								<a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors">
									<svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
									</svg>
								</a>
								<a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition-colors">
									<svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</a>
								<a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors">
									<svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
									</svg>
								</a>
							</div>
						</div>
						
						<div className="grid grid-cols-2 md:grid-cols-3 gap-8">
							<div>
								<h4 className="text-base font-semibold mb-4 text-white">Liên Kết Nhanh</h4>
								<ul className="space-y-2 text-sm">
									<li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Trang chủ</Link></li>
									<li><Link to="/AboutUs" className="text-gray-300 hover:text-white transition-colors">Về chúng tôi</Link></li>
									<li><Link to="/VaccineList" className="text-gray-300 hover:text-white transition-colors">Vắc xin</Link></li>
									<li><Link to="/ComboList" className="text-gray-300 hover:text-white transition-colors">Gói combo</Link></li>
								</ul>
							</div>
							
							<div>
								<h4 className="text-base font-semibold mb-4 text-white">Dịch Vụ</h4>
								<ul className="space-y-2 text-sm">
									<li><Link to="/Booking" className="text-gray-300 hover:text-white transition-colors">Đặt lịch tiêm</Link></li>
									<li><Link to="/PriceList" className="text-gray-300 hover:text-white transition-colors">Bảng giá</Link></li>
									<li><Link to="/User/Children" className="text-gray-300 hover:text-white transition-colors">Quản lý trẻ em</Link></li>
									<li><Link to="/User/History" className="text-gray-300 hover:text-white transition-colors">Lịch sử tiêm chủng</Link></li>
								</ul>
							</div>
							
							<div>
								<h4 className="text-base font-semibold mb-4 text-white">Liên Hệ</h4>
								<ul className="space-y-3 text-sm">
									<li className="flex items-start">
										<Phone className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
										<span className="text-gray-300">Hotline: 0903 731 347</span>
									</li>
									<li className="flex items-start">
										<Mail className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
										<span className="text-gray-300">Email: contact@vaccinecare.vn</span>
									</li>
									<li className="flex items-start">
										<MapPin className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
										<span className="text-gray-300">600 Nguyễn Văn Cừ, Quận 5, TP. HCM</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					
					<div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
						<p>© 2023 VaccineCare. Tất cả quyền được bảo lưu.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
