import {
  useCategoryBreakdown,
  useResetTransactions,
  useTransactionSummary,
} from "@/hooks/use-transactions";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

const colorToAlpha = (hexColor?: string | null) => {
  if (!hexColor) {
    return "rgba(148,163,184,0.16)";
  }

  return `${hexColor}33`;
};

const periodOptions = [
  { id: "mingguan", label: "Mingguan" },
  { id: "bulanan", label: "Bulanan" },
  { id: "tahunan", label: "Tahunan" },
] as const;

type PeriodId = (typeof periodOptions)[number]["id"];

const clampPercent = (value: number) => Math.max(0, Math.min(value, 100));

const buildRange = (period: PeriodId, anchor: Date) => {
  const base = new Date(anchor);
  let start: Date;
  let end: Date;
  let rangeLabel = "";
  let label = "";

  if (period === "mingguan") {
    const day = base.getDay();
    const diffToMonday = (day + 6) % 7;
    start = new Date(base);
    start.setDate(base.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);
    end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    rangeLabel = `${start.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })} - ${end.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })}`;
    label = rangeLabel;
  } else if (period === "tahunan") {
    start = new Date(base.getFullYear(), 0, 1);
    end = new Date(base.getFullYear(), 11, 31, 23, 59, 59, 999);
    rangeLabel = base.getFullYear().toString();
    label = rangeLabel;
  } else {
    start = new Date(base.getFullYear(), base.getMonth(), 1);
    end = new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59, 999);
    rangeLabel = `${start.toLocaleString("id-ID", {
      month: "short",
    })} ${start.getDate()} - ${end.toLocaleString("id-ID", {
      month: "short",
    })} ${end.getDate()}`;
    label = base.toLocaleString("id-ID", { month: "long", year: "numeric" });
  }

  return {
    label,
    rangeLabel,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
};

