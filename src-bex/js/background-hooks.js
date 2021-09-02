// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be `listen`'d for by all client BEX bridges for this BEX

// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks

import { ws, subscribe, unsubscribe } from './binance-websocket';

export default function attachBackgroundHooks(bridge /* , allActiveConnections */) {
  // bridge.on('storage.get', (event) => {
  //   const payload = event.data;
  //   if (payload.key === null) {
  //     chrome.storage.local.get(null, (r) => {
  //       const result = [];
  //       // Group the items up into an array to take advantage of the bridge's chunk splitting.
  //       for (const itemKey in r) {
  //         result.push(r[itemKey]);
  //       }
  //       bridge.send(event.eventResponseKey, result);
  //     });
  //   } else {
  //     chrome.storage.local.get([payload.key], (r) => {
  //       bridge.send(event.eventResponseKey, r[payload.key]);
  //     });
  //   }
  // });
  // bridge.on('storage.set', (event) => {
  //   const payload = event.data;
  //   chrome.storage.local.set({ [payload.key]: payload.data }, () => {
  //     bridge.send(event.eventResponseKey, payload.data);
  //   });
  // });
  // bridge.on('storage.remove', (event) => {
  //   const payload = event.data;
  //   chrome.storage.local.remove(payload.key, () => {
  //     bridge.send(event.eventResponseKey, payload.data);
  //   });
  // });
  let watchSymbols = [];
  bridge.on('websocket.binance.subscribe', (event) => {
    watchSymbols = [...event.data.watchSymbols];
    const symbols = watchSymbols.map((watchSymbol) => watchSymbol.symbol);
    if (!symbols.length) return;
    subscribe(symbols);
  });
  bridge.on('websocket.binance.unsubscribe', (event) => {
    const watchSymbol = event.data.watchSymbol;
    unsubscribe([watchSymbol.symbol]);
    watchSymbols = watchSymbols.filter((item) => {
      if (item.symbol === watchSymbol.symbol) return false;
      else return true;
    });
  });
  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.e === 'aggTrade') {
      bridge.send('websocket.binance.aggTrade', data);
    } else if (data.e === '24hrMiniTicker') {
      bridge.send('websocket.binance.24hrMiniTicker', data);
    }
  };
  bridge.on('notification.price', (event) => {
    const watchSymbol = event.data.watchSymbol;
    chrome.notifications.create('', {
      title: 'Price Alert',
      message: `${watchSymbol.symbol} ${watchSymbol.alertType} Hit ${watchSymbol.alertPrice} `,
      iconUrl: 'icons/price-alert-bot-48.png',
      type: 'basic',
    });
  });
}
