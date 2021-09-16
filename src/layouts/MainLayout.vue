<template>
  <q-layout
    view="lHh Lpr lFf"
    style="min-height: initial; background-color: #121212; position: static"
  >
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from '../store';

import { initDB, idb } from '../core/idb';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const store = useStore();
    onMounted(async () => {
      await initDB('quasar-example', ['todolist']);
      const todos = await idb.getAll('todolist');
      store.commit('SET_TODOS', todos);
    });
    return {};
  },
});
</script>
