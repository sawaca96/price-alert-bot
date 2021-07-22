<template>
  <q-page class="q-mt-sm">
    <WatchList :symbolType="symbolType" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { initialize } from '../core/indexed-db';
import { createWebSocket } from '../core/binance-websocket';

import WatchList from 'components/WatchList.vue';

export default defineComponent({
  name: 'Index',
  components: { WatchList },
  async setup() {
    const symbolType = ref('binance');
    createWebSocket();
    await initialize('price-alert-bot', ['binance']);
    return { symbolType };
  },
});
</script>
