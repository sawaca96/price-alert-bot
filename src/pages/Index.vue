<template>
  <q-page>
    <div class="list">
      <q-list class="q-pa-md">
        <draggable
          :modelValue="watchSymbols"
          @change="changePosition"
          handle=".handle"
          item-key="symbol"
          tag="transition-group"
          animation="200"
        >
          <template #item="{ element }">
            <q-card class="my-card q-mb-md">
              <q-item class="q-pa-md">
                <q-item-section>
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
              </q-item>
            </q-card>
          </template>
        </draggable>
      </q-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from '../store';
import { useQuasar } from 'quasar';

import axios from 'axios';
import bexHook from '../core/bex-hook';
import { db, initIDB, updatePosition } from '../core/indexed-db';
import { Binance24HrTicker } from '../types/binance';
import { WatchSymbol } from '../types/price-alert-bot';
import { DraggableEvent } from '../types/event';
import { exponentialToNumber } from '../utils/exponential-to-number';

import draggable from 'vuedraggable';

export default defineComponent({
  name: 'Index',
  components: {
    draggable, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();
    // store.state로 사용하는거랑 computed로 사용하는거 차이점 ?
    const watchSymbols = computed(() => {
      return store.state.watchSymbols;
    });
    const priceMap = computed(() => {
      return store.state.priceMap;
    });
    const changeMap = computed(() => {
      return store.state.changeMap;
    });
    const { updateAggTrade, updateMiniTicker } = bexHook();
    $q.bex.on('websocket.binance.aggTrade', updateAggTrade);
    $q.bex.on('websocket.binance.24hrMiniTicker', updateMiniTicker);

    const changePosition = async (e: Record<string, DraggableEvent>) => {
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
    const getPrice = async (symbol: string) => {
      const priceResponse = await axios.get<Record<string, string>>(
        'https://api.binance.com/api/v3/ticker/price',
        {
          params: {
            symbol,
          },
        }
      );
      const price = exponentialToNumber(parseFloat(priceResponse.data.price));
      store.commit('UPDATE_PRICE_MAP', { symbol, price });
    };
    const getChange = async (symbol: string) => {
      const changeResponse = await axios.get<Binance24HrTicker>(
        'https://api.binance.com/api/v3/ticker/24hr',
        {
          params: {
            symbol,
          },
        }
      );
      const openPrice = parseFloat(changeResponse.data.openPrice);
      const lastPrice = parseFloat(changeResponse.data.lastPrice);
      const change = openPrice === 0 ? 0 : (lastPrice - openPrice) / openPrice;
      store.commit('UPDATE_CHANGE_MAP', { symbol, change });
    };
    const fetchWatchSymbols = async () => {
      // indexed-db에 있어도 되지 않을까
      const watchSymbols = (await db.getAllFromIndex(
        store.state.watchlistName,
        'position'
      )) as WatchSymbol[];
      // 이거 왜 필요하더라
      if (!watchSymbols.length) return;
      store.commit('SET_WATCH_SYMBOLS', watchSymbols);
    };

    onMounted(async () => {
      await initIDB('price-alert-bot', [store.state.watchlistName]);
      await fetchWatchSymbols();
      let promises = [];
      for (let watchSymbol of watchSymbols.value) {
        promises.push(getPrice(watchSymbol.symbol));
        promises.push(getChange(watchSymbol.symbol));
      }
      await Promise.all(promises);
      await $q.bex.send('websocket.binance.subscribe', {
        symbols: watchSymbols.value.map((x) => x.symbol),
      });
    });
    onBeforeUnmount(() => {
      $q.bex.off('websocket.binance.aggTrade', updateAggTrade);
      $q.bex.off('websocket.binance.24hrMiniTicker', updateMiniTicker);
    });
    return { watchSymbols, priceMap, changeMap, changePosition };
  },
});
</script>

<style lang="scss" scoped>
.list {
  color: #adbac7;
  .my-card {
    background-color: #22272e;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .change {
    &.up {
      color: green;
    }
    &.down {
      color: red;
    }
  }
}
</style>
