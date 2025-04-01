import React from "react";
import MainNav from "./MainNav";
import Footer from "./Footer";
import { useTranslation } from 'react-i18next';

export default function PageContainer({ children, title, subtitle }) {
  const { t } = useTranslation();
  
  return (
    <div className="page-container">
      <MainNav />
      
      {(title || subtitle) && (
        <header className="page-header">
          <div className="page-header-container">
            {title && <h1 className="page-title">{title}</h1>}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        </header>
      )}
      
      <main className="page-content">
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 