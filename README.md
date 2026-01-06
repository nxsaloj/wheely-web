# wheely-web

SPA for the Shopping Planning bounded context built with Vue 3 + Vite + TypeScript, Tailwind CSS + daisyUI, and Pinia. It aligns with the `wheely-cloud` HTTP API while keeping ports/adapters so UI logic stays decoupled.

## Run
- `npm install`
- `npm run dev`
- `npm run build` (type-checks + bundle)
- `npm run lint` / `npm run format`

## API vs in-memory
- Default: uses in-memory adapter (seeded) for quick demos.
- To use `wheely-cloud`, set `VITE_SHOPPINGPLANNING_API_BASE_URL` (or `VITE_API_BASE_URL`) to the API root, e.g. `http://localhost:8080/api/shoppingplanning`. The DI container swaps to the fetch-based HTTP repository automatically.

## Structure (DDD / Screaming)
```
src/
  app/            // composition root: DI, router, pinia
  shared/         // kernel utilities (Result, errors)
  bounded-contexts/
    shoppingplanning/
      domain/          // entities, value-objects, domain errors
      application/     // use cases orchestrating ports
      ports/           // repository interfaces
      infrastructure/  // adapters: in-memory + HTTP (fetch)
      presentation/    // view-model mappers, Pinia store, pages/components
```
UI components talk only to stores/use cases. Infrastructure can be swapped without touching UI. Styling uses Tailwind utility classes with daisyUI primitives.

## Domain snapshot (frontend mirror of `wheely-cloud`)
- ShoppingList: `{ id, name, items[] }`
- ListItem: `{ id, productRef, quantity > 0, status: planned|optional, storeRef?, note? }`
- Operations: create/list/get, add/update/remove item, increase/decrease quantity, sort items (productRef|quantity|status asc/desc), duplicate list.
