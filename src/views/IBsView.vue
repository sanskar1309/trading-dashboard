<script setup>
import { onMounted } from 'vue'
import { useIBsStore } from '../stores/ibs.js'
import BaseTable from '../components/ui/BaseTable.vue'
import BasePagination from '../components/ui/BasePagination.vue'

const ibsStore = useIBsStore()

onMounted(() => ibsStore.fetchIBs())

const columns = [
  { key: 'id',        label: 'ID',         sortable: true,  filterable: false },
  { key: 'username',  label: 'Username',   sortable: true,  filterable: true  },
  { key: 'email',     label: 'Email',      sortable: true,  filterable: true  },
  { key: 'firstName', label: 'First Name', sortable: true,  filterable: true  },
  { key: 'lastName',  label: 'Last Name',  sortable: true,  filterable: true  },
  { key: 'state',     label: 'State',      sortable: true,  filterable: true  },
]
</script>

<template>
  <div class="p-6">
    <!-- Page title -->
    <h1 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Introducing Brokers</h1>

    <!-- Table -->
    <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
      <BaseTable
        :columns="columns"
        :rows="ibsStore.ibs"
        :sort-field="ibsStore.sort.field"
        :sort-direction="ibsStore.sort.direction"
        :loading="ibsStore.loading"
        @sort="ibsStore.setSort"
        @filter="ibsStore.setFilter"
      >
        <!-- Custom cell: state badge -->
        <template #state="{ row }">
          <span
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              row.state === 'active'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
            ]"
          >
            {{ row.state }}
          </span>
        </template>
      </BaseTable>

      <!-- Pagination -->
      <div class="border-t border-slate-200 dark:border-slate-700 px-4">
        <BasePagination
          :total="ibsStore.total"
          :limit="ibsStore.pagination.limit"
          :offset="ibsStore.pagination.offset"
          @page-change="ibsStore.setPage"
          @limit-change="ibsStore.setLimit"
        />
      </div>
    </div>
  </div>
</template>
