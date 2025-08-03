import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        console.error('API Error:', error);

        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error: Backend server might not be running');
        }

        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_type');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API methods
export const authAPI = {
    // User login
    userLogin: async (email: string, password: string) => {
        const response = await api.post('/users/login', { email, password });
        return response.data;
    },

    // Admin login
    adminLogin: async (email: string, password: string) => {
        const response = await api.post('/admins/login', { email, password });
        return response.data;
    },

    // Logout
    logout: async () => {
        await api.post('/logout');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_data');
    },
};

// Posts API methods
export const postsAPI = {
    // Get all posts (filtered by user role)
    getPosts: async () => {
        const response = await api.get('/posts');
        return response.data;
    },

    // Get single post
    getPost: async (id: number) => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    // Create new post
    createPost: async (data: { title: string; content: string; status: 'published' | 'draft' }) => {
        const response = await api.post('/posts', data);
        return response.data;
    },

    // Update post
    updatePost: async (id: number, data: { title: string; content: string; status: 'published' | 'draft' }) => {
        const response = await api.put(`/posts/${id}`, data);
        return response.data;
    },

    // Delete post
    deletePost: async (id: number) => {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    },
};

export default api; 