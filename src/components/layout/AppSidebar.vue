<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'

const props = defineProps({
  collapsed: Boolean,
  mobileOpen: Boolean,
})

const emit = defineEmits(['toggle-collapse', 'close-mobile'])

const route = useRoute()
const partnersOpen = ref(false)

const isActive = (prefix) => route.path.startsWith(prefix)
</script>

<template>
  <!-- Mobile backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="emit('close-mobile')"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 bottom-0 z-50 flex flex-col',
      'bg-white dark:bg-slate-900',
      'border-r border-slate-200 dark:border-slate-700',
      'transition-all duration-300 overflow-hidden',
      'w-[220px]',
      // Mobile: slide in/out
      mobileOpen ? 'translate-x-0' : '-translate-x-full',
      // Desktop: always visible, width changes
      'lg:relative lg:translate-x-0',
      collapsed ? 'lg:w-[60px]' : 'lg:w-[220px]',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center h-14 px-4 border-b border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
      <span class="font-bold text-slate-900 dark:text-white text-lg tracking-tight whitespace-nowrap">
        <template v-if="!collapsed">TradeDesk</template>
        <template v-else>T</template>
      </span>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 py-3 overflow-y-auto overflow-x-hidden space-y-0.5">

      <!-- My Workspace -->
      <RouterLink
        to="/workspace"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 mx-2 text-sm font-medium rounded-lg transition-colors',
          isActive('/workspace')
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white',
        ]"
      >
        <LayoutDashboard :size="18" class="shrink-0" />
        <span v-if="!collapsed" class="truncate">My Workspace</span>
      </RouterLink>

      <!-- Partners accordion -->
      <div class="mx-2">
        <button
          @click="partnersOpen = !partnersOpen"
          :class="[
            'flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
            isActive('/partners')
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white',
          ]"
        >
          <Users :size="18" class="shrink-0" />
          <span v-if="!collapsed" class="flex-1 text-left truncate">Partners</span>
          <ChevronDown
            v-if="!collapsed"
            :size="14"
            :class="['transition-transform duration-200 shrink-0', partnersOpen ? 'rotate-180' : '']"
          />
        </button>

        <!-- Sub-items -->
        <Transition
          enter-active-class="transition-all duration-200 overflow-hidden"
          leave-active-class="transition-all duration-200 overflow-hidden"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-20 opacity-100"
          leave-from-class="max-h-20 opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-if="partnersOpen && !collapsed" class="mt-1 ml-4 pl-3 border-l border-slate-200 dark:border-slate-700 space-y-1">
            <RouterLink
              to="/partners/ibs"
              :class="[
                'block px-3 py-2 text-sm rounded-lg transition-colors',
                route.path === '/partners/ibs'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white',
              ]"
            >
              IB Accounts
            </RouterLink>
          </div>
        </Transition>
      </div>
    </nav>

    <!-- Collapse toggle (desktop only) -->
    <button
      @click="emit('toggle-collapse')"
      class="hidden lg:flex items-center justify-center h-11 shrink-0 border-t border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
      <ChevronLeft v-if="!collapsed" :size="16" />
      <ChevronRight v-else :size="16" />
    </button>
  </aside>
</template>
