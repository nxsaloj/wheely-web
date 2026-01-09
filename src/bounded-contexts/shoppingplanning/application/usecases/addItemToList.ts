import { err } from '@/shared/kernel/result'
import type { Result } from '@/shared/kernel/result'
import { InvalidItemNameError } from '../../domain/errors'
import type { PlannedItemStatus, ShoppingList } from '../../domain/entities/shoppingList'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { AddItemInput } from '../dtos/shoppingListDtos'

const normalizeText = (value?: string) => value?.trim()

export class AddItemToList {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  async execute(input: AddItemInput): Promise<Result<ShoppingList>> {
    const productRef = normalizeText(input.productRef) ?? ''
    if (!productRef) {
      return err(new InvalidItemNameError())
    }

    const status: PlannedItemStatus = (input.status as PlannedItemStatus | undefined) ?? 'planned'

    return this.repository.addItem(input.listId, {
      productRef,
      quantity: input.quantity ?? 1,
      status,
      storeRef: normalizeText(input.storeRef),
      note: normalizeText(input.note),
    })
  }
}
