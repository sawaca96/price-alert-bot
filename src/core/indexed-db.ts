import { IDBPDatabase, openDB } from 'idb';
import { WatchSymbol } from '../types/price-alert-bot';
export interface IDBError {
  code: number;
  message: string;
  name: string;
}

export let db: IDBPDatabase<unknown>;

export const initialize = async (database: string, tableNames: string[]) => {
  try {
    db = await openDB(database, 1, {
      upgrade(db: IDBPDatabase) {
        for (const tableName of tableNames) {
          if (db.objectStoreNames.contains(tableName)) {
            continue;
          }
          const store = db.createObjectStore(tableName, { autoIncrement: false });
          store.createIndex('position', 'position');
        }
      },
    });
  } catch (error) {
    return false;
  }
};

export const updatePosition = async (
  store: string,
  movedSymbol: WatchSymbol,
  oldPosition: number,
  newPosition: number
) => {
  const positionRange =
    oldPosition < newPosition
      ? IDBKeyRange.bound(oldPosition, newPosition, true)
      : IDBKeyRange.bound(newPosition, oldPosition, false, true);
  const positionObjects = db.transaction(store, 'readwrite').store.index('position');
  let positionCurosr =
    oldPosition < newPosition
      ? await positionObjects.openCursor(positionRange)
      : await positionObjects.openCursor(positionRange, 'prev');
  while (positionCurosr) {
    const symbol = { ...positionCurosr.value } as WatchSymbol;
    if (oldPosition < newPosition) symbol.position -= 1;
    else symbol.position += 1;
    await positionCurosr.update(symbol);
    positionCurosr = await positionCurosr.continue();
  }

  const symbolCursor = await db
    .transaction(store, 'readwrite')
    .store.openCursor(IDBKeyRange.only(movedSymbol.symbol));
  const symbol = symbolCursor?.value as WatchSymbol;
  symbol.position = newPosition;
  await symbolCursor?.update(symbol);
};

export const update = async <K extends keyof WatchSymbol>(
  store: string,
  key: K,
  watchSymbol: WatchSymbol
) => {
  const cursor = await db
    .transaction(store, 'readwrite')
    .store.openCursor(IDBKeyRange.only(watchSymbol.symbol));
  const cursorValue = cursor?.value as WatchSymbol;
  cursorValue[key] = watchSymbol[key];
  await cursor?.update(cursorValue);
};
