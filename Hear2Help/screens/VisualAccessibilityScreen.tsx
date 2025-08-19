// VisualAccessibilityScreen.tsx


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const VisualAccessibilityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>👁️</Text>
      </View>
      <Text style={styles.title}>Visual Accessibility</Text>
      <Text style={styles.subtitle}>Designed for everyone</Text>
      <Text style={styles.description}>
        Our design uses multiple visual cues beyond just color, including patterns, shapes, and haptic feedback for accessibility.
      </Text>
      <View style={styles.features}>
        <Text style={styles.featureItem}>• 🔴 Red with dashed borders (critical)</Text>
        <Text style={styles.featureItem}>• 🟡 Yellow with solid borders (normal)</Text>
        <Text style={styles.featureItem}>• 🔵 Blue with dotted borders (misc)</Text>
      </View>
      <View style={styles.pagination}>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.dot}>•</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('SmartNotifications')}>
          <Text style={styles.nextText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4A261', alignItems: 'center', justifyContent: 'space-around', padding: 20 },
  logoContainer: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, padding: 20 },
  logo: { fontSize: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 18, color: '#FFFFFF', marginBottom: 10 },
  description: { fontSize: 16, color: '#FFFFFF', textAlign: 'center', marginBottom: 20 },
  features: { marginVertical: 20 },
  featureItem: { fontSize: 16, color: '#FFFFFF', marginVertical: 5 },
  pagination: { flexDirection: 'row', justifyContent: 'center' },
  dot: { fontSize: 20, color: '#FFFFFF', marginHorizontal: 5, opacity: 0.5 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  skipButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  skipText: { color: '#FFFFFF', fontSize: 16 },
  nextButton: { backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  nextText: { color: '#F4A261', fontSize: 16 },
});

export default VisualAccessibilityScreen;