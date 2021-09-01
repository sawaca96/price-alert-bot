import { StateInterface } from '../store';
import { Store } from 'vuex';

import { BexBinanceAggTrade, BexBinance24hrMiniTicker } from '../types/event';
import { exponentialToNumber } from '../utils/exponential-to-number';

const bexHook = (store: Store<StateInterface>) => {
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
  return { updateAggTrade, updateMiniTicker };
};

export default bexHook;
