import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";

interface Props {
  visivel: boolean;
  onFechar: () => void;
  onEscolher: (cor: string) => void;
}

export default function EscolherCorDialog({
  visivel,
  onFechar,
  onEscolher,
}: Props) {
  const tituloRef = useRef(null);

  useEffect(() => {
    if (visivel && tituloRef.current) {
      const reactTag = findNodeHandle(tituloRef.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }, [visivel]);

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <View style={styles.dialogo}>
          <Text
            ref={tituloRef}
            style={styles.titulo}
            accessible
            accessibilityRole="header"
            accessibilityLabel="Você jogou um coringa. Escolha a cor desejada."
          >
            Você jogou um coringa!
          </Text>

          <Text style={styles.subtitulo}>Escolha a cor desejada:</Text>

          {["vermelho", "azul", "verde", "amarelo"].map((cor) => (
            <TouchableOpacity
              key={cor}
              onPress={() => onEscolher(cor)}
              accessibilityLabel={`Escolher cor ${cor}`}
            >
              <Text style={styles.opcao}>{cor}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogo: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
    elevation: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  opcao: {
    fontSize: 18,
    marginVertical: 6,
    textTransform: "capitalize",
  },
});
