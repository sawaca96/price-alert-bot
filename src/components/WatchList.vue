<template>
  <div class="list">
    <q-list>
      <div class="item-wrap" v-for="symbol in watchlist" :key="symbol.symbol">
        <q-item>
          <q-item-section>
            <q-item-label class="name">{{ symbol.baseAsset }}/{{ symbol.quoteAsset }}</q-item-label>
            <q-item-label caption class="market">Market name</q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label class="chart">line chart</q-item-label>
            <q-item-label caption class="chart">comming soon</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label class="price">{{
              convert(parseFloat(priceMap[symbol.symbol]))
            }}</q-item-label>
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

    const convert = (num: number) => {
      if (num >= 1) return num.toFixed(2);

      let data = String(num).split(/[eE]/);
      if (data.length == 1) return data[0];

      let z = '',
        sign = num < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

      if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^-/, '');
      }
      mag -= str.length;
      while (mag--) z += '0';
      return str + z;
    };

    onMounted(() => {
      createWebSocket();
      ws.onmessage = function (event) {
        const data: BinanceAggTradeStreams = JSON.parse(event.data) as BinanceAggTradeStreams;
        store.commit('UPDATE_PRICE', { symbol: data.s, price: data.p });
      };
    });

    return { watchlist, priceMap, convert };
  },
});
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
}
</style>
