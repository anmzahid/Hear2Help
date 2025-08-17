// app/navigation/BottomTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@/screens/HomeScreen";
import SoundClassesScreen from "@/screens/SoundClassesScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import HistoryScreen from "@/screens/HistoryScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} 
      />
      <Tab.Screen 
        name="SoundClasses" 
        component={SoundClassesScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="musical-notes" size={size} color={color} /> }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} /> }} 
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}
