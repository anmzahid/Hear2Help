// components/SearchBar.tsx
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;  // ✅ Correct prop type
};

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search sounds..."
        value={value}
        onChangeText={onChangeText}  // ✅ Matches React Native TextInput
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
});
