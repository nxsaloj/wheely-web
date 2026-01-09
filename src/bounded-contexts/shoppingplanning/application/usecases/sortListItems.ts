import type { ShoppingList } from '../../domain/entities/shoppingList'
import type { SortItemsInput } from '../dtos/shoppingListDtos'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { Result } from '@/shared/kernel/result'

export class SortListItems {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  execute(input: SortItemsInput): Promise<Result<ShoppingList>> {
    return this.repository.sortItems(input.listId, {
      field: input.field,
      direction: input.direction,
    })
  }
}