const AnalyticsScreen = () => {
  const [period, setPeriod] = useState<PeriodId>("bulanan");
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
    null,
  );

  const range = useMemo(
    () => buildRange(period, anchorDate),
    [period, anchorDate],
  );

  const { data: summary } = useTransactionSummary({
    startDate: range.startDate,
    endDate: range.endDate,
  });
  const { data: breakdown = [] } = useCategoryBreakdown({
    startDate: range.startDate,
    endDate: range.endDate,
  });
  const resetTransactions = useResetTransactions();
  const totalSpent = summary?.expense ?? 0;
  const totalIncome = summary?.income ?? 0;
  const netTotal = summary?.net ?? 0;

  const chartSegments = useMemo(() => {
    const sorted = [...breakdown].sort((a, b) => b.total - a.total);
    const top = sorted.slice(0, 5);
    const rest = sorted.slice(5);
    const restTotal = rest.reduce((acc, item) => acc + item.total, 0);

    const items =
      restTotal > 0
        ? [
            ...top,
            {
              id: "lainnya",
              name: "Lainnya",
              color: "#64748b",
              total: restTotal,
              sharePercent: 0,
            },
          ]
        : top;

    const grand = items.reduce((acc, item) => acc + item.total, 0);

    return items.map((item) => {
      const percent = grand > 0 ? (item.total / grand) * 100 : 0;
      return {
        ...item,
        percent,
      };
    });
  }, [breakdown]);

  const selectedSegment = useMemo(() => {
    if (!selectedSegmentId) {
      return null;
    }

    return (
      chartSegments.find(
        (segment) => (segment.id ?? segment.name) === selectedSegmentId,
      ) ?? null
    );
  }, [chartSegments, selectedSegmentId]);

  const handlePeriodChange = (nextPeriod: PeriodId) => {
    setPeriod(nextPeriod);
    setAnchorDate(new Date());
    setSelectedSegmentId(null);
  };

  const shiftRange = (direction: "prev" | "next") => {
    setAnchorDate((current) => {
      const next = new Date(current);
      const delta = direction === "prev" ? -1 : 1;

      if (period === "mingguan") {
        next.setDate(next.getDate() + 7 * delta);
      } else if (period === "tahunan") {
        next.setFullYear(next.getFullYear() + delta);
      } else {
        next.setMonth(next.getMonth() + delta);
      }

      return next;
    });
  };

  const toggleSegment = (id: string) => {
    setSelectedSegmentId((current) => (current === id ? null : id));
  };

  const handleResetAll = () => {
    Alert.alert(
      "Reset data",
      "Semua transaksi (pemasukan & pengeluaran) akan dihapus. Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await resetTransactions.mutateAsync();
              setSelectedSegmentId(null);
            } catch (error) {
              console.error("Gagal reset transaksi", error);
              Alert.alert("Gagal", "Reset transaksi gagal.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#070f1f]" edges={["bottom", "top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <View className="px-5 pt-3">
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View>
                <Text
                  className="text-[18px] text-white"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  Ringkasan{" "}
                  {period === "mingguan"
                    ? "Mingguan"
                    : period === "tahunan"
                      ? "Tahunan"
                      : "Bulanan"}
                </Text>
                <Text
                  className="text-[12px] text-[#9fb4d6]"
                  style={{ fontFamily: "Manrope_600SemiBold" }}
                >
                  {range.rangeLabel}
                </Text>
              </View>
            </View>
            {selectedSegmentId && (
              <Pressable
                onPress={() => setSelectedSegmentId(null)}
                className="rounded-full border border-[#1d4ed8] bg-[#0d162b] px-3 py-1"
              >
                <Text
                  className="text-[12px] text-[#7fb2ff]"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  Reset
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleResetAll}
              className="ml-2 rounded-full border border-[#ef4444] bg-[#2a0f16] px-3 py-1"
            >
              <Text
                className="text-[12px] text-[#fca5a5]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Reset Data
              </Text>
            </Pressable>
          </View>

          <View className="mb-6 flex-row items-center rounded-full bg-[#0d162b] p-1">
            {periodOptions.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handlePeriodChange(item.id)}
                className={`flex-1 rounded-full px-3 py-2 ${
                  period === item.id ? "bg-[#1d4ed8]" : ""
                }`}
              >
                <Text
                  className={`text-center text-[13px] ${
                    period === item.id ? "text-white" : "text-[#7c8ba5]"
                  }`}
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mb-6 flex-row items-center justify-between px-1">
            <Pressable
              onPress={() => shiftRange("prev")}
              className="h-8 w-8 items-center justify-center rounded-full bg-[#0d162b]"
            >
              <Ionicons name="chevron-back" size={18} color="#7c8ba5" />
            </Pressable>
            <Text
              className="text-[15px] text-white"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              {range.label}
            </Text>
            <Pressable
              onPress={() => shiftRange("next")}
              className="h-8 w-8 items-center justify-center rounded-full bg-[#0d162b]"
            >
              <Ionicons name="chevron-forward" size={18} color="#7c8ba5" />
            </Pressable>
          </View>

          <View className="items-center">
            <View className="h-[236px] w-[236px] items-center justify-center rounded-full bg-[#0b162c]">
              <Svg width={236} height={236} viewBox="0 0 236 236">
                <Circle
                  cx={118}
                  cy={118}
                  r={86}
                  stroke="#13213a"
                  strokeWidth={22}
                  fill="transparent"
                />
                {(() => {
                  const radius = 86;
                  const circumference = 2 * Math.PI * radius;
                  let offset = 0;

                  return chartSegments.map((segment) => {
                    const dash =
                      (clampPercent(segment.percent) / 100) * circumference;
                    const strokeDasharray = `${dash} ${circumference - dash}`;
                    const strokeDashoffset = -offset;
                    offset += dash;

                    return (
                      <Circle
                        key={segment.id ?? segment.name}
                        cx={118}
                        cy={118}
                        r={radius}
                        stroke={segment.color ?? "#94a3b8"}
                        strokeWidth={
                          selectedSegmentId &&
                          selectedSegmentId !== (segment.id ?? segment.name)
                            ? 18
                            : 24
                        }
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        rotation={-90}
                        origin="118, 118"
                        strokeLinecap="round"
                        strokeOpacity={
                          selectedSegmentId &&
                          selectedSegmentId !== (segment.id ?? segment.name)
                            ? 0.4
                            : 1
                        }
                        onPress={() =>
                          toggleSegment(segment.id ?? segment.name)
                        }
                      />
                    );
                  });
                })()}
              </Svg>
              <View className="absolute items-center">
                <Text
                  className="text-[13px] uppercase tracking-[1px] text-[#8fa3c5]"
                  style={{ fontFamily: "Manrope_600SemiBold" }}
                >
                  {selectedSegment ? "Kategori" : "Total Pengeluaran"}
                </Text>
                <Text
                  className="text-[32px] text-white"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  {selectedSegment
                    ? `${selectedSegment.percent.toFixed(1)}%`
                    : formatRupiah(totalSpent)}
                </Text>
                <Text
                  className="text-[12px] text-[#7c8ba5]"
                  style={{ fontFamily: "Manrope_600SemiBold" }}
                >
                  {selectedSegment ? selectedSegment.name : range.rangeLabel}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-5 w-full flex-row flex-wrap justify-center gap-3">
            {chartSegments.map((segment) => {
              const id = segment.id ?? segment.name;
              const active = selectedSegmentId === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => toggleSegment(id)}
                  className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${
                    active
                      ? "border-[#60a5fa] bg-[#101b31]"
                      : "border-[#13213a] bg-[#0b1224]"
                  }`}
                >
                  <View
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: segment.color ?? "#94a3b8" }}
                  />
                  <Text
                    className="text-[12px] text-[#dbe6ff]"
                    style={{ fontFamily: "Manrope_600SemiBold" }}
                  >
                    {segment.name}
                  </Text>
                  <Text
                    className="text-[12px] text-[#9fb4d6]"
                    style={{ fontFamily: "Manrope_600SemiBold" }}
                  >
                    {`${segment.percent.toFixed(1)}%`}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-6 flex-row gap-3">
            <View className="flex-1 rounded-[16px] border border-[#18243d] bg-[#0f192d] p-4">
              <Text
                className="text-[12px] text-[#9fb4d6]"
                style={{ fontFamily: "Manrope_600SemiBold" }}
              >
                Pemasukan
              </Text>
              <Text
                className="mt-1 text-[18px] text-[#e7edff]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                {formatRupiah(totalIncome)}
              </Text>
            </View>
            <View className="flex-1 rounded-[16px] border border-[#18243d] bg-[#0f192d] p-4">
              <Text
                className="text-[12px] text-[#9fb4d6]"
                style={{ fontFamily: "Manrope_600SemiBold" }}
              >
                Pengeluaran
              </Text>
              <Text
                className="mt-1 text-[18px] text-[#e7edff]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                {formatRupiah(totalSpent)}
              </Text>
            </View>
            <View className="flex-1 rounded-[16px] border border-[#18243d] bg-[#0f192d] p-4">
              <Text
                className="text-[12px] text-[#9fb4d6]"
                style={{ fontFamily: "Manrope_600SemiBold" }}
              >
                Saldo Bersih
              </Text>
              <Text
                className="mt-1 text-[18px] text-[#e7edff]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                {formatRupiah(netTotal)}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-8 px-5 pb-10 pt-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text
              className="text-[15px] text-white"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Rincian Kategori
            </Text>
          </View>

          <View className="flex gap-3">
            {breakdown.map((item) => (
              <View
                key={item.id ?? item.name}
                className="flex-row items-center rounded-[18px] border border-[#13213a] bg-[#0b1224] px-4 py-3"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.18,
                  shadowRadius: 12,
                }}
              >
                <View
                  className="mr-3 h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: colorToAlpha(item.color) }}
                >
                  <Ionicons
                    name={(item.icon ?? "pricetag") as any}
                    size={22}
                    color={item.color ?? "#94a3b8"}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[14px] text-white"
                    style={{ fontFamily: "Manrope_700Bold" }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className="text-[12px] text-[#7c8ba5]"
                    style={{ fontFamily: "Manrope_500Medium" }}
                  >
                    {`${item.sharePercent.toFixed(1)}% dari pengeluaran`}
                  </Text>
                  <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#13213a]">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(item.sharePercent, 100)}%`,
                        backgroundColor: item.color ?? "#94a3b8",
                      }}
                    />
                  </View>
                </View>
                <View className="items-end">
                  <Text
                    className="text-[15px] text-white"
                    style={{ fontFamily: "Manrope_700Bold" }}
                  >
                    {formatRupiah(item.total)}
                  </Text>
                </View>
              </View>
            ))}
            {breakdown.length === 0 && (
              <View className="rounded-[18px] border border-dashed border-[#1f2a44] px-4 py-3">
                <Text
                  className="text-[12px] text-[#7c8ba5]"
                  style={{ fontFamily: "Manrope_600SemiBold" }}
                >
                  Belum ada data pengeluaran.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;
