//SounClassesScreen.tsx

import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import SearchBar from "../components/SearchBar";
import SoundItem from "../components/SoundItem";
import { useSoundPreferences, SOUND_CLASSES, CATEGORY_META, type SoundClassItem } from "@/contexts/SoundPreferencesContext";
import { useSettings } from "@/contexts/SettingsContext";

type SoundCategory = 'critical' | 'normal' | 'misc';

const FILTERS: Array<{ key: 'all' | SoundCategory; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'normal', label: 'Normal' },
  { key: 'misc', label: 'Misc' },
];

export default function SoundClassesScreen() {
  const [search, setSearch] = useState("");
  const { enabledMap, setEnabled, enabledCount } = useSoundPreferences();
  const [activeFilter, setActiveFilter] = useState<'all' | SoundCategory>('all');
  const { appearance } = useSettings();
  const styles = getStyles(appearance);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return SOUND_CLASSES.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(term);
      const matchesFilter = activeFilter === 'all' ? true : s.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const grouped = useMemo(() => {
    const groups: Record<SoundCategory, SoundClassItem[]> = { critical: [], normal: [], misc: [] };
    for (const item of filtered) groups[item.category].push(item);
    return groups;
  }, [filtered]);

  const renderSection = (category: SoundCategory) => {
    const items = grouped[category];
    const meta = CATEGORY_META[category];
    if (!items.length) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{meta.title}</Text>
          <Text style={styles.sectionCount}>{items.length} {items.length === 1 ? 'sound' : 'sounds'}</Text>
        </View>
        <View style={[styles.sectionBody, { borderColor: meta.color, borderStyle: category === 'critical' ? 'dashed' : 'solid' }]}>
          {items.map((item) => (
            <View key={item.id} style={styles.rowWrapper}>
              <SoundItem
                name={item.name}
                gif={item.gif}
                subtitle={meta.title}
                toggleable
                enabled={!!enabledMap[item.id]}
                onToggle={(val) => setEnabled(item.id, val)}
                containerStyle={styles.soundItemContainer}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.header}>Sound Classes</Text>
      <Text style={styles.subheader}>{enabledCount} of {SOUND_CLASSES.length} enabled</Text>

      <SearchBar value={search} onChange={setSearch} />

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity key={f.key} onPress={() => setActiveFilter(f.key)} style={[styles.chip, isActive ? styles.chipActive : null]}>
              <Text style={[styles.chipText, isActive ? styles.chipTextActive : null]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {renderSection('critical')}
      {renderSection('normal')}
      {renderSection('misc')}
    </ScrollView>
  );
}

function getStyles(mode: 'light' | 'dark' | 'high-contrast') {
  const isDark = mode === 'dark';
  const isHC = mode === 'high-contrast';
  const bg = isHC ? '#000000' : (isDark ? '#151718' : '#ffffff');
  const text = isHC ? '#FFFFFF' : (isDark ? '#ECEDEE' : '#111827');
  const subText = isHC ? '#FFFFFF' : (isDark ? '#9BA1A6' : '#666');
  const border = isHC ? '#FFFFFF' : (isDark ? '#374151' : '#e5e7eb');
  const cardBg = isHC ? '#000000' : (isDark ? '#111827' : '#fff');
  const chipBg = isHC ? '#000000' : (isDark ? '#0b1220' : '#f3f4f6');

  return StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: bg },
    header: { fontSize: 20, fontWeight: "700", textAlign: 'center', color: text },
    subheader: { fontSize: 12, textAlign: 'center', color: subText, marginTop: 4, marginBottom: 12 },
    filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
    chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: chipBg, borderWidth: isHC ? 2 : 1, borderColor: border },
    chipActive: { backgroundColor: isHC ? '#FFFFFF' : '#111827' },
    chipText: { fontSize: 12, color: text },
    chipTextActive: { color: isHC ? '#000000' : '#fff' },
    section: { marginTop: 10 },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: text },
    sectionCount: { fontSize: 12, color: subText },
    sectionBody: { borderWidth: isHC ? 2 : 1, borderRadius: 12, paddingVertical: 4, backgroundColor: cardBg },
    rowWrapper: { borderBottomWidth: isHC ? 2 : 1, borderBottomColor: border },
    soundItemContainer: { paddingVertical: 10, paddingHorizontal: 8 },
  });
}
