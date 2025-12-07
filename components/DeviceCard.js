import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function DeviceCard({ device, onToggle }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: device.status === "on" ? "#4F8EF7" : "#3d3d3d" },
          ]}
        >
          <MaterialCommunityIcons
            name={device.icon}
            size={24}
            color={device.status === "on" ? "#fff" : "#888"}
          />
        </View>
        <Switch
          value={device.status === "on"}
          onValueChange={() => onToggle(device.id)}
          trackColor={{ false: "#3d3d3d", true: "#4F8EF7" }}
          thumbColor={device.status === "on" ? "#fff" : "#f4f3f4"}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{device.name}</Text>
        <Text
          style={[
            styles.status,
            { color: device.status === "on" ? "#4F8EF7" : "#888" },
          ]}
        >
          {device.status === "on" ? "ON" : "OFF"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2d2d2d",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    width: "48%",
    aspectRatio: 1,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    marginTop: 10,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
  },
});
