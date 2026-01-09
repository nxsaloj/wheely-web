<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'
import type { StoreOption } from './StorePickerSheet.vue'

const props = defineProps<{
  store: StoreOption
  selected?: boolean
}>()
</script>

<template>
  <div class="flex w-full items-center justify-between gap-2">
    <div class="flex items-center gap-3">
      <span
        class="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-base-200 text-sm font-semibold text-base-content/70">
        <img v-if="props.store.imageUrl" :src="props.store.imageUrl" :alt="props.store.name"
          class="h-full w-full object-cover" />
        <span v-else>{{ props.store.name.charAt(0) }}</span>
      </span>
      <div class="flex flex-col gap-0.5">
        <span class="text-sm font-semibold text-base-content">{{ props.store.name }}</span>
        <span class="text-xs text-base-content/50">
          {{ props.selected ? 'Currently Selected' : props.store.subtitle || props.store.description || 'Store details'
          }}
        </span>
      </div>
    </div>
    <div class="flex items-center gap-1.5" aria-hidden="true">
      <CheckIcon v-if="props.selected" class="h-5 w-5 text-success" />
    </div>
  </div>
</template>
