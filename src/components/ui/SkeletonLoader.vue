<script setup>
defineProps({
  rows: { type: Number, default: 5 },
  cols: { type: Number, default: 6 },
})
</script>

<template>
  <tr v-for="r in rows" :key="r" class="animate-pulse">
    <td v-for="c in cols" :key="c" class="px-4 py-3">
      <div class="h-4 rounded bg-slate-200 dark:bg-slate-700" :style="{ width: c === 1 ? '2rem' : '80%' }" />
    </td>
  </tr>
</template>
