import type { ListItem, ShoppingList } from '../../domain/entities/shoppingList'
import type { Result } from '@/shared/kernel/result'
import type { DomainError } from '@/shared/kernel/errors'
import type { SortDirection, SortField } from '../../application/dtos/shoppingListDtos'

export type ShoppingListResult<T = ShoppingList> = Promise<Result<T, DomainError>>

export interface ShoppingListRepository {
  list(): ShoppingListResult<ShoppingList[]>
  getById(id: string): ShoppingListResult
  create(name: string): ShoppingListResult
  addItem(listId: string, item: Omit<ListItem, 'id'>): ShoppingListResult
  updateItem(listId: string, itemId: string, update: Partial<Omit<ListItem, 'id'>>): ShoppingListResult
  changeItemQuantity(listId: string, itemId: string, delta: number): ShoppingListResult
  removeItem(listId: string, itemId: string): ShoppingListResult
  sortItems(listId: string, sort: { field: SortField; direction: SortDirection }): ShoppingListResult
  duplicate(listId: string): ShoppingListResult
}
