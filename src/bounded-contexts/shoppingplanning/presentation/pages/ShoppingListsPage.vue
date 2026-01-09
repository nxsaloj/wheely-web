<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRightIcon,
  BookmarkIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import { useShoppingPlanningStore } from '../stores/shoppingPlanningStore'

const router = useRouter()
const store = useShoppingPlanningStore()
const showDialog = ref(false)
const newListName = ref('')

const loading = computed(() => store.loadingLists)
const lists = computed(() => store.lists)
const pinnedLists = computed(() => lists.value.slice(0, Math.min(2, lists.value.length)))
const otherLists = computed(() => lists.value.slice(pinnedLists.value.length))

onMounted(() => {
  store.fetchLists()
})

const createList = async () => {
  if (!newListName.value.trim()) return
  const success = await store.createList(newListName.value)
  if (success) {
    newListName.value = ''
    showDialog.value = false
  }
}

const openList = (id: string) => {
  router.push({ name: 'shopping-list-detail', params: { id } })
}
</script>

<template>
  <section class="min-h-screen bg-base-200 py-4 px-3 sm:px-6">
    <div class="mx-auto w-full max-w-4xl space-y-4">
      <div class="flex items-center justify-between">
        <button type="button" class="btn btn-ghost btn-xs text-base-content/60 normal-case">Edit</button>
        <button type="button" class="btn btn-ghost btn-circle btn-sm">
          <Cog6ToothIcon class="h-5 w-5" />
        </button>
      </div>

      <div class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-base-content">All Lists</h1>
            <button type="button" class="btn btn-ghost text-primary font-semibold px-2" @click="showDialog = true">
              New list
            </button>
          </div>
          <div
            class="input border border-slate-200 flex items-center gap-2 focus-within:ring-0 focus-within:shadow-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-base-content/50" />
            <input id="search-lists" type="text" placeholder="Search lists..."
              class="grow focus:outline-none focus:ring-0" aria-label="Search lists" />
          </div>
        </div>

        <div v-if="store.error" class="rounded-xl bg-error/10 px-4 py-3 text-error border border-error/20">
          {{ store.error }}
        </div>

        <div class="space-y-3">
          <div class="text-xs font-semibold uppercase tracking-wide text-base-content/50">Pinned</div>
          <div class="grid gap-3 md:grid-cols-2">
            <div v-for="(list, idx) in pinnedLists" :key="list.id"
              class="flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm border border-base-300/40 bg-base-100"
              @click="openList(list.id)">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-xl text-white text-lg font-semibold"
                  :class="idx === 0 ? 'bg-primary' : 'bg-secondary'">
                  <ArrowRightIcon class="h-5 w-5" />
                </div>
                <div class="flex flex-col">
                  <span class="text-base font-semibold text-base-content">{{ list.name }}</span>
                  <span class="text-xs text-base-content/60">{{ list.itemCount }} items • Updated recently</span>
                </div>
              </div>
              <ChevronRightIcon class="h-5 w-5 text-base-content/40" />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-xs font-semibold uppercase tracking-wide text-base-content/50">Others</div>
          <div v-if="loading" class="text-base-content/60 text-sm">Loading lists...</div>
          <div v-else-if="!store.hasLists" class="text-base-content/60 text-sm">No lists yet. Create your first one.
          </div>
          <div v-else class="grid gap-3 md:grid-cols-2">
            <div v-for="(list, idx) in otherLists" :key="list.id"
              class="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-base-100 transition cursor-pointer border border-transparent hover:border-base-300/50"
              @click="openList(list.id)">
              <div class="flex items-center gap-3">
                <span class="h-2.5 w-2.5 rounded-full"
                  :class="idx % 3 === 0 ? 'bg-warning' : idx % 3 === 1 ? 'bg-success' : 'bg-error'" />
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-base-content">{{ list.name }}</span>
                  <span class="text-xs text-base-content/60">{{ list.itemCount }} items</span>
                </div>
              </div>
              <span class="text-xs text-base-content/40">Home</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="button" class="btn btn-success btn-circle shadow-lg" @click="showDialog = true">
          <PlusIcon class="h-6 w-6" />
        </button>
      </div>
    </div>
  </section>

  <div v-if="showDialog" class="fixed inset-0 z-50 grid place-items-center">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showDialog = false" />
    <div class="relative z-10 w-full max-w-md rounded-xl bg-base-100 p-5 shadow-2xl space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="m-0 text-lg font-semibold">Create shopping list</h3>
        <button type="button" class="btn btn-ghost btn-sm" @click="showDialog = false">Close</button>
      </div>
      <div class="grid grid-cols-[1fr,auto] gap-3 items-center">
        <div
          class="input input-bordered flex items-center gap-2 focus-within:outline-none focus-within:ring-0 focus-within:border-b focus-within:border-base-300">
          <BookmarkIcon class="h-4 w-4 text-base-content/50" />
          <input id="new-list-name" v-model.trim="newListName" type="text" placeholder="List name" autocomplete="off"
            autofocus aria-label="List name" class="focus:outline-none focus:ring-0" @keyup.enter="createList" />
        </div>
        <button type="button" class="btn btn-primary" :disabled="!newListName" @click="createList">
          Create
        </button>
      </div>
    </div>
  </div>
</template>
