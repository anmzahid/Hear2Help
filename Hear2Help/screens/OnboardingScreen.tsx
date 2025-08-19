// app/OnboardingScreen.tsx

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const screens = [
  { 
    id: 1, 
    title: "Welcome to SoundAlert",
    subtitle: "Making sounds visible",
    description: "An accessibility app that helps you detect and get alerted about important sounds through visual and haptic notifications.",
    features: [
      { text: "Real-time sound detection", icon: "ear-outline" },
      { text: "Visual & haptic alerts", icon: "notifications-outline" },
      { text: "Colorblind-friendly design", icon: "color-palette-outline" }
    ],
    backgroundColor: "#0057FF",
    backgroundGradient: "#00A3FF",
    iconName: "volume-medium-outline",
    iconColor: "#FFFFFF"
  },
  { 
    id: 2, 
    title: "Choose Your Sounds",
    subtitle: "Customize what matters",
    description: "Select which types of sounds you want to monitor. Critical sounds like smoke alarms get special priority treatment.",
    features: [
      { text: "Critical alerts (smoke, fire)", icon: "warning-outline" },
      { text: "Normal alerts (doorbell, baby)", icon: "home-outline" },
      { text: "Misc alerts (phone, car horn)", icon: "call-outline" }
    ],
    backgroundColor: "#00A352",
    backgroundGradient: "#00D56A",
    iconName: "musical-note-outline",
    iconColor: "#9C27B0"
  },
  { 
    id: 3, 
    title: "Visual Accessibility",
    subtitle: "Designed for everyone",
    description: "Our design uses multiple visual cues beyond just color, including patterns, shapes, and haptic feedback for accessibility.",
    features: [
      { text: "Red with dashed borders (critical)", icon: "alert-circle-outline" },
      { text: "Yellow with solid borders (normal)", icon: "information-circle-outline" },
      { text: "Blue with dotted borders (misc)", icon: "help-circle-outline" }
    ],
    backgroundColor: "#FF6B00",
    backgroundGradient: "#FF9500",
    iconName: "eye-outline",
    iconColor: "#2196F3"
  },
  { 
    id: 4, 
    title: "Get Started",
    subtitle: "Ready to begin?",
    description: "Let’s set up your preferences and start detecting important sounds in your environment.",
    features: [
      { text: "Easy setup process", icon: "settings-outline" },
      { text: "Customizable alerts", icon: "options-outline" },
      { text: "Works in background", icon: "time-outline" }
    ],
    backgroundColor: "#9C27B0",
    backgroundGradient: "#BA68C8",
    iconName: "checkmark-circle-outline",
    iconColor: "#4CAF50"
  }
];

export default function OnboardingScreen() {
  const [screenIndex, setScreenIndex] = useState(0);
  const router = useRouter();

  const currentScreen = screens[screenIndex];

  const handleSkipOrFinish = () => {
    router.replace("/(tabs)"); // Navigate to the main tabs (Home)
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[currentScreen.backgroundColor, currentScreen.backgroundGradient]}
        style={{ ...StyleSheet.absoluteFillObject }}
      />

      <View style={styles.container}>
        <Ionicons 
          name={currentScreen.iconName as keyof typeof Ionicons.glyphMap} 
          size={80} 
          color={currentScreen.iconColor} 
          style={styles.mainIcon} 
        />
        <Text style={styles.title}>{currentScreen.title}</Text>
        <Text style={styles.subtitle}>{currentScreen.subtitle}</Text>
        <Text style={styles.description}>{currentScreen.description}</Text>

        {currentScreen.features.map((f, idx) => (
          <View key={idx} style={styles.feature}>
            <Ionicons name={f.icon as keyof typeof Ionicons.glyphMap} size={22} color="#fff" />
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkipOrFinish}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Next / Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (screenIndex < screens.length - 1) {
              setScreenIndex(screenIndex + 1);
            } else {
              handleSkipOrFinish();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {screenIndex === screens.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  mainIcon: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", color: "#eee", marginBottom: 12, textAlign: "center" },
  description: { fontSize: 15, color: "#ddd", marginBottom: 20, textAlign: "center" },
  feature: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  featureText: { marginLeft: 8, fontSize: 15, color: "#fff" },
  button: { marginTop: 25, padding: 14, backgroundColor: "#000", borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  skipButton: { position: "absolute", top: 40, right: 20, padding: 10 },
  skipText: { color: "#fff", fontSize: 14 }
});
