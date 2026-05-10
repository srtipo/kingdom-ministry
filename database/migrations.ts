export const migrations = {
  1: `DROP TABLE IF EXISTS visits;`,
  2: `
    CREATE TABLE IF NOT EXISTS visits (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      created_at TEXT NOT NULL,
      type TEXT NOT NULL,
      phone TEXT,
      next_visit TEXT,
      last_visit TEXT,
      description TEXT,
      updated_at TEXT NOT NULL
    );
  `,
  3: `
    -- Ejemplo de una futura actualización:
    -- ALTER TABLE products ADD COLUMN category TEXT;
  `,
};
