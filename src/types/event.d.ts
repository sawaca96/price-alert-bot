import { WatchSymbol } from './price-alert-bot';
import { BinanceAggTradeStreams, BinanceMiniTicker } from './binance';

export interface DraggableEvent {
  element: WatchSymbol;
  newIndex: number;
  oldIndex: number;
}

export interface BexBinanceAggTrade {
  data: BinanceAggTradeStreams;
}

export interface BexBinance24hrMiniTicker {
  data: BinanceMiniTicker;
}
