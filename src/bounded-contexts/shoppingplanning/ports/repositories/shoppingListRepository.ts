import type { SortDirection, SortField } from '../../application/dtos/shoppingListDtos'
import type { ListItem, ShoppingList } from '../../domain/entities/shoppingList'
import type { DomainError } from '@/shared/kernel/errors'
import type { Result } from '@/shared/kernel/result'

export type ShoppingListResult<T = ShoppingList> = Promise<Result<T, DomainError>>
export type SortInput = { field: SortField; direction: SortDirection }

export interface ShoppingListRepository {
  list(): ShoppingListResult<ShoppingList[]>
  getById(id: string): ShoppingListResult
  create(name: string): ShoppingListResult
  addItem(listId: string, item: Omit<ListItem, 'id'>): ShoppingListResult
  updateItem(
    listId: string,
    itemId: string,
    update: Partial<Omit<ListItem, 'id'>>,
  ): ShoppingListResult
  changeItemQuantity(listId: string, itemId: string, delta: number): ShoppingListResult
  removeItem(listId: string, itemId: string): ShoppingListResult
  sortItems(listId: string, sort: SortInput): ShoppingListResult
  duplicate(listId: string): ShoppingListResult
}
