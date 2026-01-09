import type { ShoppingList } from '../../domain/entities/shoppingList'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { Result } from '@/shared/kernel/result'

export class DuplicateShoppingList {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  execute(listId: string): Promise<Result<ShoppingList>> {
    return this.repository.duplicate(listId)
  }
}
