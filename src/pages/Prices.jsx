import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DollarSign, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { apiService } from '../api';

export default function Prices() {
  const { t } = useTranslation();
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const response = await apiService.vaccine.getAll();
        const data = response.data;
        setPriceData(data);
      } catch (error) {
        console.error('Error fetching price data:', error);
        setError(error.response?.data?.message || error.message);
        // Use demo data if API fails
        setPriceData(demoPrices);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrices();
  }, []);
  
  // Demo data to use when API fails
  const demoPrices = [
    {
      id: 1,
      name: "Vắc xin COVID-19",
      description: "Ngừa COVID-19 với hiệu quả bảo vệ cao",
      price: 850000,
      manufacturer: "AstraZeneca",
      origin: "UK/Sweden"
    },
    {
      id: 2,
      name: "Vắc xin Cúm mùa",
      description: "Bảo vệ hàng năm chống lại các chủng cúm theo mùa",
      price: 620000,
      manufacturer: "Sanofi Pasteur",
      origin: "France"
    },
    {
      id: 3,
      name: "Vắc xin MMR",
      description: "Phòng ngừa Sởi, Quai bị và Rubella cho trẻ",
      price: 580000,
      manufacturer: "Merck",
      origin: "USA"
    },
    {
      id: 4,
      name: "Vắc xin viêm gan B",
      description: "Phòng ngừa virus viêm gan B",
      price: 350000,
      manufacturer: "GSK",
      origin: "Belgium"
    },
    {
      id: 5,
      name: "Vắc xin HPV",
      description: "Ngừa các bệnh liên quan đến virus HPV",
      price: 1500000,
      manufacturer: "Merck",
      origin: "USA"
    }
  ];
  
  // Payment methods information
  const paymentMethods = [
    {
      id: "cash",
      name: t('prices.payment.cash'),
      icon: <Wallet className="payment-icon" />,
      description: t('prices.payment.cashDesc')
    },
    {
      id: "card",
      name: t('prices.payment.card'),
      icon: <CreditCard className="payment-icon" />,
      description: t('prices.payment.cardDesc')
    },
    {
      id: "transfer",
      name: t('prices.payment.transfer'),
      icon: <DollarSign className="payment-icon" />,
      description: t('prices.payment.transferDesc')
    }
  ];
  
  return (
    <PageContainer 
      title={t('prices.title')} 
      subtitle={t('prices.subtitle')}
    >
      <div className="prices-content">
        {/* Vaccination Price List */}
        <section className="prices-section">
          <div className="prices-container">
            <h2 className="prices-section-title">
              <DollarSign className="prices-icon" />
              {t('prices.vaccineList')}
            </h2>
            
            {loading ? (
              <div className="prices-loading">
                <div className="loading-spinner"></div>
                <p>{t('prices.loading')}</p>
              </div>
            ) : error ? (
              <div className="prices-error">
                <AlertCircle className="error-icon" />
                <p>{t('prices.error')}: {error}</p>
                <p>{t('prices.usingDemo')}</p>
              </div>
            ) : (
              <div className="price-table-container">
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>{t('prices.table.name')}</th>
                      <th>{t('prices.table.manufacturer')}</th>
                      <th>{t('prices.table.origin')}</th>
                      <th>{t('prices.table.price')}</th>
                      <th>{t('prices.table.action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceData.map((vaccine) => (
                      <tr key={vaccine.id}>
                        <td>
                          <div className="vaccine-name">
                            <span>{vaccine.name}</span>
                            <small>{vaccine.description}</small>
                          </div>
                        </td>
                        <td>{vaccine.manufacturer || "N/A"}</td>
                        <td>{vaccine.origin || "N/A"}</td>
                        <td className="price-cell">
                          {new Intl.NumberFormat('vi-VN').format(vaccine.price)} VNĐ
                        </td>
                        <td>
                          <Link to={`/Booking?vaccineId=${vaccine.id}`} className="book-button">
                            {t('prices.book')}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="price-note">
                  <AlertCircle className="note-icon" />
                  <p>{t('prices.note')}</p>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Payment Methods */}
        <section className="prices-section payment-section">
          <div className="prices-container">
            <h2 className="prices-section-title">
              <CreditCard className="prices-icon" />
              {t('prices.paymentTitle')}
            </h2>
            
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <div key={method.id} className="payment-method-card">
                  <div className="payment-method-icon">
                    {method.icon}
                  </div>
                  <h3 className="payment-method-name">{method.name}</h3>
                  <p className="payment-method-description">{method.description}</p>
                </div>
              ))}
            </div>
            
            <div className="payment-details">
              <h3>{t('prices.additionalInfo')}</h3>
              <ul className="payment-info-list">
                <li>{t('prices.info1')}</li>
                <li>{t('prices.info2')}</li>
                <li>{t('prices.info3')}</li>
                <li>{t('prices.info4')}</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="prices-cta">
          <div className="prices-container">
            <h2 className="prices-cta-title">{t('prices.cta.title')}</h2>
            <p className="prices-cta-text">{t('prices.cta.text')}</p>
            <div className="prices-cta-buttons">
              <Link to="/Booking" className="prices-cta-button primary">
                {t('prices.cta.book')}
              </Link>
              <Link to="/VaccineList" className="prices-cta-button secondary">
                {t('prices.cta.view')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
} 