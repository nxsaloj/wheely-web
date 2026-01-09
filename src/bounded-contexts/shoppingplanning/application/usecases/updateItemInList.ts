import type { PlannedItemStatus, ShoppingList } from '../../domain/entities/shoppingList'
import type { UpdateItemInput } from '../dtos/shoppingListDtos'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { Result } from '@/shared/kernel/result'
import { InvalidItemNameError } from '../../domain/errors'
import { err } from '@/shared/kernel/result'

export class UpdateItemInList {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  async execute(input: UpdateItemInput): Promise<Result<ShoppingList>> {
    if (input.productRef !== undefined && !input.productRef.trim()) {
      return err(new InvalidItemNameError())
    }

    const payload = {
      productRef: input.productRef?.trim(),
      quantity: input.quantity,
      status: input.status as PlannedItemStatus | undefined,
      note: input.note?.trim(),
      storeRef: input.storeRef?.trim(),
    }

    return this.repository.updateItem(input.listId, input.itemId, payload)
  }
}
