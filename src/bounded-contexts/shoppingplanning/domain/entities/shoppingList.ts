export type PlannedItemStatus = 'planned' | 'optional'

export interface ListItem {
  id: string
  productRef: string
  quantity: number
  status: PlannedItemStatus
  storeRef?: string
  note?: string
}

export interface ShoppingList {
  id: string
  name: string
  items: ListItem[]
}

export const getListItemCount = (list: ShoppingList) => list.items.length
