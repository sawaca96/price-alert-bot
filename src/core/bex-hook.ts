import { useStore } from '../store';
import { useQuasar } from 'quasar';

import { WatchSymbol } from '../types/price-alert-bot';
import { BexBinanceAggTrade, BexBinance24hrMiniTicker } from '../types/event';
import { exponentialToNumber } from '../utils/exponential-to-number';
import { update } from '../core/indexed-db';

const bexHook = () => {
  const store = useStore();
  const $q = useQuasar();

  const checkAlertPrice = async (price: number, symbol: string) => {
    const watchSymbol = store.state.watchSymbols.find(
      (watchSymbol) => watchSymbol.symbol === symbol
    ) as WatchSymbol;

    if (price >= watchSymbol?.alertPrice && watchSymbol?.alertType === 'upper') {
      store.commit('UPDATE_WATCH_SYMBOL_ALERT_TYPE', {
        symbol: watchSymbol.symbol,
        alertType: 'lower',
      });
      await update(store.state.watchlistName, 'alertType', watchSymbol);
      await $q.bex.send('notification.price', { watchSymbol });
    } else if (price <= watchSymbol?.alertPrice && watchSymbol?.alertType === 'lower') {
      store.commit('UPDATE_WATCH_SYMBOL_ALERT_TYPE', {
        symbol: watchSymbol.symbol,
        alertType: 'upper',
      });
      await update(store.state.watchlistName, 'alertType', watchSymbol);
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  const updateAggTrade = async (event: object | undefined) => {
    const payload = (event as BexBinanceAggTrade).data;
    const symbol = payload.s;
    const price = exponentialToNumber(parseFloat(payload.p));
    store.commit('UPDATE_PRICE_MAP', { symbol, price });
    await checkAlertPrice(parseFloat(price), symbol);
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  const updateMiniTicker = (event: object | undefined) => {
    const payload = (event as BexBinance24hrMiniTicker).data;
    const symbol = payload.s;
    const change = (payload.c - payload.o) / payload.o;
    store.commit('UPDATE_CHANGE_MAP', { symbol, change });
  };
  return { updateAggTrade, updateMiniTicker };
};

export default bexHook;
