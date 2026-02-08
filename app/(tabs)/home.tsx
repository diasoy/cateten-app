import {
  useDeleteTransaction,
  useTransactionSummary,
  useTransactionsWithCategory,
} from "@/hooks/use-transactions";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { cssInterop } from "nativewind";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(LinearGradient, { className: "style" });

const avatars = [
  { id: "av-1", initials: "AR", color: "#fbbf24" },
  { id: "av-2", initials: "JK", color: "#22c55e" },
  { id: "av-3", initials: "LM", color: "#fb7185" },
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
const signedRupiah = (value: number) =>
  `${value < 0 ? "-" : ""}${formatRupiah(value)}`;

const formatDateTime = (value: string) => {
  const date = new Date(value);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  const timeLabel = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (date >= startOfToday) {
    return `Hari ini, ${timeLabel}`;
  }

  if (date >= startOfYesterday) {
    return `Kemarin, ${timeLabel}`;
  }

  return `${date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })}, ${timeLabel}`;
};

const colorToAlpha = (hexColor?: string | null) => {
  if (!hexColor) {
    return "rgba(148,163,184,0.16)";
  }

  return `${hexColor}33`;
};

const HomeScreen = () => {
  const router = useRouter();
  const { data: transactions = [] } = useTransactionsWithCategory({
    limit: 8,
  });
  const deleteTransaction = useDeleteTransaction();
  const { data: summary } = useTransactionSummary();
  const netBalance = summary?.net ?? 0;
  const income = summary?.income ?? 0;
  const expense = summary?.expense ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-[#0b1220]" edges={["bottom", "top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-2 pb-8 space-y-4"
      >
        <LinearGradient
          colors={["#4b7dff", "#2f64f2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-[20px] p-[18px] shadow-lg"
          style={{
            shadowColor: "#2f64f2",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.35,
            shadowRadius: 18,
            elevation: 8,
          }}
        >
          <View className="mb-[18px] flex-row items-center justify-between ">
            <View>
              <Text
                className="text-[14px] text-[#dbe6ff]"
                style={{ fontFamily: "Manrope_500Medium" }}
              >
                Saldo Total
              </Text>
              <Text
                className="mt-1 text-[24px] text-[#f8fbff]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                {signedRupiah(netBalance)}
              </Text>
            </View>
            <Pressable className="h-10 w-10 items-center justify-center rounded-[12px] bg-[rgba(255,255,255,0.14)]">
              <Ionicons name="card-outline" size={20} color="#f5f7fb" />
            </Pressable>
          </View>
          <View className="flex-row items-center justify-between">
            <Pressable className="flex-row items-center gap-2 rounded-[22px] bg-white px-4 py-[10px]">
              <Link
                href="/(tabs)/budget"
                className="text-[14px] text-[#1d4ed8] "
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Tambah Dana
              </Link>
              <Ionicons name="add" size={18} color="#1d4ed8" />
            </Pressable>
          </View>
        </LinearGradient>

        <View className="flex-row gap-3 my-5">
          <View
            className="flex-1 rounded-[16px] border border-[#18243d] bg-[#0f192d] p-4 shadow-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.14,
              shadowRadius: 10,
            }}
          >
            <View className="mb-3 h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(34,197,94,0.16)]">
              <Ionicons name="arrow-down-left-box" size={16} color="#34d399" />
            </View>
            <Text
              className="mb-1 text-[13px] text-[#9fb4d6]"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Pemasukan
            </Text>
            <Text
              className="text-[16px] text-[#e7edff]"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              {formatRupiah(income)}
            </Text>
          </View>

          <View
            className="flex-1 rounded-[16px] border border-[#18243d] bg-[#0f192d] p-4 shadow-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.14,
              shadowRadius: 10,
            }}
          >
            <View className="mb-3 h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(239,68,68,0.14)]">
              <Ionicons name="arrow-up-right-box" size={16} color="#f87171" />
            </View>
            <Text
              className="mb-1 text-[13px] text-[#9fb4d6]"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Pengeluaran
            </Text>
            <Text
              className="text-[16px] text-[#e7edff]"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              {formatRupiah(expense)}
            </Text>
          </View>
        </View>

        <View className="mb-5 flex-row items-center justify-between">
          <Text
            className="text-[16px] text-[#e7edff]"
            style={{ fontFamily: "Manrope_700Bold" }}
          >
            Transaksi Terbaru
          </Text>
          <Pressable onPress={() => router.push("/history")}>
            <Text
              className="text-[12px] text-[#7fb2ff]"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              LIHAT SEMUA
            </Text>
          </Pressable>
        </View>

        <View className="flex gap-y-2">
          {transactions.map((item) => {
            const signedAmount =
              item.type === "expense" ? -item.amount : item.amount;
            const iconName =
              item.categoryIcon ??
              (item.type === "income" ? "arrow-down" : "arrow-up");
            const iconColor = item.categoryColor ?? "#94a3b8";
            const iconBg = colorToAlpha(item.categoryColor);

            const handleDelete = () => {
              Alert.alert(
                "Hapus transaksi",
                "Yakin ingin menghapus transaksi ini?",
                [
                  { text: "Batal", style: "cancel" },
                  {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await deleteTransaction.mutateAsync(item.id);
                      } catch (error) {
                        console.error("Gagal menghapus transaksi", error);
                        Alert.alert("Gagal", "Transaksi gagal dihapus.");
                      }
                    },
                  },
                ],
              );
            };

            return (
              <View
                key={item.id}
                className="flex-row items-center rounded-[16px] border border-[#18243d] bg-[#0f192d] p-[14px] "
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.14,
                  shadowRadius: 8,
                }}
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
                <Pressable
                  onPress={handleDelete}
                  className="mt-1 ml-5 h-6 w-6 items-center justify-center rounded-full bg-[#111827]"
                >
                  <Ionicons name="trash" size={24} color="#f87171" />
                </Pressable>
              </View>
            );
          })}
          {transactions.length === 0 && (
            <View className="rounded-[16px] border border-dashed border-[#1f2a44] px-4 py-3">
              <Text
                className="text-[12px] text-[#7c8ba5]"
                style={{ fontFamily: "Manrope_600SemiBold" }}
              >
                Belum ada data transaksi terbaru.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
