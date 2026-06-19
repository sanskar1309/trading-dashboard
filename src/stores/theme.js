import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('tradedesk-theme') === 'dark',
  }),
  actions: {
    initTheme() {
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('tradedesk-theme', this.isDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', this.isDark)
    },
  },
})
