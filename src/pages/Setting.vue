<template>
  <q-page>
    <q-card class="my-card q-mb-md">
      <q-card-section>
        <div class="text-h6 header">Setting</div>
      </q-card-section>
    </q-card>

    <q-list class="q-pa-md">
      <div class="item-wrap" v-for="watchSymbol in watchSymbols" :key="watchSymbol.symbol">
        <q-card class="my-card q-mb-md">
          <q-item class="q-pa-md row content-between">
            <q-item-section>
              <q-item-label class="symbol text-weight-bold">{{ watchSymbol.symbol }}</q-item-label>
            </q-item-section>

            <q-item-section class="content-center">
              <q-input
                dark
                dense
                type="number"
                :model-value="watchSymbol.alertPrice"
                @change="updateAlertPrice($event, watchSymbol)"
              />
            </q-item-section>

            <q-item-section class="content-end">
              <q-btn
                flat
                dense
                icon="delete"
                aria-label="delete"
                class="text-grey"
                @click="deleteSymbol(watchSymbol)"
              />
            </q-item-section>
          </q-item>
        </q-card>
      </div>
      <q-card-actions align="right">
        <router-link to="/">
          <q-btn flat label="close" class="text-amber" />
        </router-link>
      </q-card-actions>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '../store';
import { useQuasar } from 'quasar';

import { WatchSymbol } from '../types/price-alert-bot';
import { db, update } from '../core/indexed-db';

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const watchSymbols = computed(() => {
      return store.state.watchSymbols;
    });

    const deleteSymbol = async (watchSymbol: WatchSymbol) => {
      await db.delete(store.state.watchlistName, watchSymbol.symbol);
      store.commit('DELETE_WATCH_SYMBOLS', watchSymbol.symbol);
      await $q.bex.send('websocket.binance.unsubscribe', { watchSymbols: [watchSymbol] });
    };
    const updateAlertPrice = async (e: string, watchSymbol: WatchSymbol) => {
      // TODO: why event is string?
      const alertPrice = parseFloat(e);
      const price = parseFloat(store.state.priceMap[watchSymbol.symbol]);
      const alertType = alertPrice > price ? 'upper' : 'lower';
      store.commit('UPDATE_WATCH_SYMBOL_ALERT_PRICE', { symbol: watchSymbol.symbol, alertPrice });
      store.commit('UPDATE_WATCH_SYMBOL_ALERT_TYPE', { symbol: watchSymbol.symbol, alertType });
      await update(store.state.watchlistName, 'alertPrice', watchSymbol);
      await update(store.state.watchlistName, 'alertType', watchSymbol);
    };

    return { watchSymbols, updateAlertPrice, deleteSymbol };
  },
});
</script>

<style lang="scss" scoped>
.my-card {
  background-color: #22272e;
  a {
    color: inherit;
    text-decoration: none;
  }
  .symbol {
    color: #adbac7;
  }
  .header {
    color: rgb(205 217 229 / 70%);
  }
}
</style>
