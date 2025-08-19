//SounClassesScreen.tsx

import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import SearchBar from "../components/SearchBar";
import SoundItem from "../components/SoundItem";

const soundClasses = [
  { id: "1", name: "Doorbell", gif: require("../assets/gifs/doorbell.gif") },
  { id: "2", name: "Alarm", gif: require("../assets/gifs/alarm.gif") },
  { id: "3", name: "Siren", gif: require("../assets/gifs/siren.gif") },
];

export default function SoundClassesScreen() {
  const [search, setSearch] = useState("");
  const [enabledSounds, setEnabledSounds] = useState<{ [key: string]: boolean }>({});

  const filtered = soundClasses.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sound Classes</Text>
      <SearchBar value={search} onChange={setSearch} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SoundItem
            name={item.name}
            gif={item.gif}
            toggleable
            enabled={enabledSounds[item.id] || false}
            onToggle={(val) => setEnabledSounds({ ...enabledSounds, [item.id]: val })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
