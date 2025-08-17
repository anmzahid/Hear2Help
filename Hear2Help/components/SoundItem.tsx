import React from "react";
import { View, Text, Image, StyleSheet, Switch } from "react-native";

interface Props {
  name: string;
  gif: any;
  time?: string;
  toggleable?: boolean;
  enabled?: boolean;
  onToggle?: (value: boolean) => void;
}

export default function SoundItem({ name, gif, time, toggleable, enabled, onToggle }: Props) {
  return (
    <View style={styles.item}>
      <Image source={gif} style={styles.gif} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        {time && <Text style={styles.time}>{time}</Text>}
      </View>
      {toggleable && (
        <Switch value={enabled} onValueChange={onToggle} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", padding: 8 },
  gif: { width: 50, height: 50, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "bold" },
  time: { fontSize: 12, color: "gray" },
});
