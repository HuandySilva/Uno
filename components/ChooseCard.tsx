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

interface Props {
  maoJogador: CartaUno[];
  jogar: (index: number) => void;
}

export default function ChooseCard({ maoJogador, jogar }: Props) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const { t } = useTranslation();
  const { getCardTranslation } = useCardTranslator();

  const renderItem = ({ item, index }: { item: CartaUno; index: number }) => {
    const { valor, cor, colorKey, full } = getCardTranslation(item);

    return (
      <TouchableOpacity
        // A lógica da borda agora usa a cor vinda do utilitário ou o fallback do estilo
        style={[
          styles.cardItem,
          {
            borderLeftColor:
              colorKey === "special" ? styles.specialCard.color : colorKey,
          },
        ]}
        onPress={() => {
          setModalVisivel(false);
          jogar(index);
        }}
        accessibilityLabel={t("Card_acc_label", { value: valor, color: cor })}
      >
        <Text style={styles.cardText}>{full}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisivel(true)}
        accessibilityLabel={t("Open_hand_acc")}
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
  specialCard: {
    color: "#333", // Centralizamos a cor do 'especial' aqui no estilo
  },
  cardText: {
    fontSize: 16,
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
