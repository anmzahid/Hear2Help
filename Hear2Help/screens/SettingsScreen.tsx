//SettingsScreen.tsx

import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [batterySaver, setBatterySaver] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.row}>
        <Text>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={styles.row}>
        <Text>Battery Saver</Text>
        <Switch value={batterySaver} onValueChange={setBatterySaver} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Text>Sensitivity: {sensitivity}</Text>
        {/* Slider may require community package for RN */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
});
