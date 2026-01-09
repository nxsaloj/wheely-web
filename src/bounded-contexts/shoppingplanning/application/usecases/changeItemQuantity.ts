import type { ShoppingList } from '../../domain/entities/shoppingList'
import type { ChangeItemQuantityInput } from '../dtos/shoppingListDtos'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { Result } from '@/shared/kernel/result'

export class ChangeItemQuantity {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  execute(input: ChangeItemQuantityInput): Promise<Result<ShoppingList>> {
    return this.repository.changeItemQuantity(input.listId, input.itemId, input.delta)
  }
}
