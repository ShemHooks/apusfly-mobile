import { useRouter } from "expo-router";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  History,
  Plus,
  RotateCcw,
  ShieldCheck,
  Wallet,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#75C928";
const PRIMARY_DARK = "#559E1C";
const CHARCOAL = "#171717";

type Transaction = {
  id: string;
  title: string;
  description: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  category: "topup" | "booking" | "refund";
  status: "Completed" | "Pending";
};

// Demo data only. Replace with Laravel wallet API responses.
const INITIAL_BALANCE = 5000;

const initialTransactions: Transaction[] = [
  {
    id: "TXN-001",
    title: "Wallet Top Up",
    description: "Added funds to wallet",
    date: "Oct 9, 2026",
    amount: 5000,
    type: "credit",
    category: "topup",
    status: "Completed",
  },
  {
    id: "TXN-002",
    title: "Aerial Photography",
    description: "Booking down payment",
    date: "Oct 8, 2026",
    amount: 2000,
    type: "debit",
    category: "booking",
    status: "Completed",
  },
  {
    id: "TXN-003",
    title: "Booking Refund",
    description: "Refund for cancelled booking",
    date: "Oct 7, 2026",
    amount: 500,
    type: "credit",
    category: "refund",
    status: "Completed",
  },
];

// Transactions above are illustrative examples,
// not a reconciled ledger for INITIAL_BALANCE.

