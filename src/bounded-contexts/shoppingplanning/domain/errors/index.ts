import { ConflictError, NotFoundError, ValidationError } from '@/shared/kernel/errors'

export class ListNotFoundError extends NotFoundError {
  constructor(listId: string) {
    super(`Shopping list ${listId} was not found`)
    this.name = 'ListNotFoundError'
  }
}

export class ItemNotFoundError extends NotFoundError {
  constructor(itemId: string) {
    super(`Item ${itemId} was not found in the list`)
    this.name = 'ItemNotFoundError'
  }
}

export class DuplicateListError extends ConflictError {
  constructor(name: string) {
    super(`A list with the name "${name}" already exists`)
    this.name = 'DuplicateListError'
  }
}

export class InvalidListNameError extends ValidationError {
  constructor() {
    super('List name cannot be empty')
    this.name = 'InvalidListNameError'
  }
}

export class InvalidItemNameError extends ValidationError {
  constructor() {
    super('Item name cannot be empty')
    this.name = 'InvalidItemNameError'
  }
}
