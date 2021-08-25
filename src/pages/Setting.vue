<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6 header">Setting</div>
    </q-card-section>

    <q-separator />

    <q-card-section style="max-height: 50vh; width: 30vh" class="scroll">
      <q-list>
        <div class="item-wrap" v-for="watchSymbol in watchSymbols" :key="watchSymbol.symbol">
          <q-item>
            <q-item-section>
              <q-item-label class="symbol">{{ watchSymbol.symbol }}</q-item-label>
            </q-item-section>

            <q-item-section side>
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

          <q-separator spaced inset />
        </div>
      </q-list>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <router-link to="/">
        <q-btn flat label="Decline" class="text-amber" v-close-popup />
      </router-link>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '../store';

import { WatchSymbol } from '../components/models';
import { db } from '../core/indexed-db';

export default defineComponent({
  setup() {
    const store = useStore();
    const watchSymbols = computed(() => {
      return store.state.watchSymbols;
    });

    const deleteSymbol = async (watchSymbol: WatchSymbol) => {
      await db.delete(store.state.watchlistName, watchSymbol.symbol);
      store.commit('DELETE_WATCH_SYMBOLS', watchSymbol.symbol);
    };
    return { watchSymbols, deleteSymbol };
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