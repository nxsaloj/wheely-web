<script setup lang="ts">
const props = defineProps<{
  value: number
}>()

const emit = defineEmits<{
  (e: 'increment'): void
  (e: 'decrement'): void
}>()
</script>

<template>
  <div
    class="inline-flex min-w-[84px] items-center justify-center gap-2 rounded-full bg-base-200 px-3 py-1.5 text-sm font-semibold text-base-content/60"
    aria-label="Quantity">
    <button type="button"
      class="rounded px-1 text-base-content/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-success/40"
      @click="emit('decrement')">
      -
    </button>
    <span class="min-w-[12px] text-center text-sm font-semibold text-base-content/70">{{ props.value }}</span>
    <button type="button"
      class="rounded px-1 text-base-content/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-success/40"
      @click="emit('increment')">
      +
    </button>
  </div>
</template>
