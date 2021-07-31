export interface BinanceSymbol {
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

export interface BinanceAggTradeStreams {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  a: number; // Aggregate trade ID
  p: string; // Price
  q: string; // Quantity
  f: number; // First trade ID
  l: number; // Last trade ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
}

export interface BinanceMiniTicker {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: number; // Close price
  o: number; // Open price
  h: number; // High price
  l: number; // Low price
  v: number; // Total traded base asset volume
  q: number; // Total traded quote asset volume
}

export interface Binance24HrTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

interface RateLimit {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
}

export interface ExchangeInfo {
  exchangeFilters: Record<string, unknown>[];
  rateLimits: RateLimit[];
  serverTime: number;
  symbols: BinanceSymbol[];
  timezone: string;
}

export interface WatchSymbol {
  type: string;
  symbol: string;
  alertPrice: number;
}
