import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Course APIs
export const getCourses = () => API.get('/courses');
export const getCourse = (id) => API.get(`/courses/${id}`);

// Progress APIs
export const enrollCourse = (courseId) => API.post(`/progress/enroll/${courseId}`);
export const getMyProgress = () => API.get('/progress');
export const getCourseProgress = (courseId) => API.get(`/progress/${courseId}`);
export const updateLectureProgress = (courseId, lectureId) =>
  API.put(`/progress/${courseId}/lecture/${lectureId}`);

// Admin APIs
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');
export const getPendingCourses = () => API.get('/admin/courses/pending');
export const approveCourse = (id) => API.put(`/admin/courses/${id}/approve`);
export const rejectCourse = (id) => API.put(`/admin/courses/${id}/reject`);
// Recommendation APIs
export const getRecommendations = () => API.get('/recommendations');
export const updateInterests = (interests) => API.put('/recommendations/interests', { interests });
export const getTrending = () => API.get('/recommendations/trending');

export default API;