<template>
  <q-page class="q-mt-sm">
    <div class="list">
      <q-list>
        <div class="item-wrap" v-for="watchSymbol in watchSymbols" :key="watchSymbol.symbol">
          <q-item>
            <q-item-section class="col-3">
              <q-item-label class="name">{{ watchSymbol.symbol }}</q-item-label>
              <q-item-label class="price">{{ priceMap[watchSymbol.symbol] }}</q-item-label>
              <q-item-label class="change"
                >{{ (changeMap[watchSymbol.symbol] * 100).toFixed(2) }}%</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <v-chart class="chart" :option="option(watchSymbol.symbol)" />
            </q-item-section>
          </q-item>

          <q-separator spaced inset />
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive, watch } from 'vue';
import { useStore } from '../store';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
use([CanvasRenderer, LineChart, GridComponent]);

import axios from 'axios';

import {
  BinanceAggTradeStreams,
  WatchSymbol,
  BinanceMiniTicker,
  Binance24HrTicker,
} from '../components/models';
import { db, initialize } from '../core/indexed-db';
import { ws, subscribe, createWebSocket, unsubscribe } from '../core/binance-websocket';

export default defineComponent({
  name: 'Index',
  components: {
    VChart,
  },
  setup() {
    const store = useStore();
    const watchSymbols = computed(() => {
      return store.state.watchSymbols;
    });
    const priceMap: Record<string, string> = reactive({});
    const changeMap: Record<string, number> = reactive({});
    const candleMap: Record<string, (string | number)[][]> = reactive({});

    const option = (symbol: string) => {
      // TODO: watchSymbol을 등록 후 candleMap을 업데이트 하다보니 candleMap[symbol]이 undefined인 경우가 생김
      let data: (string | number)[][];
      try {
        data = candleMap[symbol].map((tick) => {
          return [tick[0], parseFloat(tick[4] as string)];
        });
      } catch (e) {
        data = [];
      }
      return {
        grid: {
          left: 10,
          top: 10,
          right: 10,
          bottom: 10,
        },
        xAxis: {
          type: 'time',
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
          min: 'dataMin',
          max: 'dataMax',
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            name: symbol,
            type: 'line',
            symbol: 'none',
            data: data,
          },
        ],
      };
    };
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
    const updateSymbol = async (watchSymbol: WatchSymbol) => {
      const price = await axios.get<Record<string, string>>(
        'https://api.binance.com/api/v3/ticker/price',
        {
          params: {
            symbol: watchSymbol.symbol,
          },
        }
      );
      const candle = await axios.get<(string | number)[][]>(
        'https://api.binance.com/api/v3/klines',
        {
          params: {
            symbol: watchSymbol.symbol,
            interval: '30m',
            startTime: Date.now() - 86400000,
            endTime: Date.now(),
          },
        }
      );
      const change = await axios.get<Binance24HrTicker>(
        'https://api.binance.com/api/v3/ticker/24hr',
        {
          params: {
            symbol: watchSymbol.symbol,
          },
        }
      );
      priceMap[watchSymbol.symbol] = exponentialToNumber(parseFloat(price.data.price));
      candleMap[watchSymbol.symbol] = candle.data;
      changeMap[watchSymbol.symbol] =
        (parseFloat(change.data.lastPrice) - parseFloat(change.data.openPrice)) /
        parseFloat(change.data.openPrice);
    };
    const setupWatchSymbols = async () => {
      await initialize('price-alert-bot', [store.state.watchlistName]);
      const watchSymbols = (await db.getAll(store.state.watchlistName)) as WatchSymbol[];
      if (!watchSymbols.length) return;

      for (let watchSymbol of watchSymbols) {
        store.commit('APPEND_WATCH_SYMBOL', watchSymbol);
      }
    };

    onMounted(async () => {
      createWebSocket();
      await setupWatchSymbols();
      ws.onmessage = function (event) {
        let data = JSON.parse(event.data) as BinanceAggTradeStreams | BinanceMiniTicker;
        if (data.e === 'aggTrade') {
          priceMap[data.s] = exponentialToNumber(parseFloat((data as BinanceAggTradeStreams).p));
        } else if (data.e === '24hrMiniTicker') {
          changeMap[data.s] =
            ((data as BinanceMiniTicker).c - (data as BinanceMiniTicker).o) /
            (data as BinanceMiniTicker).o;
        }
      };
    });
    watch(
      () => [...store.state.watchSymbols],
      async (newVal, prevVal) => {
        const AddedSymbols = newVal.filter((x) => !prevVal.includes(x));
        const DeletedSymbols = prevVal.filter((x) => !newVal.includes(x));
        if (AddedSymbols.length) {
          for (let watchSymbol of AddedSymbols) {
            await updateSymbol(watchSymbol);
            subscribe([watchSymbol.symbol]);
          }
        }
        if (DeletedSymbols.length) {
          for (let watchSymbol of DeletedSymbols) {
            unsubscribe([watchSymbol.symbol]);
            delete priceMap[watchSymbol.symbol];
            delete changeMap[watchSymbol.symbol];
            delete candleMap[watchSymbol.symbol];
          }
        }
      }
    );
    return { option, watchSymbols, priceMap, changeMap, exponentialToNumber };
  },
});
</script>

<style lang="scss" scoped>
.chart {
  height: 100px;
}
</style>
