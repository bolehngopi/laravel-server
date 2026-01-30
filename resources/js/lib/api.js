import axios from 'axios';
import { encrypt, decrypt } from './utils';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    if (config.data) {
        config.data = {
            payload: encrypt(config.data),
        };
    }
    console.log('Encrypted payload:', config)
    return config;
});

api.interceptors.response.use((response) => {
    if (response.data?.payload) {
        response.data = decrypt(response.data.payload);
    }
    console.log('Decrypted response data:', response.data)
    return response;
});

export default api;
