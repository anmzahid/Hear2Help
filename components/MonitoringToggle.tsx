import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function MonitoringToggle() {
  const [monitoring, setMonitoring] = useState(false);

  return (
    <TouchableOpacity 
      style={[styles.button, monitoring ? styles.stop : styles.start]} 
      onPress={() => setMonitoring(!monitoring)}
    >
      <Text style={styles.text}>
        {monitoring ? "Stop Monitoring" : "Start Monitoring"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 16, borderRadius: 10, alignItems: "center", marginVertical: 16 },
  start: { backgroundColor: "green" },
  stop: { backgroundColor: "red" },
  text: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
