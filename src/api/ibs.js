import api from './axios.js'

// params is a plain object: filters, ordering, limit, offset
export const getIBs = (params = {}) => api.get('/ibs', { params })
