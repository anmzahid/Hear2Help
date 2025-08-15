import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#888" />
      <TextInput
        style={styles.input}
        placeholder="Search sounds..."
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f1f1", borderRadius: 8, paddingHorizontal: 8, marginVertical: 10 },
  input: { flex: 1, padding: 8 },
});
