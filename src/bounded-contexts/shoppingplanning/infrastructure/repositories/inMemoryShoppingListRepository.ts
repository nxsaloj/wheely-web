import type { ListItem, ShoppingList } from '../../domain/entities/shoppingList'
import {
  DuplicateListError,
  InvalidItemNameError,
  InvalidListNameError,
  ItemNotFoundError,
  ListNotFoundError,
} from '../../domain/errors'
import type { ShoppingListRepository } from '../../ports/repositories/shoppingListRepository'
import type { SortDirection, SortField } from '../../application/dtos/shoppingListDtos'
import { delay } from '@/shared/kernel/utils/delay'
import { createId } from '@/shared/kernel/utils/ids'
import { err, ok, type Result } from '@/shared/kernel/result'
import type { DomainError } from '@/shared/kernel/errors'

type RepoResult<T = ShoppingList> = Promise<Result<T, DomainError>>

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

let lists: ShoppingList[] = seedLists.map((l) => cloneList(l))
const simulateLatency = () => delay(150)

export class InMemoryShoppingListRepository implements ShoppingListRepository {
  async list(): RepoResult<ShoppingList[]> {
    await simulateLatency()
    return ok(lists.map((l) => cloneList(l)))
  }

  async getById(id: string): RepoResult {
    await simulateLatency()
    const list = lists.find((l) => l.id === id)
    if (!list) return err(new ListNotFoundError(id))
    return ok(cloneList(list))
  }

  async create(name: string): RepoResult {
    await simulateLatency()
    const trimmed = name.trim()
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
    const list = lists.find((l) => l.id === listId)
    if (!list) return err(new ListNotFoundError(listId))
    const name = item.productRef.trim()
    if (!name) return err(new InvalidItemNameError())
    const newItem: ListItem = { ...item, id: createId(), productRef: name, status: item.status ?? 'planned' }
    list.items.push(newItem)
    return ok(cloneList(list))
  }

  async updateItem(listId: string, itemId: string, update: Partial<Omit<ListItem, 'id'>>): RepoResult {
    await simulateLatency()
    const list = lists.find((l) => l.id === listId)
    if (!list) return err(new ListNotFoundError(listId))
    const item = list.items.find((i) => i.id === itemId)
    if (!item) return err(new ItemNotFoundError(itemId))
    if (update.productRef !== undefined) {
      const name = update.productRef.trim()
      if (!name) return err(new InvalidItemNameError())
      item.productRef = name
    }
    if (update.quantity !== undefined) item.quantity = update.quantity
    if (update.status !== undefined) item.status = update.status as any
    if (update.note !== undefined) item.note = update.note?.trim() || undefined
    if (update.storeRef !== undefined) item.storeRef = update.storeRef?.trim() || undefined
    return ok(cloneList(list))
  }

  async changeItemQuantity(listId: string, itemId: string, delta: number): RepoResult {
    await simulateLatency()
    const list = lists.find((l) => l.id === listId)
    if (!list) return err(new ListNotFoundError(listId))
    const item = list.items.find((i) => i.id === itemId)
    if (!item) return err(new ItemNotFoundError(itemId))
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
    const list = lists.find((l) => l.id === listId)
    if (!list) return err(new ListNotFoundError(listId))
    const idx = list.items.findIndex((i) => i.id === itemId)
    if (idx === -1) return err(new ItemNotFoundError(itemId))
    list.items.splice(idx, 1)
    return ok(cloneList(list))
  }

  async sortItems(
    listId: string,
    sort: { field: SortField; direction: SortDirection },
  ): RepoResult {
    await simulateLatency()
    const list = lists.find((l) => l.id === listId)
    if (!list) return err(new ListNotFoundError(listId))
    const multiplier = sort.direction === 'desc' ? -1 : 1
    list.items.sort((a, b) => compare(sort.field, a, b) * multiplier)
    return ok(cloneList(list))
  }

  async duplicate(listId: string): RepoResult {
    await simulateLatency()
    const list = lists.find((l) => l.id === listId)
    if (!list) return err(new ListNotFoundError(listId))
    const copy: ShoppingList = {
      id: createId(),
      name: `${list.name} Copy`,
      items: list.items.map((i) => ({ ...i, id: createId() })),
    }
    lists.unshift(copy)
    return ok(cloneList(copy))
  }
}

function compare(field: SortField, a: ListItem, b: ListItem) {
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

function cloneList(list: ShoppingList): ShoppingList {
  return { ...list, items: list.items.map((i) => ({ ...i })) }
}
