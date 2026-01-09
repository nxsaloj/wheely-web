<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, FunnelIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { useShoppingPlanningStore } from '../stores/shoppingPlanningStore'
import type { ListItemViewModel } from '../view-models/shoppingListViewModels'
import ShoppingListItemCard from '../components/ShoppingListItemCard.vue'
import EditItemDialog from '../components/EditItemDialog.vue'
import StorePickerSheet, { type StoreOption } from '../components/StorePickerSheet.vue'
import AddItemComposer, { type AddItemPayload } from '../components/AddItemComposer.vue'
import type { SortingType } from '../../application/dtos/shoppingListDtos'

// accept id from router props to avoid extraneous-attr warnings
// (we still read the list id from route params)
defineProps<{ id?: string }>()

const route = useRoute()
const router = useRouter()
const store = useShoppingPlanningStore()
const storeSearch = ref('')
const storeSelection = reactive<{ itemId: string | null }>({ itemId: null })
const storePickerVisible = ref(false)
const storeSelectionContext = ref<'add' | 'item' | 'edit'>('add')

const addItemForm = reactive({
  storeRef: '',
})

const editState = reactive({
  visible: false,
  itemId: '',
  productRef: '',
  quantity: 1,
  status: 'planned' as 'planned' | 'optional',
  note: '',
  storeRef: '',
})

const selectedList = computed(() => store.selectedList)
const items = computed(() => selectedList.value?.items ?? [])
const selectedStoreRef = computed(() => {
  if (!storeSelection.itemId) return ''
  const item = items.value.find((i) => i.id === storeSelection.itemId)
  return item?.storeRef ?? ''
})
const activeStoreValue = computed(() => {
  if (storeSelectionContext.value === 'item') return selectedStoreRef.value
  if (storeSelectionContext.value === 'edit') return editState.storeRef
  return addItemForm.storeRef
})
const storeOptions = ref<StoreOption[]>([
  {
    id: 'whole-foods',
    name: 'Whole Foods Market',
    subtitle: '1.2 mi • 3rd St & Fairfax',
    imageUrl: 'https://images.unsplash.com/photo-1580915411954-282cb1c9c4ef?auto=format&fit=crop&w=60&q=60',
  },
  {
    id: 'trader-joes',
    name: "Trader Joe's",
    subtitle: 'Currently Selected',
    imageUrl: 'https://images.unsplash.com/photo-1568643186300-5c9f6467db5d?auto=format&fit=crop&w=60&q=60',
  },
  {
    id: 'central-market',
    name: 'Central Market',
    subtitle: 'Local favorite',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=60&q=60',
  },
  {
    id: 'target',
    name: 'Target',
    subtitle: '0.5 mi • Beverly Center',
    imageUrl: 'https://images.unsplash.com/photo-1580915411954-282cb1c9c4ef?auto=format&fit=crop&w=60&q=60',
  },
  {
    id: 'costco',
    name: 'Costco Wholesale',
    subtitle: '3.8 mi • Marina Del Rey',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=60&q=60',
  },
  {
    id: 'local-market',
    name: "Local Farmer's Market",
    subtitle: 'Every Sunday • 9AM - 2PM',
    imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=60&q=60',
  },
  {
    id: 'sprouts',
    name: 'Sprouts Farmers Market',
    subtitle: '2.1 mi • Wilshire Blvd',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=60&q=60',
  },
  {
    id: 'ralphs',
    name: "Ralphs",
    subtitle: 'Open until 10PM',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=60&q=60',
  },
  {
    id: 'trader-joes-hollywood',
    name: "Trader Joe's - Hollywood",
    subtitle: '1.7 mi • Hollywood Blvd',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=60&q=60',
  },
  {
    id: 'hardware-store',
    name: 'Hardware Store',
    subtitle: 'Every Sunday • 9AM - 2PM',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=60&q=60',
  },
])
const storeSearchFilter = ref('')
const addComposerRef = ref<InstanceType<typeof AddItemComposer> | null>(null)

