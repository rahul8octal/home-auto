import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

export default function ControlCard({ ipAddress, setIpAddress }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>ESP8266 IP Address</Text>
      <TextInput
        style={styles.input}
        value={ipAddress}
        onChangeText={setIpAddress}
        placeholder="e.g., 192.168.1.105"
        placeholderTextColor="#666"
        keyboardType="numbers-and-punctuation"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        importantForAutofill="no"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2d2d2d",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  label: {
    color: "#aaaaaa",
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#3d3d3d",
  },
});
