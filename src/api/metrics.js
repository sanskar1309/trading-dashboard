import api from './axios.js'

export const getMetrics = () => api.get('/metrics')

 