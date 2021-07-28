import { IDBPDatabase, openDB } from 'idb';

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
          db.createObjectStore(tableName, { autoIncrement: false });
        }
      },
    });
  } catch (error) {
    return false;
  }
};
