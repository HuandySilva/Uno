import React from "react";
import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import LanguageSelector from "@/components/LanguageSelector";
import { useSettings } from "../context/SettingsContext";

export default function SettingsScreen() {
  const { musicaAtivada, setMusicaAtivada, sonsAtivados, setSonsAtivados } =
    useSettings();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          Configurações
        </Text>
      </View>

      <View style={styles.content}>
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
        </View>{" "}
        {/* <--- ESTAVA FALTANDO FECHAR ESTA VIEW AQUI */}
        {/* ITEM: SONS */}
        <View style={styles.settingItem}>
          <Text style={styles.label}>Efeitos de Som</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#34C759" }}
            thumbColor={sonsAtivados ? "#fff" : "#f4f3f4"}
            onValueChange={setSonsAtivados}
            value={sonsAtivados}
          />
        </View>
        {/* SELETOR DE IDIOMA (FORA DOS ITENS DE SOM) */}
        <View style={styles.settingItem}>
          <LanguageSelector />
        </View>
      </View>
    </View>
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
});
