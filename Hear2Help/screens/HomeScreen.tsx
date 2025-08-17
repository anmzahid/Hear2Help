import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Image } from 'expo-image';
import MonitoringToggle from "../components/MonitoringToggle";
import { useSocket } from "../hooks/useSocket";
import { getSoundClassification, DEFAULT_GIF } from "../utils/soundClassificationMap";

export default function HomeScreen() {
  const { soundData } = useSocket();

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
      <Text style={styles.header}>Hear2Help</Text>
      <MonitoringToggle />
      
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
  soundDisplay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
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
