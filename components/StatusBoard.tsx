import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

interface StatusBoardProps {
  vezDoJogador: boolean;
  maoJogadorCount: number;
  maoPCCount: number;
  corAtual: string | null;
}

export default function StatusBoard({
  vezDoJogador,
  maoJogadorCount,
  maoPCCount,
  corAtual,
}: StatusBoardProps) {
  const { t } = useTranslation();

  // Monta a string única para o leitor de telas
  const resumoAcessibilidade = `
    ${vezDoJogador ? t("Your_turn") : t("Machine_turn")}. 
    ${t("My_hand_acc_label", { count: maoJogadorCount })}. 
    ${t("Announce_draw_other", { name: t("Machine_name"), count: maoPCCount })}.
    ${corAtual ? `${t("Choosen color")}: ${t(`colors.${corAtual}`)}` : ""}
  `;

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={resumoAcessibilidade}
      accessibilityLiveRegion="polite"
    >
      <Text
        style={[styles.turnText, { color: vezDoJogador ? "green" : "red" }]}
      >
        {vezDoJogador ? `👉 ${t("Your_turn")}` : `⌛ ${t("Machine_turn")}`}
      </Text>

      <View style={styles.row}>
        <View style={styles.statBox}>
          <Text style={styles.label}>{t("Player")}</Text>
          <Text style={styles.value}>{maoJogadorCount}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.label}>{t("Machine_name")}</Text>
          <Text style={styles.value}>{maoPCCount}</Text>
        </View>
      </View>

      {corAtual && (
        <View style={styles.colorIndicator}>
          <Text style={styles.label}>{t("Choosen color")}: </Text>
          <Text style={[styles.value, { color: "blue" }]}>
            {t(`colors.${corAtual}`)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  turnText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  colorIndicator: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});
