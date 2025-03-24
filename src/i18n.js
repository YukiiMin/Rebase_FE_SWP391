import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  nav: {
    home: 'Home',
    about: 'About Us',
    vaccines: 'Vaccines',
    combos: 'Vaccine Combos',
    prices: 'Prices',
    booking: 'Booking',
    orderVaccine: 'Order Vaccine',
    login: 'Log in',
    signup: 'Sign up',
    profile: 'Your Profile',
    children: 'Your Children',
    schedule: 'Your Schedule',
    history: 'History',
    signout: 'Sign out'
  },
  home: {
    hero: {
      title: 'Safe Immunization for Children',
      description: 'Protect your child\'s health from the early days',
      cta: 'Book Appointment Now'
    },
    about: {
      title: 'Safe Vaccination System',
      description: 'We provide high-quality vaccination services with professional medical staff and a modern vaccine storage system that meets Ministry of Health standards.',
      feature1: 'Genuine vaccines',
      feature1_desc: '100% imported genuine vaccines',
      feature2: 'International standards',
      feature2_desc: 'WHO vaccination process'
    },
    services: {
      title: 'Our Services',
      booking: 'Vaccination Scheduling',
      booking_desc: 'Easy, quick and convenient vaccination appointments',
      booking_cta: 'Book Now',
      packages: 'Vaccine Packages',
      packages_desc: 'Save costs with various disease prevention vaccine packages',
      packages_cta: 'View Packages',
      reminders: 'Vaccination Reminders',
      reminders_desc: 'Receive vaccination reminders for you and your family',
      reminders_cta: 'Register',
      history: 'Vaccination History',
      history_desc: 'Track your child\'s vaccination history easily',
      history_cta: 'View History'
    },
    featured: {
      title: 'Featured Vaccines & Packages',
      vaccines_tab: 'Single Vaccines',
      combos_tab: 'Vaccine Packages',
      loading: 'Loading vaccines...',
      loading_combos: 'Loading packages...',
      view_detail: 'View Details',
      view_all_vaccines: 'View All Vaccines',
      view_all_combos: 'View All Packages',
      demo_data: 'Failed to load data. Displaying demo data for presentation purposes.'
    },
    cta: {
      title: 'Protect Your Child\'s Health',
      description: 'Book a vaccination appointment today and provide your child with the best protection against dangerous diseases.',
      book_now: 'Book Now',
      create_account: 'Create Account'
    },
    footer: {
      description: 'Vietnam\'s leading quality vaccine immunization system, committed to providing safe and professional vaccination services.',
      contact: 'Contact',
      rights: '© 2023 VaccineCare. All rights reserved.'
    }
  }
};

// Vietnamese translations
const viTranslations = {
  nav: {
    home: 'Trang chủ',
    about: 'Giới thiệu',
    vaccines: 'Vắc xin trẻ em',
    combos: 'Gói vắc xin',
    prices: 'Bảng giá',
    booking: 'Đặt lịch tiêm',
    orderVaccine: 'Đặt mua vắc xin',
    login: 'Đăng nhập',
    signup: 'Đăng ký',
    profile: 'Thông tin cá nhân',
    children: 'Trẻ của bạn',
    schedule: 'Lịch tiêm của bạn',
    history: 'Lịch sử tiêm',
    signout: 'Đăng xuất'
  },
  home: {
    hero: {
      title: 'Tiêm chủng an toàn cho trẻ em',
      description: 'Bảo vệ sức khỏe trẻ em từ những ngày đầu đời',
      cta: 'Đặt lịch tiêm ngay'
    },
    about: {
      title: 'Hệ Thống Tiêm Chủng An Toàn',
      description: 'Chúng tôi cung cấp dịch vụ tiêm chủng chất lượng cao với đội ngũ y bác sĩ chuyên nghiệp và hệ thống bảo quản vắc xin hiện đại đạt chuẩn của Bộ Y tế.',
      feature1: 'Vắc xin chính hãng',
      feature1_desc: '100% vắc xin nhập khẩu chính hãng',
      feature2: 'Đạt chuẩn quốc tế',
      feature2_desc: 'Quy trình tiêm chủng WHO'
    },
    services: {
      title: 'Dịch Vụ Của Chúng Tôi',
      booking: 'Đặt Lịch Tiêm Chủng',
      booking_desc: 'Đặt lịch tiêm chủng dễ dàng, nhanh chóng và thuận tiện',
      booking_cta: 'Đặt lịch ngay',
      packages: 'Gói Vắc Xin',
      packages_desc: 'Tiết kiệm chi phí với các gói vắc xin phòng ngừa bệnh đa dạng',
      packages_cta: 'Xem gói vắc xin',
      reminders: 'Nhắc Lịch Tiêm',
      reminders_desc: 'Nhận thông báo nhắc lịch tiêm chủng cho bạn và gia đình',
      reminders_cta: 'Đăng ký nhận',
      history: 'Lịch Sử Tiêm Chủng',
      history_desc: 'Theo dõi lịch sử tiêm chủng của trẻ dễ dàng và thuận tiện',
      history_cta: 'Xem lịch sử'
    },
    featured: {
      title: 'Vắc Xin & Gói Tiêm Nổi Bật',
      vaccines_tab: 'Vắc Xin Đơn Lẻ',
      combos_tab: 'Gói Vắc Xin',
      loading: 'Đang tải dữ liệu vắc xin...',
      loading_combos: 'Đang tải dữ liệu gói vắc xin...',
      view_detail: 'Xem Chi Tiết',
      view_all_vaccines: 'Xem Tất Cả Vắc Xin',
      view_all_combos: 'Xem Tất Cả Gói Vắc Xin',
      demo_data: 'Không thể tải dữ liệu. Hiển thị dữ liệu demo cho mục đích trình bày.'
    },
    cta: {
      title: 'Bảo Vệ Sức Khỏe Cho Bé Yêu',
      description: 'Đặt lịch tiêm chủng ngay hôm nay và cung cấp cho con bạn sự bảo vệ tốt nhất trước các bệnh nguy hiểm.',
      book_now: 'Đặt Lịch Ngay',
      create_account: 'Đăng Ký Tài Khoản'
    },
    footer: {
      description: 'Hệ thống tiêm chủng vắc xin chất lượng hàng đầu Việt Nam, cam kết mang đến dịch vụ tiêm chủng an toàn và chuyên nghiệp.',
      contact: 'Liên Hệ',
      rights: '© 2023 VaccineCare. Tất cả quyền được bảo lưu.'
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      vi: { translation: viTranslations }
    },
    lng: localStorage.getItem('language') || 'vi', // Default language is Vietnamese
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n; 