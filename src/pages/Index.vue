<template>
  <q-page class="q-mt-sm">
    <WatchList />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import WatchList from 'components/WatchList.vue';

export default defineComponent({
  name: 'Index',
  components: { WatchList },
  setup() {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    // When message received from web socket then...
    ws.onmessage = function (event) {
      // Easier and shorter.
      const data: Record<string, unknown> = JSON.parse(event.data);
      console.log(data);
    };

    const subscribe = () => {
      const msg = {
        method: 'SUBSCRIBE',
        params: ['btcusdt@aggTrade', 'btcusdt@depth'],
        id: 1,
      };
      ws.send(JSON.stringify(msg));
    };

    const unsubscribe = () => {
      const msg = {
        method: 'UNSUBSCRIBE',
        params: ['btcusdt@aggTrade', 'btcusdt@depth'],
        id: 1,
      };
      ws.send(JSON.stringify(msg));
    };

    return { ws, subscribe, unsubscribe };
  },
});
</script>
