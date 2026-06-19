<script setup>
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'
import SkeletonLoader from './SkeletonLoader.vue'

const props = defineProps({
  columns: { type: Array, required: true }, // [{ key, label, sortable, filterable }]
  rows: { type: Array, default: () => [] },
  sortField: { type: String, default: null },
  sortDirection: { type: String, default: null }, // 'asc' | 'desc' | null
  loading: Boolean,
})

const emit = defineEmits(['sort', 'filter'])

// Local filter input values (display only — actual state lives in the store)
const filterValues = ref(
  Object.fromEntries(props.columns.map((c) => [c.key, '']))
)

const debouncedFilter = useDebounceFn((key, value) => {
  emit('filter', key, value)
}, 500)

const onFilterInput = (key, value) => {
  filterValues.value[key] = value
  debouncedFilter(key, value)
}

const sortIcon = (col) => {
  if (!col.sortable || props.sortField !== col.key) return ArrowUpDown
  return props.sortDirection === 'asc' ? ArrowUp : ArrowDown
}

const sortIconClass = (col) => {
  if (props.sortField === col.key && props.sortDirection) return 'text-slate-900 dark:text-white'
  return 'text-slate-400'
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
    <table class="w-full text-sm text-left">
      <thead class="bg-slate-50 dark:bg-slate-800/60">
        <!-- Column labels -->
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
            :class="col.sortable ? 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200' : ''"
            @click="col.sortable && emit('sort', col.key)"
          >
            <div class="flex items-center gap-1.5">
              {{ col.label }}
              <component
                v-if="col.sortable"
                :is="sortIcon(col)"
                :size="14"
                :class="sortIconClass(col)"
              />
            </div>
          </th>
        </tr>

        <!-- Filter inputs -->
        <tr class="border-t border-slate-200 dark:border-slate-700">
          <th v-for="col in columns" :key="col.key" class="px-3 py-2">
            <input
              v-if="col.filterable"
              :value="filterValues[col.key]"
              @input="onFilterInput(col.key, $event.target.value)"
              type="text"
              placeholder="Search..."
              class="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500"
            />
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-900">
        <template v-if="loading">
          <SkeletonLoader :rows="5" :cols="columns.length" />
        </template>

        <template v-else-if="rows.length === 0">
          <tr>
            <td :colspan="columns.length" class="px-4 py-10 text-center text-slate-400 dark:text-slate-500">
              No records found.
            </td>
          </tr>
        </template>

        <template v-else>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap"
            >
              <slot :name="col.key" :row="row">{{ row[col.key] }}</slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