const formatMoney = (amount: number) =>
  `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CustomerWalletScreen() {
  const router = useRouter();

  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [topUpVisible, setTopUpVisible] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [showAll, setShowAll] = useState(false);

  const displayedTransactions = useMemo(
    () => (showAll ? transactions : transactions.slice(0, 3)),
    [showAll, transactions],
  );

  const handleTopUp = () => {
    const amount = Number(amountInput);

    if (!Number.isFinite(amount) || amount < 100 || amount > 50000) {
      Alert.alert(
        "Invalid amount",
        "Enter an amount between ₱100 and ₱50,000.",
      );
      return;
    }

    // DEMO ONLY: No real payment or bank transaction occurs.
    setBalance((previous) => previous + amount);

    setTransactions((previous) => [
      {
        id: `DEMO-${Date.now()}`,
        title: "Wallet Top Up",
        description: "Demo wallet credit",
        date: new Date().toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        amount,
        type: "credit",
        category: "topup",
        status: "Completed",
      },
      ...previous,
    ]);

    setAmountInput("");
    setTopUpVisible(false);

    Alert.alert(
      "Demo Top Up",
      `${formatMoney(amount)} was added to your demo wallet. No actual money was transferred.`,
    );
  };

  const handlePayBooking = () => {
    Alert.alert(
      "Pay for Booking",
      "Wallet payments will be available when the booking and Laravel payment modules are connected.",
    );
  };

  const renderTransactionIcon = (category: Transaction["category"]) => {
    if (category === "booking") {
      return <CreditCard size={20} color={PRIMARY_DARK} />;
    }

    if (category === "refund") {
      return <RotateCcw size={20} color={PRIMARY_DARK} />;
    }

    return <ArrowDownLeft size={20} color={PRIMARY_DARK} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF7]" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAF7" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 48,
        }}
      >
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-5 pb-6">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="items-center justify-center bg-white h-11 w-11 rounded-2xl"
            >
              <ArrowLeft size={22} color={CHARCOAL} />
            </Pressable>

            <View>
              <Text className="text-2xl font-extrabold text-[#171717]">
                My Wallet
              </Text>
              <Text className="mt-1 text-xs text-gray-500">
                Manage your ApusFly balance
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setShowAll(true)}
            accessibilityRole="button"
            accessibilityLabel="View transaction history"
            className="items-center justify-center bg-white h-11 w-11 rounded-2xl"
          >
            <History size={22} color={CHARCOAL} />
          </Pressable>
        </View>

        {/* BALANCE CARD */}
        <View className="px-6">
          <View className="overflow-hidden rounded-3xl bg-[#171717] p-6">
            <View
              className="absolute w-48 h-48 rounded-full -right-14 -top-16"
              style={{
                backgroundColor: "rgba(117,201,40,0.12)",
              }}
            />

            <View
              className="absolute w-40 h-40 rounded-full -bottom-20 right-12"
              style={{
                backgroundColor: "rgba(117,201,40,0.08)",
              }}
            />

            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-300">
                Available Balance
              </Text>

              <View className="items-center justify-center h-11 w-11 rounded-xl bg-white/10">
                <Wallet size={23} color={PRIMARY} />
              </View>
            </View>

            <Text className="mt-5 text-4xl font-extrabold text-white">
              {formatMoney(balance)}
            </Text>

            <View className="flex-row items-center gap-2 mt-5">
              <ShieldCheck size={16} color={PRIMARY} />

              <Text className="text-xs font-medium text-gray-300">
                ApusFly Wallet · PHP
              </Text>
            </View>
          </View>
        </View>

        {/* WALLET ACTIONS */}
        <View className="flex-row gap-3 px-6 mt-5">
          <Pressable
            onPress={() => setTopUpVisible(true)}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#75C928] py-4"
          >
            <Plus size={21} color={CHARCOAL} />
            <Text className="font-bold text-[#171717]">Top Up</Text>
          </Pressable>

          <Pressable
            onPress={handlePayBooking}
            className="flex-row items-center justify-center flex-1 gap-2 py-4 bg-white border border-gray-200 rounded-2xl"
          >
            <CreditCard size={20} color={CHARCOAL} />
            <Text className="font-bold text-[#171717]">Pay Booking</Text>
          </Pressable>
        </View>

        {/* WALLET INFORMATION */}
        <View className="mx-6 mt-7 rounded-2xl border border-[#DDEECD] bg-[#F0F8E9] p-4">
          <View className="flex-row items-start gap-3">
            <View className="items-center justify-center w-10 h-10 bg-white rounded-xl">
              <CheckCircle2 size={21} color={PRIMARY_DARK} />
            </View>

            <View className="flex-1">
              <Text className="text-sm font-bold text-[#171717]">
                One wallet for your bookings
              </Text>

              <Text className="mt-2 text-xs leading-5 text-gray-600">
                Your wallet will let you pay booking down payments and remaining
                balances when payment integration is available.
              </Text>
            </View>
          </View>
        </View>

        {/* RECENT TRANSACTIONS */}
        <View className="px-6 mt-9">
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-xl font-extrabold text-[#171717]">
                Recent Transactions
              </Text>
              <Text className="mt-1 text-sm text-gray-500">
                Your wallet activity
              </Text>
            </View>

            <Pressable
              onPress={() => setShowAll((previous) => !previous)}
              className="flex-row items-center gap-1"
            >
              <Text className="text-sm font-bold text-[#559E1C]">
                {showAll ? "Show Less" : "View All"}
              </Text>
              <ChevronRight size={17} color={PRIMARY_DARK} />
            </Pressable>
          </View>

          <View className="overflow-hidden bg-white border border-gray-100 rounded-2xl">
            {displayedTransactions.map((transaction, index) => (
              <View
                key={transaction.id}
                className={`flex-row items-center px-4 py-4 ${
                  index > 0 ? "border-t border-gray-100" : ""
                }`}
              >
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6DF]">
                  {renderTransactionIcon(transaction.category)}
                </View>

                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-bold text-[#171717]"
                  >
                    {transaction.title}
                  </Text>

                  <Text
                    numberOfLines={1}
                    className="mt-1 text-xs text-gray-500"
                  >
                    {transaction.description}
                  </Text>

                  <Text className="mt-1 text-xs text-gray-400">
                    {transaction.date}
                  </Text>
                </View>

                <View className="items-end">
                  <Text
                    className={`text-sm font-bold ${
                      transaction.type === "credit"
                        ? "text-[#559E1C]"
                        : "text-[#171717]"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "−"}
                    {formatMoney(transaction.amount)}
                  </Text>

                  <Text className="mt-1 text-xs text-gray-400">
                    {transaction.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* FOOTER */}
        <View className="items-center px-6 mt-8">
          <Text className="text-xs leading-5 text-center text-gray-400">
            Wallet balances and transactions shown here are for demonstration
            purposes only.
          </Text>
        </View>
      </ScrollView>

      {/* TOP UP MODAL */}
      <Modal
        visible={topUpVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTopUpVisible(false)}
      >
        <View className="justify-end flex-1 bg-black/50">
          <View className="px-6 pt-6 pb-10 bg-white rounded-t-3xl">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-xl font-extrabold text-[#171717]">
                  Top Up Wallet
                </Text>
                <Text className="mt-1 text-sm text-gray-500">
                  Add funds to your ApusFly wallet
                </Text>
              </View>

              <Pressable
                onPress={() => setTopUpVisible(false)}
                className="items-center justify-center w-10 h-10 bg-gray-100 rounded-xl"
              >
                <ArrowLeft size={20} color={CHARCOAL} />
              </Pressable>
            </View>

            <Text className="mb-3 text-sm font-semibold text-[#171717]">
              Select Amount
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-4">
              {[500, 1000, 2000, 5000].map((amount) => (
                <Pressable
                  key={amount}
                  onPress={() => setAmountInput(String(amount))}
                  className={`rounded-xl border px-4 py-3 ${
                    amountInput === String(amount)
                      ? "border-[#75C928] bg-[#EAF6DF]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Text className="font-bold text-[#171717]">
                    {formatMoney(amount)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="mb-2 text-sm font-semibold text-[#171717]">
              Custom Amount
            </Text>

            <View className="flex-row items-center px-4 border border-gray-200 rounded-xl">
              <Text className="text-lg font-bold text-gray-500">₱</Text>

              <TextInput
                value={amountInput}
                onChangeText={setAmountInput}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="#9CA3AF"
                className="h-14 flex-1 pl-3 text-base text-[#171717]"
              />
            </View>

            <Text className="mt-3 text-xs text-gray-500">
              Demo only. No payment gateway or bank transaction will be
              initiated.
            </Text>

            <Pressable
              onPress={handleTopUp}
              className="mt-7 flex-row items-center justify-center gap-2 rounded-xl bg-[#75C928] py-4"
            >
              <Text className="text-base font-bold text-[#171717]">
                Add Demo Funds
              </Text>
              <ArrowRight size={19} color={CHARCOAL} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
