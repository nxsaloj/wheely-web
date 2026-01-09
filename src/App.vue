<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <header class="sticky top-0 z-10 border-b border-base-300 bg-base-100/80 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div class="flex items-center gap-2 text-base font-semibold text-base-content">
          <ShoppingCartIcon class="h-5 w-5" aria-hidden="true" />
          <span>Wheely Shopping Planning</span>
        </div>
        <nav class="flex items-center gap-2 text-sm font-semibold">
          <RouterLink to="/lists" class="rounded-lg px-3 py-1.5 text-base-content/70 hover:bg-base-200"
            active-class="bg-primary/10 text-primary">
            Shopping Lists
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <RouterView />
    </main>
  </div>
</template>
