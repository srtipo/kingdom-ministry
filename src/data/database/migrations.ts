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
      next_visit DATETIME NOT NULL,
      last_visit DATETIME,
      notes TEXT,
      updated_at TEXT NOT NULL

    );
  `,
  3: `
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY NOT NULL,
      visit_id TEXT NOT NULL,
      date DATETIME NOT NULL,
      notes TEXT,
      FOREIGN KEY (visit_id) REFERENCES visits(id)
    );
  `,
};
