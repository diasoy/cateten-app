import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  { id: "grocery", label: "Grocery", icon: "basket", color: "#3b82f6" },
  { id: "rent", label: "Rent", icon: "home", color: "#a855f7" },
  { id: "coffee", label: "Coffee", icon: "cafe", color: "#f97316" },
  { id: "travel", label: "Travel", icon: "airplane", color: "#22c55e" },
  { id: "entertainment", label: "Fun", icon: "game-controller", color: "#eab308" },
];

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "DEL"];

const BudgetScreen = () => {
  const [mode, setMode] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("0");
  const [category, setCategory] = useState("grocery");

  const prettyAmount = useMemo(() => {
    if (!amount.includes(".")) {
      return `${amount}.00`;
    }
    const [int, dec = ""] = amount.split(".");
    return `${int}.${dec.padEnd(2, "0").slice(0, 2)}`;
  }, [amount]);

  const handleKey = (key: string) => {
    setAmount((prev) => {
      let next = prev;
      if (key === "DEL") {
        next = prev.length > 1 ? prev.slice(0, -1) : "0";
      } else if (key === ".") {
        if (!prev.includes(".")) next = prev + ".";
      } else {
        next = prev === "0" && !prev.includes(".") ? key : prev + key;
      }

      if (next.includes(".")) {
        const [int, dec] = next.split(".");
        next = dec.length > 2 ? `${int}.${dec.slice(0, 2)}` : next;
      }

      return next;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#070f1f]" edges={["bottom", "top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <View className="px-5 pt-3">
          <View className="mb-6 flex-row items-center justify-between">
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-[#0d162b] border border-[#13213a]">
              <Ionicons name="close" size={18} color="#b8c7e6" />
            </Pressable>
            <Text
              className="text-[17px] text-white"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Add Transaction
            </Text>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-[#0d162b] border border-[#13213a]">
              <Ionicons name="calendar-clear" size={18} color="#b8c7e6" />
            </Pressable>
          </View>

          <View className="mb-6 flex-row items-center rounded-full bg-[#0d162b] p-1">
            {(["expense", "income"] as const).map((item) => (
              <Pressable
                key={item}
                onPress={() => setMode(item)}
                className={`flex-1 rounded-full px-3 py-2 ${
                  mode === item ? "bg-[#1d4ed8]" : ""
                }`}
              >
                <Text
                  className={`text-center text-[13px] ${
                    mode === item ? "text-white" : "text-[#7c8ba5]"
                  }`}
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  {item === "expense" ? "Expense" : "Income"}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="items-center">
            <Text
              className="text-[12px] uppercase tracking-[1px] text-[#7c8ba5]"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Amount
            </Text>
            <Text
              className="text-[46px] text-white"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              ${prettyAmount}
            </Text>
          </View>

          <View className="mt-6 rounded-[20px] border border-[#13213a] bg-[#0b1224] p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text
                className="text-[13px] uppercase tracking-[1px] text-[#7c8ba5]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Category
              </Text>
              <Pressable>
                <Text
                  className="text-[12px] text-[#7fb2ff]"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  View All
                </Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
            >
              {categories.map((item) => {
                const active = category === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setCategory(item.id)}
                    className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
                      active ? "bg-[#1d4ed8]" : "bg-[#101b31]"
                    }`}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={16}
                      color={active ? "#e8f0ff" : "#9fb4d6"}
                    />
                    <Text
                      className={`text-[13px] ${
                        active ? "text-white" : "text-[#9fb4d6]"
                      }`}
                      style={{ fontFamily: "Manrope_700Bold" }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View className="mt-6 rounded-[24px] border border-[#13213a] bg-[#0b1224] p-4">
            <View className="flex-row flex-wrap gap-3">
              {keypad.map((key, idx) => (
                <TouchableOpacity
                  key={key + idx}
                  onPress={() => handleKey(key)}
                  className="h-14 w-[30%] items-center justify-center rounded-[14px] bg-[#101b31]"
                  activeOpacity={0.8}
                >
                  <Text
                    className="text-[20px] text-white"
                    style={{ fontFamily: "Manrope_700Bold" }}
                  >
                    {key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Pressable
            className="mt-6 flex-row items-center justify-center rounded-[18px] bg-[#1d4ed8] px-4 py-4"
            style={{
              shadowColor: "#1d4ed8",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.35,
              shadowRadius: 18,
              elevation: 8,
            }}
          >
            <Text
              className="text-[16px] text-white"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Save Transaction
            </Text>
            <View className="ml-2">
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BudgetScreen;
