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

  const handleToggleMonitoring = async () => {
    if (monitoring) {
      // Stop monitoring
      await stopRecording();
      disconnect();
      setMonitoring(false);
    } else {
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
        // Connect to WebSocket first
        connect();
        
        // Start audio recording
        await startRecording((audioData) => {
          // Send audio data to Backend_API
          sendAudioData(audioData);
        });
        
        setMonitoring(true);
      } catch (error) {
        console.error('Failed to start monitoring:', error);
        Alert.alert(
          "Error",
          "Failed to start sound monitoring. Please try again.",
          [{ text: "OK" }]
        );
      }
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
        {monitoring ? "Connected & Recording" : "Not Connected"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { 
    padding: 16, 
    borderRadius: 10, 
    alignItems: "center", 
    marginVertical: 16 
  },
  start: { backgroundColor: "green" },
  stop: { backgroundColor: "red" },
  text: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8
  }
});
