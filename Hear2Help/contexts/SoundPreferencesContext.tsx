import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type SoundCategory = 'critical' | 'normal' | 'misc';

export interface SoundClassItem {
  id: string;
  name: string;
  category: SoundCategory;
  gif?: any;
}

export interface HistoryEntry {
  id: string; // uuid-like or timestamp-based id
  classId: string;
  displayName: string;
  category: SoundCategory | string;
  timestamp: number; // Date.now()
}

const alarmGif = require("@/assets/gifs/alarm.gif");
const sirenGif = require("@/assets/gifs/siren.gif");
const doorbellGif = require("@/assets/gifs/doorbell.gif");

export const SOUND_CLASSES: SoundClassItem[] = [
  { id: "alarm", name: "Alarm", category: "normal", gif: alarmGif },
  { id: "siren", name: "Siren", category: "critical", gif: sirenGif },
  { id: "doorbell", name: "Doorbell", category: "misc", gif: doorbellGif },
];

export const CATEGORY_META: Record<SoundCategory, { title: string; color: string }> = {
  critical: { title: "Critical", color: "#ef4444" },
  normal: { title: "Normal", color: "#f59e0b" },
  misc: { title: "Miscellaneous", color: "#3b82f6" },
};

interface SoundPreferencesValue {
  enabledMap: Record<string, boolean>;
  setEnabled: (classId: string, enabled: boolean) => void;
  toggle: (classId: string) => void;
  enabledCount: number;
  history: HistoryEntry[];
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'> & Partial<Pick<HistoryEntry, 'id' | 'timestamp'>>) => void;
  clearHistory: () => void;
}

const SoundPreferencesContext = createContext<SoundPreferencesValue | undefined>(undefined);

export function SoundPreferencesProvider({ children }: { children: ReactNode }) {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({
    alarm: true,
    siren: true,
    doorbell: false,
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const setEnabled = (classId: string, enabled: boolean) => {
    setEnabledMap((prev) => ({ ...prev, [classId]: enabled }));
  };

  const toggle = (classId: string) => setEnabled(classId, !enabledMap[classId]);

  const enabledCount = useMemo(() => Object.values(enabledMap).filter(Boolean).length, [enabledMap]);

  const addHistory: SoundPreferencesValue['addHistory'] = (entry) => {
    const id = entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const timestamp = entry.timestamp || Date.now();
    setHistory((prev) => [{ id, timestamp, classId: entry.classId, displayName: entry.displayName, category: entry.category }, ...prev].slice(0, 100));
  };

  const clearHistory = () => setHistory([]);

  const value: SoundPreferencesValue = {
    enabledMap,
    setEnabled,
    toggle,
    enabledCount,
    history,
    addHistory,
    clearHistory,
  };

  return <SoundPreferencesContext.Provider value={value}>{children}</SoundPreferencesContext.Provider>;
}

export function useSoundPreferences() {
  const ctx = useContext(SoundPreferencesContext);
  if (!ctx) throw new Error('useSoundPreferences must be used within SoundPreferencesProvider');
  return ctx;
}

export function findClassById(classId: string): SoundClassItem | undefined {
  return SOUND_CLASSES.find((c) => c.id === classId);
}

export function findClassForLabel(label: string): SoundClassItem | undefined {
  const t = (label || '').toLowerCase();
  if (t.includes('siren')) return findClassById('siren');
  if (t.includes('alarm')) return findClassById('alarm');
  if (t.includes('door') || t.includes('bell')) return findClassById('doorbell');
  return undefined;
}


