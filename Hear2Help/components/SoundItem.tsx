import React from "react";
import { View, Text, Image, StyleSheet, Switch, StyleProp, ViewStyle } from "react-native";

interface Props {
  name: string;
  gif: any;
  time?: string;
  toggleable?: boolean;
  enabled?: boolean;
  onToggle?: (value: boolean) => void;
  subtitle?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function SoundItem({ name, gif, time, toggleable, enabled, onToggle, subtitle, containerStyle }: Props) {
  return (
    <View style={[styles.item, containerStyle]}>
      <Image source={gif} style={styles.gif} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
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
  subtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  time: { fontSize: 12, color: "gray" },
});
