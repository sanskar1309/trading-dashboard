import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './style.css'

async function main() {
  const { worker } = await import('./mocks/browser.js')
  await worker.start({ onUnhandledRequest: 'bypass' })

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

main()
