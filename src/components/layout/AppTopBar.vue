<script setup>
import { Menu, Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '../../stores/theme.js'

const emit = defineEmits(['toggle-mobile'])
const themeStore = useThemeStore()
</script>

<template>
  <header class="flex items-center justify-between h-14 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shrink-0">
    <!-- Hamburger — mobile only -->
    <button
      @click="emit('toggle-mobile')"
      class="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle menu"
    >
      <Menu :size="20" />
    </button>

    <!-- Spacer so theme toggle stays right on desktop -->
    <div class="hidden lg:block" />

    <!-- Theme toggle -->
    <button
      @click="themeStore.toggleTheme()"
      class="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <Sun v-if="themeStore.isDark" :size="20" />
      <Moon v-else :size="20" />
    </button>
  </header>
</template>
