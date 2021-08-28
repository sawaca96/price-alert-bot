import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import { createStore, Store as VuexStore, useStore as vuexUseStore } from 'vuex';
import { WatchSymbol } from '../types/price-alert-bot';

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
  exchange: string;
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
      watchlistName: 'watchlist',
      exchange: 'BINANCE',
    }),
    mutations: {
      SET_WATCH_SYMBOLS(state: StateInterface, symbols: WatchSymbol[]) {
        state.watchSymbols = symbols;
      },
      UPDATE_WATCH_SYMBOL_POSITION(
        state: StateInterface,
        { newPosition, oldPosition }: Record<string, number>
      ) {
        const symbol = state.watchSymbols.splice(oldPosition, 1);
        state.watchSymbols.splice(newPosition, 0, symbol[0]);
      },
      UPDATE_WATCH_SYMBOL_ALERT_PRICE(
        state: StateInterface,
        { symbolIndex, alertPrice }: Record<string, number>
      ) {
        state.watchSymbols[symbolIndex].alertPrice = alertPrice;
      },
      DELETE_WATCH_SYMBOLS(state: StateInterface, symbol: string) {
        state.watchSymbols = state.watchSymbols.filter((watchSymbol) => {
          if (watchSymbol.symbol === symbol) return false;
          else return true;
        });
      },
      APPEND_WATCH_SYMBOL(state: StateInterface, watchSymbol: WatchSymbol) {
        state.watchSymbols.push(watchSymbol);
      },
      CLEAR_WATCH_SYMBOLS(state: StateInterface) {
        state.watchSymbols = [];
      },
      SET_EXCHANGE(state: StateInterface, exchange: string) {
        state.exchange = exchange;
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
