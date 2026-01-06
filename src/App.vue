<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand">
        <ShoppingCartIcon class="h-5 w-5" aria-hidden="true" />
        <span>Wheely Shopping Planning</span>
      </div>
      <nav class="nav">
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
