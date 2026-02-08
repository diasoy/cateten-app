import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(LinearGradient, { className: "style" });

const transactions = [
  {
    id: "tx-1",
    title: "Starbucks Coffee",
    time: "Today, 10:45 AM",
    amount: -5.5,
    category: "Food",
    icon: "cafe",
    iconColor: "#fbbf24",
    iconBg: "rgba(251, 191, 36, 0.16)",
  },
  {
    id: "tx-2",
    title: "Uber Trip",
    time: "Yesterday, 06:20 PM",
    amount: -15,
    category: "Transport",
    icon: "car-sport",
    iconColor: "#38bdf8",
    iconBg: "rgba(56, 189, 248, 0.18)",
  },
  {
    id: "tx-3",
    title: "Amazon Store",
    time: "Oct 12, 02:30 PM",
    amount: -89,
    category: "Shopping",
    icon: "bag-handle",
    iconColor: "#a78bfa",
    iconBg: "rgba(167, 139, 250, 0.16)",
  },
  {
    id: "tx-4",
    title: "Amazon Store",
    time: "Oct 12, 02:30 PM",
    amount: -89,
    category: "Shopping",
    icon: "bag-handle",
    iconColor: "#a78bfa",
    iconBg: "rgba(167, 139, 250, 0.16)",
  },
  {
    id: "tx-5",
    title: "Amazon Store",
    time: "Oct 12, 02:30 PM",
    amount: -89,
    category: "Shopping",
    icon: "bag-handle",
    iconColor: "#a78bfa",
    iconBg: "rgba(167, 139, 250, 0.16)",
  },
  {
    id: "tx-6",
    title: "Amazon Store",
    time: "Oct 12, 02:30 PM",
    amount: -89,
    category: "Shopping",
    icon: "bag-handle",
    iconColor: "#a78bfa",
    iconBg: "rgba(167, 139, 250, 0.16)",
  },
];

const avatars = [
  { id: "av-1", initials: "AR", color: "#fbbf24" },
  { id: "av-2", initials: "JK", color: "#22c55e" },
  { id: "av-3", initials: "LM", color: "#fb7185" },
];

const currency = (value: number) =>
  `$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#0b1220]" edges={["bottom", "top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-2 pb-8 space-y-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 py-5">
            <View
              className="h-[46px] w-[46px] items-center justify-center rounded-[16px] bg-[#fbbf24]"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.18,
                shadowRadius: 8,
              }}
            >
              <Text
                className="text-[14px] text-[#0b1220]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                AR
              </Text>
            </View>
            <View>
              <Text
                className="text-[13px] text-[#8a9ab8]"
                style={{ fontFamily: "Manrope_500Medium" }}
              >
                Good morning,
              </Text>
              <Text
                className="text-[18px] text-[#e7edff]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Alex Rivera
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2.5">
            <Pressable className="h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-[#172541] bg-[#101b31]">
              <Ionicons name="search" size={20} color="#e6edff" />
            </Pressable>
            <Pressable className="h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-[#172541] bg-[#101b31]">
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#e6edff"
              />
            </Pressable>
          </View>
        </View>

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
          <View className="mb-[18px] flex-row items-center justify-between">
            <View>
              <Text
                className="text-[14px] text-[#dbe6ff]"
                style={{ fontFamily: "Manrope_500Medium" }}
              >
                Total Balance
              </Text>
              <Text
                className="mt-1 text-[32px] text-[#f8fbff]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                $12,450.00
              </Text>
            </View>
            <Pressable className="h-10 w-10 items-center justify-center rounded-[12px] bg-[rgba(255,255,255,0.14)]">
              <Ionicons name="card-outline" size={20} color="#f5f7fb" />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {avatars.map((person, idx) => (
                <View
                  key={person.id}
                  className={`h-[34px] w-[34px] items-center justify-center rounded-[12px] border-2 border-[#2f64f2] ${
                    idx !== 0 ? "ml-[-10px]" : ""
                  }`}
                  style={{ backgroundColor: person.color }}
                >
                  <Text
                    className="text-[12px] text-[#0b1220]"
                    style={{ fontFamily: "Manrope_700Bold" }}
                  >
                    {person.initials}
                  </Text>
                </View>
              ))}
              <View className="ml-[-10px] h-[34px] w-[34px] items-center justify-center rounded-[12px] border-2 border-[#2f64f2] bg-[rgba(255,255,255,0.18)]">
                <Text
                  className="text-[12px] text-[#f8fbff]"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  +3
                </Text>
              </View>
            </View>
            <Pressable className="flex-row items-center gap-2 rounded-[22px] bg-white px-4 py-[10px]">
              <Text
                className="text-[14px] text-[#1d4ed8]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Add Money
              </Text>
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
              Income
            </Text>
            <Text
              className="text-[22px] text-[#e7edff]"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              $5,200.00
            </Text>
            <Text
              className="mt-[6px] text-[12px] text-[#34d399]"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              +12%
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
              Expenses
            </Text>
            <Text
              className="text-[22px] text-[#e7edff]"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              $3,100.00
            </Text>
            <Text
              className="mt-[6px] text-[12px] text-[#f87171]"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              -5%
            </Text>
          </View>
        </View>

        <View className="mb-5 flex-row items-center justify-between">
          <Text
            className="text-[16px] text-[#e7edff]"
            style={{ fontFamily: "Manrope_700Bold" }}
          >
            Recent Transactions
          </Text>
          <Pressable>
            <Text
              className="text-[12px] text-[#7fb2ff]"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              SEE ALL
            </Text>
          </Pressable>
        </View>

        <View className="flex gap-y-2">
          {transactions.map((item) => (
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
                style={{ backgroundColor: item.iconBg }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={item.iconColor}
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
                  {item.time}
                </Text>
              </View>
              <View className="items-end gap-1">
                <Text
                  className={`text-[15px] ${
                    item.amount < 0 ? "text-[#f87171]" : "text-[#34d399]"
                  }`}
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  {item.amount < 0 ? "-" : "+"}
                  {currency(item.amount)}
                </Text>
                <Text
                  className="text-[12px] text-[#7f8dab]"
                  style={{ fontFamily: "Manrope_600SemiBold" }}
                >
                  {item.category}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
