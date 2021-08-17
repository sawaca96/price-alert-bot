export let ws: WebSocket;

export const createWebSocket = () => {
  ws = new WebSocket('wss://stream.binance.com:9443/ws');
};

const send = function (message: string, interval: number) {
  if (ws.readyState === 1) {
    ws.send(message);
  } else {
    setTimeout(function () {
      send(message, interval);
    }, interval);
  }
};

export const subscribe = (symbols: string[]) => {
  const aggTreadeParams = symbols.map((symbol) => {
    return `${symbol.toLowerCase()}@aggTrade`;
  });
  const miniTicker = symbols.map((symbol) => {
    return `${symbol.toLowerCase()}@miniTicker`;
  });
  const msg = {
    method: 'SUBSCRIBE',
    params: [...aggTreadeParams, ...miniTicker],
    id: 1,
  };
  send(JSON.stringify(msg), 1000);
};

export const unsubscribe = (symbols: string[]) => {
  const aggTreadeParams = symbols.map((symbol) => {
    return `${symbol.toLowerCase()}@aggTrade`;
  });
  const miniTicker = symbols.map((symbol) => {
    return `${symbol.toLowerCase()}@miniTicker`;
  });
  const msg = {
    method: 'UNSUBSCRIBE',
    params: [...aggTreadeParams, ...miniTicker],
    id: 1,
  };
  send(JSON.stringify(msg), 1000);
};
