import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { useTranslation } from "react-i18next";
import OptionsMenu from "@/components/OptionsMenu";

export default function MyMainScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [menuVisivel, setMenuVisivel] = useState(false);

  useEffect(() => {
    async function handleOrientation() {
      const { width, height } = Dimensions.get("window");
      const isTablet =
        Platform.OS === "ios" ? Platform.isPad : Math.min(width, height) >= 600;

      if (isTablet) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
      }
    }

    handleOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const irParaJogo = () => {
    router.push("/GameScreen");
  };

  const handleNavegacao = (rota: string) => {
    setMenuVisivel(false);
    router.push(rota as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Botão de Menu no topo direito */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuTrigger}
          onPress={() => setMenuVisivel(true)}
          accessibilityLabel={t("More_options", "Mais opções")}
          accessibilityRole="button"
        >
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo Centralizado */}
      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          {t("Title")}
        </Text>

        <Text style={styles.subtitle}>{t("Welcome")}</Text>

        <TouchableOpacity
          style={styles.playButton}
          onPress={irParaJogo}
          accessibilityLabel={t("Beginning")}
          accessibilityRole="button"
        >
          <Text style={styles.playButtonText}>{t("Play_btn")}</Text>
        </TouchableOpacity>
      </View>

      <OptionsMenu
        visivel={menuVisivel}
        onFechar={() => setMenuVisivel(false)}
        onNavegar={handleNavegacao}
      />

      <Text style={styles.footer}>v1.0.0 - Mobile Core</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end", // Alinha o botão à direita
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 10, // Ajuste para status bar no Android
  },
  menuTrigger: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIcon: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "bold",
  },
  content: {
    flex: 1, // Faz o conteúdo ocupar o resto da tela
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center",
    paddingBottom: 60, // Compensa visualmente o espaço do footer
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
    marginBottom: 40,
  },
  playButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    textAlign: "center",
    fontSize: 12,
    color: "#999",
  },
});
