<template>
  <q-page class="q-mt-sm">
    <div class="q-pa-md q-gutter-sm">
      <q-btn
        :ripple="{ color: 'yellow' }"
        color="secondary"
        label="Subscribe"
        no-caps
        @click="subscribe"
      />
      <q-btn
        :ripple="{ color: 'yellow' }"
        color="secondary"
        label="Unsubscribe"
        no-caps
        @click="unsubscribe"
      />
    </div>
    <List />
  </q-page>
</template>

<script lang="ts">
import List from 'components/List.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: { List },
  setup() {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    // When message received from web socket then...
    ws.onmessage = function (event) {
      // Easier and shorter.
      const data: Object = JSON.parse(event.data);
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
