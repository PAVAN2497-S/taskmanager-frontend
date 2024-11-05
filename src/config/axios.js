import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://taskmanager-backend-w2gu.onrender.com',
});
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const BACKEND_URL = 'https://taskmanager-backend-w2gu.onrender.com'

export default axiosInstance;
