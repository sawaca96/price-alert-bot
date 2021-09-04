// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be `listen`'d for by all client BEX bridges for this BEX

// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks

import { ws, subscribe, unsubscribe } from './binance-websocket';

export default function attachBackgroundHooks(bridge /* , allActiveConnections */) {
  let watchSymbols = [];
  let ignoreSymbols = [];
  let popupOpened = true;
  const closePopup = () => {
    popupOpened = false;
    chrome.windows.onFocusChanged.removeListener(closePopup);
  };
  bridge.on('bex.opened', () => {
    chrome.windows.onFocusChanged.addListener(closePopup);
  });

  const sendNotification = (watchSymbol) => {
    if (ignoreSymbols.includes(watchSymbol.symbol)) return;
    if (popupOpened) return;
    chrome.notifications.create('', {
      title: 'Price Alert',
      message: `${watchSymbol.symbol} ${watchSymbol.alertType} Hit ${watchSymbol.alertPrice} `,
      iconUrl: 'icons/price-alert-bot-48.png',
      type: 'basic',
    });
    ignoreSymbols.push(watchSymbol.symbol);
  };
  const checkAlertPrice = (price, symbol) => {
    const watchSymbol = watchSymbols.find((watchSymbol) => watchSymbol.symbol === symbol);
    if (price >= watchSymbol?.alertPrice && watchSymbol?.alertType === 'upper') {
      sendNotification(watchSymbol);
      watchSymbol.alertType = 'lower';
      bridge.send('watchSymbol.alertType.update', { watchSymbol });
    } else if (price <= watchSymbol?.alertPrice && watchSymbol?.alertType === 'lower') {
      sendNotification(watchSymbol);
      watchSymbol.alertType = 'upper';
      bridge.send('watchSymbol.alertType.update', { watchSymbol });
    }
  };
  bridge.on('watchSymbol.update', (event) => {
    watchSymbols = [...event.data.watchSymbols];
  });
  bridge.on('websocket.binance.subscribe', (event) => {
    const symbols = event.data.watchSymbols.map((watchSymbol) => watchSymbol.symbol);
    if (!symbols.length) return;
    subscribe(symbols);
  });
  bridge.on('websocket.binance.unsubscribe', (event) => {
    const symbols = event.data.watchSymbols.map((watchSymbol) => watchSymbol.symbol);
    if (!symbols.length) return;
    unsubscribe(symbols);
  });
  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.e === 'aggTrade') {
      bridge.send('websocket.binance.aggTrade', data);
      checkAlertPrice(data.p, data.s);
    } else if (data.e === '24hrMiniTicker') {
      bridge.send('websocket.binance.24hrMiniTicker', data);
    }
  };
}
