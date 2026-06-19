import { defineStore } from 'pinia'
import { getDeals, createDeal, updateDeal } from '../api/deals.js'

export const useDealsStore = defineStore('deals', {
  state: () => ({
    deals: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchDeals() {
      this.loading = true
      this.error = null
      try {
        const res = await getDeals()
        this.deals = res.data
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    async createDeal(payload) {
      const res = await createDeal(payload)
      this.deals.push(res.data)
    },
    async updateDealStage(id, stage) {
      // Optimistic update so the UI feels instant
      const deal = this.deals.find((d) => d.id === id)
      if (deal) deal.stage = stage
      await updateDeal(id, { stage })
    },
  },
})
