import { useCategories } from "@/hooks/use-categories";
import { useTransactionsWithCategory } from "@/hooks/use-transactions";
import { TransactionType } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const colorToAlpha = (hexColor?: string | null) => {
  if (!hexColor) {
    return "rgba(148,163,184,0.16)";
  }

  return `${hexColor}33`;
};

const typeOptions: { id: "all" | TransactionType; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "income", label: "Pemasukan" },
  { id: "expense", label: "Pengeluaran" },
];

const HistoryScreen = () => {
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const { data: categories = [] } = useCategories(
    typeFilter === "all" ? undefined : typeFilter,
  );

  const filters = useMemo(
    () => ({
      type: typeFilter === "all" ? undefined : typeFilter,
      categoryId: categoryFilter === "all" ? undefined : categoryFilter,
      limit: 200,
    }),
    [typeFilter, categoryFilter],
  );

  const { data: transactions = [] } = useTransactionsWithCategory(filters);

  return (
    <SafeAreaView
      className="flex-1 bg-[#0b1220]"
      edges={["top", "bottom", "left", "right"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5"
      >
        <View className="mb-4 flex-row items-center rounded-full bg-[#0d162b] p-1">
          {typeOptions.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setTypeFilter(item.id);
                setCategoryFilter("all");
              }}
              className={`flex-1 rounded-full px-3 py-2 ${
                typeFilter === item.id ? "bg-[#1d4ed8]" : ""
              }`}
            >
              <Text
                className={`text-center text-[13px] ${
                  typeFilter === item.id ? "text-white" : "text-[#7c8ba5]"
                }`}
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3"
        >
          <Pressable
            onPress={() => setCategoryFilter("all")}
            className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
              categoryFilter === "all" ? "bg-[#1d4ed8]" : "bg-[#101b31]"
            }`}
          >
            <Ionicons
              name="grid"
              size={16}
              color={categoryFilter === "all" ? "#e8f0ff" : "#9fb4d6"}
            />
            <Text
              className={`text-[13px] ${
                categoryFilter === "all" ? "text-white" : "text-[#9fb4d6]"
              }`}
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Semua Kategori
            </Text>
          </Pressable>
          {categories.map((item) => {
            const active = categoryFilter === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setCategoryFilter(item.id)}
                className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
                  active ? "bg-[#1d4ed8]" : "bg-[#101b31]"
                }`}
              >
                <Ionicons
                  name={(item.icon ?? "pricetag") as any}
                  size={16}
                  color={active ? "#e8f0ff" : "#9fb4d6"}
                />
                <Text
                  className={`text-[13px] ${
                    active ? "text-white" : "text-[#9fb4d6]"
                  }`}
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="my-6 flex-col gap-3 space-y-3">
          {transactions.map((item) => {
            const signedAmount =
              item.type === "expense" ? -item.amount : item.amount;
            const iconName =
              item.categoryIcon ??
              (item.type === "income" ? "arrow-down" : "arrow-up");
            const iconColor = item.categoryColor ?? "#94a3b8";
            const iconBg = colorToAlpha(item.categoryColor);

            return (
              <View
                key={item.id}
                className="flex-row items-center rounded-[16px] border border-[#18243d] bg-[#0f192d] p-[14px]"
              >
                <View
                  className="mr-3 h-[38px] w-[38px] items-center justify-center rounded-[12px]"
                  style={{ backgroundColor: iconBg }}
                >
                  <Ionicons
                    name={iconName as any}
                    size={18}
                    color={iconColor}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[15px] text-[#e7edff]"
                    style={{ fontFamily: "Manrope_700Bold" }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="mt-[2px] text-[12px] text-[#7f8dab]"
                    style={{ fontFamily: "Manrope_500Medium" }}
                  >
                    {formatDateTime(item.occurredAt)}
                  </Text>
                </View>
                <View className="items-end gap-1">
                  <Text
                    className={`text-[15px] ${
                      signedAmount < 0 ? "text-[#f87171]" : "text-[#34d399]"
                    }`}
                    style={{ fontFamily: "Manrope_700Bold" }}
                  >
                    {signedAmount < 0 ? "-" : "+"}
                    {formatRupiah(signedAmount)}
                  </Text>
                  <Text
                    className="text-[12px] text-[#7f8dab]"
                    style={{ fontFamily: "Manrope_600SemiBold" }}
                  >
                    {item.categoryName ?? "Tanpa kategori"}
                  </Text>
                </View>
              </View>
            );
          })}

          {transactions.length === 0 && (
            <View className="rounded-[16px] border border-dashed border-[#1f2a44] px-4 py-3">
              <Text
                className="text-[12px] text-[#7c8ba5]"
                style={{ fontFamily: "Manrope_600SemiBold" }}
              >
                Belum ada transaksi.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
