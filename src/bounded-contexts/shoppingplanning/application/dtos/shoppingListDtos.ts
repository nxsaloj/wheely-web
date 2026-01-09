import type { ListItem, ShoppingList } from '../../domain/entities/shoppingList'

export type SortField = 'productRef' | 'quantity' | 'status'
export type SortDirection = 'asc' | 'desc'

export type SortingType = {
  field: SortField
  direction: SortDirection
}

export interface ShoppingListSummaryDTO {
  id: string
  name: string
  itemCount: number
}

export interface ShoppingListDetailsDTO extends ShoppingListSummaryDTO {
  items: ListItem[]
}

export type CreateShoppingListInput = {
  name: string
}

export type AddItemInput = {
  listId: string
  productRef: string
  quantity?: number
  status?: string
  note?: string
  storeRef?: string
}

export type UpdateItemInput = {
  listId: string
  itemId: string
  productRef?: string
  quantity?: number
  status?: string
  note?: string
  storeRef?: string
}

export type ChangeItemQuantityInput = {
  listId: string
  itemId: string
  delta: number
}

export type RemoveItemInput = {
  listId: string
  itemId: string
}

export type SortItemsInput = {
  listId: string
  field: SortField
  direction: SortDirection
}

export const mapShoppingListToDTO = (list: ShoppingList): ShoppingListDetailsDTO => ({
  id: list.id,
  name: list.name,
  itemCount: list.items.length,
  items: list.items,
})
