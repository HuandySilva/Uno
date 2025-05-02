import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MyMainScreen() {
  const router = useRouter();

  const irParaJogo = () => {
    router.push("/GameScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao UNO Acessível!</Text>
      <Button title="Jogar" onPress={irParaJogo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
