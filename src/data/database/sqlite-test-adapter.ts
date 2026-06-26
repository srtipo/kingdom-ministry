import alasql from "alasql";

export async function createTestDb() {
  const db = new alasql.Database();

  return {
    execAsync: async (sql: string) => {
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const stmt of statements) {
        if (/^PRAGMA/i.test(stmt)) continue;
        db.exec(stmt);
      }
    },

    runAsync: async (
      sql: string,
      params?: (string | number | null)[]
    ): Promise<{ lastInsertRowId: number; changes: number }> => {
      const result = db.exec(sql, params);
      const isInsert = /^\s*INSERT/i.test(sql);
      if (isInsert && typeof result === "number") {
        return { lastInsertRowId: result, changes: 1 };
      }
      if (Array.isArray(result)) {
        return { lastInsertRowId: 0, changes: result.length };
      }
      const changes = typeof result === "number" ? result : 0;
      return { lastInsertRowId: 0, changes };
    },

    getAllAsync: async <T>(
      sql: string,
      params?: (string | number | null)[]
    ): Promise<T[]> => {
      const result = db.exec(sql, params);
      if (!result) return [];
      if (Array.isArray(result)) return result as T[];
      return [];
    },

    getFirstAsync: async <T>(
      sql: string,
      params?: (string | number | null)[]
    ): Promise<T | null> => {
      const result = db.exec(sql, params);
      if (!result) return null;
      if (Array.isArray(result)) return result[0] as T ?? null;
      return null;
    },
  };
}
