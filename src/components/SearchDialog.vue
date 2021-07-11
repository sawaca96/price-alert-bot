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
        <p v-for="symbol in autocompleteSymbols" :key="symbol.symbol">{{ symbol.symbol }}</p>
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

import axios from 'axios';

interface BinanceSymbol {
  label: string;
  baseAsset: string;
  baseAssetPrecision: number;
  baseCommissionPrecision: number;
  filters: Record<string, string>[];
  icebergAllowed: boolean;
  isMarginTradingAllowed: boolean;
  isSpotTradingAllowed: boolean;
  ocoAllowed: boolean;
  orderTypes: string[];
  permissions: string[];
  quoteAsset: string;
  quoteAssetPrecision: number;
  quoteCommissionPrecision: number;
  quoteOrderQtyMarketAllowed: boolean;
  quotePrecision: number;
  status: string;
  symbol: string;
}

export default defineComponent({
  props: {
    showSearch: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit }) {
    const symbolName = ref('');
    let symbols: BinanceSymbol[] = [];
    let autocompleteSymbols = ref<BinanceSymbol[]>([]);

    const getSymbols = async (): Promise<void> => {
      const data = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
      symbols = data.data.symbols;
    };
    const toggleSearch = (e: Event) => {
      emit('update:showSearch', e);
    };
    const autocomplete = (name: string) => {
      const data = symbols.filter((symbol: BinanceSymbol) => {
        const symbolName: string = symbol.symbol;
        if (symbolName.startsWith(name.toUpperCase())) return true;
        return false;
      });
      autocompleteSymbols.value = data;
    };

    onMounted(async () => {
      await getSymbols();
    });

    return { symbolName, autocompleteSymbols, toggleSearch, autocomplete };
  },
});
</script>
