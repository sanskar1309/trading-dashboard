<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Inbox,
} from 'lucide-vue-next'
import { getMetrics } from '../api/metrics.js'

const metrics = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getMetrics()
    metrics.value = res.data
  } finally {
    loading.value = false
  }
})

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

const fmt = (val) =>
  '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtInt = (val) => Number(val).toLocaleString('en-US')

const cards = computed(() => {
  if (!metrics.value) return []
  const m = metrics.value
  return [
    {
      label: 'Deposits',
      value: fmt(m.deposits.amount),
      sub: `Net: ${fmt(m.deposits.net)}`,
      detail: `${fmtInt(m.deposits.transactions)} transactions`,
      icon: ArrowDownToLine,
      iconClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Non-FTD',
      value: fmt(m.nonFtd.amount),
      sub: null,
      detail: `${fmtInt(m.nonFtd.transactions)} transactions`,
      icon: TrendingUp,
      iconClass: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'FTD',
      value: fmt(m.ftd.amount),
      sub: null,
      detail: `${fmtInt(m.ftd.transactions)} transactions`,
      icon: TrendingDown,
      iconClass: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10',
    },
    {
      label: 'Pending Deposits',
      value: fmt(m.pendingDeposits.amount),
      sub: null,
      detail: `${fmtInt(m.pendingDeposits.transactions)} transactions`,
      icon: Clock,
      iconClass: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
    },
    {
      label: 'Withdrawals',
      value: fmt(m.withdrawals.amount),
      sub: null,
      detail: `${fmtInt(m.withdrawals.transactions)} transactions`,
      icon: ArrowUpFromLine,
      iconClass: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10',
    },
    {
      label: 'Pending Withdrawals',
      value: fmt(m.pendingWithdrawals.amount),
      sub: null,
      detail: `${fmtInt(m.pendingWithdrawals.transactions)} transactions`,
      icon: Clock,
      iconClass: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10',
    },
    {
      label: 'Active Traders',
      value: fmtInt(m.activeTraders),
      sub: null,
      detail: null,
      icon: Users,
      iconClass: 'text-slate-500 bg-slate-100 dark:bg-slate-700',
    },
  ]
})
</script>

<template>
  <div class="p-6">
    <!-- Greeting -->
    <h1 class="text-xl font-semibold text-slate-900 dark:text-white mb-6">
      {{ greeting }}, welcome back 👋
    </h1>

    <div class="flex gap-6">
      <!-- Metrics grid -->
      <div class="flex-1 min-w-0">

        <!-- Skeleton -->
        <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="i in 7"
            :key="i"
            class="h-28 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"
          />
        </div>

        <!-- Cards -->
        <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="card in cards"
            :key="card.label"
            class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">{{ card.label }}</span>
              <span :class="['p-2 rounded-lg', card.iconClass]">
                <component :is="card.icon" :size="16" />
              </span>
            </div>
            <div>
              <div class="text-xl font-bold text-slate-900 dark:text-white">{{ card.value }}</div>
              <div v-if="card.sub" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ card.sub }}</div>
            </div>
            <div v-if="card.detail" class="text-xs text-slate-400 dark:text-slate-500">{{ card.detail }}</div>
          </div>
        </div>
      </div>

      <!-- Activity feed (desktop only) -->
      <div class="hidden lg:flex flex-col w-72 shrink-0">
        <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 flex flex-col items-center justify-center gap-2 p-6">
          <Inbox :size="32" class="text-slate-300 dark:text-slate-600" />
          <p class="text-sm text-slate-400 dark:text-slate-500 text-center">No recent activity</p>
        </div>
      </div>
    </div>
  </div>
</template>
