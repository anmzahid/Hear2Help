//OnlobardingScreen.tsx

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppContext } from "../app/context/AppContext";
import { LinearGradient } from 'expo-linear-gradient';

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
    title: "Smart Notifications",
    subtitle: "Stay informed anywhere",
    description: "Get instant notifications with haptic feedback. Critical alerts have stronger vibrations and visual effects.",
    features: [
      { text: "Haptic feedback patterns", icon: "pulse-outline" },
      { text: "Push notifications", icon: "notifications-outline" },
      { text: "Location tracking (optional)", icon: "location-outline" }
    ],
    backgroundColor: "#7700FF",
    backgroundGradient: "#B066FF",
    iconName: "notifications-outline",
    iconColor: "#FF9800"
  }
];

export default function OnboardingScreen({ onFinish }: { onFinish?: () => void }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedSounds, setSelectedSounds] = useState({
    critical: true,
    normal: true,
    misc: true
  });
  const [notificationSettings, setNotificationSettings] = useState({
    hapticFeedback: true,
    pushNotifications: true,
    locationTracking: false
  });

  const { completeOnboarding } = useAppContext();

  // Expo Router navigation for top-level tab switch

  const screen = screens[currentScreen];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Navigate to HomeScreen tab
      completeOnboarding();
      router.replace("/");
    }
  };

  const handleSkip = () => {
    // Navigate to HomeScreen tab
    completeOnboarding();
    router.replace("/");
  };
  
  const renderBackground = () => {
    if (screen.backgroundGradient) {
      return (
        <LinearGradient
          colors={[screen.backgroundColor, screen.backgroundGradient]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      );
    }
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: screen.backgroundColor }]} />;
  };
  
  const renderPaginationDots = () => {
    return (
      <View style={styles.pagination}>
        {screens.map((_, index) => (
          <View 
            key={index} 
            style={[styles.paginationDot, 
              currentScreen === index ? styles.paginationDotActive : null
            ]} 
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderBackground()}
      <View style={styles.iconCircleContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name={screen.iconName as any} size={32} color={screen.iconColor} />
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{screen.title}</Text>
        <Text style={styles.subtitle}>{screen.subtitle}</Text>
        <Text style={styles.description}>{screen.description}</Text>
        
        <View style={styles.featuresList}>
          {screen.features.map((feature, index) => {
            let borderStyle = {};
            if (currentScreen === 2) {
              if (index === 0) {
                borderStyle = styles.criticalBorder;
              } else if (index === 1) {
                borderStyle = styles.normalBorder;
              } else if (index === 2) {
                borderStyle = styles.miscBorder;
              }
            }
            
            const notificationTypes = ['hapticFeedback', 'pushNotifications', 'locationTracking'];
            
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.featureItem, borderStyle]}
                onPress={() => {
                  if (currentScreen === 1) {
                    const soundTypes = ['critical', 'normal', 'misc'];
                    const soundType = soundTypes[index] as keyof typeof selectedSounds;
                    setSelectedSounds(prev => ({
                      ...prev,
                      [soundType]: !prev[soundType]
                    }));
                  }
                  if (currentScreen === 3) {
                    const notificationType = notificationTypes[index] as keyof typeof notificationSettings;
                    setNotificationSettings(prev => ({
                      ...prev,
                      [notificationType]: !prev[notificationType]
                    }));
                  }
                }}
              >
                <View style={styles.checkboxContainer}>
                  {currentScreen === 1 && (
                    <View style={[styles.checkbox, selectedSounds[['critical', 'normal', 'misc'][index] as keyof typeof selectedSounds] ? styles.checkboxSelected : null]}>
                      {selectedSounds[['critical', 'normal', 'misc'][index] as keyof typeof selectedSounds] && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  )}
                  {currentScreen === 3 && (
                    <View style={[styles.toggleSwitch, notificationSettings[notificationTypes[index] as keyof typeof notificationSettings] ? styles.toggleSwitchOn : styles.toggleSwitchOff]}>
                      <View style={[styles.toggleKnob, notificationSettings[notificationTypes[index] as keyof typeof notificationSettings] ? styles.toggleKnobOn : styles.toggleKnobOff]} />
                    </View>
                  )}
                  <Ionicons name={feature.icon as any} size={20} color="#FFFFFF" style={styles.featureIcon} />
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      <View style={styles.bottomContainer}>
        {renderPaginationDots()}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentScreen === screens.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            {currentScreen < screens.length - 1 && (
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            )}
            {currentScreen === screens.length - 1 && (
              <Ionicons name="rocket-outline" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  iconCircleContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 20,
  },
  featuresList: {
    width: "100%",
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  criticalBorder: {
    borderWidth: 2,
    borderColor: "#FF5252",
    borderStyle: "dashed",
    backgroundColor: "rgba(255, 82, 82, 0.1)",
  },
  normalBorder: {
    borderWidth: 2,
    borderColor: "#FFD740",
    borderStyle: "solid",
    backgroundColor: "rgba(255, 215, 64, 0.1)",
  },
  miscBorder: {
    borderWidth: 2,
    borderColor: "#40C4FF",
    borderStyle: "dotted",
    backgroundColor: "rgba(64, 196, 255, 0.1)",
  },
  toggleSwitch: {
    width: 40,
    height: 22,
    borderRadius: 11,
    marginRight: 10,
    padding: 2,
  },
  toggleSwitchOn: {
    backgroundColor: "#64FFDA",
  },
  toggleSwitchOff: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },
  toggleKnobOn: {
    transform: [{ translateX: 18 }],
  },
  toggleKnobOff: {
    transform: [{ translateX: 0 }],
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#FFFFFF",
    width: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  skipButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
});
