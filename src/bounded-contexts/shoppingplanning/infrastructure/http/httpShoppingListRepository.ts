import { err, ok, type Result } from '@/shared/kernel/result'
import { DomainError, ValidationError } from '@/shared/kernel/errors'
import { ItemNotFoundError, ListNotFoundError } from '../../domain/errors'
import type {
  ShoppingListRepository,
  SortInput,
} from '../../ports/repositories/shoppingListRepository'
import type { ListItem, ShoppingList } from '../../domain/entities/shoppingList'

type RepoResult<T = ShoppingList> = Promise<Result<T, DomainError>>

type ApiListItem = {
  id: string
  productRef: string
  quantity: number
  status: string
  storeRef?: string
  note?: string
}

type ApiList = {
  id: string
  name: string
  items: ApiListItem[]
}

const DEFAULT_BASE_URL = 'http://localhost:8080/api/shoppingplanning'
const DEFAULT_MODULE_PATH = '/shoppingplanning'

export class HttpShoppingListRepository implements ShoppingListRepository {
  private readonly baseUrl: string

  constructor(baseUrl: string = DEFAULT_BASE_URL, moduleBasePath: string = DEFAULT_MODULE_PATH) {
    this.baseUrl = baseUrl + moduleBasePath
  }

  private url(path: string) {
    return `${this.baseUrl.replace(/\/$/, '')}${path}`
  }

  private async handleResponse<T>(response: Response): RepoResult<T> {
    let data: unknown = null
    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (response.ok) {
      return ok(data as T)
    }

    const errorMessage = this.getErrorMessage(data)
    const message = errorMessage || response.statusText || 'Request failed'
    let error: DomainError
    if (response.status === 404) {
      error = message.toLowerCase().includes('item')
        ? new ItemNotFoundError(message)
        : new ListNotFoundError(message)
    } else if (response.status === 400) {
      error = new ValidationError(message)
    } else {
      error = new DomainError(message, `HTTP_${response.status}`)
    }

    return err(error)
  }

  private getErrorMessage(data: unknown): string | undefined {
    if (typeof data !== 'object' || data === null || !('error' in data)) return undefined
    return String((data as { error?: unknown }).error)
  }

  private mapList(response: ApiList): ShoppingList {
    return {
      id: response.id,
      name: response.name,
      items: (response.items || []).map(this.mapItem),
    }
  }

  private mapItem(item: ApiListItem): ListItem {
    return {
      id: item.id,
      productRef: item.productRef,
      quantity: item.quantity,
      status: (item.status || 'planned') as ListItem['status'],
      storeRef: item.storeRef ?? undefined,
      note: item.note ?? undefined,
    }
  }

  async list(): RepoResult<ShoppingList[]> {
    const res = await fetch(this.url('/lists'))
    const parsed = await this.handleResponse<ApiList[]>(res)
    if (!parsed.ok) return parsed
    return ok(parsed.value.map((list) => this.mapList(list)))
  }

  async getById(id: string): RepoResult {
    const res = await fetch(this.url(`/lists/${id}`))
    const parsed = await this.handleResponse<ApiList>(res)
    if (!parsed.ok) return parsed
    return ok(this.mapList(parsed.value))
  }

  async create(name: string): RepoResult {
    const res = await fetch(this.url('/lists'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const parsed = await this.handleResponse<ApiList>(res)
    if (!parsed.ok) return parsed
    return ok(this.mapList(parsed.value))
  }

  async addItem(listId: string, item: Omit<ListItem, 'id'>): RepoResult {
    const payload = {
      productRef: item.productRef,
      quantity: item.quantity,
      status: item.status,
      note: item.note,
      storeRef: item.storeRef,
    }
    const res = await fetch(this.url(`/lists/${listId}/items`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const parsed = await this.handleResponse<ApiList>(res)
    if (!parsed.ok) return parsed
    return ok(this.mapList(parsed.value))
  }

  async updateItem(
    listId: string,
    itemId: string,
    update: Partial<Omit<ListItem, 'id'>>,
  ): RepoResult {
    const payload = {
      productRef: update.productRef,
      quantity: update.quantity,
      status: update.status,
      note: update.note,
      storeRef: update.storeRef,
    }
    const res = await fetch(this.url(`/lists/${listId}/items/${itemId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const parsed = await this.handleResponse<ApiList>(res)
    if (!parsed.ok) return parsed
    return ok(this.mapList(parsed.value))
  }

  async changeItemQuantity(listId: string, itemId: string, delta: number): RepoResult {
    const amount = Math.abs(delta)
    if (amount === 0) {
      return this.getById(listId)
    }
    const endpoint = delta >= 0 ? 'increase' : 'decrease'
    const res = await fetch(this.url(`/lists/${listId}/items/${itemId}/${endpoint}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
    const parsed = await this.handleResponse<ApiList>(res)
    if (!parsed.ok) return parsed
    return ok(this.mapList(parsed.value))
  }

  async removeItem(listId: string, itemId: string): RepoResult {
    const res = await fetch(this.url(`/lists/${listId}/items/${itemId}`), {
      method: 'DELETE',
    })
    const parsed = await this.handleResponse<ApiList>(res)
    if (!parsed.ok) return parsed
    return ok(this.mapList(parsed.value))
  }

  async sortItems(listId: string, sort: SortInput): RepoResult {
    const payload = { field: sort.field, direction: sort.direction }
    const res = await fetch(this.url(`/lists/${listId}/items-order/sort`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const parsed = await this.handleResponse<ApiList>(res)
    if (!parsed.ok) return parsed
    return ok(this.mapList(parsed.value))
  }

  async duplicate(listId: string): RepoResult {
    const res = await fetch(this.url(`/lists/${listId}/duplicate`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const parsed = await this.handleResponse<ApiList>(res)
    if (!parsed.ok) return parsed
    return ok(this.mapList(parsed.value))
  }
}
