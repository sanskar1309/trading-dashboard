<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from './stores/theme.js'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopBar from './components/layout/AppTopBar.vue'

const themeStore = useThemeStore()
onMounted(() => themeStore.initTheme())

const collapsed = ref(false)
const mobileOpen = ref(false)
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
    <AppSidebar
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      @toggle-collapse="collapsed = !collapsed"
      @close-mobile="mobileOpen = false"
    />

    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <AppTopBar @toggle-mobile="mobileOpen = !mobileOpen" />
      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
