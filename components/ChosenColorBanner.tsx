import { useEffect } from "react";
import { View, Text, StyleSheet, AccessibilityInfo } from "react-native";

interface Props {
  cor: string;
  onDesaparecer: () => void;
}

export default function ChosenColorBanner({ cor, onDesaparecer }: Props) {
  useEffect(() => {
    const mensagem = `Cor escolhida: ${cor}`;
    AccessibilityInfo.announceForAccessibility(mensagem);

    const timer = setTimeout(() => {
      onDesaparecer();
    }, 3000); // some depois de 3 segundos

    return () => clearTimeout(timer);
  }, [cor]);

  return (
    <View style={styles.banner}>
      <Text style={styles.texto}>Cor escolhida: {cor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 12,
  },
  texto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
