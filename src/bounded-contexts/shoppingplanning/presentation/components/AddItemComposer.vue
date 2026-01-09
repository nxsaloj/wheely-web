<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  BuildingStorefrontIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  ClockIcon,
  HashtagIcon,
  LockClosedIcon,
  LockOpenIcon,
} from '@heroicons/vue/24/outline'
import type { StoreOption } from './StorePickerSheet.vue'

type PlannedStatus = 'planned' | 'optional'

export interface AddItemPayload {
  productRef: string
  quantity: number
  status: PlannedStatus
  note?: string
  storeRef?: string
}

const props = defineProps<{
  pendingStore?: string | null
  stores: StoreOption[]
}>()

const emit = defineEmits<{
  (e: 'add', value: AddItemPayload): void
  (e: 'open-store-picker'): void
}>()

const form = reactive({
  productRef: '',
  quantity: 1,
  status: 'planned' as PlannedStatus,
  note: '',
  storeRef: props.pendingStore ?? '',
})

const ui = reactive({
  showQty: false,
  showNote: false,
})

const locks = reactive({
  keepStore: false,
})

watch(
  () => props.pendingStore,
  (val) => {
    form.storeRef = val ?? ''
  },
)

const storeLabel = computed(() => props.stores.find((s) => s.id === form.storeRef)?.name ?? '')

const toggleStatus = () => {
  form.status = form.status === 'planned' ? 'optional' : 'planned'
}

const toggleQtyEditor = () => {
  ui.showQty = !ui.showQty
}

const toggleNote = () => {
  ui.showNote = !ui.showNote
}

const toggleKeepStore = () => {
  locks.keepStore = !locks.keepStore
}

const submit = () => {
  if (!form.productRef.trim()) return
  emit('add', {
    productRef: form.productRef.trim(),
    quantity: form.quantity,
    status: form.status,
    note: form.note?.trim() || undefined,
    storeRef: form.storeRef || undefined,
  })
}

const resetAfterAdd = (success: boolean) => {
  if (!success) return
  form.productRef = ''
  form.quantity = 1
  form.status = 'planned'
  form.note = ''
  ui.showNote = false
  if (!locks.keepStore) {
    form.storeRef = ''
  }
  ui.showQty = false
}

defineExpose({ resetAfterAdd })
</script>

<template>
  <div class="grid gap-3 border-b border-base-300/60 pb-4">
    <div class="flex items-center gap-3">
      <input v-model.trim="form.productRef" type="text"
        class="input input-bordered w-full rounded-lg text-base font-normal text-base-content/80 focus:outline-none focus:ring-0 placeholder:text-base-content/35"
        placeholder="Add an item..." @keyup.enter.prevent="submit" />
      <button type="button" class="btn btn-ghost bg-success/75 px-5 text-white font-semibold"
        @click="submit">Add</button>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button type="button"
        class="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-sm font-semibold text-base-content/60 hover:bg-base-300/70"
        :class="ui.showQty ? 'bg-base-300/50' : ''" @click="toggleQtyEditor">
        <HashtagIcon class="h-4 w-4" />
        <span>Quantity</span>
      </button>
      <div class="join rounded-full border border-base-300/60 bg-base-200 text-sm font-semibold text-base-content/60">
        <button type="button" class="join-item inline-flex items-center gap-2 rounded-full px-4 py-1.5" :class="form.status === 'planned'
          ? 'bg-success/15 text-success'
          : 'bg-base-200 text-base-content/50 hover:bg-base-300/50'
          " @click="toggleStatus">
          <CheckCircleIcon v-if="form.status === 'planned'" class="h-4 w-4" />
          <ClockIcon v-else class="h-4 w-4" />
          <span>{{ form.status === 'planned' ? 'Planned' : 'Optional' }}</span>
        </button>
      </div>
      <div class="join rounded-full border border-base-300/60 bg-base-200 text-sm font-semibold text-base-content/60">
        <button type="button"
          class="join-item inline-flex items-center gap-2 rounded-l-full rounded-r-none border-r border-base-300/60 px-4 py-1.5"
          @click="emit('open-store-picker')">
          <BuildingStorefrontIcon class="h-4 w-4" />
          <span>{{ storeLabel || '+ Store' }}</span>
        </button>
        <button type="button"
          class="join-item rounded-l-none rounded-r-full px-3 py-1.5 text-base-content/50 hover:bg-base-300/70"
          :class="locks.keepStore ? 'bg-base-300/50' : ''" :aria-pressed="locks.keepStore" @click="toggleKeepStore"
          aria-label="Keep store">
          <LockClosedIcon v-if="locks.keepStore" class="h-4 w-4" />
          <LockOpenIcon v-else class="ml-0.5 h-4 w-4" />
        </button>
      </div>
      <button type="button"
        class="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-sm font-semibold text-base-content/60 hover:bg-base-300/70"
        :class="ui.showNote ? 'bg-base-300/50' : ''" @click="toggleNote">
        <ChatBubbleLeftEllipsisIcon class="h-4 w-4" />
        <span>{{ ui.showNote ? 'Hide note' : '+ Note' }}</span>
      </button>
    </div>

    <div v-if="ui.showQty" class="grid gap-1">
      <span class="text-xs font-semibold text-base-content/50">Quantity</span>
      <input v-model.number="form.quantity" type="number" min="1"
        class="input input-bordered w-28 rounded-xl text-sm focus:outline-none focus:ring-0" />
    </div>

    <div v-if="ui.showNote" class="grid gap-1">
      <span class="text-xs font-semibold text-base-content/50">Note</span>
      <input v-model.trim="form.note" type="text" placeholder="Add a note"
        class="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:ring-0 placeholder:text-base-content/40" />
    </div>

  </div>
</template>
