//AlertScreen.tsx

import React, { useState } from "react";
import { View, Button } from "react-native";
import AlertPopup from "../components/AlertPopup";

export default function AlertScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Simulate Alert" onPress={() => setVisible(true)} />
      <AlertPopup
        visible={visible}
        gif={require("../assets/gifs/alarm.gif")}
        soundName="Alarm"
        onAcknowledge={() => setVisible(false)}
        onSnooze={() => setVisible(false)}
      />
    </View>
  );
}
