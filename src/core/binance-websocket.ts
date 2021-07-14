export let ws: WebSocket;

export const createWebSocket = () => {
  ws = new WebSocket('wss://stream.binance.com:9443/ws');
};

export const subscribe = (symbols: string[]) => {
  const params = symbols.map((symbol) => {
    return `${symbol.toLowerCase()}@aggTrade`;
  });
  const msg = {
    method: 'SUBSCRIBE',
    params: params,
    id: 1,
  };
  ws.send(JSON.stringify(msg));
};

export const unsubscribe = (symbols: string[]) => {
  const params = symbols.map((symbol) => {
    return `${symbol.toLowerCase()}@aggTrade`;
  });
  const msg = {
    method: 'UNSUBSCRIBE',
    params: params,
    id: 1,
  };
  ws.send(JSON.stringify(msg));
};
