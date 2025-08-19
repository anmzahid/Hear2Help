//HomeScreen.tsx

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import MonitoringToggle from "../components/MonitoringToggle";
import { useSocketContext } from "@/contexts/SocketContext";
import { getSoundClassification, DEFAULT_GIF } from "../utils/soundClassificationMap";

export default function HomeScreen() {
  const { soundData, isConnected, clearSound } = useSocketContext();

  // Debug logging
  useEffect(() => {
    console.log("HomeScreen - soundData changed:", soundData);
  }, [soundData]);

  // Show alert for emergency sounds
  useEffect(() => {
    if (soundData && soundData.label) {
      console.log("Processing sound:", soundData.label);
      const classification = getSoundClassification(soundData.label);
      console.log("Classification result:", classification);
      
      if (classification.category === 'emergency') {
        Alert.alert(
          "🚨 Emergency Sound Detected!",
          `Detected: ${classification.displayName}`,
          [{ text: "OK" }]
        );
      }
    }
  }, [soundData]);

  const getSoundDisplay = () => {
    if (!soundData || !soundData.label) {
      console.log("No sound data to display");
      return null;
    }

    console.log("Getting sound display for:", soundData.label);
    const classification = getSoundClassification(soundData.label);
    console.log("Display classification:", classification);

    const gifSource = classification.gif || DEFAULT_GIF;
    if (!classification.gif) {
      console.warn(`No GIF mapped for "${classification.label}", using default GIF.`);
    }

    // Color coding based on sound category
    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'emergency': return '#FF4444'; // Red
        case 'household': return '#FF8800'; // Orange
        case 'nature': return '#44AA44';   // Green
        case 'music': return '#8844FF';    // Purple
        case 'speech': return '#4488FF';   // Blue
        case 'vehicle': return '#FF4488';  // Pink
        default: return '#888888';         // Gray
      }
    };

    const getCategoryEmoji = (category: string) => {
      switch (category) {
        case 'emergency': return '🚨';
        case 'household': return '🏠';
        case 'nature': return '🌿';
        case 'music': return '🎵';
        case 'speech': return '🗣️';
        case 'vehicle': return '🚗';
        default: return '🔊';
      }
    };

    return (
      <View style={styles.soundDisplay}>
        <View style={styles.gifContainer}>
          <Image source={gifSource} style={styles.gif} />
          <TouchableOpacity style={styles.closeGifBtn} onPress={clearSound}>
            <Text style={styles.closeGifText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.soundLabel, { color: getCategoryColor(classification.category) }]}>
            {getCategoryEmoji(classification.category)} {classification.displayName}
          </Text>
          
          <Text style={[styles.categoryText, { color: getCategoryColor(classification.category) }]}>
            {classification.category.toUpperCase()}
          </Text>
          
          <Text style={styles.rawLabel}>
            Raw: {soundData.label}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SoundAlert</Text>
      <Text style={styles.subheader}>{isConnected ? 'Sound monitoring is active' : 'Sound monitoring is paused'}</Text>

      {/* Big mic/status card */}
      <View style={styles.statusCard}>
        <View style={styles.statusCircle}>
          <Text style={styles.statusIcon}>🔊</Text>
          <Text style={styles.statusLabel}>{isConnected ? 'Listening' : 'Paused'}</Text>
        </View>
      </View>

      <MonitoringToggle />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{soundData && soundData.label ? 1 : 0}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Alerts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: isConnected ? '#1DB954' : '#999' }]}>{isConnected ? 'ON' : 'OFF'}</Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>

      {/* Detected sound display */}
      {soundData && soundData.label ? (
        getSoundDisplay()
      ) : (
        <View style={styles.noSound}>
          <Text style={styles.noSoundText}>🎤 No sound detected yet</Text>
          <Text style={styles.noSoundSubtext}>Start monitoring to detect sounds</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#fff" 
  },
  header: { 
    fontSize: 28, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20,
    color: "#333"
  },
  subheader: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: -12,
    marginBottom: 16,
  },
  statusCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: { fontSize: 22 },
  statusLabel: { marginTop: 6, fontSize: 12, color: '#666' },
  soundDisplay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNumber: { fontSize: 20, fontWeight: '700', color: '#333' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  gifContainer: {
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gif: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  closeGifBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGifText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  textContainer: {
    alignItems: "center",
  },
  soundLabel: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
    opacity: 0.8,
    letterSpacing: 2,
  },
  rawLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  noSound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noSoundText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#888",
    textAlign: "center",
    marginBottom: 10,
  },
  noSoundSubtext: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
  }
});
