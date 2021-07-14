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
        <p v-for="symbol in autocompleteSymbols" :key="symbol.symbol" @click="addSymbol(symbol)">
          {{ symbol.symbol }}
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
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from '../store';

import axios from 'axios';

import { subscribe } from '../core/binance-websocket';
import { BinanceSymbol } from './models';

const searchSymbol = () => {
  const symbolName = ref('');
  let symbols: BinanceSymbol[] = [];
  const autocompleteSymbols = ref<BinanceSymbol[]>([]);

  const getSymbols = async (): Promise<void> => {
    const data = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    symbols = data.data.symbols;
  };
  const autocomplete = (name: string) => {
    const data = symbols.filter((symbol: BinanceSymbol) => {
      const symbolName: string = symbol.symbol;
      if (symbolName.startsWith(name.toUpperCase())) return true;
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
    const { symbolName, autocompleteSymbols, getSymbols, autocomplete } = searchSymbol();

    const toggleSearch = (e: Event) => {
      emit('update:showSearch', e);
    };
    const addSymbol = async (symbol: BinanceSymbol) => {
      const data = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol.symbol}`
      );
      store.commit('UPDATE_PRICE', data.data);
      store.commit('APPEND_SYMBOL', symbol);
      subscribe([symbol.symbol]);
    };

    onMounted(async () => {
      await getSymbols();
    });

    return { symbolName, autocompleteSymbols, toggleSearch, autocomplete, addSymbol };
  },
});
</script>
