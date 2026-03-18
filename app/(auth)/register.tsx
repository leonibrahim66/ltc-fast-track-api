import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { APP_CONFIG, USER_ROLES } from "@/constants/app";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useITRealtime } from "@/lib/it-realtime-context";
import { useAdmin } from "@/lib/admin-context";
import { getStaticResponsive } from "@/hooks/use-responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fallback seed zones shown when no zones have been created by admin yet
const SEED_ZONES: { id: string; name: string; town?: string; province?: string }[] = [
  { id: "zone-1", name: "Lusaka Central Zone A", town: "Lusaka", province: "Lusaka" },
  { id: "zone-2", name: "Lusaka Central Zone B", town: "Lusaka", province: "Lusaka" },
  { id: "zone-3", name: "Kabulonga Residential", town: "Lusaka", province: "Lusaka" },
  { id: "zone-4", name: "Woodlands Area", town: "Lusaka", province: "Lusaka" },
];
type UserType = "residential" | "commercial";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { addRegistration, addEvent } = useITRealtime();
  const { addNotification } = useAdmin();

  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>("residential");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Zone selection (step 5)
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [selectedZoneName, setSelectedZoneName] = useState("");
  const [availableZones, setAvailableZones] = useState<{ id: string; name: string; town?: string; province?: string }[]>(SEED_ZONES);
  const [zonesLoading, setZonesLoading] = useState(false);

  // Load zones from AsyncStorage on mount
  useEffect(() => {
    const loadZones = async () => {
      setZonesLoading(true);
      try {
        const raw = await AsyncStorage.getItem("@ltc_zones");
        if (raw) {
          const stored: any[] = JSON.parse(raw);
          const active = stored.filter((z) => z.status !== "inactive" && z.id && z.name);
          if (active.length > 0) setAvailableZones(active);
        }
      } catch (_e) {
        // keep SEED_ZONES as fallback
      } finally {
        setZonesLoading(false);
      }
    };
    loadZones();
  }, []);

  // Filter zones by keywords extracted from the customer's address (Step 4 → Step 5 suggestion)
  const filteredZones = (() => {
    if (!locationAddress.trim()) return availableZones;
    const keywords = locationAddress
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((w) => w.length > 2);
    if (keywords.length === 0) return availableZones;
    const matched = availableZones.filter((z) => {
      const haystack = [z.name, z.town, z.province]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return keywords.some((kw) => haystack.includes(kw));
    });
    // Always fall back to all zones so the user is never stuck with an empty list
    return matched.length > 0 ? matched : availableZones;
  })();
  const isFiltered = filteredZones.length < availableZones.length;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!fullName.trim()) {
        Alert.alert("Error", "Please enter your full name");
        return;
      }
      if (!phone.trim()) {
        Alert.alert("Error", "Please enter your phone number");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!password.trim()) {
        Alert.alert("Error", "Please enter a password");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      if (password.length < 4) {
        Alert.alert("Error", "Password must be at least 4 characters");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!locationAddress.trim()) {
        Alert.alert("Error", "Please enter your location");
        return;
      }
      setStep(5);
    }
  };

  const handleRegister = async () => {
    if (!selectedZoneId) {
      Alert.alert("Error", "Please select your collection zone");
      return;
    }
    setIsLoading(true);
    try {
      const success = await register({
        fullName: fullName.trim(),
        phone: phone.trim(),
        password: password,
        role: userType,
        location: {
          latitude: -15.4167,
          longitude: 28.2833,
          address: locationAddress.trim(),
        },
        assignedZoneId: selectedZoneId,
        zoneId: selectedZoneId,
        assignedZoneName: selectedZoneName,
      });

      if (success) {
        // Fix 1: Emit registration event to admin live screens
        addRegistration({
          fullName: fullName.trim(),
          phone: phone.trim(),
          role: userType,
          location: locationAddress.trim(),
          verified: false,
        });
        addEvent({
          type: "new_registration",
          title: "New User Registration",
          description: `${fullName.trim()} (${userType}) registered`,
          data: { userName: fullName.trim(), phone: phone.trim(), userRole: userType },
          priority: "medium",
        });
        addNotification({
          type: "user",
          title: "New Registration",
          message: `${fullName.trim()} registered as ${userType} user`,
        });
        Alert.alert(
          "Registration Successful",
          "Welcome to LTC FAST TRACK! You can now request garbage pickups.",
          [{ text: "Continue", onPress: () => router.replace("/(tabs)") }]
        );
      } else {
        Alert.alert("Registration Failed", "Phone number already registered. Please login instead.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-8">
            {/* Back Button */}
            <TouchableOpacity
              onPress={handleBack}
              className="mb-6"
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>

            {/* Progress Indicator */}
            <View className="flex-row mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <View
                  key={s}
                  className={`flex-1 h-1 rounded-full mx-1 ${
                    s <= step ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </View>

            {/* Step 1: User Type Selection */}
            {step === 1 && (
              <View className="flex-1">
                <Text className="text-3xl font-bold text-foreground mb-2">
                  Account Type
                </Text>
                <Text className="text-base text-muted mb-8">
                  Select the type of account you want to create
                </Text>

                <TouchableOpacity
                  onPress={() => setUserType("residential")}
                  className={`p-6 rounded-2xl mb-4 border-2 ${
                    userType === "residential"
                      ? "border-primary bg-surface"
                      : "border-border bg-background"
                  }`}
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                      <MaterialIcons name="home" size={24} color="#22C55E" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">
                        Residential
                      </Text>
                      <Text className="text-sm text-muted">
                        For homes and households
                      </Text>
                    </View>
                    {userType === "residential" && (
                      <MaterialIcons name="check-circle" size={24} color="#22C55E" />
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setUserType("commercial")}
                  className={`p-6 rounded-2xl mb-4 border-2 ${
                    userType === "commercial"
                      ? "border-primary bg-surface"
                      : "border-border bg-background"
                  }`}
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                      <MaterialIcons name="business" size={24} color="#22C55E" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">
                        Commercial
                      </Text>
                      <Text className="text-sm text-muted">
                        For businesses and companies
                      </Text>
                    </View>
                    {userType === "commercial" && (
                      <MaterialIcons name="check-circle" size={24} color="#22C55E" />
                    )}
                  </View>
                </TouchableOpacity>

                <View className="flex-1" />

                <TouchableOpacity
                  onPress={handleNext}
                  className="bg-primary py-4 rounded-full mb-4"
                  style={styles.button}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <View className="flex-1">
                <Text className="text-3xl font-bold text-foreground mb-2">
                  Personal Details
                </Text>
                <Text className="text-base text-muted mb-8">
                  Enter your personal information
                </Text>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-foreground mb-2">
                    Full Name
                  </Text>
                  <View className="flex-row items-center bg-surface border border-border rounded-xl px-4">
                    <MaterialIcons name="person" size={20} color="#6B7280" />
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter your full name"
                      className="flex-1 py-4 px-3 text-foreground text-base"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </Text>
                  <View className="flex-row items-center bg-surface border border-border rounded-xl px-4">
                    <MaterialIcons name="phone" size={20} color="#6B7280" />
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="e.g., 0960819993"
                      keyboardType="phone-pad"
                      className="flex-1 py-4 px-3 text-foreground text-base"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <View className="flex-1" />

                <TouchableOpacity
                  onPress={handleNext}
                  className="bg-primary py-4 rounded-full mb-4"
                  style={styles.button}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <View className="flex-1">
                <Text className="text-3xl font-bold text-foreground mb-2">
                  Create Password
                </Text>
                <Text className="text-base text-muted mb-8">
                  Choose a secure password for your account
                </Text>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-foreground mb-2">
                    Password
                  </Text>
                  <View className="flex-row items-center bg-surface border border-border rounded-xl px-4">
                    <MaterialIcons name="lock" size={20} color="#6B7280" />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter password"
                      secureTextEntry={!showPassword}
                      className="flex-1 py-4 px-3 text-foreground text-base"
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <MaterialIcons
                        name={showPassword ? "visibility-off" : "visibility"}
                        size={20}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </Text>
                  <View className="flex-row items-center bg-surface border border-border rounded-xl px-4">
                    <MaterialIcons name="lock" size={20} color="#6B7280" />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm password"
                      secureTextEntry={!showPassword}
                      className="flex-1 py-4 px-3 text-foreground text-base"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <View className="flex-1" />

                <TouchableOpacity
                  onPress={handleNext}
                  className="bg-primary py-4 rounded-full mb-4"
                  style={styles.button}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <View className="flex-1">
                <Text className="text-3xl font-bold text-foreground mb-2">
                  Your Location
                </Text>
                <Text className="text-base text-muted mb-8">
                  Enter your address for garbage pickup
                </Text>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-foreground mb-2">
                    Address / Location
                  </Text>
                  <View className="flex-row items-center bg-surface border border-border rounded-xl px-4">
                    <MaterialIcons name="location-on" size={20} color="#6B7280" />
                    <TextInput
                      value={locationAddress}
                      onChangeText={setLocationAddress}
                      placeholder="e.g., Plot 123, Lusaka, Zambia"
                      className="flex-1 py-4 px-3 text-foreground text-base"
                      placeholderTextColor="#9CA3AF"
                      multiline
                    />
                  </View>
                </View>

                <View className="bg-surface rounded-xl p-4 mb-4">
                  <View className="flex-row items-center">
                    <MaterialIcons name="info" size={20} color="#22C55E" />
                    <Text className="text-sm text-muted ml-2 flex-1">
                      You can update your exact location when requesting a pickup
                    </Text>
                  </View>
                </View>

                <View className="flex-1" />

                <TouchableOpacity
                  onPress={handleNext}
                  className="bg-primary py-4 rounded-full mb-4"
                  style={styles.button}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 5: Zone Selection */}
            {step === 5 && (
              <View className="flex-1">
                <Text className="text-3xl font-bold text-foreground mb-2">
                  Select Your Zone
                </Text>
                <Text className="text-base text-muted mb-6">
                  Choose the collection zone for your area. This helps us assign the right team to your pickups.
                </Text>

                {zonesLoading ? (
                  <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="#22C55E" size="large" />
                    <Text className="text-muted mt-3">Loading zones...</Text>
                  </View>
                ) : (
                  <View style={{ flex: 1 }}>
                    {isFiltered && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#E8F5E9",
                          borderRadius: 10,
                          padding: 10,
                          marginBottom: 10,
                        }}
                      >
                        <MaterialIcons name="filter-list" size={16} color="#22C55E" />
                        <Text style={{ fontSize: 12, color: "#22C55E", marginLeft: 6, flex: 1 }}>
                          Showing zones near your address. Tap a zone or scroll for all options.
                        </Text>
                      </View>
                    )}
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {filteredZones.map((zone) => {
                      const isSelected = selectedZoneId === zone.id;
                      return (
                        <TouchableOpacity
                          key={zone.id}
                          onPress={() => {
                            setSelectedZoneId(zone.id);
                            setSelectedZoneName(zone.name);
                          }}
                          style={[
                            {
                              borderRadius: 16,
                              marginBottom: 12,
                              padding: 16,
                              borderWidth: 2,
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: isSelected ? "#E8F5E9" : "#F9FAFB",
                              borderColor: isSelected ? "#22C55E" : "#E5E7EB",
                            },
                          ]}
                        >
                          <View
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 22,
                              backgroundColor: isSelected ? "#22C55E20" : "#F3F4F6",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: 14,
                            }}
                          >
                            <MaterialIcons
                              name="location-on"
                              size={22}
                              color={isSelected ? "#22C55E" : "#6B7280"}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "700",
                                color: isSelected ? "#1A2E1A" : "#1F2937",
                              }}
                            >
                              {zone.name}
                            </Text>
                            {(zone.town || zone.province) && (
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: "#6B7280",
                                  marginTop: 2,
                                }}
                              >
                                {[zone.town, zone.province].filter(Boolean).join(", ")}
                              </Text>
                            )}
                          </View>
                          {isSelected && (
                            <MaterialIcons name="check-circle" size={24} color="#22C55E" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                    </ScrollView>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={isLoading || !selectedZoneId}
                  className="bg-primary py-4 rounded-full mb-4 mt-4"
                  style={[styles.button, (isLoading || !selectedZoneId) && styles.buttonDisabled]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-center text-lg font-semibold">
                      Create Account
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Login Link */}
            <View className="flex-row justify-center mb-4">
              <Text className="text-muted text-base">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/role-auth?role=customer" as any)}>
                <Text className="text-primary font-semibold text-base">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const _rs = getStaticResponsive();
const styles = StyleSheet.create({
  backButton: {
    width: _rs.s(40),
    height: _rs.s(40),
    borderRadius: _rs.s(20),
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
