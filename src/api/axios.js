import axios from 'axios'

// MSW intercepts requests at the service worker level,
// so a relative baseURL works in both dev and production.
const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
})

export default api
