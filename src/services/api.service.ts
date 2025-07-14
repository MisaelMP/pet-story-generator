import axios from 'axios';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_PROXY_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
	(config) => {
		// Add user session token, never OpenAI API key
		const token = localStorage.getItem('userToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized access
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default apiClient;
