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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    return {};
  },
});
</script>
