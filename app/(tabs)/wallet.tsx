import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type TransactionType = "recharge" | "withdrawal" | "referral" | "payment";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

/**
 * Wallet tab screen - main wallet interface
 */
export default function WalletTabScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawalPin, setWithdrawalPin] = useState("");

  // Mock wallet data - will be replaced with API calls
  const [walletData, setWalletData] = useState({
    totalBalance: 1250.50,
    rechargedBalance: 1000.00,
    referralBalance: 250.50,
    hasLinkedAccount: false, // Will check from database
    linkedPhoneNumber: "",
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "recharge",
      amount: 500.00,
      date: "2026-02-13",
      status: "completed",
      description: "Wallet recharge via Mobile Money",
    },
    {
      id: "2",
      type: "referral",
      amount: 50.50,
      date: "2026-02-12",
      status: "completed",
      description: "Referral bonus from John Banda",
    },
    {
      id: "3",
      type: "payment",
      amount: -150.00,
      date: "2026-02-11",
      status: "completed",
      description: "Carrier service payment",
    },
    {
      id: "4",
      type: "withdrawal",
      amount: -200.00,
      date: "2026-02-10",
      status: "pending",
      description: "Withdrawal to bank account",
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch wallet data from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }

    // TODO: Integrate with payment gateway API
    Alert.alert(
      "Recharge Initiated",
      `Recharging K${amount.toFixed(2)}. You will be redirected to payment gateway.`,
      [
        {
          text: "OK",
          onPress: () => {
            setShowRechargeModal(false);
            setRechargeAmount("");
          },
        },
      ]
    );
  };

  const handleWithdraw = () => {
    if (!walletData.hasLinkedAccount) {
      Alert.alert(
        "Link Account Required",
        "Please link your mobile money account first to withdraw funds.",
        [
          {
            text: "Link Account",
            onPress: () => {
              setShowWithdrawModal(false);
              router.push("/link-account" as any);
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }

    if (amount > walletData.totalBalance) {
      Alert.alert("Insufficient Balance", "You don't have enough balance to withdraw");
      return;
    }

    if (!withdrawalPin || withdrawalPin.length < 4) {
      Alert.alert("PIN Required", "Please enter your 4-digit withdrawal PIN");
      return;
    }

    // TODO: Verify PIN and submit withdrawal request to API
    Alert.alert(
      "Withdrawal Requested",
      `Withdrawal of K${amount.toFixed(2)} to ${walletData.linkedPhoneNumber} has been submitted. It will be processed within 24-48 hours.`,
      [
        {
          text: "OK",
          onPress: () => {
            setShowWithdrawModal(false);
            setWithdrawAmount("");
            setWithdrawalPin("");
          },
        },
      ]
    );
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "recharge":
        return "add-circle";
      case "withdrawal":
        return "remove-circle";
      case "referral":
        return "card-giftcard";
      case "payment":
        return "payment";
      default:
        return "attach-money";
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case "recharge":
        return "#22C55E";
      case "withdrawal":
        return "#EF4444";
      case "referral":
        return "#8B5CF6";
      case "payment":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#22C55E";
      case "pending":
        return "#F59E0B";
      case "failed":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  if (!user) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-base text-muted">My Wallet</Text>
          <Text className="text-2xl font-bold text-foreground">
            K{walletData.totalBalance.toFixed(2)}
          </Text>
        </View>

        {/* Balance Cards */}
        <View className="px-6 mb-6">
          <View className="bg-primary rounded-2xl p-6 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white text-sm opacity-80">Total Balance</Text>
                <Text className="text-white text-3xl font-bold mt-1">
                  K{walletData.totalBalance.toFixed(2)}
                </Text>
              </View>
              <MaterialIcons name="account-balance-wallet" size={48} color="rgba(255,255,255,0.3)" />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowRechargeModal(true)}
                className="flex-1 bg-white rounded-xl py-3 items-center"
              >
                <MaterialIcons name="add" size={20} color="#0a7ea4" />
                <Text className="text-primary text-xs font-semibold mt-1">Recharge</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowWithdrawModal(true)}
                className="flex-1 bg-white rounded-xl py-3 items-center"
              >
                <MaterialIcons name="remove" size={20} color="#0a7ea4" />
                <Text className="text-primary text-xs font-semibold mt-1">Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Breakdown */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Recharged</Text>
              <Text className="text-foreground text-lg font-bold">
                K{walletData.rechargedBalance.toFixed(2)}
              </Text>
            </View>

            <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Referral</Text>
              <Text className="text-foreground text-lg font-bold">
                K{walletData.referralBalance.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Link Account Button */}
          <TouchableOpacity
            onPress={() => router.push("/link-account" as any)}
            className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <MaterialIcons
                name={walletData.hasLinkedAccount ? "check-circle" : "link"}
                size={24}
                color={walletData.hasLinkedAccount ? "#22C55E" : "#0a7ea4"}
              />
              <View className="ml-3">
                <Text className="text-foreground font-semibold">
                  {walletData.hasLinkedAccount ? "Manage Linked Account" : "Link Your Account"}
                </Text>
                <Text className="text-muted text-xs mt-1">
                  {walletData.hasLinkedAccount
                    ? `Linked: ${walletData.linkedPhoneNumber}`
                    : "Required for withdrawals"}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Transaction History
          </Text>

          {transactions.length === 0 ? (
            <View className="bg-surface rounded-xl p-8 items-center">
              <MaterialIcons name="receipt-long" size={48} color="#9CA3AF" />
              <Text className="text-muted text-center mt-2">No transactions yet</Text>
            </View>
          ) : (
            <View className="gap-3">
              {transactions.map((transaction) => (
                <View
                  key={transaction.id}
                  className="bg-surface rounded-xl p-4 border border-border"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View
                        style={{ backgroundColor: `${getTransactionColor(transaction.type)}20` }}
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      >
                        <MaterialIcons
                          name={getTransactionIcon(transaction.type) as any}
                          size={20}
                          color={getTransactionColor(transaction.type)}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold text-sm">
                          {transaction.description}
                        </Text>
                        <Text className="text-muted text-xs mt-1">
                          {transaction.date}
                        </Text>
                      </View>
                    </View>

                    <View className="items-end ml-2">
                      <Text
                        style={{ color: transaction.amount >= 0 ? "#22C55E" : "#EF4444" }}
                        className="font-bold text-base"
                      >
                        {transaction.amount >= 0 ? "+" : ""}K{Math.abs(transaction.amount).toFixed(2)}
                      </Text>
                      <View
                        style={{ backgroundColor: `${getStatusColor(transaction.status)}20` }}
                        className="px-2 py-1 rounded mt-1"
                      >
                        <Text
                          style={{ color: getStatusColor(transaction.status) }}
                          className="text-xs font-medium capitalize"
                        >
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Recharge Modal */}
      <Modal
        visible={showRechargeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRechargeModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-foreground">Recharge Wallet</Text>
              <TouchableOpacity onPress={() => setShowRechargeModal(false)}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-muted text-sm mb-2">Enter Amount (K)</Text>
              <TextInput
                value={rechargeAmount}
                onChangeText={setRechargeAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-lg"
              />
            </View>

            <View className="flex-row gap-2 mb-6">
              {["100", "500", "1000", "2000"].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => setRechargeAmount(amount)}
                  className="flex-1 bg-surface border border-border rounded-lg py-2"
                >
                  <Text className="text-foreground text-center font-medium">K{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleRecharge}
              className="bg-primary rounded-xl py-4 items-center"
            >
              <Text className="text-white font-bold text-base">Continue to Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-foreground">Withdraw Funds</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-muted text-sm mb-2">Available Balance</Text>
              <Text className="text-foreground text-2xl font-bold mb-4">
                K{walletData.totalBalance.toFixed(2)}
              </Text>
            </View>

            {walletData.hasLinkedAccount && (
              <View className="mb-4 bg-surface rounded-xl p-3 border border-border">
                <Text className="text-muted text-xs mb-1">Withdraw to</Text>
                <Text className="text-foreground font-semibold">{walletData.linkedPhoneNumber}</Text>
              </View>
            )}

            <View className="mb-4">
              <Text className="text-muted text-sm mb-2">Withdrawal Amount (K)</Text>
              <TextInput
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-lg"
              />
            </View>

            {walletData.hasLinkedAccount && (
              <View className="mb-6">
                <Text className="text-muted text-sm mb-2">Withdrawal PIN</Text>
                <TextInput
                  value={withdrawalPin}
                  onChangeText={setWithdrawalPin}
                  placeholder="Enter 4-digit PIN"
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-lg"
                />
              </View>
            )}

            <TouchableOpacity
              onPress={handleWithdraw}
              className="bg-primary rounded-xl py-4 items-center"
            >
              <Text className="text-white font-bold text-base">
                {walletData.hasLinkedAccount ? "Submit Withdrawal Request" : "Link Account to Withdraw"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
