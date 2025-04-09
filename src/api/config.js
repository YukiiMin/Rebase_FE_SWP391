// Base URL configuration
const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:8080"

// Log the base URL for debugging
console.log("API Base URL:", API_BASE_URL);

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    introspect: `${API_BASE_URL}/auth/introspect`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
    resendOtp: `${API_BASE_URL}/auth/resend-otp`,
  },

  // User endpoints
  users: {
    register: `${API_BASE_URL}/users/register`,
    createStaff: `${API_BASE_URL}/users/staff`,
    update: (accountId) => `${API_BASE_URL}/users/${accountId}`,
    getAll: `${API_BASE_URL}/users/getAllUser`,
    getById: (accountId) => `${API_BASE_URL}/users/${accountId}`,
    getMyInfo: `${API_BASE_URL}/users/myInfo`,
    getChildren: (accountId) => `${API_BASE_URL}/users/${accountId}/children`,
    activate: (accountId) => `${API_BASE_URL}/users/${accountId}/active`,
    deactivate: (accountId) => `${API_BASE_URL}/users/${accountId}/inactive`,
  },

  // Children endpoints
  children: {
    create: (accountId) => `${API_BASE_URL}/children/${accountId}/create`,
    update: (childId) => `${API_BASE_URL}/children/${childId}`,
    getByName: (name) => `${API_BASE_URL}/children/${name}`,
    activate: (childId) => `${API_BASE_URL}/children/${childId}/active`,
    deactivate: (childId) => `${API_BASE_URL}/children/${childId}/inactive`,
  },

  // Booking endpoints
  bookings: {
    create: (childId) => `${API_BASE_URL}/api/bookings/child/${childId}`,
    getAll: `${API_BASE_URL}/api/bookings/`,
    getById: (bookingId) => `${API_BASE_URL}/api/bookings/${bookingId}`,
    update: (bookingId) => `${API_BASE_URL}/api/bookings/${bookingId}`,
    checkIn: (bookingId) => `${API_BASE_URL}/api/bookings/${bookingId}/check-in`,
    updatePayment: (bookingId) => `${API_BASE_URL}/api/bookings/${bookingId}/payment`,
    assignStaff: (bookingId, role) => `${API_BASE_URL}/api/bookings/${bookingId}/assign/${role}`,
    recordReaction: (bookingId) => `${API_BASE_URL}/api/bookings/${bookingId}/reaction`,
  },

  // Order endpoints
  orders: {
    create: (bookingId) => `${API_BASE_URL}/order/${bookingId}/create`,
    addDetail: (orderId, vaccineId) => `${API_BASE_URL}/order/${orderId}/addDetail/${vaccineId}`,
    getAll: (bookingId) => `${API_BASE_URL}/order/${bookingId}/all`,
    addCombo: (orderId, comboId) => `${API_BASE_URL}/order/${orderId}/addCombo/${comboId}`,
    complete: (orderId) => `${API_BASE_URL}/order/${orderId}/done`,
    reject: (orderId) => `${API_BASE_URL}/order/${orderId}/rejected`,
  },

  // Payment endpoints
  payments: {
    createIntent: (orderId) => `${API_BASE_URL}/payment/${orderId}/create-intent`,
    confirm: (orderId) => `${API_BASE_URL}/payment/${orderId}/confirm`,
  },

  // Vaccination endpoints
  vaccination: {
    recordDiagnosis: (bookingId, doctorId) => `${API_BASE_URL}/api/vaccination/diagnosis/${bookingId}/${doctorId}`,
    recordInjection: (bookingId, nurseId) => `${API_BASE_URL}/api/vaccination/inject/${bookingId}/${nurseId}`,
    createNextSchedule: (bookingId) => `${API_BASE_URL}/api/vaccination/schedule/next/${bookingId}`,
    completeDiagnosis: (diagnosisId, doctorId) =>
      `${API_BASE_URL}/api/vaccination/diagnosis/${diagnosisId}/${doctorId}/complete`,
  },

  // Working schedule endpoints
  working: {
    createSchedule: `${API_BASE_URL}/working/api/schedules`,
    addStaff: `${API_BASE_URL}/working/api/schedules/add-staff`,
    getSchedules: `${API_BASE_URL}/working/api/schedules/all`,
    getAllWorkingDates: `${API_BASE_URL}/working/api/working-dates/all`,
    getStaffSchedule: (staffId) => `${API_BASE_URL}/working/api/staff/${staffId}/schedule`,
  },

  // Vaccine endpoints
  vaccine: {
    addCategory: `${API_BASE_URL}/vaccine/category/add`,
    getAllCategories: `${API_BASE_URL}/vaccine/categories`,
    add: (categoryId) => `${API_BASE_URL}/vaccine/add/${categoryId}`,
    getAll: `${API_BASE_URL}/vaccine/get`,
    getById: (id) => `${API_BASE_URL}/vaccine/get/${id}`,
    addCombo: `${API_BASE_URL}/vaccine/addCombo`,
    addComboDetail: (vaccineId, comboId) => `${API_BASE_URL}/vaccine/addDetailCombo/${vaccineId}/${comboId}`,
    getCombos: `${API_BASE_URL}/vaccine/combo`,
    getComboById: (id) => `${API_BASE_URL}/vaccine/combo/${id}`,
    getComboDetails: `${API_BASE_URL}/vaccine/comboDetails`,
    searchComboByCategory: (category) => `${API_BASE_URL}/vaccine/search/${category}`,
    addProtocol: `${API_BASE_URL}/vaccine/protocol/add`,
    getAllProtocols: `${API_BASE_URL}/vaccine/protocols`,
    getProtocolById: (protocolId) => `${API_BASE_URL}/vaccine/protocol/${protocolId}`,
    addVaccineToProtocol: (protocolId, vaccineId) =>
      `${API_BASE_URL}/vaccine/protocol/${protocolId}/addVaccine/${vaccineId}`,
    getProtocolDoseByVaccine: (vaccineId) => `${API_BASE_URL}/vaccine/protocol/dose/${vaccineId}`,
    activateVaccine: (vaccineId) => `${API_BASE_URL}/vaccine/${vaccineId}/active`,
    deactivateVaccine: (vaccineId) => `${API_BASE_URL}/vaccine/${vaccineId}/deactive-vaccine`,
    deactivateCombo: (comboId) => `${API_BASE_URL}/vaccine/${comboId}/deactive-combo`,
    activateCombo: (comboId) => `${API_BASE_URL}/vaccine/${comboId}/active-combo`,
  },
}

