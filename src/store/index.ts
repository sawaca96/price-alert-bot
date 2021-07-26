import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import { createStore, Store as VuexStore, useStore as vuexUseStore } from 'vuex';
import { WatchSymbol } from '../components/models';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  watchSymbols: WatchSymbol[];
  watchlistName: string;
  priceMap: Record<string, string>;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key');

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StateInterface>({
    modules: {},
    state: () => ({
      watchSymbols: [],
      watchlistName: 'binance',
      priceMap: {},
    }),
    mutations: {
      DELETE_WATCH_SYMBOLS(state: StateInterface, symbol: string) {
        state.watchSymbols = state.watchSymbols.filter((item) => {
          if (item.data.symbol === symbol) return false;
          else return true;
        });
        delete state.priceMap[symbol];
      },
      APPEND_WATCH_SYMBOL(state: StateInterface, symbol: WatchSymbol) {
        state.watchSymbols.push(symbol);
      },
      UPDATE_PRICE(state: StateInterface, payload: Record<string, string>) {
        state.priceMap[payload.symbol] = payload.price;
      },
      CLEAR_WATCH_SYMBOLS(state: StateInterface) {
        state.watchSymbols = [];
      },
      CLEAR_PRICE(state: StateInterface) {
        state.priceMap = {};
      },
    },
    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}
