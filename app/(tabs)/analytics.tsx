import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";

cssInterop(LinearGradient, { className: "style" });

const categories = [
  {
    id: "housing",
    name: "Housing",
    share: "40% of expenses",
    amount: "$1,700.00",
    change: "-2.4%",
    trend: "down",
    color: "#6366f1",
    iconBg: "rgba(99,102,241,0.18)",
    icon: "home",
  },
  {
    id: "food",
    name: "Food & Dining",
    share: "25% of expenses",
    amount: "$1,062.50",
    change: "+1.8%",
    trend: "up",
    color: "#22d3ee",
    iconBg: "rgba(34,211,238,0.18)",
    icon: "fast-food",
  },
  {
    id: "transport",
    name: "Transport",
    share: "15% of expenses",
    amount: "$637.50",
    change: "STABLE",
    trend: "flat",
    color: "#f59e0b",
    iconBg: "rgba(245,158,11,0.18)",
    icon: "bus",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    share: "10% of expenses",
    amount: "$425.00",
    change: "+1.5%",
    trend: "up",
    color: "#a855f7",
    iconBg: "rgba(168,85,247,0.18)",
    icon: "game-controller",
  },
];

const AnalyticsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#070f1f]" edges={["bottom", "top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <View className="px-5 pt-3">
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-[#0d162b] border border-[#13213a]">
                <Ionicons name="chevron-back" size={18} color="#b8c7e6" />
              </Pressable>
              <View>
                <Text
                  className="text-[14px] text-[#9fb4d6]"
                  style={{ fontFamily: "Manrope_600SemiBold" }}
                >
                  Spending Analytics
                </Text>
                <Text
                  className="text-[18px] text-white"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  Monthly Overview
                </Text>
              </View>
            </View>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-[#0d162b] border border-[#13213a]">
              <Ionicons name="calendar-clear" size={18} color="#b8c7e6" />
            </Pressable>
          </View>

          <View className="mb-6 flex-row items-center rounded-full bg-[#0d162b] p-1">
            {["Weekly", "Monthly", "Yearly"].map((label) => (
              <Pressable
                key={label}
                className={`flex-1 rounded-full px-3 py-2 ${
                  label === "Monthly" ? "bg-[#1d4ed8]" : ""
                }`}
              >
                <Text
                  className={`text-center text-[13px] ${
                    label === "Monthly" ? "text-white" : "text-[#7c8ba5]"
                  }`}
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mb-6 flex-row items-center justify-between px-1">
            <Ionicons name="chevron-back" size={18} color="#7c8ba5" />
            <Text
              className="text-[15px] text-white"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              September 2023
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#7c8ba5" />
          </View>

          <View className="items-center">
            <View className="h-[236px] w-[236px] items-center justify-center rounded-full bg-[#0b162c]">
              <LinearGradient
                colors={["#60a5fa", "#22d3ee", "#34d399", "#f59e0b", "#a855f7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-full w-full items-center justify-center rounded-full"
              >
                <View className="h-[170px] w-[170px] items-center justify-center rounded-full bg-[#070f1f]">
                  <Text
                    className="text-[13px] uppercase tracking-[1px] text-[#8fa3c5]"
                    style={{ fontFamily: "Manrope_600SemiBold" }}
                  >
                    Total Spent
                  </Text>
                  <Text
                    className="text-[34px] text-white"
                    style={{ fontFamily: "Manrope_700Bold" }}
                  >
                    $4,250
                  </Text>
                  <Text
                    className="text-[12px] text-[#7c8ba5]"
                    style={{ fontFamily: "Manrope_600SemiBold" }}
                  >
                    Sep 1 - Sep 30
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>

        <View className="mt-8 rounded-t-[30px] bg-[#0d162b] px-5 pb-10 pt-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text
              className="text-[15px] text-white"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Category Breakdown
            </Text>
            <Pressable>
              <Text
                className="text-[12px] text-[#7fb2ff]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Details
              </Text>
            </Pressable>
          </View>

          <View className="space-y-3">
            {categories.map((item) => (
              <View
                key={item.id}
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
                  style={{ backgroundColor: item.iconBg }}
                >
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
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
                    {item.share}
                  </Text>
                </View>
                <View className="items-end">
                  <Text
                    className="text-[15px] text-white"
                    style={{ fontFamily: "Manrope_700Bold" }}
                  >
                    {item.amount}
                  </Text>
                  <Text
                    className={`text-[12px] ${
                      item.trend === "up"
                        ? "text-[#34d399]"
                        : item.trend === "down"
                        ? "text-[#f87171]"
                        : "text-[#9fb4d6]"
                    }`}
                    style={{ fontFamily: "Manrope_700Bold" }}
                  >
                    {item.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;
