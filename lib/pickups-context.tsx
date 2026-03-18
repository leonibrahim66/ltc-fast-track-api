import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppStateStatus } from "react-native";
import { PickupStatus } from "@/constants/app";
import { StorageEventBus, STORAGE_KEYS } from "@/lib/storage-event-bus";

export interface PickupRequest {
  id: string;
  userId: string;
  userPhone: string;
  userName: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  binType: "residential" | "commercial" | "industrial";
  photoUri?: string;
  notes?: string;
  status: PickupStatus;
  createdAt: string;
  assignedTo?: string;
  collectorId?: string;
  collectorName?: string;
  completedAt?: string;
  completionNotes?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  rating?: number;
  ratingComment?: string;
  completionPhotos?: string[];
  // Zone relationship — set from customer.assignedZoneId at pickup creation
  zoneId?: string;
  zoneName?: string;
  // Driver contact details — written when driver accepts the pickup
  driverPhone?: string;
  driverVehicleType?: string;
  // Convenience: driver name already stored in collectorName but also here for clarity
  assignedDriverName?: string;
}

interface PickupsContextType {
  pickups: PickupRequest[];
  userPickups: PickupRequest[];
  pendingPickups: PickupRequest[];
  isLoading: boolean;
  createPickup: (pickup: Omit<PickupRequest, "id" | "createdAt" | "status">) => Promise<PickupRequest>;
  updatePickup: (id: string, updates: Partial<PickupRequest>) => Promise<void>;
  updatePickupStatus: (id: string, status: PickupStatus) => Promise<void>;
  getPickupById: (id: string) => PickupRequest | undefined;
  refreshPickups: () => Promise<void>;
}

// Export type alias for convenience
export type Pickup = PickupRequest;

const PickupsContext = createContext<PickupsContextType | undefined>(undefined);

const STORAGE_KEY = STORAGE_KEYS.PICKUPS;

export function PickupsProvider({ children }: { children: React.ReactNode }) {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPickups = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPickups(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load pickups:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPickups();
  }, [loadPickups]);

  // Real-time: reload when another context emits a change to this key
  useEffect(() => {
    return StorageEventBus.subscribe(STORAGE_KEY, loadPickups);
  }, [loadPickups]);

  // Cross-device: reload when app returns to foreground
  useEffect(() => {
    let appStateRef: AppStateStatus = AppState.currentState;
    const sub = AppState.addEventListener("change", (next) => {
      if (appStateRef.match(/inactive|background/) && next === "active") {
        loadPickups();
      }
      appStateRef = next;
    });
    return () => sub.remove();
  }, [loadPickups]);

  const savePickups = async (newPickups: PickupRequest[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPickups));
      setPickups(newPickups);
      // Notify all other subscribers (admin panels, driver screens, etc.)
      StorageEventBus.emit(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to save pickups:", error);
    }
  };

  const createPickup = useCallback(async (
    pickupData: Omit<PickupRequest, "id" | "createdAt" | "status">
  ): Promise<PickupRequest> => {
    const newPickup: PickupRequest = {
      ...pickupData,
      id: `pickup_${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    // Read fresh state to avoid stale closure
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const current: PickupRequest[] = stored ? JSON.parse(stored) : [];
    const updatedPickups = [newPickup, ...current];
    await savePickups(updatedPickups);
    return newPickup;
  }, []);

  const updatePickup = useCallback(async (id: string, updates: Partial<PickupRequest>) => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const current: PickupRequest[] = stored ? JSON.parse(stored) : [];
    const updatedPickups = current.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    await savePickups(updatedPickups);
  }, []);

  const updatePickupStatus = useCallback(async (id: string, status: PickupStatus) => {
    const updates: Partial<PickupRequest> = { status };
    if (status === "completed") {
      updates.completedAt = new Date().toISOString();
    }
    await updatePickup(id, updates);
  }, [updatePickup]);

  const getPickupById = useCallback((id: string) => {
    return pickups.find((p) => p.id === id);
  }, [pickups]);

  const refreshPickups = useCallback(async () => {
    setIsLoading(true);
    await loadPickups();
  }, [loadPickups]);

  // Derived state
  const userPickups = pickups; // Will be filtered by userId in components
  const pendingPickups = pickups.filter((p) => p.status === "pending" || p.status === "assigned");

  return (
    <PickupsContext.Provider
      value={{
        pickups,
        userPickups,
        pendingPickups,
        isLoading,
        createPickup,
        updatePickup,
        updatePickupStatus,
        getPickupById,
        refreshPickups,
      }}
    >
      {children}
    </PickupsContext.Provider>
  );
}

export function usePickups() {
  const context = useContext(PickupsContext);
  if (context === undefined) {
    throw new Error("usePickups must be used within a PickupsProvider");
  }
  return context;
}
