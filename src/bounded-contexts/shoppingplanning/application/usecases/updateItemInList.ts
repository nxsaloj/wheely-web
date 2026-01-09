import { err } from '@/shared/kernel/result'
import type { Result } from '@/shared/kernel/result'
import { InvalidItemNameError } from '../../domain/errors'
import type { PlannedItemStatus, ShoppingList } from '../../domain/entities/shoppingList'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { UpdateItemInput } from '../dtos/shoppingListDtos'

const normalizeText = (value?: string) => value?.trim()

export class UpdateItemInList {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  async execute(input: UpdateItemInput): Promise<Result<ShoppingList>> {
    if (input.productRef !== undefined && !normalizeText(input.productRef)) {
      return err(new InvalidItemNameError())
    }

    const payload = {
      productRef: normalizeText(input.productRef),
      quantity: input.quantity,
      status: input.status as PlannedItemStatus | undefined,
      note: normalizeText(input.note),
      storeRef: normalizeText(input.storeRef),
    }

    return this.repository.updateItem(input.listId, input.itemId, payload)
  }
}
