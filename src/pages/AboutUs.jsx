import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, Users, Syringe, Clock, Medal, FileCheck } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';

export default function AboutUs() {
  const { t } = useTranslation();
  
  return (
    <PageContainer 
      title={t('aboutUs.title')} 
      subtitle={t('aboutUs.subtitle')}
    >
      <div className="about-us-content">
        {/* Mission Section */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-card">
              <h2 className="about-section-title">
                <Shield className="about-icon" />
                {t('aboutUs.mission.title')}
              </h2>
              <p className="about-text">{t('aboutUs.mission.description')}</p>
              <div className="about-highlight">
                <p>Our mission is to establish a nationwide comprehensive vaccine service system that meets international standards, making quality vaccine services widely accessible to the Vietnamese people.</p>
              </div>
              <p className="about-text">
                At our Vaccination Center, we are dedicated to providing the highest quality immunization services to protect individuals and communities from preventable diseases. We believe that prevention through vaccination is one of the most effective ways to ensure public health and well-being.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Team Section */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-card">
              <h2 className="about-section-title">
                <Users className="about-icon" />
                {t('aboutUs.team.title')}
              </h2>
              <p className="about-text">{t('aboutUs.team.description')}</p>
              
              <div className="team-grid">
                <div className="team-member">
                  <div className="team-member-image">
                    <img src="https://placehold.co/200x200/0056B3/FFF?text=Doctor" alt="Dr. Nguyen Van A" />
                  </div>
                  <h3 className="team-member-name">Dr. Nguyen Van A</h3>
                  <p className="team-member-role">Chief Medical Officer</p>
                </div>
                
                <div className="team-member">
                  <div className="team-member-image">
                    <img src="https://placehold.co/200x200/0056B3/FFF?text=Doctor" alt="Dr. Tran Thi B" />
                  </div>
                  <h3 className="team-member-name">Dr. Tran Thi B</h3>
                  <p className="team-member-role">Pediatric Specialist</p>
                </div>
                
                <div className="team-member">
                  <div className="team-member-image">
                    <img src="https://placehold.co/200x200/0056B3/FFF?text=Doctor" alt="Dr. Le Van C" />
                  </div>
                  <h3 className="team-member-name">Dr. Le Van C</h3>
                  <p className="team-member-role">Immunization Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Approach Section */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-card">
              <h2 className="about-section-title">
                <Syringe className="about-icon" />
                {t('aboutUs.approach.title')}
              </h2>
              <p className="about-text">{t('aboutUs.approach.description')}</p>
              
              <div className="about-features">
                <div className="about-feature">
                  <div className="about-feature-icon about-feature-icon-blue">
                    <FileCheck />
                  </div>
                  <div className="about-feature-content">
                    <h3 className="about-feature-title">Pre-vaccination Screening</h3>
                    <p className="about-feature-description">Thorough medical history review and consultation</p>
                  </div>
                </div>
                
                <div className="about-feature">
                  <div className="about-feature-icon about-feature-icon-green">
                    <Medal />
                  </div>
                  <div className="about-feature-content">
                    <h3 className="about-feature-title">Quality Vaccines</h3>
                    <p className="about-feature-description">Only WHO-approved vaccines with proper cold chain storage</p>
                  </div>
                </div>
                
                <div className="about-feature">
                  <div className="about-feature-icon about-feature-icon-orange">
                    <Clock />
                  </div>
                  <div className="about-feature-content">
                    <h3 className="about-feature-title">Post-vaccination Monitoring</h3>
                    <p className="about-feature-description">30-minute observation and follow-up care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* History Section */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-card">
              <h2 className="about-section-title">
                <Clock className="about-icon" />
                {t('aboutUs.history.title')}
              </h2>
              <p className="about-text">{t('aboutUs.history.description')}</p>
              
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-date">2015</div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Establishment</h3>
                    <p className="timeline-description">Founded with a mission to provide accessible vaccine services</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-date">2018</div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Expansion</h3>
                    <p className="timeline-description">Opened 10 new centers across major cities in Vietnam</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-date">2020</div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">COVID-19 Response</h3>
                    <p className="timeline-description">Played a key role in national vaccination efforts</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-date">2023</div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Digital Transformation</h3>
                    <p className="timeline-description">Launched online booking and digital vaccination records</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="about-cta">
          <div className="about-container">
            <h2 className="about-cta-title">Ready to protect yourself and your loved ones?</h2>
            <p className="about-cta-text">Schedule a vaccination appointment today or browse our services.</p>
            <div className="about-cta-buttons">
              <Link to="/Booking" className="about-cta-button primary">Book Appointment</Link>
              <Link to="/Prices" className="about-cta-button secondary">View Prices</Link>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
} 