import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AccessibilityInfo,
  Platform,
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
  const tituloRef = useRef<any>(null);

  useEffect(() => {
    if (visivel && tituloRef.current) {
      if (Platform.OS === "web") {
        tituloRef.current.focus?.();
      } else {
        AccessibilityInfo.setAccessibilityFocus(tituloRef.current);
      }
    }
  }, [visivel]);

  const cores = [
    { nome: "Vermelho", valor: "vermelho" },
    { nome: "Azul", valor: "azul" },
    { nome: "Verde", valor: "verde" },
    { nome: "Amarelo", valor: "amarelo" },
  ];

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
            {...(Platform.OS === "web" ? { tabIndex: -1 } : {})}
            accessibilityLabel="Você jogou um coringa. Escolha a cor desejada."
          >
            Você jogou um coringa!
          </Text>

          <Text style={styles.subtitulo}>Escolha a cor desejada:</Text>

          {cores.map((cor) => (
            <TouchableOpacity
              key={cor.valor}
              onPress={() => onEscolher(cor.valor)}
              style={styles.botaoCor}
              accessibilityLabel={`Escolher cor ${cor.nome}`}
              accessibilityRole="button"
            >
              <Text style={styles.opcao}>{cor.nome}</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#000",
  },
  subtitulo: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
    color: "#444",
  },
  botaoCor: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  opcao: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "500",
  },
});
