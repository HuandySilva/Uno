import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  AccessibilityInfo,
} from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CartaUno } from "../types/CartaUno";
// Verifique se o nome do arquivo é gameHelpers.ts ou gameHelper.ts
import { ordenarMao } from "../utils/gameHelpers";

interface Props {
  maoJogador: CartaUno[];
  setMaoJogador: (novaMao: CartaUno[]) => void;
}

export default function SortingModal({ maoJogador, setMaoJogador }: Props) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<
    "cor" | "valor" | null
  >(null);
  const { t } = useTranslation();

  const handleSelect = (tipo: "cor" | "valor") => {
    setOpcaoSelecionada(tipo);

    const maoOrdenada = ordenarMao(maoJogador, tipo);
    setMaoJogador(maoOrdenada);

    // Feedback de acessibilidade curto
    const feedback =
      tipo === "cor" ? t("Sort_feedback_color") : t("Sort_feedback_value");
    AccessibilityInfo.announceForAccessibility(feedback);

    setModalVisivel(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisivel(true)}
        accessibilityLabel={t("Sort_cards_acc")}
      >
        <Text style={styles.openButtonText}>{t("Sort_btn_label")}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} accessibilityRole="header">
              {t("Sort_modal_title")}
            </Text>

            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => handleSelect("cor")}
              accessibilityRole="radio"
              accessibilityState={{ selected: opcaoSelecionada === "cor" }}
            >
              <View style={styles.radioButton}>
                {opcaoSelecionada === "cor" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>{t("Sort_by_color")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => handleSelect("valor")}
              accessibilityRole="radio"
              accessibilityState={{ selected: opcaoSelecionada === "valor" }}
            >
              <View style={styles.radioButton}>
                {opcaoSelecionada === "valor" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>{t("Sort_by_value")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.closeButtonText}>{t("Close_btn")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  openButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    width: 250,
    alignItems: "center",
  },
  openButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#2196F3",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
  },
  closeButtonText: {
    color: "#FF5252",
    fontWeight: "bold",
    fontSize: 16,
  },
});
