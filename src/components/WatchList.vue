<template>
  <div class="list">
    <q-list>
      <div class="item-wrap" v-for="symbol in watchlist" :key="symbol.symbol">
        <q-item>
          <q-item-section>
            <q-item-label class="name">{{ symbol.symbol }}</q-item-label>
            <q-item-label caption class="market">Market name</q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label class="chart">line chart</q-item-label>
            <q-item-label caption class="chart">comming soon</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label class="price">{{ priceMap[symbol.symbol] }}</q-item-label>
            <q-item-label class="change">change</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </div>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '../store';

import { BinanceAggTradeStreams } from './models';
import { ws, createWebSocket } from '../core/binance-websocket';

export default defineComponent({
  setup() {
    const store = useStore();
    const watchlist = computed(() => {
      return store.state.watchlist;
    });
    const priceMap = computed(() => {
      return store.state.priceMap;
    });

    onMounted(() => {
      createWebSocket();
      ws.onmessage = function (event: MessageEvent) {
        const data: BinanceAggTradeStreams = JSON.parse(event.data);
        store.commit('UPDATE_PRICE', { symbol: data.s, price: data.p });
      };
    });

    return { watchlist, priceMap };
  },
});
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
}
</style>
