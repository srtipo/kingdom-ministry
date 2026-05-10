import { type SQLiteDatabase } from "expo-sqlite";
import { migrations } from "./migrations";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // 1. Crear una tabla interna para llevar el control de versiones si no existe
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    DROP TABLE IF EXISTS db_versions;
    CREATE TABLE IF NOT EXISTS db_versions (version INTEGER PRIMARY KEY NOT NULL);
  `);

  // 2. Obtener la versión actual
  const result = await db.getFirstAsync<{ version: number }>(
    "SELECT version FROM db_versions",
  );
  let currentVersion = result?.version ?? 0;
  const targetVersion = Object.keys(migrations).length;
  console.log("Version actual:", currentVersion);
  console.log("Version target:", targetVersion);

  // 3. Ejecutar migraciones pendientes en orden
  if (currentVersion < targetVersion) {
    for (let i = currentVersion + 1; i <= targetVersion; i++) {
      const sql = migrations[i as keyof typeof migrations];
      await db.execAsync(sql);

      // Actualizar la versión interna
      if (i === 1) {
        await db.runAsync("INSERT INTO db_versions (version) VALUES (?)", [i]);
      } else {
        await db.runAsync("UPDATE db_versions SET version = ?", [i]);
      }
    }
  }
}
