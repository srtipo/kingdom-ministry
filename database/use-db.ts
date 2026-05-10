import { useSQLiteContext } from "expo-sqlite";

export function useDb() {
  return useSQLiteContext();
}
