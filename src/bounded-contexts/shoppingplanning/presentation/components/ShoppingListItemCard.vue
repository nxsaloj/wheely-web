<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { ListItemViewModel } from '../view-models/shoppingListViewModels'
import QuantityStepper from './QuantityStepper.vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  item: ListItemViewModel
}>()

const emit = defineEmits<{
  (e: 'changeQuantity', delta: number): void
  (e: 'edit'): void
  (e: 'remove'): void
  (e: 'storeClick', event: Event): void
  (e: 'toggleStatus'): void
}>()

const ui = reactive({
  menuOpen: false,
})

const statusLabel = computed(() =>
  props.item.status.charAt(0).toUpperCase() + props.item.status.slice(1),
)
const isPlanned = computed(() => props.item.status === 'planned')

const toggleMenu = () => {
  ui.menuOpen = !ui.menuOpen
}
const closeMenu = () => {
  ui.menuOpen = false
}
const handleEdit = () => {
  emit('edit')
  closeMenu()
}
const handleRemove = () => {
  emit('remove')
  closeMenu()
}
</script>

<template>
  <div class="flex items-start justify-between gap-3 py-3">
    <div class="grid gap-2">
      <span class="text-base font-semibold text-base-content">{{ props.item.productRef }}</span>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="isPlanned
          ? 'bg-success/15 text-success/90'
          : 'bg-base-300/50 text-base-content/50 hover:bg-base-300/50'" @click="emit('toggleStatus')">
          {{ statusLabel }}
        </button>
        <button v-if="props.item.storeRef" type="button"
          class="rounded-full bg-base-300/50 px-2.5 py-1 text-xs font-semibold text-base-content/60"
          @click="(e: Event) => emit('storeClick', e)">
          {{ props.item.storeRef }}
        </button>
        <button v-else type="button"
          class="rounded-full bg-base-300/50 px-2.5 py-1 text-xs font-semibold text-base-content/40"
          @click="(e: Event) => emit('storeClick', e)">
          No store
        </button>
      </div>
      <p v-if="props.item.note" class="text-xs text-base-content/40 mb-0">{{ props.item.note }}</p>
    </div>
    <div class="grid grid-flow-col items-center gap-2">
      <QuantityStepper :value="props.item.quantity" @decrement="emit('changeQuantity', -1)"
        @increment="emit('changeQuantity', 1)" />
      <div class="dropdown dropdown-end">
        <button type="button" class="btn btn-ghost btn-circle btn-sm text-base-content/50" aria-label="Item actions"
          @click="toggleMenu">
          <EllipsisVerticalIcon class="h-5 w-5" />
        </button>
        <ul v-if="ui.menuOpen" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36 mt-2">
          <li><button type="button" @click="handleEdit">Edit</button></li>
          <li><button type="button" class="text-error" @click="handleRemove">Remove</button></li>
        </ul>
      </div>
    </div>
  </div>
</template>
