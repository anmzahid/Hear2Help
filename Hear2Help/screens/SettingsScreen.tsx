//SettingsScreen.tsx

import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useSettings } from "@/contexts/SettingsContext";
import { useAudioRecording } from "@/hooks/useAudioRecording";

export default function SettingsScreen() {
  const { appearance, setAppearance, sensitivity, setSensitivity, pushNotificationsEnabled, setPushNotificationsEnabled, locationServicesEnabled, setLocationServicesEnabled } = useSettings();
  const { hasPermission, requestPermission } = useAudioRecording();

  const setAppearanceMode = (mode: 'light' | 'dark' | 'high-contrast') => setAppearance(mode);

  const isActive = (mode: 'light' | 'dark' | 'high-contrast') => appearance === mode;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <Text style={styles.subheader}>Customize your SoundAlert experience</Text>

      {/* Appearance */}
      <Text style={styles.sectionLabel}>Appearance</Text>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setAppearanceMode('light')} style={[styles.optionRow, isActive('light') ? styles.optionActive : null]}>
          <Text style={styles.optionTitle}>Light</Text>
          <Text style={styles.optionSub}>Bright and clean</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAppearanceMode('dark')} style={[styles.optionRow, isActive('dark') ? styles.optionActive : null]}>
          <Text style={styles.optionTitle}>Dark</Text>
          <Text style={styles.optionSub}>Easy on the eyes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAppearanceMode('high-contrast')} style={[styles.optionRow, isActive('high-contrast') ? styles.optionActiveHC : styles.optionHC]}>
          <Text style={[styles.optionTitle, styles.optionTitleHC]}>High Contrast</Text>
          <Text style={[styles.optionSub, styles.optionSubHC]}>Maximum accessibility</Text>
        </TouchableOpacity>
      </View>

      {/* Detection */}
      <Text style={styles.sectionLabel}>Detection</Text>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.optionTitle}>Sensitivity</Text>
            <Text style={styles.optionSub}>{sensitivity === 'low' ? 'Low (30%)' : sensitivity === 'medium' ? 'Medium (50%)' : 'High (70%)'}</Text>
          </View>
          <View>
            <Text style={styles.indicatorDot}>•</Text>
          </View>
        </View>

        <View style={styles.sliderRow}>
          {(['low','medium','high'] as const).map(lvl => (
            <TouchableOpacity key={lvl} onPress={() => setSensitivity(lvl)} style={[styles.sliderTick, sensitivity===lvl ? styles.sliderTickActive : null]}>
              <Text style={[styles.sliderLabel, sensitivity===lvl ? styles.sliderLabelActive : null]}>{lvl.charAt(0).toUpperCase()+lvl.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notifications */}
      <Text style={styles.sectionLabel}>Notifications</Text>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.optionTitle}>Push Notifications</Text>
            <Text style={styles.optionSub}>Receive alerts when sounds are detected</Text>
          </View>
          <Switch value={pushNotificationsEnabled} onValueChange={setPushNotificationsEnabled} />
        </View>

        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.optionTitle}>Location Services</Text>
            <Text style={styles.optionSub}>Add location information to alerts</Text>
          </View>
          <Switch value={locationServicesEnabled} onValueChange={setLocationServicesEnabled} />
        </View>
      </View>

      {/* Permissions */}
      <Text style={styles.sectionLabel}>Permissions</Text>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.optionTitle}>Microphone Access</Text>
            <Text style={styles.optionSub}>{hasPermission ? 'Granted' : 'Not granted'}</Text>
          </View>
          <TouchableOpacity onPress={requestPermission} style={[styles.permissionBtn, hasPermission ? styles.permissionBtnGranted : styles.permissionBtnDenied]}>
            <Text style={[styles.permissionBtnText, hasPermission ? styles.permissionBtnTextGranted : styles.permissionBtnTextDenied]}>{hasPermission ? 'Granted' : 'Allow'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Performance (stub) */}
      <Text style={styles.sectionLabel}>Performance</Text>
      <View style={styles.card}>
        <Text style={styles.optionSub}>Defaults optimized for battery and accuracy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: 'center' },
  subheader: { fontSize: 12, textAlign: 'center', color: '#666', marginTop: 4, marginBottom: 12 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginTop: 6, marginBottom: 6 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, backgroundColor: '#fff', padding: 10, marginBottom: 10 },
  optionRow: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, marginBottom: 8, backgroundColor: '#fff' },
  optionActive: { borderColor: '#111827' },
  optionHC: { borderStyle: 'dashed' },
  optionActiveHC: { borderColor: '#111827', borderStyle: 'dashed' },
  optionTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  optionTitleHC: { },
  optionSub: { fontSize: 12, color: '#6b7280' },
  optionSubHC: { },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  indicatorDot: { fontSize: 24, color: '#10b981' },
  sliderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  sliderTick: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  sliderTickActive: { borderColor: '#111827', backgroundColor: '#111827' },
  sliderLabel: { fontSize: 12, color: '#111827' },
  sliderLabelActive: { color: '#fff' },
  permissionBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1 },
  permissionBtnGranted: { borderColor: '#10b981', backgroundColor: '#10b9810d' },
  permissionBtnDenied: { borderColor: '#111827', backgroundColor: '#111827' },
  permissionBtnText: { fontSize: 12, fontWeight: '700' },
  permissionBtnTextGranted: { color: '#10b981' },
  permissionBtnTextDenied: { color: '#fff' },
});
 