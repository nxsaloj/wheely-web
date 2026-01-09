import { ConflictError, NotFoundError, ValidationError } from '@/shared/kernel/errors'

const listNotFoundMessage = (listId: string) => `Shopping list ${listId} was not found`
const itemNotFoundMessage = (itemId: string) => `Item ${itemId} was not found in the list`
const duplicateListMessage = (name: string) => `A list with the name "${name}" already exists`
const invalidListNameMessage = () => 'List name cannot be empty'
const invalidItemNameMessage = () => 'Item name cannot be empty'

export class ListNotFoundError extends NotFoundError {
  constructor(listId: string) {
    super(listNotFoundMessage(listId))
    this.name = 'ListNotFoundError'
  }
}

export class ItemNotFoundError extends NotFoundError {
  constructor(itemId: string) {
    super(itemNotFoundMessage(itemId))
    this.name = 'ItemNotFoundError'
  }
}

export class DuplicateListError extends ConflictError {
  constructor(name: string) {
    super(duplicateListMessage(name))
    this.name = 'DuplicateListError'
  }
}

export class InvalidListNameError extends ValidationError {
  constructor() {
    super(invalidListNameMessage())
    this.name = 'InvalidListNameError'
  }
}

export class InvalidItemNameError extends ValidationError {
  constructor() {
    super(invalidItemNameMessage())
    this.name = 'InvalidItemNameError'
  }
}
