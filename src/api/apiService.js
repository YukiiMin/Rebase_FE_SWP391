import axios from "axios"
import { API_ENDPOINTS } from "./config"

// Create axios instance with default config
const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Get refresh token from storage
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // Call refresh token endpoint
        const response = await axios.post(API_ENDPOINTS.auth.refresh, {
          refreshToken,
        })

        // Update tokens in storage
        const { accessToken, refreshToken: newRefreshToken } = response.data.result
        localStorage.setItem("token", accessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// API service methods
const apiService = {
  // Auth methods
  auth: {
    login: (data) => apiClient.post(API_ENDPOINTS.auth.login, data),
    logout: (data) => apiClient.post(API_ENDPOINTS.auth.logout, data),
    refreshToken: (data) => apiClient.post(API_ENDPOINTS.auth.refresh, data),
    forgotPassword: (data) => apiClient.post(API_ENDPOINTS.auth.forgotPassword, data),
    resetPassword: (data) => apiClient.post(API_ENDPOINTS.auth.resetPassword, data),
    verifyOtp: (data) => apiClient.post(API_ENDPOINTS.auth.verifyOtp, data),
    resendOtp: (data) => apiClient.post(API_ENDPOINTS.auth.resendOtp, data),
  },

  // User methods
  users: {
    register: (data) => apiClient.post(API_ENDPOINTS.users.register, data),
    createStaff: (data) => apiClient.post(API_ENDPOINTS.users.createStaff, data),
    update: (accountId, data) => apiClient.patch(API_ENDPOINTS.users.update(accountId), data),
    getAll: () => apiClient.get(API_ENDPOINTS.users.getAll),
    getById: (accountId) => apiClient.get(API_ENDPOINTS.users.getById(accountId)),
    getMyInfo: () => apiClient.get(API_ENDPOINTS.users.getMyInfo),
    getChildren: (accountId) => apiClient.get(API_ENDPOINTS.users.getChildren(accountId)),
    activate: (accountId) => apiClient.put(API_ENDPOINTS.users.activate(accountId)),
    deactivate: (accountId) => apiClient.put(API_ENDPOINTS.users.deactivate(accountId)),
  },

  // Children methods
  children: {
    create: (accountId, data) => apiClient.post(API_ENDPOINTS.children.create(accountId), data),
    update: (childId, data) => apiClient.patch(API_ENDPOINTS.children.update(childId), data),
    getByName: (name) => apiClient.get(API_ENDPOINTS.children.getByName(name)),
    activate: (childId) => apiClient.put(API_ENDPOINTS.children.activate(childId)),
    deactivate: (childId) => apiClient.put(API_ENDPOINTS.children.deactivate(childId)),
  },

  // Booking methods
  bookings: {
    create: (childId, data) => apiClient.post(API_ENDPOINTS.bookings.create(childId), data),
    getAll: () => apiClient.get(API_ENDPOINTS.bookings.getAll),
    getById: (bookingId) => apiClient.get(API_ENDPOINTS.bookings.getById(bookingId)),
    update: (bookingId, data) => apiClient.put(API_ENDPOINTS.bookings.update(bookingId), data),
    checkIn: (bookingId) => apiClient.put(API_ENDPOINTS.bookings.checkIn(bookingId)),
    updatePayment: (bookingId) => apiClient.put(API_ENDPOINTS.bookings.updatePayment(bookingId)),
    assignStaff: (bookingId, role, date) =>
      apiClient.post(API_ENDPOINTS.bookings.assignStaff(bookingId, role), null, {
        params: { bookingDate: date },
      }),
    recordReaction: (bookingId, data) => apiClient.post(API_ENDPOINTS.bookings.recordReaction(bookingId), data),
  },

  // Order methods
  orders: {
    create: (bookingId, data) => apiClient.post(API_ENDPOINTS.orders.create(bookingId), data),
    addDetail: (orderId, vaccineId, data) => apiClient.post(API_ENDPOINTS.orders.addDetail(orderId, vaccineId), data),
    getAll: (bookingId) => apiClient.get(API_ENDPOINTS.orders.getAll(bookingId)),
    addCombo: (orderId, comboId) => apiClient.get(API_ENDPOINTS.orders.addCombo(orderId, comboId)),
    complete: (orderId) => apiClient.put(API_ENDPOINTS.orders.complete(orderId)),
    reject: (orderId) => apiClient.put(API_ENDPOINTS.orders.reject(orderId)),
  },

  // Payment methods
  payments: {
    createIntent: (orderId, data) => apiClient.post(API_ENDPOINTS.payments.createIntent(orderId), data),
    confirm: (orderId, data) => apiClient.post(API_ENDPOINTS.payments.confirm(orderId), data),
  },

  // Vaccination methods
  vaccination: {
    recordDiagnosis: (bookingId, doctorId, data) =>
      apiClient.post(API_ENDPOINTS.vaccination.recordDiagnosis(bookingId, doctorId), data),
    recordInjection: (bookingId, nurseId, data) =>
      apiClient.post(API_ENDPOINTS.vaccination.recordInjection(bookingId, nurseId), data),
    createNextSchedule: (bookingId) => apiClient.post(API_ENDPOINTS.vaccination.createNextSchedule(bookingId)),
    completeDiagnosis: (diagnosisId, doctorId, data) =>
      apiClient.put(API_ENDPOINTS.vaccination.completeDiagnosis(diagnosisId, doctorId), data),
  },

  // Working schedule methods
  working: {
    createSchedule: (data) => {
      console.log("API Service: Creating schedule with data:", data);
      return apiClient.post(API_ENDPOINTS.working.createSchedule, data);
    },
    addStaff: (data) => {
      console.log("API Service: Adding staff with data:", data);
      return apiClient.post(API_ENDPOINTS.working.addStaff, data);
    },
    getSchedules: (startDate, endDate) =>
      apiClient.get(API_ENDPOINTS.working.getSchedules, {
        params: { startDate, endDate },
      }),
    getAvailableDates: (startDate, endDate) =>
      apiClient.get(API_ENDPOINTS.working.getAvailableDates, {
        params: { startDate, endDate },
      }),
    getAllWorkingDates: () =>
      apiClient.get(API_ENDPOINTS.working.getAllWorkingDates),
    getStaffSchedule: (staffId, startDate, endDate) =>
      apiClient.get(API_ENDPOINTS.working.getStaffSchedule(staffId), {
        params: { startDate, endDate },
      }),
  },

  // Vaccine methods
  vaccine: {
    addCategory: (data) => apiClient.post(API_ENDPOINTS.vaccine.addCategory, data),
    getAllCategories: () => apiClient.get(API_ENDPOINTS.vaccine.getAllCategories),
    add: (categoryId, data) => apiClient.post(API_ENDPOINTS.vaccine.add(categoryId), data),
    getAll: () => apiClient.get(API_ENDPOINTS.vaccine.getAll),
    addCombo: (data) => apiClient.post(API_ENDPOINTS.vaccine.addCombo, data),
    addComboDetail: (vaccineId, comboId, data) =>
      apiClient.post(API_ENDPOINTS.vaccine.addComboDetail(vaccineId, comboId), data),
    getCombos: () => apiClient.get(API_ENDPOINTS.vaccine.getCombos),
    getComboDetails: () => apiClient.get(API_ENDPOINTS.vaccine.getComboDetails),
    addProtocol: (data) => apiClient.post(API_ENDPOINTS.vaccine.addProtocol, data),
    getAllProtocols: () => apiClient.get(API_ENDPOINTS.vaccine.getAllProtocols),
    getProtocolById: (protocolId) => apiClient.get(API_ENDPOINTS.vaccine.getProtocolById(protocolId)),
    addVaccineToProtocol: (vaccineId, protocolId) =>
      apiClient.post(API_ENDPOINTS.vaccine.addVaccineToProtocol(vaccineId, protocolId)),
    getProtocolDoseByVaccine: (vaccineId) => apiClient.get(API_ENDPOINTS.vaccine.getProtocolDoseByVaccine(vaccineId)),
    activateVaccine: (vaccineId) => apiClient.put(API_ENDPOINTS.vaccine.activateVaccine(vaccineId)),
    deactivateVaccine: (vaccineId) => apiClient.put(API_ENDPOINTS.vaccine.deactivateVaccine(vaccineId)),
    deactivateCombo: (comboId) => apiClient.put(API_ENDPOINTS.vaccine.deactivateCombo(comboId)),
    activateCombo: (comboId) => apiClient.put(API_ENDPOINTS.vaccine.activateCombo(comboId)),
  },
}

export default apiService