const filterTerm = computed(() => (storeSearchFilter.value || storeSearch.value || '').toLowerCase().trim())

const filteredStores = computed(() => {
  if (!filterTerm.value) return storeOptions.value
  return storeOptions.value.filter((s) => s.name.toLowerCase().includes(filterTerm.value))
})

const editStoreLabel = computed(
  () => storeOptions.value.find((s) => s.id === editState.storeRef)?.name ?? '',
)

const groupedItems = computed(() => {
  const groups: { key: string; name: string; items: ListItemViewModel[] }[] = []
  const byStore: Record<string, ListItemViewModel[]> = {}

  items.value.forEach((item) => {
    const key = item.storeRef || 'unassigned'
    if (!byStore[key]) {
      byStore[key] = []
    }
    byStore[key].push(item)
  })

  const unassigned = byStore['unassigned'] ?? []
  if (unassigned.length) {
    groups.push({ key: 'unassigned', name: 'Unassigned', items: unassigned })
  }

  Object.entries(byStore)
    .filter(([key]) => key !== 'unassigned')
    .sort(([, a], [, b]) => {
      const nameA = storeOptions.value.find((s) => s.id === a[0]?.storeRef)?.name || a[0]?.storeRef || ''
      const nameB = storeOptions.value.find((s) => s.id === b[0]?.storeRef)?.name || b[0]?.storeRef || ''
      return nameA.localeCompare(nameB)
    })
    .forEach(([key, list]) => {
      const label = storeOptions.value.find((s) => s.id === key)?.name || key
      groups.push({ key, name: label, items: list })
    })

  return groups
})

watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string') {
      store.fetchList(id)
    }
  },
  { immediate: true },
)

const submitAddItem = async (payload: AddItemPayload) => {
  if (!selectedList.value) return
  if (!payload.productRef.trim()) return

  const success = await store.addItem({
    listId: selectedList.value.id,
    ...payload,
  })
  if (success) {
    addComposerRef.value?.resetAfterAdd(true)
  }
}

const openEdit = (item: ListItemViewModel) => {
  editState.visible = true
  editState.itemId = item.id
  editState.productRef = item.productRef
  editState.quantity = item.quantity
  editState.status = item.status
  editState.note = item.note ?? ''
  editState.storeRef = item.storeRef ?? ''
}

const saveEdit = async () => {
  if (!selectedList.value) return
  const success = await store.updateItem({
    listId: selectedList.value.id,
    itemId: editState.itemId,
    productRef: editState.productRef,
    note: editState.note,
    status: editState.status,
    storeRef: editState.storeRef,
    quantity: editState.quantity,
  })
  if (success) {
    editState.visible = false
  }
}

const changeQuantity = async (itemId: string, delta: number) => {
  if (!selectedList.value) return
  await store.changeQuantity(selectedList.value.id, itemId, delta)
}

const toggleItemStatus = async (item: ListItemViewModel) => {
  if (!selectedList.value) return
  const nextStatus = item.status === 'planned' ? 'optional' : 'planned'
  await store.updateItem({
    listId: selectedList.value.id,
    itemId: item.id,
    status: nextStatus,
  })
}

const removeItem = async (itemId: string) => {
  if (!selectedList.value) return
  if (!confirm('Remove this item?')) return
  await store.removeItem(selectedList.value.id, itemId)
}

const changeSort = async (sort: SortingType) => {
  await store.sortItems(sort)
}

const goBack = () => router.push({ name: 'shopping-lists' })


const openStorePanel = (_event: Event, itemId: string) => {
  storeSelectionContext.value = 'item'
  storeSelection.itemId = itemId
  storeSearch.value = ''
  storeSearchFilter.value = ''
  storePickerVisible.value = true
}

