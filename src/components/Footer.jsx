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
  ExternalLink 
} from "lucide-react";

function Footer() {
	const { t } = useTranslation();
	
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-gray-200 pt-12 pb-8">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
					{/* Logo and Company Info */}
					<div className="space-y-4">
						<div className="flex items-center">
							<div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
								<Shield className="h-6 w-6 text-white" />
							</div>
							<span className="ml-3 font-bold text-xl text-white">VaccineCare</span>
						</div>
						<p className="text-sm text-gray-400 mt-2">
							{t('home.footer.description')}
						</p>
						<div className="pt-2 flex space-x-4">
							<a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
								<Facebook size={20} />
							</a>
							<a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
								<Twitter size={20} />
							</a>
							<a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
								<Instagram size={20} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
						<ul className="space-y-2">
							<li>
								<Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
									<ExternalLink className="h-3.5 w-3.5 mr-2" />
									{t('nav.home')}
								</Link>
							</li>
							<li>
								<Link to="/AboutUs" className="text-gray-400 hover:text-white transition-colors flex items-center">
									<ExternalLink className="h-3.5 w-3.5 mr-2" />
									{t('nav.about')}
								</Link>
							</li>
							<li>
								<Link to="/VaccineList" className="text-gray-400 hover:text-white transition-colors flex items-center">
									<ExternalLink className="h-3.5 w-3.5 mr-2" />
									{t('nav.vaccines')}
								</Link>
							</li>
							<li>
								<Link to="/ComboList" className="text-gray-400 hover:text-white transition-colors flex items-center">
									<ExternalLink className="h-3.5 w-3.5 mr-2" />
									{t('nav.combos')}
								</Link>
							</li>
							<li>
								<Link to="/Booking" className="text-gray-400 hover:text-white transition-colors flex items-center">
									<ExternalLink className="h-3.5 w-3.5 mr-2" />
									{t('nav.booking')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-white font-semibold text-lg mb-4">{t('home.footer.contact')}</h3>
						<ul className="space-y-3">
							<li className="flex items-start">
								<Phone className="h-5 w-5 mr-2 text-orange-500 mt-0.5" />
								<div>
									<p className="text-gray-400">Hotline:</p>
									<a href="tel:0903731347" className="text-white hover:text-orange-400 transition-colors">
										0903 731 347
									</a>
								</div>
							</li>
							<li className="flex items-start">
								<Mail className="h-5 w-5 mr-2 text-orange-500 mt-0.5" />
								<div>
									<p className="text-gray-400">Email:</p>
									<a href="mailto:contact@vaccinecare.vn" className="text-white hover:text-orange-400 transition-colors">
										contact@vaccinecare.vn
									</a>
								</div>
							</li>
							<li className="flex items-start">
								<MapPin className="h-5 w-5 mr-2 text-orange-500 mt-0.5" />
								<div>
									<p className="text-gray-400">{t('footer.address')}:</p>
									<p className="text-white">
										FPT University, District 9, TP. Ho Chi Minh
									</p>
								</div>
							</li>
						</ul>
					</div>

					{/* Working Hours */}
					<div>
						<h3 className="text-white font-semibold text-lg mb-4">{t('footer.workingHours')}</h3>
						<ul className="space-y-2">
							<li className="flex items-center">
								<Clock className="h-4 w-4 mr-2 text-orange-500" />
								<span className="text-gray-400">{t('footer.monday')} - {t('footer.friday')}: </span>
								<span className="ml-1 text-white">8:00 AM - 5:00 PM</span>
							</li>
							<li className="flex items-center">
								<Clock className="h-4 w-4 mr-2 text-orange-500" />
								<span className="text-gray-400">{t('footer.saturday')}: </span>
								<span className="ml-1 text-white">8:00 AM - 12:00 PM</span>
							</li>
							<li className="flex items-center">
								<Clock className="h-4 w-4 mr-2 text-orange-500" />
								<span className="text-gray-400">{t('footer.sunday')}: </span>
								<span className="ml-1 text-white">{t('footer.closed')}</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Divider */}
				<div className="border-t border-gray-800 pt-6 mt-6">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-sm text-gray-500">
							© {currentYear} VaccineCare. {t('home.footer.rights')}
						</p>
						<div className="flex space-x-4 mt-4 md:mt-0">
							<Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-white transition-colors">
								{t('footer.privacy')}
							</Link>
							<Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-white transition-colors">
								{t('footer.terms')}
							</Link>
							<Link to="/faqs" className="text-sm text-gray-500 hover:text-white transition-colors">
								FAQs
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
