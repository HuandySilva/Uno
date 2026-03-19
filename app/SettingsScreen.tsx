import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const [musicaAtivada, setMusicaAtivada] = useState(true);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar" // Label simples como você pediu
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          Configurações
        </Text>
      </View>

      <View style={styles.content}>
        {/* Item de Configuração: Música */}
        <View
          style={styles.settingItem}
          accessible={true}
          accessibilityLabel={`Música de fundo: ${musicaAtivada ? "Ativada" : "Desativada"}`}
        >
          <Text style={styles.label}>Música de Fundo</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#34C759" }}
            thumbColor={musicaAtivada ? "#fff" : "#f4f3f4"}
            onValueChange={() =>
              setMusicaAtivada((previousState) => !previousState)
            }
            value={musicaAtivada}
          />
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
    backgroundColor: "#eee", // Um fundinho cinza para destacar o botão
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
