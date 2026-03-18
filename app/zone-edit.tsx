import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ZoneEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const zoneId = params.id as string;

  // Mock data - will be replaced with backend API call
  const [zoneName, setZoneName] = useState("Lusaka Central Zone A");
  const [city, setCity] = useState("Lusaka");
  const [description, setDescription] = useState("Covers the central business district and surrounding residential areas");
  const [boundaries, setBoundaries] = useState('[{"lat": -15.4167, "lng": 28.2833}, {"lat": -15.4200, "lng": 28.2900}]');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!zoneName.trim() || !city.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call backend API to update zone
      // const response = await trpc.zoneManagement.updateZone.mutate({
      //   id: zoneId,
      //   name: zoneName,
      //   city,
      //   description,
      //   boundaries,
      // });

      Alert.alert(
        "Success",
        "Zone updated successfully",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update zone");
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
          <Text className="text-white text-2xl font-bold">Edit Zone</Text>
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

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`bg-green-600 rounded-xl py-4 items-center ${isLoading ? "opacity-50" : ""}`}
        >
          <Text className="text-white font-bold text-base">
            {isLoading ? "Saving Changes..." : "Save Changes"}
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
