import {
    addCategory,
    deleteCategory,
    listCategories,
    updateCategory,
    type CategoryUpdate,
    type NewCategory,
} from "@/repositories/category-repository";
import { TransactionType } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const categoryKeys = {
  all: ["categories"] as const,
  list: (type?: TransactionType) => ["categories", type] as const,
};

export function useCategories(type?: TransactionType) {
  return useQuery({
    queryKey: categoryKeys.list(type),
    queryFn: () => listCategories(type),
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewCategory) => addCategory(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CategoryUpdate }) =>
      updateCategory(id, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
