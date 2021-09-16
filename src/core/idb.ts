import { IDBPDatabase, openDB } from 'idb';
import { Todo } from '../types/models';

export let idb: IDBPDatabase<unknown>;

export const initDB = async (database: string, tableNames: string[]) => {
  try {
    idb = await openDB(database, 1, {
      upgrade(idb) {
        for (const tableName of tableNames) {
          if (idb.objectStoreNames.contains(tableName)) continue;
          idb.createObjectStore(tableName, { autoIncrement: true, keyPath: 'id' });
        }
      },
    });
  } catch (error) {
    return false;
  }
};

export const idbUpdate = async <K extends keyof Todo>(store: string, key: K, todo: Todo) => {
  const cursor = await idb
    .transaction(store, 'readwrite')
    .store.openCursor(IDBKeyRange.only(todo.id));
  const cursorObj = cursor?.value as Todo;
  cursorObj[key] = todo[key];
  await cursor?.update(cursorObj);
};
