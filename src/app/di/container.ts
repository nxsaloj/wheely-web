import { HttpShoppingListRepository } from '@/bounded-contexts/shoppingplanning/infrastructure/http/httpShoppingListRepository'
import { InMemoryShoppingListRepository } from '@/bounded-contexts/shoppingplanning/infrastructure/repositories/inMemoryShoppingListRepository'
import { AddItemToList } from '@/bounded-contexts/shoppingplanning/application/usecases/addItemToList'
import { ChangeItemQuantity } from '@/bounded-contexts/shoppingplanning/application/usecases/changeItemQuantity'
import { CreateShoppingList } from '@/bounded-contexts/shoppingplanning/application/usecases/createShoppingList'
import { GetShoppingList } from '@/bounded-contexts/shoppingplanning/application/usecases/getShoppingList'
import { GetShoppingLists } from '@/bounded-contexts/shoppingplanning/application/usecases/getShoppingLists'
import { RemoveItemFromList } from '@/bounded-contexts/shoppingplanning/application/usecases/removeItemFromList'
import { SortListItems } from '@/bounded-contexts/shoppingplanning/application/usecases/sortListItems'
import { UpdateItemInList } from '@/bounded-contexts/shoppingplanning/application/usecases/updateItemInList'
import { DuplicateShoppingList } from '@/bounded-contexts/shoppingplanning/application/usecases/duplicateShoppingList'
import type { ShoppingPlanningUseCases } from '@/bounded-contexts/shoppingplanning/application/usecases/types'
import type { ShoppingListRepository } from '@/bounded-contexts/shoppingplanning/ports/repositories/shoppingListRepository'

export interface ShoppingPlanningModule {
  repository: ShoppingListRepository
  useCases: ShoppingPlanningUseCases
}

export function createShoppingPlanningModule(): ShoppingPlanningModule {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''
  const repository: ShoppingListRepository = apiBase
    ? new HttpShoppingListRepository(apiBase)
    : new InMemoryShoppingListRepository()

  return {
    repository,
    useCases: {
      createShoppingList: new CreateShoppingList(repository),
      getShoppingLists: new GetShoppingLists(repository),
      getShoppingList: new GetShoppingList(repository),
      addItemToList: new AddItemToList(repository),
      updateItemInList: new UpdateItemInList(repository),
      changeItemQuantity: new ChangeItemQuantity(repository),
      removeItemFromList: new RemoveItemFromList(repository),
      sortListItems: new SortListItems(repository),
      duplicateShoppingList: new DuplicateShoppingList(repository),
    },
  }
}

export const shoppingPlanningModule = createShoppingPlanningModule()
