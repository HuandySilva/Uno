import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function DrawScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>😐 It's a draw! The deck is empty. 😐</Text>
      <Button title="Play again" onPress={() => router.replace("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
});