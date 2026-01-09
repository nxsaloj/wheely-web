import type { ShoppingList } from '../../domain/entities/shoppingList'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { Result } from '@/shared/kernel/result'

export class GetShoppingList {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  execute(id: string): Promise<Result<ShoppingList>> {
    return this.repository.getById(id)
  }
}
