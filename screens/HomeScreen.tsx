import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import MonitoringToggle from "../components/MonitoringToggle";
import SoundItem from "../components/SoundItem";

const recentAlerts = [
  { id: "1", name: "Doorbell", gif: require("../assets/gifs/doorbell.gif"), time: "10:32 AM" },
  { id: "2", name: "Alarm", gif: require("../assets/gifs/alarm.gif"), time: "9:50 AM" },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hear2Help</Text>
      <MonitoringToggle />
      <Text style={styles.sectionTitle}>Recent Alerts</Text>
      <FlatList
        data={recentAlerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SoundItem name={item.name} gif={item.gif} time={item.time} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
});
