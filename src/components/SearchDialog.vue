<template>
  <q-dialog :modelValue="showSearch" @update:modelValue="toggleSearch">
    <q-card>
      <q-card-section>
        <div class="text-h6">Search Symbol</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pt-none">
        <q-input dense :modelValue="symbolName" @update:modelValue="autocomplete" autofocus />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <p v-for="symbol in autocompleteSymbols" :key="symbol" @click="addSymbol(exchange, symbol)">
          {{ symbol }}
        </p>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Decline" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from '../store';

import axios from 'axios';

import { ExchangeInfo, WatchSymbol } from './models';
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
  props: {
    showSearch: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit }) {
    const store = useStore();
    const exchange = computed(() => {
      return store.state.exchange;
    });
    const { symbolName, autocompleteSymbols, getSymbols, autocomplete } = searchSymbol();

    const toggleSearch = (e: Event) => {
      emit('update:showSearch', e);
    };
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

    return { exchange, symbolName, autocompleteSymbols, toggleSearch, autocomplete, addSymbol };
  },
});
</script>
