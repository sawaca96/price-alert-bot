<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6 header">Search Symbol</div>
      </q-card-section>
    </q-card>

    <q-list class="q-pa-md">
      <q-card-section>
        <q-input dark dense :modelValue="symbolName" @update:modelValue="autocomplete" autofocus />
      </q-card-section>
      <q-card class="my-card">
        <q-card-section class="scroll row justify-between">
          <q-btn
            class="symbol q-ma-sm"
            v-for="symbol in autocompleteSymbols"
            :key="symbol"
            @click="addSymbol(exchange, symbol)"
          >
            {{ symbol }}
          </q-btn>
        </q-card-section>
      </q-card>

      <q-card-actions align="right">
        <router-link to="/">
          <q-btn flat label="Decline" class="text-amber" v-close-popup />
        </router-link>
      </q-card-actions>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from '../store';

import axios from 'axios';

import { ExchangeInfo, WatchSymbol } from '../components/models';
import { db, IDBError } from '../core/indexed-db';

const searchSymbol = () => {
  const symbolName = ref('');
  let symbols: string[] = [];
  const autocompleteSymbols = ref<string[]>([]);

  const getSymbols = async (exchange: string): Promise<void> => {
    if (exchange === 'BINANCE') {
      const data = await axios.get<ExchangeInfo>('https://api.binance.com/api/v3/exchangeInfo');
      for (let symbol of data.data.symbols) {
        symbols.push(symbol.symbol);
      }
    }
  };
  const autocomplete = (inputName: string) => {
    const data = symbols.filter((symbol: string) => {
      if (symbol.startsWith(inputName.toUpperCase())) return true;
      return false;
    });
    autocompleteSymbols.value = data;
  };

  return { symbolName, symbols, autocompleteSymbols, getSymbols, autocomplete };
};

export default defineComponent({
  setup() {
    const store = useStore();
    const exchange = computed(() => {
      return store.state.exchange;
    });
    const { symbolName, autocompleteSymbols, getSymbols, autocomplete } = searchSymbol();

    const addSymbol = async (exchange: string, symbol: string) => {
      try {
        const watchSymbol: WatchSymbol = {
          type: exchange,
          symbol: symbol,
          alertPrice: -1,
          position: store.state.watchSymbols.length + 1,
        };
        await db.add(store.state.watchlistName, watchSymbol, watchSymbol.symbol);
        store.commit('APPEND_WATCH_SYMBOL', watchSymbol);
      } catch (e) {
        const { message } = e as IDBError;
        if (message === 'Key already exists in the object store.') {
          alert('Duplicated Symbol');
        }
      }
    };

    onMounted(async () => {
      await getSymbols(exchange.value);
    });

    return { exchange, symbolName, autocompleteSymbols, autocomplete, addSymbol };
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
