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
    bookingAppointment: 'Booking Appointment',
    orderVaccine: 'Order Vaccine',
    login: 'Log in',
    signup: 'Sign up',
    profile: 'Your Profile',
    children: 'Your Children',
    schedule: 'Your Schedule',
    history: 'History',
    logout: 'Log out',
    dashboard: 'Dashboard',
    tagline: 'NATIONAL VACCINATION SYSTEM',
    staffPortal: 'Staff Portal'
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
    },
    banner1: {
      title: "Safe Vaccination for Children",
      description: "Protect children's health from the early days of life",
      cta: "Book Now"
    },
    banner2: {
      title: "Prevent Dengue Fever",
      description: "Qdenga vaccination against dengue fever with up to 80% effectiveness",
      cta: "Learn More"
    },
    banner3: {
      title: "Combo Vaccine Package",
      description: "Save up to 25% with combo vaccine packages",
      cta: "View Packages"
    },
    about: {
      title: "Safe Vaccination System",
      description: "We provide high-quality vaccination services with professional medical staff and modern vaccine storage systems that meet Ministry of Health standards.",
      image_alt: "Vaccination center",
      feature1: {
        title: "Genuine Vaccines",
        description: "100% imported genuine vaccines"
      },
      feature2: {
        title: "International Standards",
        description: "WHO vaccination protocol"
      }
    },
    services: {
      title: "Our Services",
      booking: {
        title: "Vaccination Booking",
        description: "Easy, quick and convenient vaccination scheduling",
        button: "Book Now"
      },
      combos: {
        title: "Vaccine Packages",
        description: "Save costs with diverse disease prevention vaccine packages",
        button: "View Packages"
      },
      reminders: {
        title: "Vaccination Reminders",
        description: "Receive vaccination schedule notifications for you and your family",
        button: "Register"
      },
      history: {
        title: "Vaccination History",
        description: "Track children's vaccination history easily and conveniently",
        button: "View History"
      }
    },
    featured: {
      title: "Featured Vaccines & Packages",
      error_message: "Displaying demo data for presentation purposes.",
      single_vaccines: "Single Vaccines",
      combo_packages: "Vaccine Packages",
      loading_vaccines: "Loading vaccine data...",
      loading_combos: "Loading package data...",
      view_details: "View Details",
      view_package: "View Package",
      view_all_vaccines: "View All Vaccines"
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
    subtitle: "Create an account to access all features and schedule vaccinations",
    haveAccount: "Already have an account?",
    loginLink: "Log in",
    createAccount: "Create your VaccineCare Account",
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
      serverError: "Server error. Please try again later.",
      firstNameLength: "First name must be at most 100 characters",
      lastNameLength: "Last name must be at most 100 characters",
      emailLength: "Email must be at most 50 characters",
      invalidGender: "Please select a valid gender"
    },
    success: {
      title: "Registration successful!",
      redirecting: "Redirecting you to login..."
    },
    steps: {
      accountInfo: "Account Information",
      accountDesc: "Create your login credentials",
      personalInfo: "Personal Information",
      personalDesc: "Tell us about yourself",
      next: "Continue",
      back: "Back",
      create: "Create Account",
      cancel: "Cancel"
    },
    address: "Address",
    addressPlaceholder: "Enter your address"
  },
  login: {
    title: "Log in to your VaccineCare Account",
    heading: "Log in",
    noAccount: "Don't have an account?",
    createAccount: "Create Account",
    username: "Username",
    usernamePlaceholder: "Enter your username",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember Me",
    login: "Log in",
    processing: "Processing...",
    advancedOptions: "Advanced options",
    errors: {
      required: "This field is required",
      invalidCredentials: "Login failed. Please check your username and password.",
      serverError: "An error occurred during login. Please try again."
    }
  },
  // Admin translations
  admin: {
    sidebar: {
      dashboard: "Dashboard",
      account: "Account",
      vaccine: "Vaccine",
      combo: "Vaccine Combo",
      workSchedule: "Work Schedule",
      protocol: "Protocol Management",
      returnHome: "Return to Home"
    },
    dashboard: {
      title: "Dashboard",
      totalAccounts: "Total Accounts",
      totalVaccines: "Total Vaccines",
      totalBookings: "Total Bookings",
      totalSales: "Total Sales ($)",
      registeredAccounts: "Registered Accounts",
      manageAccounts: "Manage Accounts",
      staffTable: "Staff Table",
      scheduling: "Scheduling",
      vaccineInventory: "Vaccine Inventory",
      manageVaccines: "Manage Vaccines",
      topVaccine: "Top Vaccine",
      comboTable: "Combo Table",
      manageCombos: "Manage Combos",
      noData: "No data"
    },
    account: {
      title: "Account Management",
      addAccount: "Add Account",
      createDescription: "Create a new account for staff members with appropriate role access",
      manageAccounts: "Manage Accounts",
      searchPlaceholder: "Search accounts...",
      id: "ID",
      accountID: "AccountID",
      fullName: "Full Name",
      username: "Username",
      gender: "Gender",
      email: "Email",
      phoneNumber: "Phone Number",
      address: "Address",
      role: "Role",
      status: "Status",
      actions: "Actions",
      updateRole: "Update Role",
      deactivate: "Deactivate",
      activate: "Activate",
      active: "Active",
      inactive: "Inactive",
      makeAdmin: "Make Admin",
      makeStaff: "Make Staff",
      noAccounts: "No accounts found",
      showing: "Showing",
      of: "of",
      items: "items"
    },
    vaccine: {
      title: "Vaccine Management",
      addVaccine: "Add New Vaccine",
      vaccineName: "Vaccine Name",
      manufacturer: "Manufacturer",
      sortBy: "Sort By",
      id: "ID",
      image: "Image",
      description: "Description",
      quantity: "Quantity",
      unitPrice: "Unit Price ($)",
      salePrice: "Sale Price ($)",
      totalDoses: "Total Doses",
      status: "Status",
      actions: "Actions",
      protocol: "Protocol",
      edit: "Edit",
      delete: "Delete",
      available: "Available",
      outOfStock: "Out of Stock",
      disabled: "Disabled",
      noVaccines: "No vaccines found"
    },
    combo: {
      title: "Combo Vaccine Management",
      addCombo: "Add New Combo",
      comboName: "Combo Name",
      category: "Category",
      sortBy: "Sort By",
      id: "ID",
      comboCategory: "Combo Category",
      description: "Description",
      includedVaccine: "Included Vaccine",
      vaccineManufacturer: "Vaccine Manufacturer",
      vaccineDose: "Vaccine Dose",
      saleOff: "Sale Off",
      totalPrice: "Total Price",
      noResults: "No Result"
    },
    protocol: {
      title: "Protocol Management",
      addProtocol: "Add New Protocol",
      id: "ID",
      protocolName: "Protocol Name",
      description: "Description",
      totalDoses: "Total Doses",
      actions: "Actions",
      viewDetails: "View Details",
      delete: "Delete",
      noProtocols: "No protocols found"
    },
    workSchedule: {
      title: "Staff Work Schedule",
      addWork: "Add Work Schedule",
      selectMonth: "Select Month",
      selectYear: "Select Year",
      refreshSchedule: "Refresh Schedule",
      loading: "Loading schedules...",
      staff: "Staff",
      noSchedules: "No schedules found for"
    },
    common: {
      first: "First",
      prev: "Prev",
      next: "Next",
      last: "Last",
      search: "Search",
      sort: "Sort"
    }
  },
  navbar: {
    language: "Language",
    login: "Login",
    register: "Register",
    logout: "Logout"
  },
  vaccines: {
    list_title: "Vaccine List",
    search_placeholder: "Search vaccines...",
    price: "Price",
    view_details: "View Details",
    no_results: "No results found for",
    no_data: "No data retrieved.",
    check_connection: "Please check your network connection."
  },
  vaccine_detail: {
    manufacturer: "Manufacturer",
    price: "Price",
    description: "Description",
    category: "Category",
    dosage: "Dosage",
    contraindications: "Contraindications",
    precautions: "Precautions",
    interactions: "Interactions",
    adverse_reactions: "Adverse Reactions",
    storage_conditions: "Storage Conditions",
    recommended_for: "Recommended For",
    pre_vaccination: "Pre-Vaccination Information",
    compatibility: "Compatibility",
    not_found: "Vaccine not found",
    not_found_message: "The requested vaccine information could not be found."
  },
  price_list: {
    title: "Vaccination Price List and Payment Methods",
    vaccine_prices: "Vaccination Price List",
    vaccine_name: "Vaccine Name",
    origin: "Origin",
    price_per_dose: "Price/Dose ($)",
    status: "Status",
    available: "Available",
    unavailable: "Unavailable",
    no_data: "No data available",
    payment_methods: "Payment Methods",
    payment_cash: "Cash payment at the cashier.",
    payment_card: "Payment by credit card.",
    payment_ecommerce: "Payment via e-commerce applications, mobile payment services, VNPAY-QR e-wallets, Momo, etc."
  },
  resetPassword: {
    title: "Reset your VaccineCare Password",
    heading: "Reset Password",
    subtitle: "Enter your email and we'll send you an OTP code to reset your password",
    emailPlaceholder: "Enter your email address",
    newPassword: "New Password",
    newPasswordPlaceholder: "Enter new password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm your password",
    sendButton: "Send Request",
    resetButton: "Reset Password",
    backToLogin: "Back to Login",
    processing: "Processing...",
    otpSent: "OTP code sent to your email",
    success: "Password reset successful! Redirecting to login...",
    errors: {
      required: "This field is required",
      invalidEmail: "Invalid email address",
      emailNotFound: "Email not found in our system",
      passwordLength: "Password must be at least 8 characters",
      passwordRequirements: "Password must include lowercase, uppercase, number, and special character",
      passwordMatch: "Passwords do not match",
      serverError: "Server error. Please try again later.",
      resetFailed: "Password reset failed. Please try again.",
      tokenMissing: "Reset token is missing. Please try again."
    }
  },
  verifyOTP: {
    title: "Verify OTP",
    heading: "Enter Verification Code",
    subtitle: "Enter the verification code sent to",
    verifyButton: "Verify",
    resendOTP: "Resend OTP",
    resendCountdown: "Resend in {seconds}s",
    backToLogin: "Back to Login",
    verifying: "Verifying...",
    resending: "Resending...",
    errors: {
      required: "Please enter the complete OTP code",
      invalidOTP: "Invalid OTP code. Please try again.",
      expired: "OTP code has expired. Please request a new one.",
      serverError: "Server error. Please try again later.",
      resendFailed: "Failed to resend OTP. Please try again."
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
    bookingAppointment: 'Đặt lịch hẹn tiêm',
    orderVaccine: 'Đặt mua vắc xin',
    login: 'Đăng nhập',
    signup: 'Đăng ký',
    register: 'Đăng ký',
    profile: 'Thông tin cá nhân',
    tagline: 'HỆ THỐNG TIÊM CHỦNG TOÀN QUỐC',
    staffPortal: 'Cổng Nhân Viên',
    children: 'Trẻ của bạn',
    schedule: 'Lịch tiêm của bạn',
    history: 'Lịch sử tiêm',
    logout: 'Đăng xuất',
    dashboard: 'Bảng điều khiển'
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
    },
    banner1: {
      title: "Tiêm chủng an toàn cho trẻ em",
      description: "Bảo vệ sức khỏe trẻ em từ những ngày đầu đời",
      cta: "Đặt lịch tiêm ngay"
    },
    banner2: {
      title: "Phòng ngừa bệnh sốt xuất huyết",
      description: "Tiêm vắc xin Qdenga ngừa sốt xuất huyết hiệu quả đến 80%",
      cta: "Tìm hiểu thêm"
    },
    banner3: {
      title: "Gói vắc xin tiết kiệm",
      description: "Tiết kiệm đến 25% với các gói vắc xin combo",
      cta: "Xem gói vắc xin"
    },
    about: {
      title: "Hệ Thống Tiêm Chủng An Toàn",
      description: "Chúng tôi cung cấp dịch vụ tiêm chủng chất lượng cao với đội ngũ y bác sĩ chuyên nghiệp và hệ thống bảo quản vắc xin hiện đại đạt chuẩn của Bộ Y tế.",
      image_alt: "Trung tâm tiêm chủng",
      feature1: {
        title: "Vắc xin chính hãng",
        description: "100% vắc xin nhập khẩu chính hãng"
      },
      feature2: {
        title: "Đạt chuẩn quốc tế",
        description: "Quy trình tiêm chủng WHO"
      }
    },
    services: {
      title: "Dịch Vụ Của Chúng Tôi",
      booking: {
        title: "Đặt Lịch Tiêm Chủng",
        description: "Đặt lịch tiêm chủng dễ dàng, nhanh chóng và thuận tiện",
        button: "Đặt lịch ngay"
      },
      combos: {
        title: "Gói Vắc Xin",
        description: "Tiết kiệm chi phí với các gói vắc xin phòng ngừa bệnh đa dạng",
        button: "Xem gói vắc xin"
      },
      reminders: {
        title: "Nhắc Lịch Tiêm",
        description: "Nhận thông báo nhắc lịch tiêm chủng cho bạn và gia đình",
        button: "Đăng ký nhận"
      },
      history: {
        title: "Lịch Sử Tiêm Chủng",
        description: "Theo dõi lịch sử tiêm chủng của trẻ dễ dàng và thuận tiện",
        button: "Xem lịch sử"
      }
    },
    featured: {
      title: "Vắc Xin & Gói Tiêm Nổi Bật",
      error_message: "Hiển thị dữ liệu demo cho mục đích trình bày.",
      single_vaccines: "Vắc Xin Đơn Lẻ",
      combo_packages: "Gói Vắc Xin",
      loading_vaccines: "Đang tải dữ liệu vắc xin...",
      loading_combos: "Đang tải dữ liệu gói vắc xin...",
      view_details: "Xem Chi Tiết",
      view_package: "Xem Chi Tiết",
      view_all_vaccines: "Xem Tất Cả Vắc Xin"
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
    title: "Đăng ký tài khoản",
    subtitle: "Tạo tài khoản để sử dụng đầy đủ tính năng và đặt lịch tiêm chủng",
    haveAccount: "Đã có tài khoản?",
    loginLink: "Đăng nhập",
    createAccount: "Tạo tài khoản VaccineCare",
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
      serverError: "Lỗi máy chủ. Vui lòng thử lại sau.",
      firstNameLength: "Họ không được quá 100 ký tự",
      lastNameLength: "Tên không được quá 100 ký tự",
      emailLength: "Email không được quá 50 ký tự",
      invalidGender: "Vui lòng chọn giới tính hợp lệ"
    },
    success: {
      title: "Đăng ký thành công!",
      redirecting: "Đang chuyển hướng đến trang đăng nhập..."
    },
    steps: {
      accountInfo: "Thông tin tài khoản",
      accountDesc: "Tạo thông tin đăng nhập",
      personalInfo: "Thông tin cá nhân",
      personalDesc: "Cho chúng tôi biết về bạn",
      next: "Tiếp tục",
      back: "Quay lại",
      create: "Tạo tài khoản",
      cancel: "Hủy bỏ"
    },
    address: "Địa chỉ",
    addressPlaceholder: "Nhập địa chỉ của bạn"
  },
  login: {
    title: "Đăng nhập vào tài khoản VaccineCare",
    heading: "Đăng nhập",
    noAccount: "Bạn chưa có tài khoản?",
    createAccount: "Tạo tài khoản",
    username: "Tên đăng nhập",
    usernamePlaceholder: "Nhập tên đăng nhập của bạn",
    password: "Mật khẩu",
    passwordPlaceholder: "Nhập mật khẩu của bạn",
    forgotPassword: "Quên mật khẩu?",
    rememberMe: "Ghi nhớ đăng nhập",
    login: "Đăng nhập",
    processing: "Đang xử lý...",
    advancedOptions: "Tùy chọn nâng cao",
    errors: {
      required: "Trường này là bắt buộc",
      invalidCredentials: "Đăng nhập thất bại. Vui lòng kiểm tra tên đăng nhập và mật khẩu.",
      serverError: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại."
    }
  },
  // Admin translations - Vietnamese
  admin: {
    sidebar: {
      dashboard: "Bảng điều khiển",
      account: "Tài khoản",
      vaccine: "Vắc xin",
      combo: "Gói vắc xin",
      workSchedule: "Lịch làm việc",
      protocol: "Quản lý quy trình",
      returnHome: "Quay về trang chủ"
    },
    dashboard: {
      title: "Bảng điều khiển",
      totalAccounts: "Tổng số tài khoản",
      totalVaccines: "Tổng số vắc xin",
      totalBookings: "Tổng số lịch hẹn",
      totalSales: "Tổng doanh thu (₫)",
      registeredAccounts: "Tài khoản đã đăng ký",
      manageAccounts: "Quản lý tài khoản",
      staffTable: "Bảng nhân viên",
      scheduling: "Lịch trình",
      vaccineInventory: "Kho vắc xin",
      manageVaccines: "Quản lý vắc xin",
      topVaccine: "Vắc xin hàng đầu",
      comboTable: "Bảng gói vắc xin",
      manageCombos: "Quản lý gói",
      noData: "Không có dữ liệu"
    },
    account: {
      title: "Quản lý tài khoản",
      addAccount: "Thêm tài khoản",
      createDescription: "Tạo tài khoản mới cho nhân viên với quyền truy cập phù hợp",
      manageAccounts: "Quản lý tài khoản",
      searchPlaceholder: "Tìm kiếm tài khoản...",
      id: "Mã",
      accountID: "Mã tài khoản",
      fullName: "Họ và tên",
      username: "Tên đăng nhập",
      gender: "Giới tính",
      email: "Email",
      phoneNumber: "Số điện thoại",
      address: "Địa chỉ",
      role: "Vai trò",
      status: "Trạng thái",
      actions: "Thao tác",
      updateRole: "Cập nhật vai trò",
      deactivate: "Vô hiệu hóa",
      activate: "Kích hoạt",
      active: "Hoạt động",
      inactive: "Không hoạt động",
      makeAdmin: "Đặt làm Admin",
      makeStaff: "Đặt làm Nhân viên",
      noAccounts: "Không tìm thấy tài khoản nào",
      showing: "Hiển thị",
      of: "trong tổng số",
      items: "mục"
    },
    vaccine: {
      title: "Quản lý vắc xin",
      addVaccine: "Thêm vắc xin mới",
      vaccineName: "Tên vắc xin",
      manufacturer: "Nhà sản xuất",
      sortBy: "Sắp xếp theo",
      id: "Mã",
      image: "Hình ảnh",
      description: "Mô tả",
      quantity: "Số lượng",
      unitPrice: "Đơn giá (₫)",
      salePrice: "Giá bán (₫)",
      totalDoses: "Tổng liều",
      status: "Trạng thái",
      actions: "Thao tác",
      protocol: "Quy trình",
      edit: "Sửa",
      delete: "Xóa",
      available: "Có sẵn",
      outOfStock: "Hết hàng",
      disabled: "Vô hiệu",
      noVaccines: "Không tìm thấy vắc xin nào"
    },
    combo: {
      title: "Quản lý gói vắc xin",
      addCombo: "Thêm gói mới",
      comboName: "Tên gói",
      category: "Danh mục",
      sortBy: "Sắp xếp theo",
      id: "Mã",
      comboCategory: "Danh mục gói",
      description: "Mô tả",
      includedVaccine: "Vắc xin bao gồm",
      vaccineManufacturer: "Nhà sản xuất vắc xin",
      vaccineDose: "Liều vắc xin",
      saleOff: "Giảm giá",
      totalPrice: "Tổng giá",
      noResults: "Không có kết quả"
    },
    protocol: {
      title: "Quản lý quy trình",
      addProtocol: "Thêm quy trình mới",
      id: "Mã",
      protocolName: "Tên quy trình",
      description: "Mô tả",
      totalDoses: "Tổng liều",
      actions: "Thao tác",
      viewDetails: "Xem chi tiết",
      delete: "Xóa",
      noProtocols: "Không tìm thấy quy trình nào"
    },
    workSchedule: {
      title: "Lịch làm việc nhân viên",
      addWork: "Thêm lịch làm việc",
      selectMonth: "Chọn tháng",
      selectYear: "Chọn năm",
      refreshSchedule: "Làm mới lịch",
      loading: "Đang tải lịch làm việc...",
      staff: "Nhân viên",
      noSchedules: "Không tìm thấy lịch làm việc nào cho"
    },
    common: {
      first: "Đầu",
      prev: "Trước",
      next: "Tiếp",
      last: "Cuối",
      search: "Tìm kiếm",
      sort: "Sắp xếp"
    }
  },
  navbar: {
    language: "Ngôn ngữ",
    login: "Đăng nhập",
    register: "Đăng ký",
    logout: "Đăng xuất"
  },
  vaccines: {
    list_title: "Danh sách vắc xin",
    search_placeholder: "Tìm kiếm vắc xin...",
    price: "Giá",
    view_details: "Xem chi tiết",
    no_results: "Không tìm thấy kết quả cho",
    no_data: "Không có dữ liệu.",
    check_connection: "Vui lòng kiểm tra kết nối mạng."
  },
  vaccine_detail: {
    manufacturer: "Nhà sản xuất",
    price: "Giá",
    description: "Mô tả",
    category: "Loại",
    dosage: "Liều lượng",
    contraindications: "Chống chỉ định",
    precautions: "Lưu ý",
    interactions: "Tương tác",
    adverse_reactions: "Phản ứng phụ",
    storage_conditions: "Điều kiện bảo quản",
    recommended_for: "Khuyến nghị cho",
    pre_vaccination: "Thông tin trước khi tiêm",
    compatibility: "Tương thích",
    not_found: "Không tìm thấy vắc xin",
    not_found_message: "Thông tin vắc xin được yêu cầu không thể tìm thấy."
  },
  price_list: {
    title: "Bảng Giá Tiêm Chủng và Phương Thức Thanh Toán",
    vaccine_prices: "Bảng Giá Vắc Xin",
    vaccine_name: "Tên Vắc Xin",
    origin: "Xuất xứ",
    price_per_dose: "Giá/Liều ($)",
    status: "Trạng thái",
    available: "Có sẵn",
    unavailable: "Không có sẵn",
    no_data: "Không có dữ liệu",
    payment_methods: "Phương Thức Thanh Toán",
    payment_cash: "Thanh toán tiền mặt tại quầy thu ngân.",
    payment_card: "Thanh toán bằng thẻ tín dụng.",
    payment_ecommerce: "Thanh toán qua các ứng dụng thương mại điện tử, dịch vụ thanh toán di động, ví điện tử VNPAY-QR, Momo, v.v."
  },
  resetPassword: {
    title: "Đặt lại mật khẩu VaccineCare",
    heading: "Đặt lại mật khẩu",
    subtitle: "Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu",
    emailPlaceholder: "Nhập địa chỉ email của bạn",
    newPassword: "Mật khẩu mới",
    newPasswordPlaceholder: "Nhập mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu",
    confirmPasswordPlaceholder: "Xác nhận mật khẩu của bạn",
    sendButton: "Gửi yêu cầu",
    resetButton: "Đặt lại mật khẩu",
    backToLogin: "Quay lại đăng nhập",
    processing: "Đang xử lý...",
    otpSent: "Mã OTP đã được gửi đến email của bạn",
    success: "Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...",
    errors: {
      required: "Trường này là bắt buộc",
      invalidEmail: "Địa chỉ email không hợp lệ",
      emailNotFound: "Không tìm thấy email trong hệ thống",
      passwordLength: "Mật khẩu phải có ít nhất 8 ký tự",
      passwordRequirements: "Mật khẩu phải bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt",
      passwordMatch: "Mật khẩu không khớp",
      serverError: "Lỗi máy chủ. Vui lòng thử lại sau.",
      resetFailed: "Đặt lại mật khẩu thất bại. Vui lòng thử lại.",
      tokenMissing: "Thiếu token đặt lại. Vui lòng thử lại."
    }
  },
  verifyOTP: {
    title: "Xác thực OTP",
    heading: "Nhập mã xác thực",
    subtitle: "Nhập mã xác thực đã gửi đến",
    verifyButton: "Xác thực",
    resendOTP: "Gửi lại OTP",
    resendCountdown: "Gửi lại sau {seconds}s",
    backToLogin: "Quay lại đăng nhập",
    verifying: "Đang xác thực...",
    resending: "Đang gửi lại...",
    errors: {
      required: "Vui lòng nhập đầy đủ mã OTP",
      invalidOTP: "Mã OTP không hợp lệ. Vui lòng thử lại.",
      expired: "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.",
      serverError: "Lỗi máy chủ. Vui lòng thử lại sau.",
      resendFailed: "Gửi lại OTP thất bại. Vui lòng thử lại."
    }
  }
};

// Thêm hàm an toàn để đọc từ localStorage với try-catch đầy đủ
const getSafeLanguage = () => {
  try {
    // Sử dụng try-catch để tránh lỗi khi truy cập localStorage
    const storedLang = localStorage.getItem('language');
    if (storedLang && typeof storedLang === 'string') {
      return storedLang;
    }
    return 'vi'; // Mặc định tiếng Việt
  } catch (error) {
    console.error('Error accessing language from localStorage:', error);
    return 'vi';
  }
};

// Đảm bảo i18n được khởi tạo an toàn
try {
  // Initialize i18next
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        vi: { translation: viTranslations }
      },
      lng: getSafeLanguage(),
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false // React already safes from XSS
      }
    });
} catch (error) {
  console.error('Error initializing i18n:', error);
}

export default i18n; 