const applyStore = async (storeId: string | null) => {
  if (!selectedList.value || !storeSelection.itemId) return
  await store.updateItem({
    listId: selectedList.value.id,
    itemId: storeSelection.itemId,
    storeRef: storeId ?? '',
  })
  storePickerVisible.value = false
  storeSelection.itemId = null
}

const onItemStoreClick = (event: Event, itemId: string) => {
  openStorePanel(event, itemId)
}

const openStorePicker = () => {
  storeSelectionContext.value = 'add'
  storeSelection.itemId = null
  storeSearchFilter.value = ''
  storePickerVisible.value = true
}

const applyStoreSelection = (storeId: string | null) => {
  if (storeSelectionContext.value === 'item') {
    applyStore(storeId)
  } else if (storeSelectionContext.value === 'edit') {
    editState.storeRef = storeId ?? ''
    storePickerVisible.value = false
  } else {
    addItemForm.storeRef = storeId || ''
    storePickerVisible.value = false
  }
}

const onStoreSearch = (value: string) => {
  storeSearchFilter.value = value
}

const openEditStorePicker = () => {
  storeSelectionContext.value = 'edit'
  storeSelection.itemId = null
  storeSearchFilter.value = ''
  storePickerVisible.value = true
}

</script>

<template>
  <section class="min-h-screen bg-base-100 px-4 py-4 sm:px-6 space-y-5">
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <button type="button" class="btn btn-ghost btn-circle btn-sm" @click="goBack">
            <ArrowLeftIcon class="h-5 w-5" />
          </button>
          <h2 class="text-2xl font-bold text-base-content m-0">{{ selectedList?.name || 'Shopping list' }}</h2>
        </div>
        <p class="text-sm text-base-content/45 pl-9">{{ selectedList?.itemCount || 0 }} items</p>
      </div>
      <button type="button" class="btn btn-ghost btn-circle btn-sm text-base-content/50" aria-label="Sort / Filter"
        @click="() => changeSort(store.activeSort)">
        <FunnelIcon class="h-5 w-5" />
      </button>
    </div>

    <div v-if="store.error" class="rounded-xl bg-error/10 px-4 py-3 text-error border border-error/20">
      {{ store.error }}
    </div>

    <AddItemComposer ref="addComposerRef" :pending-store="addItemForm.storeRef || ''" :stores="storeOptions"
      @add="(payload) => submitAddItem(payload)" @open-store-picker="openStorePicker" />

    <div class="space-y-6">
      <template v-for="group in groupedItems" :key="group.key">
        <div class="space-y-3">
          <div v-if="groupedItems.length > 1 || group.key !== 'unassigned'" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wide text-base-content/45">
                {{ group.name }}
              </span>
              <button type="button" class="btn btn-ghost btn-xs text-base-content/40" aria-label="Edit group">
                <PencilSquareIcon class="h-4 w-4" />
              </button>
            </div>
            <span v-if="group.items.length" class="badge badge-sm border-0 bg-base-200 text-base-content/50">
              {{ group.items.length }} items
            </span>
          </div>

          <div class="divide-y divide-base-200">
            <ShoppingListItemCard v-for="item in group.items" :key="item.id" :item="item" class="px-1"
              @change-quantity="(delta) => changeQuantity(item.id, delta)" @toggle-status="() => toggleItemStatus(item)"
              @edit="openEdit(item)" @remove="removeItem(item.id)" @store-click="(e) => onItemStoreClick(e, item.id)" />
          </div>
        </div>
      </template>
    </div>
  </section>

  <EditItemDialog
    v-model:visible="editState.visible"
    v-model:state="editState"
    :store-label="editStoreLabel"
    :saving="store.saving"
    @apply="saveEdit"
    @open-store-picker="openEditStorePicker"
  />

  <StorePickerSheet v-model:visible="storePickerVisible" :stores="filteredStores" :modelValue="activeStoreValue || null"
    @select="applyStoreSelection" @search="onStoreSearch" />
</template>
