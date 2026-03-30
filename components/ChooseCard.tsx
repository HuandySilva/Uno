import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { CartaUno } from "@/types/CartaUno";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCardTranslator } from "@/hooks/useCardTranslator";
import { podeJogar } from "@/utils/gameHelpers";

interface Props {
  maoJogador: CartaUno[];
  jogar: (index: number) => void;
  cartaTopo: CartaUno | null;
  corAtual: string | null;
  precisaComprar: boolean;
}

export default function ChooseCard({
  maoJogador,
  jogar,
  cartaTopo,
  corAtual,
  precisaComprar,
}: Props) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const { t } = useTranslation();
  const { getCardTranslation } = useCardTranslator();

  const renderItem = ({ item, index }: { item: CartaUno; index: number }) => {
    const { valor, cor, colorKey, full } = getCardTranslation(item);
    const jogavel = podeJogar(item, cartaTopo, corAtual, precisaComprar);

    return (
      <TouchableOpacity
        style={[
          styles.cardItem,
          { borderLeftColor: colorKey === "special" ? "#333" : colorKey },
          !jogavel && styles.cardDisabled,
        ]}
        onPress={() => {
          setModalVisivel(false);
          jogar(index);
        }}
        disabled={!jogavel}
        accessibilityLabel={t("Card_acc_label", { value: valor, color: cor })}
        accessibilityState={{ disabled: !jogavel }}
      >
        <Text style={[styles.cardText, !jogavel && styles.disabledText]}>
          {full} {!jogavel && `(${t("Invalid_move_announce")})`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisivel(true)}
        accessibilityLabel={t("Open_hand_acc")}
        accessibilityRole="button"
      >
        <Text style={styles.openButtonText}>{t("My_hand_label")}</Text>
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
              {t("Choose_card_title")}
            </Text>

            <FlatList
              data={maoJogador}
              keyExtractor={(_, i) => i.toString()}
              renderItem={renderItem}
              style={styles.list}
            />

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
    marginVertical: 15,
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
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  list: {
    maxHeight: 400,
    width: "100%",
  },
  cardItem: {
    width: 280,
    padding: 15,
    borderLeftWidth: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 5,
  },
  cardDisabled: {
    opacity: 0.4,
    backgroundColor: "#e0e0e0",
  },
  cardText: {
    fontSize: 16,
    color: "#000",
  },
  disabledText: {
    color: "#888",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
  },
  closeButtonText: {
    color: "#FF5252",
    fontWeight: "bold",
  },
});
