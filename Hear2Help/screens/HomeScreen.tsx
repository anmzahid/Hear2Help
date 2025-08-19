//HomeScreen.tsx

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import MonitoringToggle from "../components/MonitoringToggle";
import { useSocketContext } from "@/contexts/SocketContext";
import { getSoundClassification, DEFAULT_GIF } from "../utils/soundClassificationMap";
import { CATEGORY_META, SOUND_CLASSES, useSoundPreferences, findClassForLabel } from "@/contexts/SoundPreferencesContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function HomeScreen() {
  const { soundData, isConnected, clearSound } = useSocketContext();
  const { enabledMap, history, addHistory } = useSoundPreferences();
  const { appearance } = useSettings();
  const styles = getStyles(appearance);

  // Derive whether current detection should show based on enabled classes
  const currentClassification = soundData?.label ? getSoundClassification(soundData.label) : null;
  const currentMatch = currentClassification ? (findClassForLabel(currentClassification.displayName) || findClassForLabel(soundData!.label)) : undefined;
  // Show by default if no mapping; only hide when it maps to a disabled class
  const isEnabledForDisplay = currentMatch ? !!enabledMap[currentMatch.id] : true;

  // Debug logging
  useEffect(() => {
    console.log("HomeScreen - soundData changed:", soundData);
  }, [soundData]);

  // Show alert for emergency sounds and track history only if enabled
  useEffect(() => {
    if (soundData && soundData.label) {
      console.log("Processing sound:", soundData.label);
      const classification = getSoundClassification(soundData.label);
      console.log("Classification result:", classification);
      
      if (classification.category === 'emergency' && isEnabledForDisplay) {
        Alert.alert(
          "🚨 Emergency Sound Detected!",
          `Detected: ${classification.displayName}`,
          [{ text: "OK" }]
        );
      }
      // Track history for enabled classes only
      const match = findClassForLabel(classification.displayName) || findClassForLabel(soundData.label);
      if (match && enabledMap[match.id]) {
        addHistory({ classId: match.id, displayName: classification.displayName, category: match.category });
      }
    }
  }, [soundData, isEnabledForDisplay]);

  const getSoundDisplay = () => {
    if (!soundData || !soundData.label || !isEnabledForDisplay || !currentClassification) {
      console.log("No sound data to display");
      return null;
    }

    console.log("Getting sound display for:", soundData.label);
    const classification = currentClassification;
    console.log("Display classification:", classification);

    const gifSource = classification.gif || DEFAULT_GIF;
    if (!classification.gif) {
      console.warn(`No GIF mapped for "${classification.label}", using default GIF.`);
    }

    // Color coding based on sound category
    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'emergency': return '#ff0000';
        case 'household': return '#ffcc00';
        case 'nature': return '#00ff6a';
        case 'music': return '#b388ff';
        case 'speech': return '#66b2ff';
        case 'vehicle': return '#ff66b2';
        default: return styles.mutedText.color;
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
        <Text style={styles.topLabel}>{soundData.label}</Text>
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
          <Text style={styles.statNumber}>{isEnabledForDisplay && soundData && soundData.label ? 1 : 0}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Alerts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: isConnected ? styles.accent.color : styles.mutedText.color }]}>{isConnected ? 'ON' : 'OFF'}</Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>

      {/* Detected sound display */}
      {isEnabledForDisplay && soundData && soundData.label ? (
        getSoundDisplay()
      ) : (
        <View style={styles.noSound}>
          <Text style={styles.noSoundText}>🎤 No sound detected yet</Text>
          <Text style={styles.noSoundSubtext}>Start monitoring to detect sounds</Text>
        </View>
      )}
      
      {/* Active Sound Classes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Active Sound Classes</Text>
        {SOUND_CLASSES.filter(s => enabledMap[s.id]).slice(0, 3).map(s => (
          <View key={s.id} style={styles.classRow}>
            <Text style={styles.className}>{s.name}</Text>
            <View style={[styles.badge, { borderColor: CATEGORY_META[s.category].color }]}>
              <Text style={[styles.badgeText, { color: CATEGORY_META[s.category].color }]}>{s.category}</Text>
            </View>
          </View>
        ))}
        {SOUND_CLASSES.filter(s => enabledMap[s.id]).length > 3 && (
          <Text style={styles.moreText}>+ {SOUND_CLASSES.filter(s => enabledMap[s.id]).length - 3} more sounds active</Text>
        )}
      </View>

      {/* Recent Alerts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Alerts</Text>
        {history.slice(0, 3).map(entry => (
          <View key={entry.id} style={styles.recentRow}>
            <Text style={styles.recentName}>{entry.displayName}</Text>
            <Text style={styles.recentTime}>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        ))}
        {history.length === 0 && (
          <Text style={styles.noRecent}>No alerts yet</Text>
        )}
      </View>
    </View>
  );
}

function getStyles(mode: 'light' | 'dark' | 'high-contrast') {
  const isDark = mode === 'dark';
  const isHC = mode === 'high-contrast';

  const bg = isHC ? '#000000' : (isDark ? '#151718' : '#ffffff');
  const text = isHC ? '#FFFFFF' : (isDark ? '#ECEDEE' : '#333333');
  const subTextColor = isHC ? '#FFFFFF' : (isDark ? '#9BA1A6' : '#666666');
  const border = isHC ? '#FFFFFF' : (isDark ? '#374151' : '#e5e7eb');
  const cardBg = isHC ? '#000000' : (isDark ? '#111827' : '#ffffff');
  const mutedBg = isHC ? '#000000' : (isDark ? '#0b1220' : '#f9fafb');
  const accentColor = isHC ? '#00FF00' : '#1DB954';
  const closeBtnBg = isHC ? '#FFFFFF' : '#111827';
  const closeBtnText = isHC ? '#000000' : '#FFFFFF';

  return StyleSheet.create({
    container: { 
      flex: 1, 
      padding: 16, 
      backgroundColor: bg 
    },
    header: { 
      fontSize: isHC ? 30 : 28, 
      fontWeight: "bold", 
      textAlign: "center", 
      marginBottom: 20,
      color: text
    },
    subheader: {
      fontSize: 14,
      textAlign: 'center',
      color: subTextColor,
      marginTop: -12,
      marginBottom: 16,
    },
    statusCard: {
      alignItems: 'center',
      marginBottom: 16,
    },
    statusCircle: {
      width: isHC ? 100 : 90,
      height: isHC ? 100 : 90,
      borderRadius: isHC ? 50 : 45,
      borderWidth: isHC ? 2 : 1,
      borderColor: border,
      backgroundColor: isHC ? '#000000' : (isDark ? '#0b1220' : '#f8fafc'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusIcon: { fontSize: isHC ? 26 : 22, color: text },
    statusLabel: { marginTop: 6, fontSize: isHC ? 14 : 12, color: subTextColor },
    soundDisplay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      padding: 20,
    },
    topLabel: { fontSize: isHC ? 18 : 20, fontWeight: '600', color: text, marginBottom: 10 },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 100,
      marginBottom: 8,
    },
    statBox: {
      flex: 1,
      marginHorizontal: 6,
      paddingVertical: isHC ? 16 : 14,
      borderRadius: 12,
      backgroundColor: mutedBg,
      alignItems: 'center',
      borderWidth: isHC ? 2 : 1,
      borderColor: border,
    },
    statNumber: { fontSize: isHC ? 22 : 20, fontWeight: '700', color: text },
    statLabel: { fontSize: isHC ? 14 : 12, color: subTextColor, marginTop: 4 },
    gifContainer: {
      marginBottom: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    gif: {
      width: isHC ? 220 : 200,
      height: isHC ? 220 : 200,
      borderRadius: 20,
    },
    closeGifBtn: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: closeBtnBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: isHC ? 2 : 0,
      borderColor: isHC ? '#000000' : 'transparent',
    },
    closeGifText: { color: closeBtnText, fontSize: 16, fontWeight: '700' },
    textContainer: {
      alignItems: "center",
    },
    soundLabel: {
      fontSize: isHC ? 34 : 32,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      textShadowColor: isHC ? 'transparent' : 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
      color: text,
    },
    categoryText: {
      fontSize: isHC ? 20 : 18,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 15,
      opacity: isHC ? 1 : 0.8,
      letterSpacing: 2,
      color: text,
    },
    rawLabel: {
      fontSize: isHC ? 16 : 14,
      color: subTextColor,
      textAlign: "center",
      fontStyle: isHC ? 'normal' : 'italic',
      backgroundColor: isHC ? '#000000' : (isDark ? '#0b1220' : '#f5f5f5'),
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      borderWidth: isHC ? 2 : 0,
      borderColor: isHC ? '#FFFFFF' : 'transparent',
    },
    noSound: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    noSoundText: {
      fontSize: isHC ? 26 : 24,
      fontWeight: "600",
      color: subTextColor,
      textAlign: "center",
      marginBottom: 10,
    },
    noSoundSubtext: {
      fontSize: isHC ? 18 : 16,
      color: subTextColor,
      textAlign: "center",
    },
    card: {
      marginTop: 12,
      padding: 12,
      borderRadius: 12,
      borderWidth: isHC ? 2 : 1,
      borderColor: border,
      backgroundColor: cardBg,
    },
    cardTitle: { fontSize: isHC ? 16 : 14, fontWeight: '700', marginBottom: 8, color: text },
    classRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
    className: { fontSize: isHC ? 16 : 14, color: text },
    badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, backgroundColor: cardBg },
    badgeText: { fontSize: isHC ? 12 : 10, fontWeight: '700', textTransform: 'capitalize' },
    moreText: { marginTop: 6, fontSize: isHC ? 14 : 12, color: subTextColor },
    recentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
    recentName: { fontSize: isHC ? 16 : 14, color: text },
    recentTime: { fontSize: isHC ? 14 : 12, color: subTextColor },
    noRecent: { fontSize: isHC ? 14 : 12, color: subTextColor },
    accent: { color: accentColor },
    mutedText: { color: subTextColor },
  });
}
