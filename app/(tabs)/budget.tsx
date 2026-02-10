import {
    useAddCategory,
    useCategories,
    useDeleteCategory,
} from "@/hooks/use-categories";
import { useAddTransaction } from "@/hooks/use-transactions";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "DEL"];

const iconOptions = [
  "pricetag",
  "basket",
  "car",
  "cafe",
  "home",
  "airplane",
  "game-controller",
  "gift",
  "heart",
  "briefcase",
  "wallet",
  "school",
  "medkit",
  "wifi",
];

const colorOptions = [
  "#2563EB",
  "#16A34A",
  "#DC2626",
  "#EA580C",
  "#7C3AED",
  "#0F172A",
  "#14B8A6",
  "#6366F1",
  "#F59E0B",
  "#38BDF8",
  "#F43F5E",
  "#22C55E",
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const createId = () =>
  `tx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const createCategoryId = () =>
  `cat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const BudgetScreen = () => {
  const [mode, setMode] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("0");
  const [category, setCategory] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState(iconOptions[0]);
  const [categoryColor, setCategoryColor] = useState(colorOptions[0]);
  const { data: categories = [] } = useCategories(mode);
  const addTransaction = useAddTransaction();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();

  useEffect(() => {
    if (categories.length === 0) {
      setCategory(null);
      return;
    }

    const exists = category
      ? categories.some((item) => item.id === category)
      : false;
    if (!category || !exists) {
      setCategory(categories[0].id);
    }
  }, [category, categories]);

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

  const handleSave = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount || Number.isNaN(numericAmount)) {
      Alert.alert("Jumlah tidak valid", "Silakan masukkan jumlah yang valid.");
      return;
    }

    if (!category) {
      Alert.alert("Pilih kategori", "Silakan pilih kategori terlebih dahulu.");
      return;
    }

    const activeCategory = categories.find((item) => item.id === category);
    const title =
      activeCategory?.name ?? (mode === "income" ? "Income" : "Expense");

    try {
      await addTransaction.mutateAsync({
        id: createId(),
        title,
        amount: numericAmount,
        type: mode,
        categoryId: category,
        occurredAt: new Date().toISOString(),
      });

      setAmount("0");
      Alert.alert("Tersimpan", "Transaksi berhasil disimpan.");
    } catch (error) {
      console.error("Failed to save transaction", error);
      Alert.alert("Gagal", "Transaksi gagal disimpan.");
    }
  };

  const openCategoryModal = () => {
    setCategoryName("");
    setCategoryIcon(iconOptions[0]);
    setCategoryColor(colorOptions[0]);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      Alert.alert("Nama wajib", "Nama kategori tidak boleh kosong.");
      return;
    }

    try {
      await addCategory.mutateAsync({
        id: createCategoryId(),
        name: trimmedName,
        type: mode,
        icon: categoryIcon,
        color: categoryColor,
      });

      setCategoryModalOpen(false);
    } catch (error) {
      console.error("Failed to save category", error);
      Alert.alert("Gagal", "Kategori gagal disimpan.");
    }
  };

  const handleDeleteCategory = (id: string) => {
    Alert.alert("Hapus kategori", "Yakin ingin menghapus kategori ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategory.mutateAsync(id);
          } catch (error) {
            console.error("Failed to delete category", error);
            Alert.alert("Gagal", "Kategori gagal dihapus.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0b1220]" edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
        style={{ backgroundColor: "#0b1220" }}
      >
        <View className="px-5 pt-3">
          <View className="mb-6 flex items-center justify-between">
            <Text
              className="text-[17px] text-white"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Tambah Transaksi
            </Text>
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
                  {item === "expense" ? "Pengeluaran" : "Pemasukan"}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="items-center">
            <Text
              className="text-[12px] uppercase tracking-[1px] text-[#7c8ba5]"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Jumlah
            </Text>
            <Text
              className="text-[46px] text-white"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              {formatRupiah(Number(amount))}
            </Text>
          </View>

          <View className="mt-6 rounded-[20px] border border-[#13213a] bg-[#0b1224] p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text
                className="text-[13px] uppercase tracking-[1px] text-[#7c8ba5]"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Kategori
              </Text>
              <Pressable onPress={openCategoryModal}>
                <Text
                  className="text-[12px] text-[#7fb2ff]"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  Tambah Baru
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
                  <View
                    key={item.id}
                    className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
                      active ? "bg-[#1d4ed8]" : "bg-[#101b31]"
                    }`}
                  >
                    <TouchableOpacity
                      onPress={() => setCategory(item.id)}
                      className="flex-row items-center gap-2"
                      activeOpacity={0.8}
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
                    </TouchableOpacity>
                    <Pressable
                      onPress={() => handleDeleteCategory(item.id)}
                      className="ml-1 h-6 w-6 items-center justify-center rounded-full bg-[#0f172a]"
                    >
                      <Ionicons name="close" size={12} color="#f87171" />
                    </Pressable>
                  </View>
                );
              })}
              {categories.length === 0 && (
                <View className="rounded-[14px] border border-dashed border-[#1f2a44] px-4 py-3">
                  <Text
                    className="text-[12px] text-[#7c8ba5]"
                    style={{ fontFamily: "Manrope_600SemiBold" }}
                  >
                    Belum ada kategori.
                  </Text>
                </View>
              )}
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
            onPress={handleSave}
            disabled={addTransaction.isPending}
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
              {addTransaction.isPending ? "Menyimpan..." : "Simpan Transaksi"}
            </Text>
            <View className="ml-2">
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={categoryModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalOpen(false)}
      >
        <View className="flex-1 items-center justify-center bg-[rgba(7,15,31,0.7)] px-6">
          <View className="w-full rounded-[22px] border border-[#1b2842] bg-[#0b1224] p-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text
                className="text-[16px] text-white"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Kategori Baru
              </Text>
              <Pressable onPress={() => setCategoryModalOpen(false)}>
                <Ionicons name="close" size={18} color="#9fb4d6" />
              </Pressable>
            </View>

            <Text
              className="text-[12px] uppercase tracking-[1px] text-[#7c8ba5]"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Nama
            </Text>
            <TextInput
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="mis. Belanja"
              placeholderTextColor="#526079"
              className="mt-2 rounded-[14px] border border-[#1b2842] bg-[#0f192d] px-3 py-2 text-[14px] text-white"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            />

            <Text
              className="mt-4 text-[12px] uppercase tracking-[1px] text-[#7c8ba5]"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Ikon
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="mt-2 gap-2"
            >
              {iconOptions.map((icon) => {
                const active = icon === categoryIcon;
                return (
                  <Pressable
                    key={icon}
                    onPress={() => setCategoryIcon(icon)}
                    className={`h-10 w-10 items-center justify-center rounded-[12px] border ${
                      active ? "border-[#60a5fa]" : "border-[#1b2842]"
                    } bg-[#0f192d]`}
                  >
                    <Ionicons
                      name={icon as any}
                      size={18}
                      color={active ? "#60a5fa" : "#9fb4d6"}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text
              className="mt-4 text-[12px] uppercase tracking-[1px] text-[#7c8ba5]"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Warna
            </Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {colorOptions.map((color) => {
                const active = color === categoryColor;
                return (
                  <Pressable
                    key={color}
                    onPress={() => setCategoryColor(color)}
                    className={`h-9 w-9 items-center justify-center rounded-full border ${
                      active ? "border-white" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {active && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={handleSaveCategory}
              className="mt-6 flex-row items-center justify-center rounded-[16px] bg-[#1d4ed8] px-4 py-3"
            >
              <Text
                className="text-[14px] text-white"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Simpan Kategori
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BudgetScreen;
