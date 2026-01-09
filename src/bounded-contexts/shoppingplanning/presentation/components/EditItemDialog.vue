<script setup lang="ts">
import { watch } from 'vue'
import { BuildingStorefrontIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'

type PlannedStatus = 'planned' | 'optional'

type EditState = {
  visible: boolean
  itemId: string
  productRef: string
  quantity: number
  status: PlannedStatus
  note: string
  storeRef: string
}

const visible = defineModel<boolean>('visible', { default: false })
const editState = defineModel<EditState>('state', { required: true })

const props = defineProps<{
  storeLabel?: string
  saving?: boolean
}>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'open-store-picker'): void
}>()

watch(
  () => visible.value,
  (isVisible) => {
    if (!isVisible) return
  },
)

const close = () => {
  visible.value = false
}

const toggleStatus = () => {
  editState.value.status = editState.value.status === 'planned' ? 'optional' : 'planned'
}

</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 grid place-items-center">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close" />
    <div class="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-base-100 shadow-2xl">
      <div class="flex items-center justify-end border-b border-base-200 px-6 pt-4 pb-1">
        <button type="button" class="btn btn-ghost bg-base-300/50 btn-circle btn-sm" aria-label="Close dialog"
          @click="close">
          ✕
        </button>
      </div>
      <div class="space-y-5 px-6 pb-6">

        <label for="edit-item-name" class="text-xs font-semibold text-base-content/50">Item name</label>
        <input id="edit-item-name" v-model.trim="editState.productRef" type="text"
          class="input input-bordered w-full rounded-lg text-base font-normal text-base-content/80 focus:outline-none focus:ring-0 placeholder:text-base-content/35"
          placeholder="Item name" />

        <div class="grid gap-2">
          <label for="edit-item-quantity" class="text-xs font-semibold text-base-content/50">Quantity</label>
          <input id="edit-item-quantity" v-model.number="editState.quantity" type="number" min="1" step="1"
            class="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:ring-0" />
        </div>

        <div class="grid gap-2">
          <label for="edit-item-note" class="text-xs font-semibold text-base-content/50">Note</label>
          <input id="edit-item-note" v-model.trim="editState.note" type="text"
            class="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:ring-0"
            placeholder="Add a note" />
        </div>

        <div class="grid gap-3 sm:grid-cols-2 mb-5">
          <button type="button"
            class="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold" :class="editState.status === 'planned'
              ? 'bg-success/15 text-success'
              : 'bg-base-200 text-base-content/50 hover:bg-base-300/50'" @click="toggleStatus">
            <CheckCircleIcon v-if="editState.status === 'planned'" class="h-4 w-4" />
            <ClockIcon v-else class="h-4 w-4" />
            <span>{{ editState.status === 'planned' ? 'Planned' : 'Optional' }}</span>
          </button>
          <button type="button"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-base-200 px-4 py-2 text-sm font-semibold text-base-content/60 hover:bg-base-300/50"
            @click="emit('open-store-picker')">
            <BuildingStorefrontIcon class="h-4 w-4" />
            <span>{{ props.storeLabel || '+ Store' }}</span>
          </button>
        </div>

        <div class="flex justify-end">
          <button type="button" class="btn btn-ghost bg-base-300/75 px-5 mr-3 font-semibold" :disabled="props.saving"
            @click="close">
            Cancel
          </button>
          <button type="button" class="btn btn-ghost bg-success/75 px-5 text-white font-semibold"
            :disabled="props.saving" @click="emit('apply')">
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
