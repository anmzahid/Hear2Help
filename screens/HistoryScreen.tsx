import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import SoundItem from "../components/SoundItem";

const history = [
  { id: "1", name: "Doorbell", gif: require("../assets/gifs/doorbell.gif"), time: "Aug 15, 10:32 AM" },
  { id: "2", name: "Alarm", gif: require("../assets/gifs/alarm.gif"), time: "Aug 15, 9:50 AM" },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SoundItem name={item.name} gif={item.gif} time={item.time} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
