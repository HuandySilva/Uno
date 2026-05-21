import React from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import LanguageSelector from "@/components/LanguageSelector";
import GameModeSelector from "@/components/GameModeSelector";
import { useSettings } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const {
    musicaAtivada,
    setMusicaAtivada,
    sonsAtivados,
    setSonsAtivados,
    modoAtivo, // Novo: string
    setModoAtivo, // Novo: função para string
  } = useSettings();

  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("Back_btn", "Voltar")}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{t("Back_btn", "Voltar")}</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          {t("Settings", "Configurações")}
        </Text>
      </View>

      <View style={styles.content}>
        {/* --- SEÇÃO: SELEÇÃO DE MODO (O SLIDER NOVO) --- */}
        <View style={styles.modeSection}>
          <GameModeSelector />
          <Text style={styles.subLabelMode}>
            {modoAtivo === "treta"
              ? "Cartas raras e eventos caóticos ativados!"
              : "Experiência clássica do jogo de cartas."}
          </Text>
        </View>

        {/* ITEM: MÚSICA */}
        <View
          style={styles.settingItem}
          accessible={true}
          accessibilityLabel={`Música de fundo: ${musicaAtivada ? "Ativada" : "Desativada"}`}
        >
          <Text style={styles.label}>Música de Fundo</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#34C759" }}
            thumbColor={musicaAtivada ? "#fff" : "#f4f3f4"}
            onValueChange={setMusicaAtivada}
            value={musicaAtivada}
          />
        </View>

        {/* ITEM: SONS */}
        <View
          style={styles.settingItem}
          accessible={true}
          accessibilityLabel={`Efeitos de som: ${sonsAtivados ? "Ativados" : "Desativados"}`}
        >
          <Text style={styles.label}>Efeitos de Som</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#34C759" }}
            thumbColor={sonsAtivados ? "#fff" : "#f4f3f4"}
            onValueChange={setSonsAtivados}
            value={sonsAtivados}
          />
        </View>

        {/* SELETOR DE IDIOMA */}
        <View style={styles.settingItem}>
          <LanguageSelector />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    marginTop: 20,
  },
  modeSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  label: {
    fontSize: 18,
  },
  subLabelMode: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: -5,
    textAlign: "center",
  },
});
