import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
    login: (email, password) => api.post('/auth/login', { email, password }),
    logout: () => api.post('/auth/logout'),
};

export const userAPI = {
    getProfile: (userId) => api.get(`/user/${userId}/profile`),
    updateProfile: (userId, data) => api.put(`/user/${userId}/profile`, data),
    deleteAccount: (userId) => api.delete(`/user/${userId}`),
};

export const chatAPI = {
    sendMessage: (userId, message, modelChoice) => api.post('/chat', { user_id: userId, message, model_choice: modelChoice }),
};

export const moodAPI = {
    logMood: (userId, emoji, score, note = null) => api.post('/mood/log', { user_id: userId, mood_emoji: emoji, mood_score: score, note, timestamp: new Date().toISOString() }),
    getMoodToday: (userId) => api.get(`/mood/today/${userId}`),
    getMoodWeek: (userId) => api.get(`/mood/week/${userId}`),
};

export default api;
