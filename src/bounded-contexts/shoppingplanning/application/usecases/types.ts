import type { AddItemToList } from './addItemToList'
import type { ChangeItemQuantity } from './changeItemQuantity'
import type { CreateShoppingList } from './createShoppingList'
import type { GetShoppingList } from './getShoppingList'
import type { GetShoppingLists } from './getShoppingLists'
import type { RemoveItemFromList } from './removeItemFromList'
import type { SortListItems } from './sortListItems'
import type { UpdateItemInList } from './updateItemInList'
import type { DuplicateShoppingList } from './duplicateShoppingList'

export interface ShoppingPlanningUseCases {
  createShoppingList: CreateShoppingList
  getShoppingLists: GetShoppingLists
  getShoppingList: GetShoppingList
  addItemToList: AddItemToList
  updateItemInList: UpdateItemInList
  changeItemQuantity: ChangeItemQuantity
  removeItemFromList: RemoveItemFromList
  sortListItems: SortListItems
  duplicateShoppingList: DuplicateShoppingList
}
