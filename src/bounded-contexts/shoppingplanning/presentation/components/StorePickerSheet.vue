<script setup lang="ts">
import StorePickerItem from './StorePickerItem.vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

export interface StoreOption {
  id: string
  name: string
  imageUrl?: string
  subtitle?: string
  description?: string
}

const visible = defineModel<boolean>('visible', { default: false })
const props = defineProps<{
  stores: StoreOption[]
  modelValue: string | null | undefined
  subtitle?: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'select', value: string | null): void
  (e: 'search', value: string): void
}>()

const close = () => emit('update:visible', false)

const handleSelect = (storeId: string | null) => {
  emit('select', storeId)
  emit('update:visible', false)
}

const handleSearch = (event: Event) => {
  const value = (event.target as HTMLInputElement)?.value ?? ''
  emit('search', value)
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 grid items-end justify-items-center" role="dialog" aria-modal="true">
    <div class="absolute inset-0 bg-black/35" @click="close" />
    <div
      class="relative flex h-[80vh] w-full max-w-2xl flex-col gap-4 rounded-t-2xl bg-base-100 px-5 pb-2 pt-3 shadow-2xl">
      <div class="relative">
        <div class="mx-auto mt-2 h-1.5 w-14 rounded-full bg-base-300" aria-hidden="true"></div>
        <button type="button" class="btn btn-ghost bg-base-300/50 btn-circle btn-sm absolute right-0 top-0"
          aria-label="Close dialog" @click="close">
          ✕
        </button>
      </div>
      <div class="flex items-center justify-center">
        <p class="text-lg font-semibold">Select Store</p>
      </div>

      <label for="search-stores" class="sr-only">Search stores</label>
      <div
        class="input w-full border border h-12 max-h-12 flex items-center gap-2 focus-within:border-slate-300 focus-within:ring-0 focus-within:shadow-none">
        <MagnifyingGlassIcon class="h-5 w-5 text-base-content/50" />
        <input id="search-stores" placeholder="Search stores..." class="grow focus:outline-none focus:ring-0"
          aria-label="Search stores" @input="handleSearch" />
      </div>

      <button type="button"
        class="btn btn-ghost w-full justify-start gap-3 rounded-2xl text-error border-none hover:border-none hover:bg-error/5 active:bg-error/15 shadow-none hover:shadow-none pt-7 pb-7 px-1"
        @click="handleSelect(null)">
        <span class="grid h-8 w-8 place-items-center rounded-full bg-error/20 text-error" aria-hidden="true">
          <XMarkIcon class="h-4 w-4" />
        </span>
        <div class="grid gap-1 text-left">
          <span class="font-semibold">Clear store selection</span>
          <small class="text-xs text-error/70">
            Don't associate items with a specific store
          </small>
        </div>
      </button>

      <div class="relative grid min-h-0 flex-1 gap-1 overflow-y-auto pr-1">
        <button v-for="store in props.stores" :key="store.id" type="button"
          class="flex items-center justify-between h-20 rounded-2xl hover:bg-base-200 px-4 py-3"
          :aria-pressed="props.modelValue === store.id" @click="handleSelect(store.id)">
          <StorePickerItem :store="store" :selected="props.modelValue === store.id" />
        </button>
        <div v-if="!props.stores.length"
          class="absolute inset-0 flex items-center justify-center text-sm text-base-content/50">
          No stores found
        </div>
      </div>
    </div>
  </div>
</template>
