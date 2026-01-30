import axios from 'axios';
import { encrypt, decrypt } from './utils';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    if (config.data) {
        // Send encrypted string directly as JSON value
        config.data = encrypt(config.data);
    }
    console.log('Encrypted payload:', config)
    return config;
});

api.interceptors.response.use((response) => {
    // Response data is the encrypted string directly
    if (response.data && typeof response.data === 'string') {
        response.data = decrypt(response.data);
    }
    console.log('Decrypted response data:', response.data)
    return response;
});

export default api;
