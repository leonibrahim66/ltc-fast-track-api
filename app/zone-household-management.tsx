import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Household {
  id: string;
  address: string;
  customerName: string;
  phone: string;
  subscriptionType: "Residential" | "Commercial";
  currentZone: string;
  status: "active" | "inactive";
}

interface Zone {
  id: string;
  name: string;
}

export default function ZoneHouseholdManagementScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const preselectedZoneId = params.zoneId as string | undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>(preselectedZoneId || "");
  const [showZoneSelector, setShowZoneSelector] = useState(false);
  const [selectedHouseholds, setSelectedHouseholds] = useState<string[]>([]);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [targetZone, setTargetZone] = useState<string>("");

  // Mock data - will be replaced with backend API calls
  const zones: Zone[] = [
    { id: "1", name: "Lusaka Central Zone A" },
    { id: "2", name: "Lusaka Central Zone B" },
    { id: "3", name: "Kabulonga Residential" },
    { id: "4", name: "Woodlands Area" },
  ];

  const households: Household[] = [
    {
      id: "1",
      address: "Plot 123, Cairo Road",
      customerName: "James Banda",
      phone: "+260 97 111 2222",
      subscriptionType: "Commercial",
      currentZone: "Lusaka Central Zone A",
      status: "active",
    },
    {
      id: "2",
      address: "House 45, Independence Avenue",
      customerName: "Sarah Mwale",
      phone: "+260 96 222 3333",
      subscriptionType: "Residential",
      currentZone: "Lusaka Central Zone A",
      status: "active",
    },
    {
      id: "3",
      address: "Plot 78, Church Road",
      customerName: "David Phiri",
      phone: "+260 95 333 4444",
      subscriptionType: "Commercial",
      currentZone: "Lusaka Central Zone A",
      status: "active",
    },
    {
      id: "4",
      address: "House 12, Nationalist Road",
      customerName: "Grace Tembo",
      phone: "+260 97 444 5555",
      subscriptionType: "Residential",
      currentZone: "Lusaka Central Zone B",
      status: "active",
    },
  ];

  const filteredHouseholds = households.filter((household) => {
    const matchesSearch =
      household.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      household.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      household.phone.includes(searchQuery);
    const matchesZone = !selectedZone || household.currentZone === zones.find((z) => z.id === selectedZone)?.name;
    return matchesSearch && matchesZone;
  });

  const toggleHouseholdSelection = (householdId: string) => {
    setSelectedHouseholds((prev) =>
      prev.includes(householdId)
        ? prev.filter((id) => id !== householdId)
        : [...prev, householdId]
    );
  };

  const handleReassign = () => {
    if (selectedHouseholds.length === 0) {
      Alert.alert("Error", "Please select at least one household");
      return;
    }
    setShowReassignModal(true);
  };

  const confirmReassign = async () => {
    if (!targetZone) {
      Alert.alert("Error", "Please select a target zone");
      return;
    }

    const targetZoneName = zones.find((z) => z.id === targetZone)?.name;
    Alert.alert(
      "Confirm Reassignment",
      `Reassign ${selectedHouseholds.length} household(s) to ${targetZoneName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reassign",
          onPress: async () => {
            // TODO: Call backend API to reassign households
            Alert.alert("Success", "Households reassigned successfully");
            setSelectedHouseholds([]);
            setShowReassignModal(false);
            setTargetZone("");
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-6 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1">
            Household Management
          </Text>
          {selectedHouseholds.length > 0 && (
            <View className="bg-white/20 rounded-full px-3 py-1">
              <Text className="text-white font-bold">{selectedHouseholds.length}</Text>
            </View>
          )}
        </View>

        {/* Zone Selector */}
        <TouchableOpacity
          onPress={() => setShowZoneSelector(!showZoneSelector)}
          className="bg-white/20 rounded-xl px-4 py-3 flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center flex-1">
            <MaterialIcons name="location-on" size={20} color="white" />
            <Text className="text-white font-medium ml-2 flex-1" numberOfLines={1}>
              {selectedZone
                ? zones.find((z) => z.id === selectedZone)?.name
                : "All zones"}
            </Text>
          </View>
          <MaterialIcons
            name={showZoneSelector ? "expand-less" : "expand-more"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        {/* Zone Dropdown */}
        {showZoneSelector && (
          <View className="bg-white rounded-xl mb-3 overflow-hidden">
            <TouchableOpacity
              onPress={() => {
                setSelectedZone("");
                setShowZoneSelector(false);
              }}
              className={`px-4 py-3 border-b border-border ${
                !selectedZone ? "bg-green-50" : ""
              }`}
            >
              <Text
                className={`font-medium ${
                  !selectedZone ? "text-green-600" : "text-foreground"
                }`}
              >
                All zones
              </Text>
            </TouchableOpacity>
            {zones.map((zone) => (
              <TouchableOpacity
                key={zone.id}
                onPress={() => {
                  setSelectedZone(zone.id);
                  setShowZoneSelector(false);
                }}
                className={`px-4 py-3 border-b border-border ${
                  selectedZone === zone.id ? "bg-green-50" : ""
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedZone === zone.id ? "text-green-600" : "text-foreground"
                  }`}
                >
                  {zone.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Bar */}
        <View className="bg-white/20 rounded-xl px-4 py-2 flex-row items-center">
          <MaterialIcons name="search" size={20} color="white" />
          <TextInput
            placeholder="Search households..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-white"
          />
        </View>
      </View>

      {/* Household List */}
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {filteredHouseholds.length === 0 ? (
          <View className="items-center justify-center py-12">
            <MaterialIcons name="home-work" size={64} color="#9BA1A6" />
            <Text className="text-muted text-lg mt-4">No households found</Text>
            <Text className="text-muted text-sm mt-2">
              Try adjusting your search or zone filter
            </Text>
          </View>
        ) : (
          <View className="gap-4 mb-20">
            {filteredHouseholds.map((household) => {
              const isSelected = selectedHouseholds.includes(household.id);
              return (
                <TouchableOpacity
                  key={household.id}
                  onPress={() => toggleHouseholdSelection(household.id)}
                  className={`bg-surface border-2 rounded-2xl p-5 ${
                    isSelected ? "border-green-600" : "border-border"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                  }}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-foreground font-bold text-lg">
                        {household.address}
                      </Text>
                      <Text className="text-muted text-sm mt-1">
                        {household.customerName}
                      </Text>
                      <Text className="text-muted text-sm">{household.phone}</Text>
                    </View>
                    <View
                      className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                        isSelected
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </View>
                  </View>

                  <View className="flex-row items-center gap-3 mb-2">
                    <View
                      className={`px-2 py-1 rounded ${
                        household.subscriptionType === "Commercial"
                          ? "bg-purple-100"
                          : "bg-blue-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          household.subscriptionType === "Commercial"
                            ? "text-purple-700"
                            : "text-blue-700"
                        }`}
                      >
                        {household.subscriptionType}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons name="location-on" size={14} color="#9BA1A6" />
                      <Text className="text-muted text-xs ml-1">
                        {household.currentZone}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {selectedHouseholds.length > 0 && (
        <View className="absolute bottom-6 left-6 right-6">
          <TouchableOpacity
            onPress={handleReassign}
            className="bg-green-600 rounded-xl py-4 flex-row items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <MaterialIcons name="swap-horiz" size={24} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Reassign {selectedHouseholds.length} Household(s)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reassignment Modal */}
      {showReassignModal && (
        <View
          className="absolute inset-0 bg-black/50 items-center justify-center"
          style={{ zIndex: 1000 }}
        >
          <View className="bg-background rounded-2xl p-6 mx-6 w-full max-w-md">
            <Text className="text-foreground font-bold text-xl mb-4">
              Select Target Zone
            </Text>
            <Text className="text-muted text-sm mb-4">
              Choose the zone to reassign {selectedHouseholds.length} household(s) to:
            </Text>

            <ScrollView className="max-h-64 mb-4">
              {zones.map((zone) => (
                <TouchableOpacity
                  key={zone.id}
                  onPress={() => setTargetZone(zone.id)}
                  className={`px-4 py-3 rounded-xl mb-2 border ${
                    targetZone === zone.id
                      ? "bg-green-50 border-green-600"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      targetZone === zone.id ? "text-green-600" : "text-foreground"
                    }`}
                  >
                    {zone.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowReassignModal(false);
                  setTargetZone("");
                }}
                className="flex-1 bg-surface border border-border rounded-xl py-3 items-center"
              >
                <Text className="text-foreground font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmReassign}
                disabled={!targetZone}
                className={`flex-1 rounded-xl py-3 items-center ${
                  targetZone ? "bg-green-600" : "bg-gray-400"
                }`}
              >
                <Text className="text-white font-semibold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
