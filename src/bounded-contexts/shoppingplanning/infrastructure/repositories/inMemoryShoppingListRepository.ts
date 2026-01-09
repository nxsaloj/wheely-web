import { err, ok, type Result } from '@/shared/kernel/result'
import { delay } from '@/shared/kernel/utils/delay'
import { createId } from '@/shared/kernel/utils/ids'
import {
  DuplicateListError,
  InvalidItemNameError,
  InvalidListNameError,
  ItemNotFoundError,
  ListNotFoundError,
} from '../../domain/errors'
import type { ListItem, ShoppingList } from '../../domain/entities/shoppingList'
import type { SortField } from '../../application/dtos/shoppingListDtos'
import type {
  ShoppingListRepository,
  SortInput,
} from '../../ports/repositories/shoppingListRepository'
import type { DomainError } from '@/shared/kernel/errors'

type RepoResult<T = ShoppingList> = Promise<Result<T, DomainError>>

const cloneList = (list: ShoppingList): ShoppingList => ({
  ...list,
  items: list.items.map((item) => ({ ...item })),
})

const seedLists: ShoppingList[] = [
  {
    id: 'list-groceries',
    name: 'Weekly Groceries',
    items: [
      {
        id: 'item-milk',
        productRef: 'Milk',
        quantity: 2,
        status: 'planned',
        storeRef: 'Central Market',
      },
      {
        id: 'item-eggs',
        productRef: 'Eggs',
        quantity: 12,
        status: 'optional',
      },
    ],
  },
]

let lists: ShoppingList[] = seedLists.map((list) => cloneList(list))
const simulateLatency = () => delay(150)
const normalizeText = (value?: string) => value?.trim() ?? ''

export class InMemoryShoppingListRepository implements ShoppingListRepository {
  async list(): RepoResult<ShoppingList[]> {
    await simulateLatency()
    return ok(lists.map((l) => cloneList(l)))
  }

  async getById(id: string): RepoResult {
    await simulateLatency()
    const result = findListById(id)
    if (!result.ok) return result
    return ok(cloneList(result.value))
  }

  async create(name: string): RepoResult {
    await simulateLatency()
    const trimmed = normalizeText(name)
    if (!trimmed) return err(new InvalidListNameError())
    if (lists.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
      return err(new DuplicateListError(trimmed))
    }
    const list: ShoppingList = { id: createId(), name: trimmed, items: [] }
    lists = [list, ...lists]
    return ok(cloneList(list))
  }

  async addItem(listId: string, item: Omit<ListItem, 'id'>): RepoResult {
    await simulateLatency()
    const result = findListById(listId)
    if (!result.ok) return result
    const list = result.value
    const name = normalizeText(item.productRef)
    if (!name) return err(new InvalidItemNameError())
    const newItem: ListItem = {
      ...item,
      id: createId(),
      productRef: name,
      status: item.status ?? 'planned',
    }
    list.items.push(newItem)
    return ok(cloneList(list))
  }

  async updateItem(
    listId: string,
    itemId: string,
    update: Partial<Omit<ListItem, 'id'>>,
  ): RepoResult {
    await simulateLatency()
    const listResult = findListById(listId)
    if (!listResult.ok) return listResult
    const list = listResult.value
    const itemResult = findItemById(list, itemId)
    if (!itemResult.ok) return itemResult
    const item = itemResult.value
    if (update.productRef !== undefined) {
      const name = normalizeText(update.productRef)
      if (!name) return err(new InvalidItemNameError())
      item.productRef = name
    }
    if (update.quantity !== undefined) item.quantity = update.quantity
    if (update.status !== undefined) item.status = update.status
    if (update.note !== undefined) item.note = normalizeText(update.note) || undefined
    if (update.storeRef !== undefined) item.storeRef = normalizeText(update.storeRef) || undefined
    return ok(cloneList(list))
  }

  async changeItemQuantity(listId: string, itemId: string, delta: number): RepoResult {
    await simulateLatency()
    const listResult = findListById(listId)
    if (!listResult.ok) return listResult
    const list = listResult.value
    const itemResult = findItemById(list, itemId)
    if (!itemResult.ok) return itemResult
    const item = itemResult.value
    const next = item.quantity + delta
    if (next <= 0) {
      list.items = list.items.filter((i) => i.id !== itemId)
    } else {
      item.quantity = next
    }
    return ok(cloneList(list))
  }

  async removeItem(listId: string, itemId: string): RepoResult {
    await simulateLatency()
    const listResult = findListById(listId)
    if (!listResult.ok) return listResult
    const list = listResult.value
    const itemIndex = list.items.findIndex((i) => i.id === itemId)
    if (itemIndex === -1) return err(new ItemNotFoundError(itemId))
    list.items.splice(itemIndex, 1)
    return ok(cloneList(list))
  }

  async sortItems(listId: string, sort: SortInput): RepoResult {
    await simulateLatency()
    const listResult = findListById(listId)
    if (!listResult.ok) return listResult
    const list = listResult.value
    const multiplier = sort.direction === 'desc' ? -1 : 1
    list.items.sort((a, b) => compareItems(sort.field, a, b) * multiplier)
    return ok(cloneList(list))
  }

  async duplicate(listId: string): RepoResult {
    await simulateLatency()
    const listResult = findListById(listId)
    if (!listResult.ok) return listResult
    const list = listResult.value
    const copy: ShoppingList = {
      id: createId(),
      name: `${list.name} Copy`,
      items: list.items.map((i) => ({ ...i, id: createId() })),
    }
    lists.unshift(copy)
    return ok(cloneList(copy))
  }
}

const compareItems = (field: SortField, a: ListItem, b: ListItem) => {
  switch (field) {
    case 'productRef':
      return a.productRef.localeCompare(b.productRef)
    case 'status':
      return a.status.localeCompare(b.status)
    case 'quantity':
    default:
      return a.quantity - b.quantity
  }
}

const findListById = (listId: string): Result<ShoppingList, DomainError> => {
  const list = lists.find((l) => l.id === listId)
  if (!list) return err(new ListNotFoundError(listId))
  return ok(list)
}

const findItemById = (list: ShoppingList, itemId: string): Result<ListItem, DomainError> => {
  const item = list.items.find((i) => i.id === itemId)
  if (!item) return err(new ItemNotFoundError(itemId))
  return ok(item)
}
