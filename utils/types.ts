export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string | null;
  color?: string | null;
  createdAt: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId?: string | null;
  note?: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionWithCategory extends Transaction {
  categoryName?: string | null;
  categoryIcon?: string | null;
  categoryColor?: string | null;
}

export interface CategoryBreakdownItem {
  id: string | null;
  name: string;
  icon?: string | null;
  color?: string | null;
  total: number;
  sharePercent: number;
}

export interface TransactionSummary {
  income: number;
  expense: number;
  net: number;
}
