import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "cateten.db";
const SCHEMA_VERSION = 1;

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initPromise: Promise<void> | null = null;

async function openDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

async function applyPragmas(database: SQLite.SQLiteDatabase) {
  await database.execAsync(
    "PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;",
  );
}

async function createSchema(database: SQLite.SQLiteDatabase) {
  await database.execAsync(
    `
		CREATE TABLE IF NOT EXISTS schema_meta (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS categories (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL UNIQUE,
			type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
			icon TEXT,
			color TEXT,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
		);

		CREATE TABLE IF NOT EXISTS transactions (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			amount REAL NOT NULL,
			type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
			category_id TEXT,
			note TEXT,
			occurred_at TEXT NOT NULL,
			created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
			updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
			FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
		);

		CREATE INDEX IF NOT EXISTS idx_transactions_occurred_at ON transactions(occurred_at);
		CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
		CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
		`,
  );
}

async function seedDefaultCategories(database: SQLite.SQLiteDatabase) {
  const existing = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM categories;",
  );

  if ((existing?.count ?? 0) > 0) {
    return;
  }

  await database.withTransactionAsync(async () => {
    await database.runAsync(
      `
			INSERT INTO categories (id, name, type, icon, color) VALUES
				('cat-income-1', 'Gaji', 'income', 'briefcase', '#2563EB'),
        ('cat-income-2', 'Bonus', 'income', 'trophy', '#16A34A'),
				('cat-income-3', 'Freelance', 'income', 'code', '#0EA5E9'),
				('cat-income-4', 'Investasi', 'income', 'trending-up', '#22C55E'),
				('cat-income-5', 'Hadiah', 'income', 'gift', '#F97316'),
        ('cat-expense-1', 'Makan', 'expense', 'restaurant', '#DC2626'),
				('cat-expense-2', 'Transport', 'expense', 'car', '#EA580C'),
        ('cat-expense-3', 'Belanja', 'expense', 'cart', '#7C3AED'),
        ('cat-expense-4', 'Tagihan', 'expense', 'document-text', '#637193'),
				('cat-expense-5', 'Kesehatan', 'expense', 'medkit', '#14B8A6'),
				('cat-expense-6', 'Pendidikan', 'expense', 'school', '#6366F1'),
				('cat-expense-7', 'Hiburan', 'expense', 'game-controller', '#F59E0B'),
				('cat-expense-8', 'Internet', 'expense', 'wifi', '#38BDF8'),
				('cat-expense-9', 'Donasi', 'expense', 'heart', '#F43F5E');
			`,
    );
  });
}

async function normalizeCategoryIcons(database: SQLite.SQLiteDatabase) {
  await database.runAsync(
    "UPDATE categories SET icon = 'trophy' WHERE icon = 'award';",
  );
  await database.runAsync(
    "UPDATE categories SET icon = 'cart' WHERE icon = 'shopping-bag';",
  );
  await database.runAsync(
    "UPDATE categories SET icon = 'restaurant' WHERE icon = 'utensils';",
  );
  await database.runAsync(
    "UPDATE categories SET icon = 'document-text' WHERE icon = 'file-text';",
  );
}

async function getSchemaVersion(database: SQLite.SQLiteDatabase) {
  const row = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM schema_meta WHERE key = 'schema_version';",
  );

  return row?.value ? Number(row.value) : 0;
}

async function setSchemaVersion(
  database: SQLite.SQLiteDatabase,
  version: number,
) {
  await database.runAsync(
    "INSERT OR REPLACE INTO schema_meta (key, value) VALUES ('schema_version', ?);",
    [String(version)],
  );
}

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = (async () => {
      const database = await openDatabase();
      await applyPragmas(database);

      await createSchema(database);

      const currentVersion = await getSchemaVersion(database);
      if (currentVersion < SCHEMA_VERSION) {
        await setSchemaVersion(database, SCHEMA_VERSION);
      }

      await seedDefaultCategories(database);
      await normalizeCategoryIcons(database);
    })();
  }

  return initPromise;
}

export async function initializeDatabase() {
  await ensureInitialized();
}

export async function getDatabase() {
  await ensureInitialized();
  return openDatabase();
}

export async function closeDatabase() {
  if (!databasePromise) {
    return;
  }

  const database = await databasePromise;
  await database.closeAsync();
  databasePromise = null;
  initPromise = null;
}
