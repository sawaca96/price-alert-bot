<template>
  <q-page class="q-mt-sm">
    <div class="list">
      <q-list>
        <draggable
          :modelValue="watchSymbols"
          @change="changePosition"
          handle=".handle"
          item-key="symbol"
          tag="transition-group"
          :component-data="{ name: 'fade' }"
        >
          <template #item="{ element }">
            <q-item class="justify-center">
              <q-item-section class="col-4">
                <q-item-label class="name">{{ element.symbol }}</q-item-label>
                <q-item-label class="price">{{ priceMap[element.symbol] }}</q-item-label>
                <q-item-label
                  class="change"
                  :class="{
                    up: changeMap[element.symbol] > 0,
                    down: changeMap[element.symbol] < 0,
                  }"
                  >{{ (changeMap[element.symbol] * 100).toFixed(2) }}%</q-item-label
                >
              </q-item-section>
              <q-btn flat dense icon="reorder" aria-label="reorder" class="text-grey handle" />

              <q-separator spaced inset />
            </q-item>
          </template>
        </draggable>
      </q-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive, watch } from 'vue';
import { useStore } from '../store';

import axios from 'axios';
import { db, initialize, updatePosition } from '../core/indexed-db';
import { ws, subscribe, createWebSocket, unsubscribe } from '../core/binance-websocket';
import {
  BinanceAggTradeStreams,
  WatchSymbol,
  BinanceMiniTicker,
  Binance24HrTicker,
  draggableEvent,
} from '../components/models';
import { exponentialToNumber } from '../utils/exponential-to-number';

import draggable from 'vuedraggable';

export default defineComponent({
  name: 'Index',
  components: {
    draggable, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  },
  setup() {
    const store = useStore();
    const watchSymbols = computed(() => {
      return store.state.watchSymbols;
    });
    const priceMap: Record<string, string> = reactive({});
    const changeMap: Record<string, number> = reactive({});

    const changePosition = async (e: Record<string, draggableEvent>) => {
      const moved = e.moved;
      const movedSymbol = moved.element;
      const oldPosition = moved.oldIndex;
      const newPosition = moved.newIndex;

      store.commit('UPDATE_WATCH_SYMBOL_POSITION', { newPosition, oldPosition });
      await updatePosition(
        store.state.watchlistName,
        movedSymbol,
        oldPosition + 1,
        newPosition + 1
      );
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
      const change = await axios.get<Binance24HrTicker>(
        'https://api.binance.com/api/v3/ticker/24hr',
        {
          params: {
            symbol: watchSymbol.symbol,
          },
        }
      );
      priceMap[watchSymbol.symbol] = exponentialToNumber(parseFloat(price.data.price));
      const openPrice = parseFloat(change.data.openPrice);
      const lastPrice = parseFloat(change.data.lastPrice);
      const changePercent = openPrice === 0 ? 0 : (lastPrice - openPrice) / openPrice;
      changeMap[watchSymbol.symbol] = changePercent;
    };
    const setupWatchSymbols = async () => {
      await initialize('price-alert-bot', [store.state.watchlistName]);
      const watchSymbols = (await db.getAllFromIndex(
        store.state.watchlistName,
        'position'
      )) as WatchSymbol[];
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
          }
        }
      }
    );
    return { watchSymbols, priceMap, changeMap, changePosition };
  },
});
</script>

<style lang="scss" scoped>
.change {
  &.up {
    color: green;
  }
  &.down {
    color: red;
  }
}
</style>
