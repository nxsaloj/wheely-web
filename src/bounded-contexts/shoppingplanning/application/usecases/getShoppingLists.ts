import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { ShoppingList } from '../../domain/entities/shoppingList'
import type { Result } from '@/shared/kernel/result'

export class GetShoppingLists {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  execute(): Promise<Result<ShoppingList[]>> {
    return this.repository.list()
  }
}
