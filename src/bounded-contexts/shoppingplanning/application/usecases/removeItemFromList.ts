import type { ShoppingList } from '../../domain/entities/shoppingList'
import type { RemoveItemInput } from '../dtos/shoppingListDtos'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { Result } from '@/shared/kernel/result'

export class RemoveItemFromList {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  execute(input: RemoveItemInput): Promise<Result<ShoppingList>> {
    return this.repository.removeItem(input.listId, input.itemId)
  }
}
