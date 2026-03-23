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

  return (
    <View style={styles.container}>
      {/* Turno: O leitor só lê se o usuário colocar o foco aqui */}
      <Text
        style={[styles.turnText, { color: vezDoJogador ? "green" : "red" }]}
        accessibilityRole="header"
      >
        {vezDoJogador ? `👉 ${t("turn_player")}` : `⌛ ${t("turn_machine")}`}
      </Text>

      <View style={styles.row}>
        {/* Status do Jogador */}
        <View
          style={styles.statBox}
          accessible={true}
          accessibilityLabel={`${t("Player_name_you")}: ${maoJogadorCount}`}
        >
          <Text style={styles.label}>{t("Player_name_you")}</Text>
          <Text style={styles.value}>{maoJogadorCount}</Text>
        </View>

        {/* Status da Máquina */}
        <View
          style={styles.statBox}
          accessible={true}
          accessibilityLabel={`${t("Machine_name")}: ${maoPCCount}`}
        >
          <Text style={styles.label}>{t("Machine_name")}</Text>
          <Text style={styles.value}>{maoPCCount}</Text>
        </View>
      </View>

      {/* Cor Atual: Aparece apenas se houver uma cor escolhida */}
      {corAtual && (
        <View
          style={styles.colorIndicator}
          accessible={true}
          accessibilityLabel={`${t("Choosen color")}: ${t(`colors.${corAtual}`)}`}
        >
          <Text style={styles.label}>{t("Choosen color")}: </Text>
          <Text style={[styles.value, { color: "#0056b3" }]}>
            {t(`colors.${corAtual}`)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2, // Sombra leve no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  turnText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  colorIndicator: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
