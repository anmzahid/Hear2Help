import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type AppearanceMode = 'light' | 'dark' | 'high-contrast';
export type SensitivityLevel = 'low' | 'medium' | 'high';

interface SettingsValue {
  appearance: AppearanceMode;
  setAppearance: (v: AppearanceMode) => void;
  sensitivity: SensitivityLevel;
  setSensitivity: (v: SensitivityLevel) => void;
  pushNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (v: boolean) => void;
  locationServicesEnabled: boolean;
  setLocationServicesEnabled: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<AppearanceMode>('light');
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('high');
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(true);
  const [locationServicesEnabled, setLocationServicesEnabled] = useState<boolean>(false);

  const value: SettingsValue = useMemo(() => ({
    appearance,
    setAppearance,
    sensitivity,
    setSensitivity,
    pushNotificationsEnabled,
    setPushNotificationsEnabled,
    locationServicesEnabled,
    setLocationServicesEnabled,
  }), [appearance, sensitivity, pushNotificationsEnabled, locationServicesEnabled]);

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}


