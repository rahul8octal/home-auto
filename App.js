import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ControlCard from "./components/ControlCard";
import DeviceCard from "./components/DeviceCard";
import WeatherWidget from "./components/WeatherWidget";

const REQUEST_TIMEOUT_MS = 5000;

const isValidIpv4 = (value) => {
  const trimmedValue = value.trim();
  const ipv4Segment = "(25[0-5]|2[0-4]\\d|1?\\d?\\d)";
  const ipv4Regex = new RegExp(`^${ipv4Segment}(\\.${ipv4Segment}){3}$`);
  return ipv4Regex.test(trimmedValue);
};

const fetchWithTimeout = async (
  url,
  options = {},
  timeout = REQUEST_TIMEOUT_MS
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

export default function App() {
  const [ipAddress, setIpAddress] = useState("10.144.123.236");
  const [settingsVisible, setSettingsVisible] = useState(false);

  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Living Room",
      type: "light",
      status: "off",
      icon: "ceiling-light",
    },
    { id: 2, name: "Bedroom Fan", type: "fan", status: "off", icon: "fan" },
    {
      id: 3,
      name: "AC Unit",
      type: "ac",
      status: "off",
      icon: "air-conditioner",
    },
    { id: 4, name: "Lamp", type: "light", status: "off", icon: "lamp" },
  ]);

  const toggleDevice = useCallback(
    async (id) => {
      const device = devices.find((d) => d.id === id);
      if (!device) return;

      const sanitizedIp = ipAddress.trim();
      if (!sanitizedIp || !isValidIpv4(sanitizedIp)) {
        Alert.alert(
          "Configuration Error",
          "Please check the IP address in settings."
        );
        setSettingsVisible(true);
        return;
      }

      const newStatus = device.status === "on" ? "off" : "on";

      // Optimistic update
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );

      try {
        // API format: http://<IP>/<ID>/<STATE> (e.g., http://192.168.1.100/1/on)
        const url = `http://${sanitizedIp}/${id}/${newStatus}`;
        console.log(`Sending command: ${url}`);

        const response = await fetchWithTimeout(url, { method: "GET" });

        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }
      } catch (error) {
        console.error("Command failed:", error);
        Alert.alert(
          "Connection Error",
          `Failed to toggle ${device.name}. Reverting status.`
        );

        // Revert on failure
        setDevices((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: device.status } : d))
        );
      }
    },
    [ipAddress, devices]
  );

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Smart Home</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setSettingsVisible(true)}
          >
            <MaterialCommunityIcons name="cog" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <WeatherWidget />

        <Text style={styles.sectionTitle}>My Devices</Text>

        <View style={styles.grid}>
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onToggle={toggleDevice}
            />
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ControlCard ipAddress={ipAddress} setIpAddress={setIpAddress} />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={styles.saveButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  settingsButton: {
    padding: 8,
    backgroundColor: "#2d2d2d",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15,
    marginTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    minHeight: "40%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#4F8EF7",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
