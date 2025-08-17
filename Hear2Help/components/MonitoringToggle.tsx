import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useSocket } from "../hooks/useSocket";
import { useAudioRecording } from "../hooks/useAudioRecording";

export default function MonitoringToggle() {
  const [monitoring, setMonitoring] = useState(false);
  const { isConnected, connect, disconnect, sendAudioData } = useSocket();
  const { isRecording, hasPermission, startRecording, stopRecording } = useAudioRecording();

  // Update monitoring state based on actual recording and connection status
  useEffect(() => {
    setMonitoring(isRecording && isConnected);
  }, [isRecording, isConnected]);

  // Helper: attempt to connect and wait briefly for isConnected to update
  async function tryConnect(timeout = 1000) {
    console.log("MonitoringToggle: initiating socket connect...");
    try {
      // connect() might be sync or async depending on hook implementation
      await Promise.resolve(connect());
    } catch (err) {
      console.error("MonitoringToggle: connect() threw:", err);
    }

    // wait a short time for hook to update isConnected
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if ((isConnected as boolean) === true) {
        console.log("MonitoringToggle: socket reports connected.");
        return true;
      }
      // small pause
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 100));
    }
    console.warn("MonitoringToggle: socket did not connect within timeout.");
    return !!isConnected;
  }

  const handleToggleMonitoring = async () => {
    if (monitoring) {
      // Stop monitoring
      console.log("MonitoringToggle: stopping monitoring...");
      try {
        await Promise.resolve(stopRecording());
      } catch (err) {
        console.error("Error stopping recording:", err);
      }
      disconnect();
      setMonitoring(false);
      return;
    }

    // Start monitoring
    if (!hasPermission) {
      Alert.alert(
        "Microphone Permission Required",
        "Please grant microphone permission to start sound monitoring.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const connected = await tryConnect(2000);
      if (!connected) {
        Alert.alert(
          "Connection Failed",
          "Could not connect to the classification server. Check Backend_API is running and WebSocket URL (see README).",
          [{ text: "OK" }]
        );
        return;
      }

      console.log("MonitoringToggle: starting recording...");
      await Promise.resolve(
        startRecording((audioData) => {
          // Send audio data to Backend_API
          try {
            sendAudioData(audioData);
          } catch (err) {
            console.error("Failed to send audio data:", err);
          }
        })
      );

      // Give hooks a moment to update states then reflect monitoring
      setTimeout(() => setMonitoring(true), 150);
    } catch (error) {
      console.error("Failed to start monitoring:", error);
      Alert.alert(
        "Error",
        "Failed to start sound monitoring. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, monitoring ? styles.stop : styles.start]}
      onPress={handleToggleMonitoring}
    >
      <Text style={styles.text}>
        {monitoring ? "Stop Monitoring" : "Start Monitoring"}
      </Text>
      <Text style={styles.statusText}>
        {isConnected
          ? isRecording
            ? "Connected & Recording"
            : "Connected"
          : "Not Connected"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 16,
  },
  start: { backgroundColor: "green" },
  stop: { backgroundColor: "red" },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
});
