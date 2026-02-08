import {
    addTransaction,
    deleteAllTransactions,
    deleteTransaction,
    getCategoryBreakdown,
    getTransactionSummary,
    listTransactions,
    listTransactionsWithCategory,
    updateTransaction,
    type NewTransaction,
    type TransactionFilters,
    type TransactionUpdate,
} from "@/repositories/transaction-repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const transactionKeys = {
  all: ["transactions"] as const,
  list: (filters: TransactionFilters) => ["transactions", filters] as const,
  listWithCategory: (filters: TransactionFilters) =>
    ["transactions", "with-category", filters] as const,
  summary: (filters: { startDate?: string; endDate?: string }) =>
    ["transactions", "summary", filters] as const,
  breakdown: (filters: { startDate?: string; endDate?: string }) =>
    ["transactions", "breakdown", filters] as const,
};

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => listTransactions(filters),
  });
}

export function useTransactionsWithCategory(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: transactionKeys.listWithCategory(filters),
    queryFn: () => listTransactionsWithCategory(filters),
  });
}

export function useTransactionSummary(
  filters: {
    startDate?: string;
    endDate?: string;
  } = {},
) {
  return useQuery({
    queryKey: transactionKeys.summary(filters),
    queryFn: () => getTransactionSummary(filters),
  });
}

export function useCategoryBreakdown(
  filters: {
    startDate?: string;
    endDate?: string;
  } = {},
) {
  return useQuery({
    queryKey: transactionKeys.breakdown(filters),
    queryFn: () => getCategoryBreakdown(filters),
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewTransaction) => addTransaction(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TransactionUpdate }) =>
      updateTransaction(id, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useResetTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAllTransactions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
