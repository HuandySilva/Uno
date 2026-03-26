import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

interface Props {
  visivel: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmDialog({
  visivel,
  onConfirmar,
  onCancelar,
}: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <View style={styles.card} accessibilityRole="alert">
          <Text style={styles.title}>{t("game.quit_title")}</Text>
          <Text style={styles.message}>{t("game.quit_message")}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={onCancelar}
              accessibilityLabel={t("game.quit_cancel")}
              accessibilityRole="button"
            >
              <Text style={styles.btnTextCancel}>{t("game.quit_cancel")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnConfirm}
              onPress={onConfirmar}
              accessibilityLabel={t("game.quit_confirm")}
              accessibilityRole="button"
            >
              <Text style={styles.btnTextConfirm}>
                {t("game.quit_confirm")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 5, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1a1a1a",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#4a4a4a",
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  btnConfirm: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
  },
  btnCancel: {
    backgroundColor: "#F2F2F7",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  btnTextConfirm: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  btnTextCancel: {
    color: "#007AFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
