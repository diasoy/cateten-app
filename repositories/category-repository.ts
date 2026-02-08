import { getDatabase } from "@/services/database";
import { Category, TransactionType } from "@/utils/types";

interface CategoryRow {
  id: string;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
  created_at: string;
}

export interface NewCategory {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string | null;
  color?: string | null;
}

export interface CategoryUpdate {
  name?: string;
  icon?: string | null;
  color?: string | null;
}

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    color: row.color,
    createdAt: row.created_at,
  };
}

export async function listCategories(
  type?: TransactionType,
): Promise<Category[]> {
  const database = await getDatabase();
  const params: string[] = [];
  const whereClause = type ? "WHERE type = ?" : "";

  if (type) {
    params.push(type);
  }

  const rows = await database.getAllAsync<CategoryRow>(
    `
    SELECT id, name, type, icon, color, created_at
    FROM categories
    ${whereClause}
    ORDER BY name ASC;
    `,
    params,
  );

  return rows.map(mapCategoryRow);
}

export async function addCategory(input: NewCategory) {
  const database = await getDatabase();
  await database.runAsync(
    `
    INSERT INTO categories (id, name, type, icon, color)
    VALUES (?, ?, ?, ?, ?);
    `,
    [input.id, input.name, input.type, input.icon ?? null, input.color ?? null],
  );
}

export async function deleteCategory(id: string) {
  const database = await getDatabase();
  await database.runAsync("DELETE FROM categories WHERE id = ?;", [id]);
}

export async function updateCategory(id: string, updates: CategoryUpdate) {
  const database = await getDatabase();
  const fields: string[] = [];
  const params: (string | null)[] = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    params.push(updates.name);
  }

  if (updates.icon !== undefined) {
    fields.push("icon = ?");
    params.push(updates.icon);
  }

  if (updates.color !== undefined) {
    fields.push("color = ?");
    params.push(updates.color);
  }

  if (fields.length === 0) {
    return;
  }

  await database.runAsync(
    `UPDATE categories SET ${fields.join(", ")} WHERE id = ?;`,
    [...params, id],
  );
}
