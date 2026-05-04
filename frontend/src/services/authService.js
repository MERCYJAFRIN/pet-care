import axiosInstance from './api';

export const authService = {
  register: (email, password, firstName, lastName, phone, role = 'user', certificateNumber = '') =>
    axiosInstance.post('/auth/register', { email, password, firstName, lastName, phone, role, certificateNumber }),

  login: (email, password) =>
    axiosInstance.post('/auth/login', { email, password }),

  getProfile: () =>
    axiosInstance.get('/auth/profile'),

  updateProfile: (profileData) =>
    axiosInstance.put('/auth/profile', profileData),
};

export const doctorService = {
  getAllDoctors: () =>
    axiosInstance.get('/doctors/all'),

  getDoctorById: (id) =>
    axiosInstance.get(`/doctors/${id}`),

  getDoctorProfile: () =>
    axiosInstance.get('/doctors/profile/me'),

  updateDoctorProfile: (doctorData) =>
    axiosInstance.put('/doctors/profile/update', doctorData),
};

export const petService = {
  createPet: (petData) =>
    axiosInstance.post('/pets', petData),

  getPets: () =>
    axiosInstance.get('/pets'),

  getPetById: (petId) =>
    axiosInstance.get(`/pets/${petId}`),

  updatePet: (petId, petData) =>
    axiosInstance.put(`/pets/${petId}`, petData),

  deletePet: (petId) =>
    axiosInstance.delete(`/pets/${petId}`),
};

export const appointmentService = {
  createAppointment: (appointmentData) =>
    axiosInstance.post('/appointments', appointmentData),

  getAppointments: () =>
    axiosInstance.get('/appointments'),

  getAppointmentById: (appointmentId) =>
    axiosInstance.get(`/appointments/${appointmentId}`),

  updateAppointment: (appointmentId, appointmentData) =>
    axiosInstance.put(`/appointments/${appointmentId}`, appointmentData),

  deleteAppointment: (appointmentId) =>
    axiosInstance.delete(`/appointments/${appointmentId}`),

  // Doctor specific methods
  getDoctorAppointments: () =>
    axiosInstance.get('/appointments/doctor/all'),

  updateAppointmentStatusByDoctor: (appointmentId, statusData) =>
    axiosInstance.put(`/appointments/doctor/${appointmentId}/status`, statusData),

  updateMeetLinkByDoctor: (appointmentId, meetLinkData) =>
    axiosInstance.put(`/appointments/doctor/${appointmentId}/meet-link`, meetLinkData),
};

// Vaccination Service
export const vaccinationService = {
  createVaccination: (petId, vaccinationData) =>
    axiosInstance.post(`/pets/${petId}/vaccinations`, vaccinationData),

  getVaccinations: (petId) =>
    axiosInstance.get(`/pets/${petId}/vaccinations`),

  getVaccinationById: (petId, vaccinationId) =>
    axiosInstance.get(`/pets/${petId}/vaccinations/${vaccinationId}`),

  updateVaccination: (petId, vaccinationId, vaccinationData) =>
    axiosInstance.put(`/pets/${petId}/vaccinations/${vaccinationId}`, vaccinationData),

  deleteVaccination: (petId, vaccinationId) =>
    axiosInstance.delete(`/pets/${petId}/vaccinations/${vaccinationId}`),

  getVaccinationReminders: (petId) =>
    axiosInstance.get(`/pets/${petId}/vaccinations/reminders`),
};

// Weight Loss Service
export const weightLossService = {
  createWeightRecord: (petId, weightData) =>
    axiosInstance.post(`/pets/${petId}/weight-loss`, weightData),

  getWeightRecords: (petId, startDate, endDate) =>
    axiosInstance.get(`/pets/${petId}/weight-loss`, { params: { startDate, endDate } }),

  getWeightRecordById: (petId, recordId) =>
    axiosInstance.get(`/pets/${petId}/weight-loss/${recordId}`),

  updateWeightRecord: (petId, recordId, weightData) =>
    axiosInstance.put(`/pets/${petId}/weight-loss/${recordId}`, weightData),

  deleteWeightRecord: (petId, recordId) =>
    axiosInstance.delete(`/pets/${petId}/weight-loss/${recordId}`),

  getWeightTrends: (petId, period = 'month') =>
    axiosInstance.get(`/pets/${petId}/weight-loss/trends`, { params: { period } }),
};

