<template>
  <q-page class="q-mt-sm">
    <div class="list">
      <q-list>
        <div class="item-wrap" v-for="symbol in watchSymbols" :key="symbol.data.symbol">
          <q-item>
            <q-item-section>
              <q-item-label class="name"
                >{{ symbol.data.baseAsset }}/{{ symbol.data.quoteAsset }}</q-item-label
              >
              <q-item-label caption class="market">Market name</q-item-label>
            </q-item-section>

            <!-- <q-item-section>
              <q-item-label class="chart">line chart</q-item-label>
              <q-item-label caption class="chart">comming soon</q-item-label>
            </q-item-section> -->

            <q-item-section side>
              <q-item-label class="price">{{
                exponentialToNumber(parseFloat(priceMap[symbol.data.symbol]))
              }}</q-item-label>
              <q-item-label class="change">change</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset />
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '../store';

import axios from 'axios';

import { BinanceAggTradeStreams, WatchSymbol } from '../components/models';
import { db, initialize } from '../core/indexed-db';
import { ws, subscribe, createWebSocket } from '../core/binance-websocket';

export default defineComponent({
  name: 'Index',
  setup() {
    const store = useStore();
    const watchSymbols = computed(() => {
      return store.state.watchSymbols;
    });
    const priceMap = computed(() => {
      return store.state.priceMap;
    });

    const exponentialToNumber = (num: number) => {
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
    const setupWatchSymbols = async () => {
      await initialize('price-alert-bot', [store.state.watchlistName]);
      const watchSymbols = (await db.getAll(store.state.watchlistName)) as WatchSymbol[];
      if (!watchSymbols.length) return;

      let symbols = [];
      for (let watchSymbol of watchSymbols) {
        const data = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=${watchSymbol.data.symbol}`
        );
        store.commit('UPDATE_PRICE', data.data);
        store.commit('APPEND_WATCH_SYMBOL', watchSymbol);
        symbols.push(watchSymbol.data.symbol);
      }
      subscribe(symbols);
    };

    onMounted(async () => {
      createWebSocket();
      await setupWatchSymbols();
      ws.onmessage = function (event) {
        const data: BinanceAggTradeStreams = JSON.parse(event.data) as BinanceAggTradeStreams;
        store.commit('UPDATE_PRICE', { symbol: data.s, price: data.p });
      };
    });

    return { watchSymbols, priceMap, exponentialToNumber };
  },
});
</script>
