<script setup>
import { ref, computed, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { Plus } from 'lucide-vue-next'
import { useDealsStore } from '../stores/deals.js'
import BaseModal from '../components/ui/BaseModal.vue'

const dealsStore = useDealsStore()
dealsStore.fetchDeals()

// ── Kanban column data ───────────────────────────────────────────────
const COLUMNS = [
  { stage: 'starts_conversation', label: 'Starts Conversation' },
  { stage: 'negotiation', label: 'Negotiation' },
]

// Local arrays per column — synced from store, mutated by drag
const colDeals = ref({ starts_conversation: [], negotiation: [] })

watch(
  () => dealsStore.deals,
  (deals) => {
    colDeals.value.starts_conversation = deals.filter((d) => d.stage === 'starts_conversation')
    colDeals.value.negotiation = deals.filter((d) => d.stage === 'negotiation')
  },
  { immediate: true },
)

const colTotal = (stage) =>
  colDeals.value[stage].reduce((sum, d) => sum + d.value, 0)

// Called when an item is dropped into a column
const onChange = (stage, event) => {
  if (event.added) {
    dealsStore.updateDealStage(event.added.element.id, stage)
  }
}

// ── Summary stats ────────────────────────────────────────────────────
const pipelineValue = computed(() =>
  dealsStore.deals.reduce((s, d) => s + d.value, 0)
)

const stats = computed(() => [
  { label: 'Pipeline Value', value: fmt(pipelineValue.value) },
  { label: 'Open Deals', value: dealsStore.deals.length },
  { label: 'Won', value: '$0' },
  { label: 'Total Deals', value: dealsStore.deals.length },
])

// ── Create deal modal ────────────────────────────────────────────────
const showCreate = ref(false)
const form = ref({ title: '', value: '' })
const formError = ref('')

const openCreate = () => {
  form.value = { title: '', value: '' }
  formError.value = ''
  showCreate.value = true
}

const submitDeal = async () => {
  if (!form.value.title.trim() || !form.value.value) {
    formError.value = 'Both fields are required.'
    return
  }
  await dealsStore.createDeal({
    title: form.value.title.trim(),
    value: Number(form.value.value),
    stage: 'starts_conversation',
  })
  showCreate.value = false
}

// ── Helpers ──────────────────────────────────────────────────────────
const fmt = (val) =>
  '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const fmtFull = (val) =>
  '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-indigo-500',
  'bg-teal-500', 'bg-pink-500',
]

const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

const initials = (name) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

const stageName = (stage) =>
  stage === 'starts_conversation' ? 'Conversation' : 'Negotiation'

const stageBadgeClass = (stage) =>
  stage === 'starts_conversation'
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500'
</script>

<template>
  <div class="p-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-slate-900 dark:text-white">Deal Pipeline</h1>
      <button
        @click="openCreate"
        class="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
      >
        <Plus :size="16" />
        Create Deal
      </button>
    </div>

    <!-- Summary row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3"
      >
        <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">{{ stat.label }}</div>
        <div class="text-lg font-bold text-slate-900 dark:text-white">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Kanban board -->
    <div class="flex gap-4 overflow-x-auto pb-2">
      <div
        v-for="col in COLUMNS"
        :key="col.stage"
        class="flex-1 min-w-[280px]"
      >
        <!-- Column header -->
        <div class="flex items-center gap-2 mb-3">
          <span class="font-semibold text-sm text-slate-700 dark:text-slate-300">{{ col.label }}</span>
          <span class="text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-2 py-0.5">
            {{ colDeals[col.stage].length }}
          </span>
          <span class="ml-auto text-xs text-slate-400 dark:text-slate-500 font-medium">
            {{ fmt(colTotal(col.stage)) }}
          </span>
        </div>

        <!-- Drop zone -->
        <VueDraggable
          v-model="colDeals[col.stage]"
          group="deals"
          item-key="id"
          @change="onChange(col.stage, $event)"
          class="min-h-[200px] space-y-3 rounded-lg p-2 bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50"
        >
          <!-- Deal card -->
          <div
            v-for="deal in colDeals[col.stage]"
            :key="deal.id"
            class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-3 mb-3">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', avatarColor(deal.title)]">
                {{ initials(deal.title) }}
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-sm text-slate-900 dark:text-white truncate">{{ deal.title }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ fmtFull(deal.value) }}</div>
              </div>
            </div>
            <span :class="['text-xs font-medium px-2 py-0.5 rounded-full', stageBadgeClass(deal.stage)]">
              {{ stageName(deal.stage) }}
            </span>
          </div>
        </VueDraggable>
      </div>
    </div>

    <!-- Create Deal Modal -->
    <BaseModal :show="showCreate" title="Create Deal" @close="showCreate = false">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
          <input v-model="form.title" type="text" placeholder="e.g. John Doe" :class="inputClass" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Value ($)</label>
          <input v-model="form.value" type="number" min="0" placeholder="e.g. 5000" :class="inputClass" />
        </div>
        <p v-if="formError" class="text-xs text-rose-500">{{ formError }}</p>
      </div>

      <template #footer>
        <button
          @click="showCreate = false"
          class="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="submitDeal"
          class="px-4 py-2 text-sm rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
        >
          Create
        </button>
      </template>
    </BaseModal>

  </div>
</template>
