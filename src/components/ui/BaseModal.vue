<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  show: Boolean,
  title: String,
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />

        <!-- Panel -->
        <div class="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">{{ title }}</h2>
            <button
              @click="$emit('close')"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X :size="18" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-5 py-4">
            <slot />
          </div>

          <!-- Footer -->
          <div class="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
