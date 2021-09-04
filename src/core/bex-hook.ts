import { useStore } from '../store';

import {
  BexBinanceAggTrade,
  BexBinance24hrMiniTicker,
  BexWatchSymbolAlertType,
} from '../types/event';
import { exponentialToNumber } from '../utils/exponential-to-number';
import { update } from '../core/indexed-db';

const bexHook = () => {
  const store = useStore();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const updateAlertType = async (event: object | undefined) => {
    const watchSymbol = (event as BexWatchSymbolAlertType).data.watchSymbol;
    store.commit('UPDATE_WATCH_SYMBOL_ALERT_TYPE', {
      symbol: watchSymbol.symbol,
      alertType: watchSymbol.alertType,
    });
    await update(store.state.watchlistName, 'alertType', watchSymbol);
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  const updateAggTrade = (event: object | undefined) => {
    const payload = (event as BexBinanceAggTrade).data;
    const symbol = payload.s;
    const price = exponentialToNumber(parseFloat(payload.p));
    store.commit('UPDATE_PRICE_MAP', { symbol, price });
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  const updateMiniTicker = (event: object | undefined) => {
    const payload = (event as BexBinance24hrMiniTicker).data;
    const symbol = payload.s;
    const change = (payload.c - payload.o) / payload.o;
    store.commit('UPDATE_CHANGE_MAP', { symbol, change });
  };
  return { updateAggTrade, updateMiniTicker, updateAlertType };
};

export default bexHook;
