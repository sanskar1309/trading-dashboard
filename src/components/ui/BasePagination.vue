<script setup>
import { computed } from 'vue'
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-vue-next'

const props = defineProps({
  total: { type: Number, default: 0 },
  limit: { type: Number, default: 25 },
  offset: { type: Number, default: 0 },
})

const emit = defineEmits(['page-change', 'limit-change'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.limit)))
const currentPage = computed(() => Math.floor(props.offset / props.limit) + 1)

const goFirst = () => emit('page-change', 0)
const goPrev = () => emit('page-change', Math.max(0, props.offset - props.limit))
const goNext = () => emit('page-change', Math.min((totalPages.value - 1) * props.limit, props.offset + props.limit))
const goLast = () => emit('page-change', (totalPages.value - 1) * props.limit)

const btnClass = 'p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
</script>

<template>
  <div class="flex items-center justify-between gap-4 px-1 py-3 text-sm text-slate-600 dark:text-slate-400">
    <!-- Page size -->
    <div class="flex items-center gap-2">
      <span class="hidden sm:inline">Rows per page</span>
      <select
        :value="limit"
        @change="emit('limit-change', Number($event.target.value))"
        class="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
      >
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>

    <!-- Page label + nav -->
    <div class="flex items-center gap-2">
      <span class="whitespace-nowrap">Page {{ currentPage }} of {{ totalPages }}</span>

      <div class="flex items-center gap-1">
        <button :class="btnClass" :disabled="currentPage === 1" @click="goFirst" aria-label="First page">
          <ChevronsLeft :size="16" />
        </button>
        <button :class="btnClass" :disabled="currentPage === 1" @click="goPrev" aria-label="Previous page">
          <ChevronLeft :size="16" />
        </button>
        <button :class="btnClass" :disabled="currentPage === totalPages" @click="goNext" aria-label="Next page">
          <ChevronRight :size="16" />
        </button>
        <button :class="btnClass" :disabled="currentPage === totalPages" @click="goLast" aria-label="Last page">
          <ChevronsRight :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>
