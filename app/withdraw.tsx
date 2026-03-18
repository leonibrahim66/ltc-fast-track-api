import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useReferrals } from "@/lib/referrals-context";
import { useWithdrawals } from "@/lib/withdrawals-context";
import { APP_CONFIG } from "@/constants/app";

type WithdrawMethod = "mtn" | "airtel" | "bank";

interface WithdrawOption {
  id: WithdrawMethod;
  name: string;
  icon: string;
  description: string;
  processingTime: string;
}

const WITHDRAW_OPTIONS: WithdrawOption[] = [
  {
    id: "mtn",
    name: "MTN Mobile Money",
    icon: "📱",
    description: "Withdraw to your MTN MoMo account",
    processingTime: "Instant - 24 hours",
  },
  {
    id: "airtel",
    name: "Airtel Money",
    icon: "📲",
    description: "Withdraw to your Airtel Money account",
    processingTime: "Instant - 24 hours",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: "🏦",
    description: "Withdraw to your bank account",
    processingTime: "1-3 business days",
  },
];

const MIN_WITHDRAWAL = 50;
const MAX_WITHDRAWAL = 10000;

export default function WithdrawScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { credits } = useReferrals();
  const { createWithdrawal } = useWithdrawals();
  
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod | null>(null);
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // For demo, use referral credits as available balance
  const availableBalance = credits;

  const handleSelectMethod = (method: WithdrawMethod) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedMethod(method);
    setAccountNumber("");
    setAccountName("");
    setBankName("");
    setBranchCode("");
  };

  const validateWithdrawal = (): boolean => {
    const withdrawAmount = parseFloat(amount);

    if (!selectedMethod) {
      Alert.alert("Error", "Please select a withdrawal method.");
      return false;
    }

    if (!amount || isNaN(withdrawAmount)) {
      Alert.alert("Error", "Please enter a valid amount.");
      return false;
    }

    if (withdrawAmount < MIN_WITHDRAWAL) {
      Alert.alert("Error", `Minimum withdrawal amount is K${MIN_WITHDRAWAL}.`);
      return false;
    }

    if (withdrawAmount > MAX_WITHDRAWAL) {
      Alert.alert("Error", `Maximum withdrawal amount is K${MAX_WITHDRAWAL}.`);
      return false;
    }

    if (withdrawAmount > availableBalance) {
      Alert.alert("Error", "Insufficient balance for this withdrawal.");
      return false;
    }

    if (!accountNumber.trim()) {
      Alert.alert("Error", "Please enter your account/phone number.");
      return false;
    }

    if (!accountName.trim()) {
      Alert.alert("Error", "Please enter the account holder name.");
      return false;
    }

    if (selectedMethod === "bank" && !bankName.trim()) {
      Alert.alert("Error", "Please enter your bank name.");
      return false;
    }

    return true;
  };

  const handleWithdraw = async () => {
    if (!validateWithdrawal()) return;

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setIsProcessing(true);

    try {
      // Create withdrawal record
      const withdrawal = await createWithdrawal({
        userId: user?.id || "guest",
        amount: parseFloat(amount),
        method: selectedMethod!,
        accountNumber,
        accountName,
        bankName: selectedMethod === "bank" ? bankName : undefined,
      });

      setIsProcessing(false);
      
      const methodName = WITHDRAW_OPTIONS.find(o => o.id === selectedMethod)?.name || "Selected method";
      
      Alert.alert(
        "Withdrawal Request Submitted",
        `Your withdrawal of K${amount} to ${methodName} has been submitted.\n\nAccount: ${accountNumber}\nName: ${accountName}\nReference: ${withdrawal.reference}\n\nYou will receive a confirmation once processed.`,
        [
          {
            text: "View History",
            onPress: () => router.push("/withdrawal-history" as any),
          },
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      setIsProcessing(false);
      Alert.alert("Error", "Failed to submit withdrawal request. Please try again.");
    }
  };

  const renderMethodSelector = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-foreground mb-3">
        Select Withdrawal Method
      </Text>
      {WITHDRAW_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.id}
          onPress={() => handleSelectMethod(option.id)}
          className={`flex-row items-center p-4 rounded-xl mb-3 border ${
            selectedMethod === option.id
              ? "bg-primary/10 border-primary"
              : "bg-surface border-border"
          }`}
        >
          <Text className="text-3xl mr-4">{option.icon}</Text>
          <View className="flex-1">
            <Text className="text-foreground font-semibold">{option.name}</Text>
            <Text className="text-muted text-sm">{option.description}</Text>
            <Text className="text-primary text-xs mt-1">
              ⏱️ {option.processingTime}
            </Text>
          </View>
          <View
            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              selectedMethod === option.id
                ? "border-primary bg-primary"
                : "border-muted"
            }`}
          >
            {selectedMethod === option.id && (
              <Text className="text-white text-xs">✓</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMobileMoneyForm = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-foreground mb-3">
        {selectedMethod === "mtn" ? "MTN MoMo" : "Airtel Money"} Details
      </Text>
      
      <View className="mb-4">
        <Text className="text-muted mb-2">Phone Number</Text>
        <TextInput
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder={selectedMethod === "mtn" ? "e.g., 0960819993" : "e.g., 0978123456"}
          keyboardType="phone-pad"
          className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
          placeholderTextColor="#9BA1A6"
        />
      </View>

      <View className="mb-4">
        <Text className="text-muted mb-2">Account Holder Name</Text>
        <TextInput
          value={accountName}
          onChangeText={setAccountName}
          placeholder="Name as registered on mobile money"
          className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
          placeholderTextColor="#9BA1A6"
        />
      </View>
    </View>
  );

  const renderBankForm = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-foreground mb-3">
        Bank Account Details
      </Text>
      
      <View className="mb-4">
        <Text className="text-muted mb-2">Bank Name</Text>
        <TextInput
          value={bankName}
          onChangeText={setBankName}
          placeholder="e.g., Zanaco, Stanbic, FNB"
          className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
          placeholderTextColor="#9BA1A6"
        />
      </View>

      <View className="mb-4">
        <Text className="text-muted mb-2">Account Number</Text>
        <TextInput
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder="Enter your bank account number"
          keyboardType="number-pad"
          className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
          placeholderTextColor="#9BA1A6"
        />
      </View>

      <View className="mb-4">
        <Text className="text-muted mb-2">Account Holder Name</Text>
        <TextInput
          value={accountName}
          onChangeText={setAccountName}
          placeholder="Name as it appears on account"
          className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
          placeholderTextColor="#9BA1A6"
        />
      </View>

      <View className="mb-4">
        <Text className="text-muted mb-2">Branch Code (Optional)</Text>
        <TextInput
          value={branchCode}
          onChangeText={setBranchCode}
          placeholder="Enter branch code if required"
          className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
          placeholderTextColor="#9BA1A6"
        />
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center mb-6 mt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2"
          >
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-foreground">Withdraw Funds</Text>
            <Text className="text-muted">Transfer to mobile money or bank</Text>
          </View>
        </View>

        {/* Balance Card */}
        <View className="bg-primary rounded-2xl p-5 mb-6">
          <Text className="text-white/80 mb-1">Available Balance</Text>
          <Text className="text-white text-3xl font-bold">
            K{availableBalance.toFixed(2)}
          </Text>
          <Text className="text-white/60 text-sm mt-2">
            Min: K{MIN_WITHDRAWAL} • Max: K{MAX_WITHDRAWAL}
          </Text>
        </View>

        {/* Amount Input */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Withdrawal Amount
          </Text>
          <View className="flex-row items-center bg-surface border border-border rounded-xl px-4">
            <Text className="text-foreground text-xl font-bold mr-2">K</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              className="flex-1 py-4 text-foreground text-xl"
              placeholderTextColor="#9BA1A6"
            />
          </View>
          
          {/* Quick Amount Buttons */}
          <View className="flex-row gap-2 mt-3">
            {[100, 250, 500, 1000].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                onPress={() => setAmount(quickAmount.toString())}
                className="flex-1 bg-surface border border-border py-2 rounded-lg"
              >
                <Text className="text-center text-foreground font-medium">
                  K{quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Method Selector */}
        {renderMethodSelector()}

        {/* Method-specific Form */}
        {selectedMethod === "mtn" && renderMobileMoneyForm()}
        {selectedMethod === "airtel" && renderMobileMoneyForm()}
        {selectedMethod === "bank" && renderBankForm()}

        {/* Withdraw Button */}
        {selectedMethod && (
          <TouchableOpacity
            onPress={handleWithdraw}
            disabled={isProcessing}
            className={`py-4 rounded-xl mb-8 ${
              isProcessing ? "bg-muted" : "bg-primary"
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isProcessing ? "Processing..." : `Withdraw K${amount || "0"}`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Info Note */}
        <View className="bg-surface rounded-xl p-4 mb-8">
          <Text className="text-foreground font-semibold mb-2">ℹ️ Important Notes</Text>
          <Text className="text-muted text-sm leading-5">
            • Mobile money withdrawals are typically processed within 24 hours{"\n"}
            • Bank transfers may take 1-3 business days{"\n"}
            • Ensure account details are correct to avoid delays{"\n"}
            • Contact support if you experience any issues
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
