import React, { useState } from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";

const steps = [
  { id: 1, text: "Select sounds you want alerts for", img: require("../assets/gifs/doorbell.gif") },
  { id: 2, text: "Customize vibration patterns and alerts", img: require("../assets/gifs/alarm.gif") },
  { id: 3, text: "Monitor sounds in the background", img: require("../assets/gifs/siren.gif") },
  { id: 4, text: "View history and notifications", img: require("../assets/gifs/doorbell.gif") },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);

  return (
    <View style={styles.container}>
      <Image source={steps[step].img} style={styles.img} />
      <Text style={styles.text}>{steps[step].text}</Text>
      <View style={styles.buttons}>
        {step > 0 && <Button title="Back" onPress={() => setStep(step - 1)} />}
        {step < steps.length - 1 ? (
          <Button title="Next" onPress={() => setStep(step + 1)} />
        ) : (
          <Button title="Finish" onPress={() => console.log("Onboarding complete")} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  img: { width: 150, height: 150, marginBottom: 20 },
  text: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  buttons: { flexDirection: "row", gap: 10 },
});
