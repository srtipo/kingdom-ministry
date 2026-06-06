import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";

let dbInstance: SQLiteDatabase | null = null;

export const getDatabase = (): SQLiteDatabase => {
  if (!dbInstance) {
    dbInstance = openDatabaseSync(process.env.EXPO_PUBLIC_DB_NAME);
  }
  return dbInstance;
};
