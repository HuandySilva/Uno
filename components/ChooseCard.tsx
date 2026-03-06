import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Button,
} from "react-native";
import { CartaUno } from "@/types/CartaUno";
import { useState } from "react";

interface Props {
  maoJogador: CartaUno[];
  jogar: (index: number) => void;
}

export default function ChooseCard({ maoJogador, jogar }: Props) {
  const [modalVisivel, setModalVisivel] = useState(false);

  const selecionarEJogar = (index: number) => {
    setModalVisivel(false);
    jogar(index);
  };

  return (
    <View style={styles.container}>
      {/* Botão que abre o "fuá" de cartas */}
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisivel(true)}
        accessibilityLabel={`Ver minhas cartas. Você tem ${maoJogador.length} cartas.`}
      >
        <Text style={styles.openButtonText}>
          Minha Mão ({maoJogador.length})
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} accessibilityRole="header">
              Escolha uma carta para jogar:
            </Text>

            <FlatList
              data={maoJogador}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.cardItem,
                    {
                      borderLeftColor: item.cor === "preto" ? "#333" : item.cor,
                    },
                  ]}
                  onPress={() => selecionarEJogar(index)}
                  accessibilityLabel={`${item.acaoEspecial ?? item.numero} de cor ${item.cor}`}
                >
                  <Text style={styles.cardText}>
                    {item.acaoEspecial ?? item.numero} ({item.cor})
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 400 }}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
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
  cardItem: {
    width: 280,
    padding: 15,
    borderLeftWidth: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 5,
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
