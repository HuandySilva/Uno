import { useEffect } from "react";
import { View, Text, StyleSheet, AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";
import { useCardTranslator } from "@/hooks/useCardTranslator";

interface Props {
  cor: string;
  onDesaparecer: () => void;
}

export default function ChosenColorBanner({ cor, onDesaparecer }: Props) {
  const { t } = useTranslation();
  const { getColorKey } = useCardTranslator();
  const corTraduzida = t(`colors.${getColorKey(cor)}`);
  const mensagem = t("Chosen_color_announce", { color: corTraduzida });

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(mensagem);

    const timer = setTimeout(() => {
      onDesaparecer();
    }, 3000); // some depois de 3 segundos

    return () => clearTimeout(timer);
  }, [mensagem]);

  return (
    <View style={styles.banner}>
      <Text style={styles.texto}>{mensagem}</Text>
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
