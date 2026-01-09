import type { ListItem, ShoppingList } from '../../domain/entities/shoppingList'

export interface ShoppingListSummaryViewModel {
  id: string
  name: string
  itemCount: number
}

export type ListItemViewModel = ListItem

export interface ShoppingListViewModel {
  id: string
  name: string
  itemCount: number
  items: ListItemViewModel[]
}

export const toShoppingListSummaryViewModel = (
  list: ShoppingList,
): ShoppingListSummaryViewModel => ({
  id: list.id,
  name: list.name,
  itemCount: list.items.length,
})

export const toShoppingListViewModel = (list: ShoppingList): ShoppingListViewModel => ({
  id: list.id,
  name: list.name,
  itemCount: list.items.length,
  items: list.items.map((item) => ({ ...item })),
})
