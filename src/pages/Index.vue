<template>
  <q-page class="q-mt-sm">
    <WatchList />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { initialize } from '../core/indexed-db';
import { createWebSocket } from '../core/binance-websocket';

import WatchList from 'components/WatchList.vue';

export default defineComponent({
  name: 'Index',
  components: { WatchList },
  async setup() {
    createWebSocket();
    await initialize('price-alert-bot', ['binance']);
  },
});
</script>