// Medical History Service
export const medicalHistoryService = {
  createMedicalHistory: (petId, medicalData) =>
    axiosInstance.post(`/pets/${petId}/medical-history`, medicalData),

  getMedicalHistory: (petId) =>
    axiosInstance.get(`/pets/${petId}/medical-history`),

  getMedicalHistoryById: (petId, recordId) =>
    axiosInstance.get(`/pets/${petId}/medical-history/${recordId}`),

  updateMedicalHistory: (petId, recordId, medicalData) =>
    axiosInstance.put(`/pets/${petId}/medical-history/${recordId}`, medicalData),

  deleteMedicalHistory: (petId, recordId) =>
    axiosInstance.delete(`/pets/${petId}/medical-history/${recordId}`),

  getMedicalHistoryByCondition: (petId, condition) =>
    axiosInstance.get(`/pets/${petId}/medical-history/condition/${condition}`),

  getMedicalSummary: (petId) =>
    axiosInstance.get(`/pets/${petId}/medical-history/summary`),
};

// Medicine Schedule Service
export const medicineScheduleService = {
  createMedicineSchedule: (petId, scheduleData) =>
    axiosInstance.post(`/pets/${petId}/medicine-schedule`, scheduleData),

  getMedicineSchedules: (petId, status) =>
    axiosInstance.get(`/pets/${petId}/medicine-schedule`, { params: { status } }),

  getMedicineScheduleById: (petId, scheduleId) =>
    axiosInstance.get(`/pets/${petId}/medicine-schedule/${scheduleId}`),

  updateMedicineSchedule: (petId, scheduleId, scheduleData) =>
    axiosInstance.put(`/pets/${petId}/medicine-schedule/${scheduleId}`, scheduleData),

  updateMedicineStatus: (petId, scheduleId, statusData) =>
    axiosInstance.put(`/pets/${petId}/medicine-schedule/${scheduleId}/status`, statusData),

  deleteMedicineSchedule: (petId, scheduleId) =>
    axiosInstance.delete(`/pets/${petId}/medicine-schedule/${scheduleId}`),

  getTodaysMedicines: (petId) =>
    axiosInstance.get(`/pets/${petId}/medicine-schedule/today`),

  getActiveMedicines: (petId) =>
    axiosInstance.get(`/pets/${petId}/medicine-schedule/active`),
};

// Vacation Dates Service
export const vacationDatesService = {
  createVacationDates: (vacationData) =>
    axiosInstance.post('/vacation-dates', vacationData),

  getVacationDates: (status) =>
    axiosInstance.get('/vacation-dates', { params: { status } }),

  getVacationDateById: (vacationId) =>
    axiosInstance.get(`/vacation-dates/${vacationId}`),

  updateVacationDates: (vacationId, vacationData) =>
    axiosInstance.put(`/vacation-dates/${vacationId}`, vacationData),

  deleteVacationDates: (vacationId) =>
    axiosInstance.delete(`/vacation-dates/${vacationId}`),

  getUpcomingVacations: () =>
    axiosInstance.get('/vacation-dates/upcoming'),

  getOngoingVacation: () =>
    axiosInstance.get('/vacation-dates/ongoing'),
};

