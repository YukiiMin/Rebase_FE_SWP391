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
		<footer className="bg-gray-100 pt-12 pb-8">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Company Info */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-gray-800">{t('footer.aboutUs')}</h3>
						<Link to="/" className="flex items-center gap-2 mb-4">
							<img src="/Logo.png" alt="Logo" className="h-8 w-8" />
							<span className="text-xl font-bold">Vaccine Center</span>
						</Link>
						<p className="text-gray-600 mb-4">
							{t('footer.description')}
						</p>
						<div className="flex space-x-3">
							<a href="#" className="text-blue-600 hover:text-blue-800">
								<Facebook size={20} />
							</a>
							<a href="#" className="text-blue-400 hover:text-blue-600">
								<Twitter size={20} />
							</a>
							<a href="#" className="text-pink-600 hover:text-pink-800">
								<Instagram size={20} />
							</a>
							<a href="#" className="text-red-600 hover:text-red-800">
								<Youtube size={20} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-gray-800">{t('footer.quickLinks')}</h3>
						<ul className="space-y-2">
							<li>
								<Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('nav.home')}
								</Link>
							</li>
							<li>
								<Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('nav.about')}
								</Link>
							</li>
							<li>
								<Link to="/vaccine" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('nav.vaccine')}
								</Link>
							</li>
							<li>
								<Link to="/booking" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('nav.booking')}
								</Link>
							</li>
							<li>
								<Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('footer.contactUs')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Services */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-gray-800">{t('footer.services')}</h3>
						<ul className="space-y-2">
							<li>
								<Link to="/vaccine-for-children" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('footer.vaccineForChildren')}
								</Link>
							</li>
							<li>
								<Link to="/vaccine-for-adults" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('footer.vaccineForAdults')}
								</Link>
							</li>
							<li>
								<Link to="/travel-vaccines" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('footer.travelVaccines')}
								</Link>
							</li>
							<li>
								<Link to="/seasonal-vaccines" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('footer.seasonalVaccines')}
								</Link>
							</li>
							<li>
								<Link to="/vaccination-schedule" className="text-gray-600 hover:text-blue-600 transition-colors">
									{t('footer.vaccinationSchedule')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-gray-800">{t('footer.contactInfo')}</h3>
						<ul className="space-y-3">
							<li className="flex items-start space-x-3">
								<MapPin className="text-blue-600 h-5 w-5 mt-0.5" />
								<span className="text-gray-600">123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam</span>
							</li>
							<li className="flex items-center space-x-3">
								<Phone className="text-blue-600 h-5 w-5" />
								<span className="text-gray-600">+84 28 1234 5678</span>
							</li>
							<li className="flex items-center space-x-3">
								<Mail className="text-blue-600 h-5 w-5" />
								<span className="text-gray-600">info@vaccinecentre.com</span>
							</li>
							<li className="flex items-start space-x-3">
								<Clock className="text-blue-600 h-5 w-5 mt-0.5" />
								<div className="text-gray-600">
									<p>{t('footer.openingHours')}:</p>
									<p>{t('footer.monToFri')}: 8:00 AM - 8:00 PM</p>
									<p>{t('footer.satAndSun')}: 8:00 AM - 5:00 PM</p>
								</div>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-200 mt-10 pt-6">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-600 text-sm mb-4 md:mb-0">
							&copy; {currentYear} Vaccine Center. {t('footer.allRightsReserved')}
						</p>
						<div className="flex space-x-4 text-sm text-gray-600">
							<Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
								{t('footer.privacyPolicy')}
							</Link>
							<Link to="/terms-of-service" className="hover:text-blue-600 transition-colors">
								{t('footer.termsOfService')}
							</Link>
							<Link to="/faq" className="hover:text-blue-600 transition-colors">
								{t('footer.faq')}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
