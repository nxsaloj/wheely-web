import { defineStore } from 'pinia'
import { shoppingPlanningModule } from '@/app/di/container'
import { isOk } from '@/shared/kernel/result'
import {
  toShoppingListSummaryViewModel,
  toShoppingListViewModel,
  type ShoppingListSummaryViewModel,
  type ShoppingListViewModel,
} from '../view-models/shoppingListViewModels'
import type { SortingType } from '../../application/dtos/shoppingListDtos'
import type { ShoppingList } from '../../domain/entities/shoppingList'

interface State {
  lists: ShoppingListSummaryViewModel[]
  selectedList: ShoppingListViewModel | null
  loadingLists: boolean
  loadingList: boolean
  saving: boolean
  error: string | null
  activeSort: SortingType
}

const { useCases } = shoppingPlanningModule

export const itemSortOptions: {
  label: string
  value: SortingType
}[] = [
  { label: 'Product (A-Z)', value: { field: 'productRef', direction: 'asc' } },
  { label: 'Quantity ↑', value: { field: 'quantity', direction: 'asc' } },
  { label: 'Quantity ↓', value: { field: 'quantity', direction: 'desc' } },
  { label: 'Status', value: { field: 'status', direction: 'asc' } },
]

export const useShoppingPlanningStore = defineStore('shoppingPlanning', {
  state: (): State => ({
    lists: [],
    selectedList: null,
    loadingLists: false,
    loadingList: false,
    saving: false,
    error: null,
    activeSort: itemSortOptions[0]?.value ?? { field: 'productRef', direction: 'asc' },
  }),
  getters: {
    hasLists: (state) => state.lists.length > 0,
  },
  actions: {
    setError(message: string | null) {
      this.error = message
    },
    async fetchLists() {
      this.loadingLists = true
      this.error = null
      const result = await useCases.getShoppingLists.execute()
      this.loadingLists = false
      if (!isOk(result)) {
        this.error = result.error.message
        return
      }
      this.lists = result.value.map(toShoppingListSummaryViewModel)
    },
    async fetchList(id: string) {
      this.loadingList = true
      this.error = null
      const result = await useCases.getShoppingList.execute(id)
      this.loadingList = false
      if (!isOk(result)) {
        this.error = result.error.message
        this.selectedList = null
        return
      }
      this.selectedList = toShoppingListViewModel(result.value)
      this.upsertSummary(result.value)
    },
    async createList(name: string) {
      this.saving = true
      this.error = null
      const result = await useCases.createShoppingList.execute({ name })
      this.saving = false
      if (!isOk(result)) {
        this.error = result.error.message
        return false
      }
      this.upsertSummary(result.value, true)
      return true
    },
    async addItem(payload: {
      listId: string
      productRef: string
      quantity?: number
      status?: string
      note?: string
      storeRef?: string
    }) {
      this.saving = true
      this.error = null
      const result = await useCases.addItemToList.execute(payload)
      this.saving = false
      if (!isOk(result)) {
        this.error = result.error.message
        return false
      }
      this.updateSelected(result.value)
      this.upsertSummary(result.value)
      return true
    },
    async updateItem(payload: {
      listId: string
      itemId: string
      productRef?: string
      quantity?: number
      status?: string
      note?: string
      storeRef?: string
    }) {
      this.saving = true
      this.error = null
      const result = await useCases.updateItemInList.execute(payload)
      this.saving = false
      if (!isOk(result)) {
        this.error = result.error.message
        return false
      }
      this.updateSelected(result.value)
      this.upsertSummary(result.value)
      return true
    },
    async changeQuantity(listId: string, itemId: string, delta: number) {
      this.error = null
      const result = await useCases.changeItemQuantity.execute({ listId, itemId, delta })
      if (!isOk(result)) {
        this.error = result.error.message
        return false
      }
      this.updateSelected(result.value)
      this.upsertSummary(result.value)
      return true
    },
    async removeItem(listId: string, itemId: string) {
      this.error = null
      const result = await useCases.removeItemFromList.execute({ listId, itemId })
      if (!isOk(result)) {
        this.error = result.error.message
        return false
      }
      this.updateSelected(result.value)
      this.upsertSummary(result.value)
      return true
    },
    async sortItems(sort: SortingType) {
      if (!this.selectedList) return
      const previous = this.activeSort
      this.activeSort = sort
      const result = await useCases.sortListItems.execute({
        listId: this.selectedList.id,
        field: sort.field,
        direction: sort.direction,
      })
      if (!isOk(result)) {
        this.error = result.error.message
        this.activeSort = previous
        return false
      }
      this.updateSelected(result.value)
      return true
    },
    async duplicateSelected() {
      if (!this.selectedList) return false
      this.error = null
      const result = await useCases.duplicateShoppingList.execute(this.selectedList.id)
      if (!isOk(result)) {
        this.error = result.error.message
        return false
      }
      this.upsertSummary(result.value, true)
      return true
    },
    updateSelected(list: ShoppingList) {
      if (this.selectedList && this.selectedList.id === list.id) {
        this.selectedList = toShoppingListViewModel(list)
      }
    },
    upsertSummary(list: ShoppingList, prepend = false) {
      const summary = toShoppingListSummaryViewModel(list)
      const idx = this.lists.findIndex((l) => l.id === summary.id)
      if (idx >= 0) this.lists.splice(idx, 1, summary)
      else if (prepend) this.lists.unshift(summary)
      else this.lists.push(summary)
    },
  },
})
