import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button 
        className="flex items-center bg-transparent border-none text-white p-1.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5 mr-1" />
        <span className="text-xs font-semibold">{currentLanguage.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-md shadow-lg w-40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          <button 
            className={`flex items-center w-full p-2.5 border-none text-left cursor-pointer hover:bg-gray-100 transition-colors ${currentLanguage === 'en' ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700'}`}
            onClick={() => changeLanguage('en')}
          >
            <span className="text-lg mr-3">🇺🇸</span>
            <span className="text-sm">English</span>
          </button>
          <button 
            className={`flex items-center w-full p-2.5 border-none text-left cursor-pointer hover:bg-gray-100 transition-colors ${currentLanguage === 'vi' ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700'}`}
            onClick={() => changeLanguage('vi')}
          >
            <span className="text-lg mr-3">🇻🇳</span>
            <span className="text-sm">Tiếng Việt</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher; 