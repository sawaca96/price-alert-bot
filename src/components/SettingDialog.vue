<template>
  <q-dialog :modelValue="showSetting" @update:modelValue="toggleSetting">
    <q-card>
      <q-card-section>
        <div class="text-h6">Setting</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh; width: 30vh" class="scroll">
        <q-list>
          <div class="item-wrap" v-for="symbol in watchSymbols" :key="symbol.data.symbol">
            <q-item>
              <q-item-section>
                <q-item-label class="name"
                  >{{ symbol.data.baseAsset }}/{{ symbol.data.quoteAsset }}</q-item-label
                >
              </q-item-section>

              <q-item-section>
                <q-btn flat dense icon="reorder" aria-label="reorder" class="text-grey" />
              </q-item-section>

              <q-item-section side>
                <q-btn
                  flat
                  dense
                  icon="delete"
                  aria-label="delete"
                  class="text-grey"
                  @click="deleteSymbol(symbol)"
                />
              </q-item-section>
            </q-item>

            <q-separator spaced inset />
          </div>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Decline" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '../store';

import { WatchSymbol } from './models';
import { db } from '../core/indexed-db';

export default defineComponent({
  props: {
    showSetting: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit }) {
    const store = useStore();
    const watchSymbols = computed(() => {
      return store.state.watchSymbols;
    });

    const toggleSetting = (e: Event) => {
      emit('update:showSetting', e);
    };
    const deleteSymbol = async (symbol: WatchSymbol) => {
      await db.delete(store.state.watchlistName, symbol.data.symbol);
      store.commit('DELETE_WATCH_SYMBOLS', symbol.data.symbol);
    };
    return { toggleSetting, watchSymbols, deleteSymbol };
  },
});
</script>
