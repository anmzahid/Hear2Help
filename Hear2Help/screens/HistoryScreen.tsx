//HistoryScreen.tsx


import React, { useMemo, useState } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import SoundItem from "../components/SoundItem";
import { CATEGORY_META, SOUND_CLASSES, useSoundPreferences } from "@/contexts/SoundPreferencesContext";
import SearchBar from "../components/SearchBar";

export default function HistoryScreen() {
  const { history, clearHistory } = useSoundPreferences();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'normal'>('all');

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return history.filter(h => {
      const name = h.displayName.toLowerCase();
      const passSearch = name.includes(term);
      const passFilter = activeFilter === 'all' ? true : String(h.category) === activeFilter;
      return passSearch && passFilter;
    });
  }, [history, search, activeFilter]);

  const renderItem = ({ item }: any) => {
    const cls = SOUND_CLASSES.find(c => c.id === item.classId);
    const gif = cls?.gif || require("../assets/gifs/doorbell.gif");
    const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
      <View style={styles.rowWrapper}>
        <SoundItem name={item.displayName} gif={gif} time={timeStr} subtitle={String(item.category)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <Text style={styles.subheader}>{history.length} total detections</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statNum}>{history.filter(h => new Date(h.timestamp).toDateString() === new Date().toDateString()).length}</Text><Text style={styles.statLabel}>Today</Text></View>
        <View style={styles.statBox}><Text style={styles.statNum}>{history.filter(h => String(h.category) === 'critical').length}</Text><Text style={styles.statLabel}>Critical</Text></View>
        <View style={styles.statBox}><Text style={styles.statNum}>{history.length}</Text><Text style={styles.statLabel}>Total</Text></View>
      </View>

      <SearchBar value={search} onChange={setSearch} />

      <View style={styles.filterRow}>
        {['all','critical','normal'].map((k) => (
          <TouchableOpacity key={k} style={[styles.chip, activeFilter===k ? styles.chipActive: null]} onPress={() => setActiveFilter(k as any)}>
            <Text style={[styles.chipText, activeFilter===k ? styles.chipTextActive: null]}>{String(k).charAt(0).toUpperCase()+String(k).slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
        <Text style={styles.clearText}>🗑️  Clear All History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: 'center' },
  subheader: { fontSize: 12, textAlign: 'center', color: '#666', marginTop: 4, marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statBox: { flex: 1, marginHorizontal: 4, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, backgroundColor: '#fff' },
  statNum: { fontSize: 16, fontWeight: '700', color: '#333' },
  statLabel: { fontSize: 12, color: '#666' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  chipActive: { backgroundColor: '#111827' },
  chipText: { fontSize: 12, color: '#111827' },
  chipTextActive: { color: '#fff' },
  rowWrapper: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  clearBtn: { marginTop: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ef4444', borderRadius: 12, backgroundColor: '#fff' },
  clearText: { color: '#ef4444', fontWeight: '600' },
});
