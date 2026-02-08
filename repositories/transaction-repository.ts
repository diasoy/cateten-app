import { getDatabase } from "@/services/database";
import {
    CategoryBreakdownItem,
    Transaction,
    TransactionSummary,
    TransactionType,
    TransactionWithCategory,
} from "@/utils/types";

interface TransactionRow {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category_id: string | null;
  note: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

interface TransactionWithCategoryRow extends TransactionRow {
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
}

export interface TransactionFilters {
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface NewTransaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId?: string | null;
  note?: string | null;
  occurredAt: string;
}

export interface TransactionUpdate {
  title?: string;
  amount?: number;
  type?: TransactionType;
  categoryId?: string | null;
  note?: string | null;
  occurredAt?: string;
}

const DEFAULT_LIMIT = 100;

function mapTransactionRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    title: row.title,
    amount: row.amount,
    type: row.type,
    categoryId: row.category_id,
    note: row.note,
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTransactionWithCategoryRow(
  row: TransactionWithCategoryRow,
): TransactionWithCategory {
  return {
    ...mapTransactionRow(row),
    categoryName: row.category_name,
    categoryIcon: row.category_icon,
    categoryColor: row.category_color,
  };
}

export async function listTransactions(
  filters: TransactionFilters = {},
): Promise<Transaction[]> {
  const database = await getDatabase();
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filters.type) {
    clauses.push("type = ?");
    params.push(filters.type);
  }

  if (filters.categoryId) {
    clauses.push("category_id = ?");
    params.push(filters.categoryId);
  }

  if (filters.startDate) {
    clauses.push("occurred_at >= ?");
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    clauses.push("occurred_at <= ?");
    params.push(filters.endDate);
  }

  const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const offset = filters.offset ?? 0;

  const rows = await database.getAllAsync<TransactionRow>(
    `
    SELECT id, title, amount, type, category_id, note, occurred_at, created_at, updated_at
    FROM transactions
    ${whereClause}
    ORDER BY occurred_at DESC
    LIMIT ? OFFSET ?;
    `,
    [...params, limit, offset],
  );

  return rows.map(mapTransactionRow);
}

export async function listTransactionsWithCategory(
  filters: TransactionFilters = {},
): Promise<TransactionWithCategory[]> {
  const database = await getDatabase();
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filters.type) {
    clauses.push("t.type = ?");
    params.push(filters.type);
  }

  if (filters.categoryId) {
    clauses.push("t.category_id = ?");
    params.push(filters.categoryId);
  }

  if (filters.startDate) {
    clauses.push("t.occurred_at >= ?");
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    clauses.push("t.occurred_at <= ?");
    params.push(filters.endDate);
  }

  const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const offset = filters.offset ?? 0;

  const rows = await database.getAllAsync<TransactionWithCategoryRow>(
    `
    SELECT
      t.id,
      t.title,
      t.amount,
      t.type,
      t.category_id,
      t.note,
      t.occurred_at,
      t.created_at,
      t.updated_at,
      c.name as category_name,
      c.icon as category_icon,
      c.color as category_color
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    ${whereClause}
    ORDER BY t.occurred_at DESC
    LIMIT ? OFFSET ?;
    `,
    [...params, limit, offset],
  );

  return rows.map(mapTransactionWithCategoryRow);
}

export async function addTransaction(input: NewTransaction) {
  const database = await getDatabase();

  await database.runAsync(
    `
    INSERT INTO transactions (
      id, title, amount, type, category_id, note, occurred_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [
      input.id,
      input.title,
      input.amount,
      input.type,
      input.categoryId ?? null,
      input.note ?? null,
      input.occurredAt,
    ],
  );
}

export async function updateTransaction(
  id: string,
  updates: TransactionUpdate,
) {
  const database = await getDatabase();
  const fields: string[] = [];
  const params: (string | number | null)[] = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    params.push(updates.title);
  }

  if (updates.amount !== undefined) {
    fields.push("amount = ?");
    params.push(updates.amount);
  }

  if (updates.type !== undefined) {
    fields.push("type = ?");
    params.push(updates.type);
  }

  if (updates.categoryId !== undefined) {
    fields.push("category_id = ?");
    params.push(updates.categoryId);
  }

  if (updates.note !== undefined) {
    fields.push("note = ?");
    params.push(updates.note);
  }

  if (updates.occurredAt !== undefined) {
    fields.push("occurred_at = ?");
    params.push(updates.occurredAt);
  }

  if (fields.length === 0) {
    return;
  }

  fields.push("updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ','now'))");

  await database.runAsync(
    `UPDATE transactions SET ${fields.join(", ")} WHERE id = ?;`,
    [...params, id],
  );
}

export async function deleteTransaction(id: string) {
  const database = await getDatabase();
  await database.runAsync("DELETE FROM transactions WHERE id = ?;", [id]);
}

export async function deleteAllTransactions() {
  const database = await getDatabase();
  await database.runAsync("DELETE FROM transactions;");
}

export async function getTransactionSummary(
  filters: {
    startDate?: string;
    endDate?: string;
  } = {},
): Promise<TransactionSummary> {
  const database = await getDatabase();
  const clauses: string[] = [];
  const params: string[] = [];

  if (filters.startDate) {
    clauses.push("occurred_at >= ?");
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    clauses.push("occurred_at <= ?");
    params.push(filters.endDate);
  }

  const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const row = await database.getFirstAsync<{
    income: number | null;
    expense: number | null;
  }>(
    `
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM transactions
    ${whereClause};
    `,
    params,
  );

  const income = row?.income ?? 0;
  const expense = row?.expense ?? 0;

  return {
    income,
    expense,
    net: income - expense,
  };
}

export async function getCategoryBreakdown(
  filters: {
    startDate?: string;
    endDate?: string;
  } = {},
): Promise<CategoryBreakdownItem[]> {
  const database = await getDatabase();
  const clauses: string[] = ["t.type = 'expense'"];
  const params: string[] = [];

  if (filters.startDate) {
    clauses.push("t.occurred_at >= ?");
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    clauses.push("t.occurred_at <= ?");
    params.push(filters.endDate);
  }

  const whereClause = `WHERE ${clauses.join(" AND ")}`;

  const rows = await database.getAllAsync<{
    id: string | null;
    name: string | null;
    icon: string | null;
    color: string | null;
    total: number | null;
  }>(
    `
    SELECT
      c.id as id,
      c.name as name,
      c.icon as icon,
      c.color as color,
      SUM(t.amount) as total
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    ${whereClause}
    GROUP BY c.id, c.name, c.icon, c.color
    ORDER BY total DESC;
    `,
    params,
  );

  const totals = rows.map((row) => row.total ?? 0);
  const grandTotal = totals.reduce((acc, value) => acc + value, 0);

  return rows.map((row) => {
    const total = row.total ?? 0;
    const sharePercent = grandTotal > 0 ? (total / grandTotal) * 100 : 0;

    return {
      id: row.id,
      name: row.name ?? "Uncategorized",
      icon: row.icon,
      color: row.color,
      total,
      sharePercent,
    };
  });
}