// Health Reminder Service
export const healthReminderService = {
  createHealthReminder: (petId, reminderData) =>
    axiosInstance.post(`/pets/${petId}/health-reminders`, reminderData),

  getHealthReminders: (petId, reminderType, isActive) =>
    axiosInstance.get(`/pets/${petId}/health-reminders`, { params: { reminderType, isActive } }),

  getHealthReminderById: (petId, reminderId) =>
    axiosInstance.get(`/pets/${petId}/health-reminders/${reminderId}`),

  updateHealthReminder: (petId, reminderId, reminderData) =>
    axiosInstance.put(`/pets/${petId}/health-reminders/${reminderId}`, reminderData),

  deleteHealthReminder: (petId, reminderId) =>
    axiosInstance.delete(`/pets/${petId}/health-reminders/${reminderId}`),

  markReminderCompleted: (petId, reminderId) =>
    axiosInstance.put(`/pets/${petId}/health-reminders/${reminderId}/complete`),

  getUpcomingReminders: (petId) =>
    axiosInstance.get(`/pets/${petId}/health-reminders/upcoming`),

  getOverdueReminders: (petId) =>
    axiosInstance.get(`/pets/${petId}/health-reminders/overdue`),
};

// Health Metrics Service
export const healthMetricsService = {
  createHealthMetric: (petId, metricData) =>
    axiosInstance.post(`/pets/${petId}/health-metrics`, metricData),

  getHealthMetrics: (petId) =>
    axiosInstance.get(`/pets/${petId}/health-metrics`),

  getHealthMetricById: (petId, metricId) =>
    axiosInstance.get(`/pets/${petId}/health-metrics/${metricId}`),

  getLatestHealthMetric: (petId) =>
    axiosInstance.get(`/pets/${petId}/health-metrics/latest`),

  getHealthMetricsDateRange: (petId, startDate, endDate) =>
    axiosInstance.get(`/pets/${petId}/health-metrics/range/data`, {
      params: { startDate, endDate }
    }),

  updateHealthMetric: (petId, metricId, metricData) =>
    axiosInstance.put(`/pets/${petId}/health-metrics/${metricId}`, metricData),

  deleteHealthMetric: (petId, metricId) =>
    axiosInstance.delete(`/pets/${petId}/health-metrics/${metricId}`),
};

// Analytics Service
export const analyticsService = {
  getWeightTrendData: (petId, days = 90) =>
    axiosInstance.get(`/pets/${petId}/analytics/weight-trend`, { params: { days } }),

  getTemperatureTrendData: (petId, days = 30) =>
    axiosInstance.get(`/pets/${petId}/analytics/temperature-trend`, { params: { days } }),

  getVaccinationStatus: (petId) =>
    axiosInstance.get(`/pets/${petId}/analytics/vaccination-status`),

  getMedicalConditionAnalytics: (petId) =>
    axiosInstance.get(`/pets/${petId}/analytics/medical-conditions`),

  getPetHealthDashboard: (petId) =>
    axiosInstance.get(`/pets/${petId}/analytics/dashboard`),

  getComprehensiveAnalytics: (petId) =>
    axiosInstance.get(`/pets/${petId}/analytics/comprehensive`),
};

// Payment Service
export const paymentService = {
  createOrder: (appointmentId, amount, description) =>
    axiosInstance.post('/payments/create-order', { appointmentId, amount, description }),

  verifyPayment: (razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId) =>
    axiosInstance.post('/payments/verify', { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId }),

  capturePayment: (razorpay_payment_id, appointmentId, amount) =>
    axiosInstance.post('/payments/capture', { razorpay_payment_id, appointmentId, amount }),

  refundPayment: (appointmentId, reason) =>
    axiosInstance.post('/payments/refund', { appointmentId, reason }),

  getPaymentStatus: (appointmentId) =>
    axiosInstance.get(`/payments/status/${appointmentId}`),

  getPaymentHistory: () =>
    axiosInstance.get('/payments/history'),
};

// Notification Service
export const notificationService = {
  createNotification: (notificationData) =>
    axiosInstance.post('/notifications', notificationData),

  getUserNotifications: () =>
    axiosInstance.get('/notifications'),

  getUnreadNotifications: () =>
    axiosInstance.get('/notifications/unread'),

  getNotificationStats: () =>
    axiosInstance.get('/notifications/stats'),

  markAsRead: (notificationId) =>
    axiosInstance.put(`/notifications/${notificationId}/read`),

  markAllAsRead: () =>
    axiosInstance.put('/notifications/all/read'),
};
