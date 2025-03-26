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
      rights: 'All rights reserved.'
    }
  },
  footer: {
    quickLinks: 'Quick Links',
    address: 'Address',
    workingHours: 'Working Hours',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    closed: 'Closed',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: '© 2023 VaccineCare. All rights reserved.'
  },
  register: {
    title: "Create an Account",
    haveAccount: "Already have an account?",
    login: "Log in",
    firstName: "First Name",
    lastName: "Last Name",
    dob: "Date of Birth",
    phone: "Phone Number",
    email: "Email Address",
    username: "Username",
    gender: "Gender",
    selectGender: "Select gender",
    male: "Male",
    female: "Female",
    other: "Other",
    password: "Password",
    createPassword: "Create a password",
    confirmPassword: "Confirm Password",
    confirmYourPassword: "Confirm your password",
    signUp: "Sign Up",
    processing: "Processing...",
    register: "Register",
    terms: "By creating an account, you agree to our",
    termsLink: "Terms of Service",
    and: "and",
    privacyLink: "Privacy Policy",
    passwordStrength: {
      title: "Password strength:",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      requirements: "Password must have:",
      length: "At least 8 characters",
      lowercase: "At least 1 lowercase letter",
      uppercase: "At least 1 uppercase letter",
      number: "At least 1 number",
      special: "At least 1 special character"
    },
    errors: {
      required: "This field is required",
      invalidEmail: "Invalid email address",
      passwordLength: "Password must be at least 8 characters",
      passwordMatch: "Passwords do not match",
      phoneFormat: "Phone number must be 10 digits",
      invalidUsername: "Username can only contain letters, numbers, and underscores",
      usernameLength: "Username must be between 3 and 20 characters",
      weakPassword: "Please create a stronger password",
      registerFailed: "Registration failed. Please try again.",
      serverError: "Server error. Please try again later."
    },
    success: {
      title: "Registration successful!",
      redirecting: "Redirecting you to login..."
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
      rights: 'Tất cả quyền được bảo lưu.'
    }
  },
  footer: {
    quickLinks: 'Liên Kết Nhanh',
    address: 'Địa Chỉ',
    workingHours: 'Giờ Làm Việc',
    monday: 'Thứ Hai',
    tuesday: 'Thứ Ba',
    wednesday: 'Thứ Tư',
    thursday: 'Thứ Năm',
    friday: 'Thứ Sáu',
    saturday: 'Thứ Bảy',
    sunday: 'Chủ Nhật',
    closed: 'Đóng cửa',
    privacy: 'Chính Sách Bảo Mật',
    terms: 'Điều Khoản Dịch Vụ',
    copyright: '© 2025 VaccineCare. Tất cả quyền được bảo lưu.'
  },
  register: {
    title: "Tạo Tài Khoản",
    haveAccount: "Đã có tài khoản?",
    login: "Đăng nhập",
    firstName: "Tên",
    lastName: "Họ",
    dob: "Ngày sinh",
    phone: "Số điện thoại",
    email: "Địa chỉ email",
    username: "Tên đăng nhập",
    gender: "Giới tính",
    selectGender: "Chọn giới tính",
    male: "Nam",
    female: "Nữ",
    other: "Khác",
    password: "Mật khẩu",
    createPassword: "Tạo mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
    confirmYourPassword: "Xác nhận mật khẩu của bạn",
    signUp: "Đăng ký",
    processing: "Đang xử lý...",
    register: "Đăng ký",
    terms: "Bằng cách tạo tài khoản, bạn đồng ý với",
    termsLink: "Điều khoản dịch vụ",
    and: "và",
    privacyLink: "Chính sách bảo mật",
    passwordStrength: {
      title: "Độ mạnh mật khẩu:",
      weak: "Yếu",
      medium: "Trung bình",
      strong: "Mạnh",
      requirements: "Mật khẩu phải có:",
      length: "Ít nhất 8 ký tự",
      lowercase: "Ít nhất 1 chữ thường",
      uppercase: "Ít nhất 1 chữ hoa",
      number: "Ít nhất 1 số",
      special: "Ít nhất 1 ký tự đặc biệt"
    },
    errors: {
      required: "Trường này là bắt buộc",
      invalidEmail: "Địa chỉ email không hợp lệ",
      passwordLength: "Mật khẩu phải có ít nhất 8 ký tự",
      passwordMatch: "Mật khẩu không khớp",
      phoneFormat: "Số điện thoại phải có 10 chữ số",
      invalidUsername: "Tên đăng nhập chỉ có thể chứa chữ cái, số và dấu gạch dưới",
      usernameLength: "Tên đăng nhập phải từ 3 đến 20 ký tự",
      weakPassword: "Vui lòng tạo mật khẩu mạnh hơn",
      registerFailed: "Đăng ký thất bại. Vui lòng thử lại.",
      serverError: "Lỗi máy chủ. Vui lòng thử lại sau."
    },
    success: {
      title: "Đăng ký thành công!",
      redirecting: "Đang chuyển hướng đến trang đăng nhập..."
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