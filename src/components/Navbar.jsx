import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	User,
	LayoutDashboard,
	LogOut,
	Settings,
	ChevronDown,
	Home,
	Info,
	FileText,
	ShoppingBag,
	Calendar,
	UserCog,
	Menu,
	X,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

function Navigation() {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [isStaff, setIsStaff] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setIsLoggedIn(true);
			setUsername(localStorage.getItem('username') || 'User');
			
			const role = localStorage.getItem('role');
			setIsAdmin(role === 'ADMIN');
			setIsStaff(role === 'STAFF');
		} else {
			setIsLoggedIn(false);
			setUsername('');
			setIsAdmin(false);
			setIsStaff(false);
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		localStorage.removeItem('role');
		setIsLoggedIn(false);
		navigate('/');
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-white">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<Link to="/" className="flex items-center gap-2">
						<img
							src="/Logo.png"
							alt="Logo"
							className="h-10 w-10"
						/>
						<span className="hidden text-xl font-bold md:inline-block">
							Vaccine Center
						</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-6">
					<Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
						{t('nav.home')}
					</Link>
					<Link to="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
						{t('nav.about')}
					</Link>
					<Link to="/vaccine" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
						{t('nav.vaccine')}
					</Link>
					<Link to="/booking" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
						{t('nav.booking')}
					</Link>
				</nav>

				<div className="flex items-center gap-4">
					<LanguageSwitcher />
					
					{isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
									<User className="h-4 w-4" />
									<span className="font-medium">{username}</span>
									<ChevronDown className="h-4 w-4 opacity-50" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
								<DropdownMenuSeparator />
								
								<Link to="/user/profile">
									<DropdownMenuItem className="cursor-pointer">
										<User className="mr-2 h-4 w-4" />
										<span>{t('nav.profile')}</span>
									</DropdownMenuItem>
								</Link>
								
								<Link to="/user/appointments">
									<DropdownMenuItem className="cursor-pointer">
										<Calendar className="mr-2 h-4 w-4" />
										<span>{t('nav.appointments')}</span>
									</DropdownMenuItem>
								</Link>
								
								<Link to="/user/settings">
									<DropdownMenuItem className="cursor-pointer">
										<Settings className="mr-2 h-4 w-4" />
										<span>{t('nav.settings')}</span>
									</DropdownMenuItem>
								</Link>
								
								{isAdmin && (
									<Link to="/Admin/Dashboard">
										<DropdownMenuItem className="cursor-pointer">
											<LayoutDashboard className="mr-2 h-4 w-4" />
											<span>{t('nav.adminDashboard')}</span>
										</DropdownMenuItem>
									</Link>
								)}
								
								{isStaff && (
									<Link to="/Staff/Dashboard">
										<DropdownMenuItem className="cursor-pointer">
											<UserCog className="mr-2 h-4 w-4" />
											<span>{t('nav.staffDashboard')}</span>
										</DropdownMenuItem>
									</Link>
								)}
								
								<DropdownMenuSeparator />
								
								<DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
									<LogOut className="mr-2 h-4 w-4" />
									<span>{t('nav.logout')}</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="flex items-center gap-2">
							<Link to="/login">
								<Button variant="ghost" size="sm">
									{t('nav.login')}
								</Button>
							</Link>
							<Link to="/register">
								<Button size="sm">
									{t('nav.register')}
								</Button>
							</Link>
						</div>
					)}

					{/* Mobile menu button */}
					<Button 
						variant="ghost" 
						size="icon" 
						className="md:hidden" 
						onClick={toggleMenu}
					>
						{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="md:hidden border-t">
					<div className="flex flex-col space-y-3 p-4">
						<Link 
							to="/" 
							className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
							onClick={toggleMenu}
						>
							<Home className="h-4 w-4" />
							{t('nav.home')}
						</Link>
						<Link 
							to="/about" 
							className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
							onClick={toggleMenu}
						>
							<Info className="h-4 w-4" />
							{t('nav.about')}
						</Link>
						<Link 
							to="/vaccine" 
							className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
							onClick={toggleMenu}
						>
							<ShoppingBag className="h-4 w-4" />
							{t('nav.vaccine')}
						</Link>
						<Link 
							to="/booking" 
							className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
							onClick={toggleMenu}
						>
							<Calendar className="h-4 w-4" />
							{t('nav.booking')}
						</Link>
						
						{isLoggedIn && (
							<>
								<div className="h-px bg-gray-200 my-1"></div>
								<Link 
									to="/user/profile" 
									className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
									onClick={toggleMenu}
								>
									<User className="h-4 w-4" />
									{t('nav.profile')}
								</Link>
								{isAdmin && (
									<Link 
										to="/Admin/Dashboard" 
										className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
										onClick={toggleMenu}
									>
										<LayoutDashboard className="h-4 w-4" />
										{t('nav.adminDashboard')}
									</Link>
								)}
								{isStaff && (
									<Link 
										to="/Staff/Dashboard" 
										className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
										onClick={toggleMenu}
									>
										<UserCog className="h-4 w-4" />
										{t('nav.staffDashboard')}
									</Link>
								)}
								<button 
									onClick={() => {
										handleLogout();
										toggleMenu();
									}}
									className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
								>
									<LogOut className="h-4 w-4" />
									{t('nav.logout')}
								</button>
							</>
						)}
					</div>
				</div>
			)}
		</header>
	);
}

export default Navigation;
