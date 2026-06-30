import api from './axios'

export const testApiKeys = () => api.get('/test/keys')
