import type { PlannedItemStatus, ShoppingList } from '../../domain/entities/shoppingList'
import type { AddItemInput } from '../dtos/shoppingListDtos'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { Result } from '@/shared/kernel/result'
import { InvalidItemNameError } from '../../domain/errors'
import { err } from '@/shared/kernel/result'

export class AddItemToList {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  async execute(input: AddItemInput): Promise<Result<ShoppingList>> {
    const productRef = input.productRef?.trim() ?? ''
    if (!productRef) {
      return err(new InvalidItemNameError())
    }

    const status: PlannedItemStatus = (input.status as PlannedItemStatus) ?? 'planned'

    return this.repository.addItem(input.listId, {
      productRef,
      quantity: input.quantity ?? 1,
      status,
      storeRef: input.storeRef?.trim(),
      note: input.note?.trim(),
    })
  }
}
