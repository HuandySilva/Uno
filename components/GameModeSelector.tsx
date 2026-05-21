import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSettings, ModoJogoID } from "@/context/SettingsContext";
import { CONFIG_MODOS } from "@/config/gameModes";
import { useTranslation } from "react-i18next";

export default function GameModeSelector() {
  const { t } = useTranslation();
  const { modoAtivo, setModoAtivo } = useSettings();

  // Geramos a lista de modos dinamicamente
  const listaDeModos = Object.keys(CONFIG_MODOS) as ModoJogoID[];

  return (
    <View style={styles.container}>
      <Text style={styles.label} accessibilityRole="header">
        {t("Select_Mode_Label", "Modo de Jogo:")}
      </Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={modoAtivo}
          onValueChange={(itemValue) => setModoAtivo(itemValue)}
          accessibilityLabel={t(
            "Select_Mode_Acc",
            "Escolha o modo de jogo atual",
          )}
          mode="dropdown" // No Android, o dropdown costuma ser melhor que o dialog
          style={styles.picker}
        >
          {listaDeModos.map((modo) => (
            <Picker.Item
              key={modo}
              label={t(
                `${modo}_Mode`,
                modo.charAt(0).toUpperCase() + modo.slice(1),
              )}
              value={modo}
              color={modo === "treta" ? "#FF3B30" : "#333"} // Dá um toque visual no modo treta
            />
          ))}
        </Picker>
      </View>

      {/* Descrição dinâmica baseada na seleção */}
      <View style={styles.descriptionBox} accessibilityLiveRegion="polite">
        <Text style={styles.descriptionText}>
          {modoAtivo === "treta"
            ? "Cuidado! Cartas de bomba e caos ativadas."
            : "Regras clássicas para uma partida tranquila."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden", // Importante no Android para as bordas arredondadas funcionarem
  },
  picker: {
    height: 55, // Altura padrão boa para toque no Android
    width: "100%",
  },
  descriptionBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
});
