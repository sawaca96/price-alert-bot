<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white">
      <q-toolbar>
        <q-toolbar-title class="text-green-8"> Price Alert Bot </q-toolbar-title>
        <q-btn
          flat
          dense
          icon="search"
          aria-label="search"
          class="text-grey"
          @click="showSearch = true"
        />
        <q-btn flat dense icon="sort" aria-label="sort" class="text-grey" />
        <q-btn flat dense icon="settings" aria-label="settings" class="text-grey" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <SearchDialog v-model:showSearch="showSearch" v-if="showSearch" />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import SearchDialog from 'components/SearchDialog.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { SearchDialog },
  setup() {
    const showSearch = ref(false);
    return { showSearch };
  },
});
</script>
