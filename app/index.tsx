import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform, Dimensions } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

export default function MyMainScreen() {
  useEffect(() => {
    async function handleOrientation() {
      const { width, height } = Dimensions.get("window");
      // No Android, tablets geralmente têm a menor largura (window width) > 600dp
      const isTablet =
        Platform.OS === "ios" ? Platform.isPad : Math.min(width, height) >= 600;

      if (isTablet) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
      }
    }

    handleOrientation();

    // Quando sair da tela de jogo, libera para o usuário usar como quiser
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const router = useRouter();

  const irParaJogo = () => {
    // Navega para a tela do jogo que deve estar em app/GameScreen.tsx
    router.push("/GameScreen");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          UNO Acessível
        </Text>

        <Text style={styles.subtitle}>
          Derrote a máquina em uma partida divertida de uno.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={irParaJogo}
          accessibilityLabel="Iniciar nova partida de UNO"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>JOGAR</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>v1.0.0 - Mobile Core</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 12,
    elevation: 3, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    fontSize: 12,
    color: "#999",
  },
});
