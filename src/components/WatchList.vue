<template>
  <div class="list">
    <q-list>
      <div class="item-wrap" v-for="symbol in watchSymbols" :key="symbol.symbol">
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

import axios from 'axios';

import { BinanceAggTradeStreams, WatchSymbol } from '../components/models';
import { db } from '../core/indexed-db';
import { ws, subscribe } from '../core/binance-websocket';

export default defineComponent({
  props: {
    symbolType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const watchSymbols = computed(() => {
      return store.state.watchSymbols;
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

    onMounted(async () => {
      const watchSymbols = (await db.getAll(props.symbolType)) as WatchSymbol[];
      let symbols = [];
      for (let watchSymbol of watchSymbols) {
        const symbol = watchSymbol.data;
        const data = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol.symbol}`
        );
        store.commit('UPDATE_PRICE', data.data);
        store.commit('APPEND_WATCH_SYMBOL', symbol);
        symbols.push(symbol.symbol);
      }
      subscribe(symbols);
      ws.onmessage = function (event) {
        const data: BinanceAggTradeStreams = JSON.parse(event.data) as BinanceAggTradeStreams;
        store.commit('UPDATE_PRICE', { symbol: data.s, price: data.p });
      };
    });

    return { watchSymbols, priceMap, convert };
  },
});
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
}
</style>
