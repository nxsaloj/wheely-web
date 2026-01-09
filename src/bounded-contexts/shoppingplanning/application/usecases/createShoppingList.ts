import { err } from '@/shared/kernel/result'
import { InvalidListNameError } from '../../domain/errors'
import type { ShoppingList } from '../../domain/entities/shoppingList'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { CreateShoppingListInput } from '../dtos/shoppingListDtos'
import type { Result } from '@/shared/kernel/result'

const normalizeText = (value?: string) => value?.trim() ?? ''

export class CreateShoppingList {
  private readonly repository: ShoppingListRepository

  constructor(repository: ShoppingListRepository) {
    this.repository = repository
  }

  async execute(input: CreateShoppingListInput): Promise<Result<ShoppingList>> {
    const name = normalizeText(input.name)
    if (!name) {
      return err(new InvalidListNameError())
    }
    return this.repository.create(name)
  }
}
