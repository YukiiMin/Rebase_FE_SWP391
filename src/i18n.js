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
      noAccounts: "No accounts found"
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
      noAccounts: "Không tìm thấy tài khoản nào"
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