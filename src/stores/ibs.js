import { defineStore } from 'pinia'
import { getIBs } from '../api/ibs.js'

export const useIBsStore = defineStore('ibs', {
  state: () => ({
    ibs: [],
    total: 0,
    loading: false,
    error: null,
    filters: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      state: '',
    },
    sort: {
      field: null,
      direction: null, // 'asc' | 'desc' | null
    },
    pagination: {
      limit: 10,
      offset: 0,
    },
  }),
  getters: {
    totalPages: (state) => Math.ceil(state.total / state.pagination.limit) || 1,
    currentPage: (state) => Math.floor(state.pagination.offset / state.pagination.limit) + 1,
  },
  actions: {
    async fetchIBs() {
      this.loading = true
      this.error = null
      const params = {}

      // Build filter params
      if (this.filters.username) params['username__contains'] = this.filters.username
      if (this.filters.email) params['email__contains'] = this.filters.email
      if (this.filters.firstName) params['firstName__contains'] = this.filters.firstName
      if (this.filters.lastName) params['lastName__contains'] = this.filters.lastName
      if (this.filters.state) params['state__contains'] = this.filters.state

      // Sort
      if (this.sort.field && this.sort.direction) {
        params.ordering = this.sort.direction === 'desc'
          ? `-${this.sort.field}`
          : this.sort.field
      }

      // Pagination
      params.limit = this.pagination.limit
      params.offset = this.pagination.offset

      try {
        const res = await getIBs(params)
        const data = res.data
        // Prefer X-Total-Count header (set by json-server when _limit is used)
        const headerTotal = parseInt(res.headers['x-total-count'])
        if (Array.isArray(data)) {
          this.ibs = data
          this.total = isNaN(headerTotal) ? data.length : headerTotal
        } else {
          this.ibs = data.results ?? []
          this.total = isNaN(headerTotal) ? (data.count ?? 0) : headerTotal
        }
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    setFilter(field, value) {
      this.filters[field] = value
      this.pagination.offset = 0
      this.fetchIBs()
    },
    setSort(field) {
      if (this.sort.field !== field) {
        // New column — start at asc
        this.sort.field = field
        this.sort.direction = 'asc'
      } else {
        // Cycle: asc → desc → none
        if (this.sort.direction === 'asc') {
          this.sort.direction = 'desc'
        } else if (this.sort.direction === 'desc') {
          this.sort.field = null
          this.sort.direction = null
        } else {
          this.sort.direction = 'asc'
        }
      }
      this.fetchIBs()
    },
    setPage(offset) {
      this.pagination.offset = offset
      this.fetchIBs()
    },
    setLimit(limit) {
      this.pagination.limit = limit
      this.pagination.offset = 0
      this.fetchIBs()
    },
  },
})
