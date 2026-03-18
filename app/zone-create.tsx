import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ZoneCreateScreen() {
  const router = useRouter();
  const [zoneName, setZoneName] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [boundaries, setBoundaries] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!zoneName.trim() || !city.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call backend API to create zone
      // const response = await trpc.zoneManagement.createZone.mutate({
      //   name: zoneName,
      //   city,
      //   description,
      //   boundaries,
      // });

      Alert.alert(
        "Success",
        "Zone created successfully",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create zone");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="bg-green-600 px-6 pt-6 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
          >
            <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Create New Zone</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Zone Name */}
        <View className="mb-5">
          <Text className="text-foreground font-semibold text-base mb-2">
            Zone Name <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="e.g., Lusaka Central Zone A"
            value={zoneName}
            onChangeText={setZoneName}
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
          />
        </View>

        {/* City */}
        <View className="mb-5">
          <Text className="text-foreground font-semibold text-base mb-2">
            City <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="e.g., Lusaka"
            value={city}
            onChangeText={setCity}
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
          />
        </View>

        {/* Description */}
        <View className="mb-5">
          <Text className="text-foreground font-semibold text-base mb-2">Description</Text>
          <TextInput
            placeholder="Brief description of the zone coverage area"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            style={{ textAlignVertical: "top" }}
          />
        </View>

        {/* Boundaries */}
        <View className="mb-5">
          <Text className="text-foreground font-semibold text-base mb-2">
            Boundaries (Coordinates)
          </Text>
          <Text className="text-muted text-sm mb-2">
            Enter boundary coordinates in JSON format or comma-separated lat/lng pairs
          </Text>
          <TextInput
            placeholder='e.g., [{"lat": -15.4167, "lng": 28.2833}, ...]'
            value={boundaries}
            onChangeText={setBoundaries}
            multiline
            numberOfLines={4}
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground font-mono text-xs"
            style={{ textAlignVertical: "top" }}
          />
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <View className="flex-row items-start">
            <MaterialIcons name="info" size={20} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <Text className="text-blue-900 font-medium text-sm mb-1">Zone Creation Tips</Text>
              <Text className="text-blue-700 text-xs leading-5">
                • Choose a descriptive name that includes the area{"\n"}
                • Ensure boundaries don't overlap with existing zones{"\n"}
                • You can assign zone managers and households after creation
              </Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`bg-green-600 rounded-xl py-4 items-center ${isLoading ? "opacity-50" : ""}`}
        >
          <Text className="text-white font-bold text-base">
            {isLoading ? "Creating Zone..." : "Create Zone"}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-surface border border-border rounded-xl py-4 items-center mt-3"
        >
          <Text className="text-foreground font-semibold text-base">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
