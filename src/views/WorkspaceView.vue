<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { label: 'Summary', to: '/workspace/summary' },
  { label: 'Deals', to: '/workspace/deals' },
]
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Tab bar -->
    <div class="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6">
      <nav class="flex gap-1">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          :class="[
            'px-4 py-3.5 text-sm font-medium border-b-2 transition-colors',
            route.path === tab.to
              ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
          ]"
        >
          {{ tab.label }}
        </RouterLink>
      </nav>
    </div>

    <!-- Child route renders here -->
    <div class="flex-1 overflow-auto">
      <RouterView />
    </div>
  </div>
</template>
