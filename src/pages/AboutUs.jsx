import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Shield, Users, Syringe, Clock, Medal, FileCheck, Award, Building, HeartPulse, Stethoscope } from "lucide-react"
import PageContainer from "../components/layout/PageContainer"

export default function AboutUs() {
  const { t } = useTranslation()

  return (
    <PageContainer title={t("aboutUs.title")} subtitle={t("aboutUs.subtitle")}>
      <div className="max-w-7xl mx-auto text-foreground">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="w-full px-4 sm:px-6">
            <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:translate-y-[-5px]">
              <h2 className="flex items-center text-2xl font-bold text-primary mb-5">
                <Shield className="mr-3 text-primary" />
                {t("aboutUs.mission.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">{t("aboutUs.mission.description")}</p>
              <div className="bg-primary/10 border-l-4 border-primary p-5 rounded-r-lg mb-8">
                <p className="text-xl font-medium text-primary">
                  Our mission is to establish a nationwide comprehensive vaccine service system that meets international
                  standards, making quality vaccine services widely accessible to the Vietnamese people.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-10 mt-8">
                <div className="flex flex-col justify-center">
                  <p className="text-lg text-muted-foreground">
                    At VaccineCare, we are dedicated to providing the highest quality immunization services to protect
                    individuals and communities from preventable diseases. We believe that prevention through
                    vaccination is one of the most effective ways to ensure public health and well-being.
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <HeartPulse className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Commitment to safety and quality in all vaccination procedures</span>
                    </li>
                    <li className="flex items-start">
                      <Building className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Modern facilities with state-of-the-art vaccine storage systems</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Certified by the Ministry of Health and international health organizations</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=500"
                    alt="Modern vaccination facility"
                    className="w-full max-w-md rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="mb-16">
          <div className="w-full px-4 sm:px-6">
            <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:translate-y-[-5px]">
              <h2 className="flex items-center text-2xl font-bold text-primary mb-5">
                <Users className="mr-3 text-primary" />
                {t("aboutUs.team.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">{t("aboutUs.team.description")}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                <div className="bg-background rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg">
                  <div className="w-full h-56 overflow-hidden">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1xL5UTZthreDaQy2KEEJOWDgzQkQE5.png"
                      alt="Dr. Nguyen Van A"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mx-4 mt-4 mb-1">Dr. Nguyen Van A</h3>
                  <p className="text-sm font-medium text-muted-foreground mx-4 mb-2">Chief Medical Officer</p>
                  <p className="text-sm text-muted-foreground mx-4 mb-6 leading-relaxed">
                    Specialized in Pediatric Immunology with over 15 years of experience in vaccination programs.
                  </p>
                </div>

                <div className="bg-background rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg">
                  <div className="w-full h-56 overflow-hidden">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1xL5UTZthreDaQy2KEEJOWDgzQkQE5.png"
                      alt="Dr. Tran Thi B"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mx-4 mt-4 mb-1">Dr. Tran Thi B</h3>
                  <p className="text-sm font-medium text-muted-foreground mx-4 mb-2">Pediatric Specialist</p>
                  <p className="text-sm text-muted-foreground mx-4 mb-6 leading-relaxed">
                    Board-certified pediatrician with expertise in childhood immunization and preventive care.
                  </p>
                </div>

                <div className="bg-background rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg">
                  <div className="w-full h-56 overflow-hidden">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1xL5UTZthreDaQy2KEEJOWDgzQkQE5.png"
                      alt="Dr. Le Van C"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mx-4 mt-4 mb-1">Dr. Le Van C</h3>
                  <p className="text-sm font-medium text-muted-foreground mx-4 mb-2">Immunization Specialist</p>
                  <p className="text-sm text-muted-foreground mx-4 mb-6 leading-relaxed">
                    Researcher and practitioner focused on vaccine efficacy and safety protocols.
                  </p>
                </div>

                <div className="bg-background rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg">
                  <div className="w-full h-56 overflow-hidden">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1xL5UTZthreDaQy2KEEJOWDgzQkQE5.png"
                      alt="Dr. Pham Thi D"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mx-4 mt-4 mb-1">Dr. Pham Thi D</h3>
                  <p className="text-sm font-medium text-muted-foreground mx-4 mb-2">Public Health Director</p>
                  <p className="text-sm text-muted-foreground mx-4 mb-6 leading-relaxed">
                    Leads our community outreach and vaccination awareness programs.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-12 bg-muted p-6 rounded-lg">
                <div className="flex items-start">
                  <Stethoscope className="text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Certified Medical Professionals</h4>
                    <p className="text-sm text-muted-foreground">
                      All our doctors and nurses are certified by the Vietnam Medical Association
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Continuous Training</h4>
                    <p className="text-sm text-muted-foreground">
                      Our staff regularly participates in international training programs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="mb-16">
          <div className="w-full px-4 sm:px-6">
            <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:translate-y-[-5px]">
              <h2 className="flex items-center text-2xl font-bold text-primary mb-5">
                <Syringe className="mr-3 text-primary" />
                {t("aboutUs.approach.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">{t("aboutUs.approach.description")}</p>

              <div className="grid md:grid-cols-3 gap-8 mt-10">
                <div className="bg-card rounded-lg p-8 shadow-md transition-all duration-300 hover:translate-y-[-8px] flex flex-col">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6">
                    <FileCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Pre-vaccination Screening</h3>
                  <p className="text-base text-muted-foreground mb-5 leading-relaxed">
                    Thorough medical history review and consultation with a healthcare professional to ensure vaccine
                    suitability.
                  </p>
                  <ul className="list-none pl-0 mt-auto">
                    <li className="relative pl-6 mb-3 text-sm text-muted-foreground before:content-['✓'] before:absolute before:left-0 before:text-primary before:font-bold">
                      Comprehensive health assessment
                    </li>
                    <li className="relative pl-6 mb-3 text-sm text-muted-foreground before:content-['✓'] before:absolute before:left-0 before:text-primary before:font-bold">
                      Allergy and reaction history check
                    </li>
                    <li className="relative pl-6 mb-3 text-sm text-muted-foreground before:content-['✓'] before:absolute before:left-0 before:text-primary before:font-bold">
                      Personalized vaccination plan
                    </li>
                  </ul>
                </div>

                <div className="bg-card rounded-lg p-8 shadow-md transition-all duration-300 hover:translate-y-[-8px] flex flex-col">
                  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mb-6">
                    <Medal className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Quality Vaccines</h3>
                  <p className="text-base text-muted-foreground mb-5 leading-relaxed">
                    Only WHO-approved vaccines with proper cold chain storage and handling to maintain efficacy.
                  </p>
                  <ul className="list-none pl-0 mt-auto">
                    <li className="relative pl-6 mb-3 text-sm text-muted-foreground before:content-['✓'] before:absolute before:left-0 before:text-primary before:font-bold">
                      Imported directly from authorized manufacturers
                    </li>
                    <li className="relative pl-6 mb-3 text-sm text-muted-foreground before:content-['✓'] before:absolute before:left-0 before:text-primary before:font-bold">
                      Temperature-controlled storage facilities
                    </li>
                    <li className="relative pl-6 mb-3 text-sm text-muted-foreground before:content-['✓'] before:absolute before:left-0 before:text-primary before:font-bold">
                      Batch tracking and quality verification
                    </li>
                  </ul>
                </div>

                <div className="bg-card rounded-lg p-8 shadow-md transition-all duration-300 hover:translate-y-[-8px] flex flex-col">
                  <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-6">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Post-vaccination Monitoring</h3>
                  <p className="text-base text-muted-foreground mb-5 leading-relaxed">
                    30-minute observation period after vaccination and comprehensive follow-up care.
                  </p>
                  <ul className="list-none pl-0 mt-auto">
                    <li className="relative pl-6 mb-3 text-sm text-muted-foreground before:content-['✓'] before:absolute before:left-0 before:text-primary before:font-bold">
                      Immediate reaction monitoring
                    </li>
                    <li className="relative pl-6 mb-3 text-sm text-muted-foreground before:content-['✓'] before:absolute before:left-0 before:text-primary before:font-bold">
                      24/7 medical support hotline
                    </li>
                    <li className="relative pl-6 mb-3 text-sm text-muted-foreground before:content-['✓'] before:absolute before:left-0 before:text-primary before:font-bold">
                      Digital follow-up reminders
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-10 mt-12">
                <div className="flex flex-col items-center">
                  <img src="/placeholder.svg?height=80&width=80" alt="WHO Certification" className="w-20 h-20 mb-3" />
                  <span className="text-sm font-semibold text-muted-foreground">WHO Standards</span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="Ministry of Health Certification"
                    className="w-20 h-20 mb-3"
                  />
                  <span className="text-sm font-semibold text-muted-foreground">MOH Approved</span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="Safety Certification"
                    className="w-20 h-20 mb-3"
                  />
                  <span className="text-sm font-semibold text-muted-foreground">Safety Certified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="mb-16">
          <div className="w-full px-4 sm:px-6">
            <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:translate-y-[-5px]">
              <h2 className="flex items-center text-2xl font-bold text-primary mb-5">
                <Clock className="mr-3 text-primary" />
                {t("aboutUs.history.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">{t("aboutUs.history.description")}</p>

              <div className="relative max-w-4xl mx-auto mt-12">
                {/* Timeline line */}
                <div className="absolute left-[30px] md:left-[120px] top-0 bottom-0 w-1 bg-primary hidden md:block"></div>

                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row relative">
                    <div className="md:w-[120px] text-2xl font-bold text-primary md:text-right md:pr-8 mb-2 md:mb-0">
                      2015
                    </div>
                    <div className="hidden md:block absolute w-5 h-5 bg-white border-4 border-primary rounded-full left-[118px] top-[10px] z-10"></div>
                    <div className="bg-muted rounded-lg p-6 shadow-sm md:ml-8 flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">Establishment</h3>
                      <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                        Founded with a mission to provide accessible vaccine services to all Vietnamese citizens.
                      </p>
                      <div className="flex items-center mt-4">
                        <span className="text-2xl font-bold text-primary mr-3">1</span>
                        <span className="text-sm text-muted-foreground">First center opened in Hanoi</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row relative">
                    <div className="md:w-[120px] text-2xl font-bold text-primary md:text-right md:pr-8 mb-2 md:mb-0">
                      2018
                    </div>
                    <div className="hidden md:block absolute w-5 h-5 bg-white border-4 border-primary rounded-full left-[118px] top-[10px] z-10"></div>
                    <div className="bg-muted rounded-lg p-6 shadow-sm md:ml-8 flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">Expansion</h3>
                      <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                        Opened 10 new centers across major cities in Vietnam, bringing quality vaccination services
                        nationwide.
                      </p>
                      <div className="flex items-center mt-4">
                        <span className="text-2xl font-bold text-primary mr-3">100K+</span>
                        <span className="text-sm text-muted-foreground">Patients served</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row relative">
                    <div className="md:w-[120px] text-2xl font-bold text-primary md:text-right md:pr-8 mb-2 md:mb-0">
                      2020
                    </div>
                    <div className="hidden md:block absolute w-5 h-5 bg-white border-4 border-primary rounded-full left-[118px] top-[10px] z-10"></div>
                    <div className="bg-muted rounded-lg p-6 shadow-sm md:ml-8 flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">COVID-19 Response</h3>
                      <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                        Played a key role in national vaccination efforts during the global pandemic.
                      </p>
                      <div className="flex items-center mt-4">
                        <span className="text-2xl font-bold text-primary mr-3">1M+</span>
                        <span className="text-sm text-muted-foreground">COVID-19 vaccines administered</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row relative">
                    <div className="md:w-[120px] text-2xl font-bold text-primary md:text-right md:pr-8 mb-2 md:mb-0">
                      2023
                    </div>
                    <div className="hidden md:block absolute w-5 h-5 bg-white border-4 border-primary rounded-full left-[118px] top-[10px] z-10"></div>
                    <div className="bg-muted rounded-lg p-6 shadow-sm md:ml-8 flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">Digital Transformation</h3>
                      <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                        Launched online booking system and digital vaccination records for enhanced patient experience.
                      </p>
                      <div className="flex items-center mt-4">
                        <span className="text-2xl font-bold text-primary mr-3">25</span>
                        <span className="text-sm text-muted-foreground">Centers nationwide</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section - New Section */}
        <section className="mb-16">
          <div className="w-full px-4 sm:px-6">
            <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 md:p-10 transition-transform duration-300 hover:translate-y-[-5px]">
              <h2 className="flex items-center text-2xl font-bold text-primary mb-5">
                <Building className="mr-3 text-primary" />
                Our Facilities
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our modern vaccination centers are designed with patient comfort and safety in mind, featuring
                state-of-the-art equipment and dedicated areas for each stage of the vaccination process.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-8px]">
                  <img
                    src="/placeholder.svg?height=180&width=300"
                    alt="Comfortable waiting area"
                    className="w-full h-[180px] object-cover"
                  />
                  <h3 className="text-lg font-semibold text-primary mx-5 mt-5 mb-2">Comfortable Waiting Areas</h3>
                  <p className="text-sm text-muted-foreground mx-5 mb-5 leading-relaxed">
                    Spacious, child-friendly waiting rooms with entertainment options.
                  </p>
                </div>

                <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-8px]">
                  <img
                    src="/placeholder.svg?height=180&width=300"
                    alt="Private consultation room"
                    className="w-full h-[180px] object-cover"
                  />
                  <h3 className="text-lg font-semibold text-primary mx-5 mt-5 mb-2">Private Consultation Rooms</h3>
                  <p className="text-sm text-muted-foreground mx-5 mb-5 leading-relaxed">
                    Dedicated spaces for confidential pre-vaccination consultations.
                  </p>
                </div>

                <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-8px]">
                  <img
                    src="/placeholder.svg?height=180&width=300"
                    alt="Modern vaccination room"
                    className="w-full h-[180px] object-cover"
                  />
                  <h3 className="text-lg font-semibold text-primary mx-5 mt-5 mb-2">Modern Vaccination Rooms</h3>
                  <p className="text-sm text-muted-foreground mx-5 mb-5 leading-relaxed">
                    Sterile environments with advanced medical equipment.
                  </p>
                </div>

                <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-8px]">
                  <img
                    src="/placeholder.svg?height=180&width=300"
                    alt="Post-vaccination recovery area"
                    className="w-full h-[180px] object-cover"
                  />
                  <h3 className="text-lg font-semibold text-primary mx-5 mt-5 mb-2">Recovery Areas</h3>
                  <p className="text-sm text-muted-foreground mx-5 mb-5 leading-relaxed">
                    Monitored spaces for post-vaccination observation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="w-full px-4 sm:px-6">
            <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to protect yourself and your loved ones?</h2>
              <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
                Schedule a vaccination appointment today or browse our services to learn more about how we can help
                safeguard your family's health.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
                <Link
                  to="/Booking"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:translate-y-[-3px]"
                >
                  Book Appointment
                </Link>
                <Link
                  to="/Prices"
                  className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:bg-white/10 hover:translate-y-[-3px]"
                >
                  View Prices
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                <div className="bg-white/10 p-6 rounded-lg max-w-md">
                  <p className="text-lg italic mb-4 leading-relaxed">
                    "The staff at VaccineCare made our family's vaccination experience smooth and stress-free. Highly
                    recommended!"
                  </p>
                  <p className="text-sm font-semibold">— Nguyen Thi M., Parent of two</p>
                </div>
                <div className="bg-white/10 p-6 rounded-lg max-w-md">
                  <p className="text-lg italic mb-4 leading-relaxed">
                    "Professional service with clear information about vaccines. The online booking system is very
                    convenient."
                  </p>
                  <p className="text-sm font-semibold">— Tran Van H., Regular patient</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  )
}

