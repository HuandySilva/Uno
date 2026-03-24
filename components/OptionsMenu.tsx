import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useTranslation } from "react-i18next";

interface Props {
  visivel: boolean;
  onFechar: () => void;
  onNavegar: (rota: string) => void;
}

export default function OptionsMenu({ visivel, onFechar, onNavegar }: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
      accessibilityViewIsModal={true}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onFechar}
      >
        <View style={styles.menuCard}>
          <Text style={styles.menuTitle} accessibilityRole="header">
            {t("Menu_btn")}
          </Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onNavegar("/StatsScreen")}
            accessibilityRole="button"
            accessibilityLabel={t("Stats_title")}
          >
            <Text style={styles.menuItemText}>📊 {t("Stats_title")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onNavegar("/SettingsScreen")}
            accessibilityRole="button"
            accessibilityLabel={t("Settings")}
          >
            <Text style={styles.menuItemText}>⚙️ {t("Settings")}</Text>
          </TouchableOpacity>

          {/* Espaço reservado para a futura Ajuda */}
          {/* <TouchableOpacity style={styles.menuItem} onPress={() => onNavegar("/HelpScreen")}>
            <Text style={styles.menuItemText}>❓ {t("Help_title")}</Text>
          </TouchableOpacity> 
          */}

          <TouchableOpacity
            style={[styles.menuItem, styles.closeMenuItem]}
            onPress={onFechar}
            accessibilityRole="button"
          >
            <Text style={styles.closeText}>{t("Close_btn")}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  menuItem: {
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 18,
    color: "#007AFF",
  },
  closeMenuItem: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  closeText: {
    color: "#FF3B30",
    fontWeight: "bold",
    fontSize: 16,
  },
});
