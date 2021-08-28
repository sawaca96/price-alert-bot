import { WatchSymbol } from './price-alert-bot';

export interface draggableEvent {
  element: WatchSymbol;
  newIndex: number;
  oldIndex: number;
}
