import api from './axios.js'

export const getDeals = () => api.get('/deals')

export const createDeal = (payload) => api.post('/deals', payload)

export const updateDeal = (id, payload) => api.patch(`/deals/${id}`, payload)
