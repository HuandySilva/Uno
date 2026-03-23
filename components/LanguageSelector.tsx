import React from "react";
import { View, Text, StyleSheet, AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const mudarIdioma = (lang: string) => {
    i18n.changeLanguage(lang);

    // Anúncio para o leitor de telas após a troca
    const msg =
      lang === "pt"
        ? "Idioma alterado para Português"
        : "Language changed to English";
    AccessibilityInfo.announceForAccessibility(msg);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label} accessibilityRole="header">
        {t("Select_language_title", "Selecionar Idioma")}
      </Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={i18n.language.split("-")[0]} // Garante que pegue 'pt' ou 'en'
          onValueChange={(itemValue) => mudarIdioma(itemValue)}
          accessibilityLabel={t("Select_language_title")}
          mode="dropdown" // No Android, abre um menu em vez de um modal
        >
          <Picker.Item label="🇧🇷 Português" value="pt" />
          <Picker.Item label="🇺🇸 English" value="en" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden", // Garante que o Picker respeite o border radius
  },
});
