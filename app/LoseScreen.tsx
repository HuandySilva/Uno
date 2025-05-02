import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function LoseScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💀 You lost... 💀</Text>
      <Button title="Try again" onPress={() => router.replace("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcdcdc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "darkred",
    marginBottom: 20,
  },
});
