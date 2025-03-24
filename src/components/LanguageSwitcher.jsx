import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || 'vi'
  );

  useEffect(() => {
    // Update localStorage when language changes
    localStorage.setItem('language', currentLanguage);
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, i18n]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
    setCurrentLanguage(newLanguage);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1 px-2 text-sm"
        onClick={toggleLanguage}
      >
        <div className="w-5 h-3 overflow-hidden">
          <img
            src={currentLanguage === 'vi' 
              ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png"
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png"
            }
            alt={currentLanguage === 'vi' ? 'Tiếng Việt' : 'English'}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="hidden sm:inline">{currentLanguage === 'vi' ? 'VI' : 'EN'}</span>
      </Button>
    </div>
  );
} 