<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white">
      <q-toolbar>
        <q-toolbar-title class="text-green-8">
          Price Alert Bot
        </q-toolbar-title>
        <q-btn flat dense icon="search" aria-label="search" class="text-grey" />
        <q-btn flat dense icon="sort" aria-label="sort" class="text-grey" />
        <q-btn
          flat
          dense
          icon="settings"
          aria-label="settings"
          class="text-grey"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    return {};
  },
});
</script>
