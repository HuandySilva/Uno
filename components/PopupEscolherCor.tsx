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
import { useTranslation } from "react-i18next";
import { useCardTranslator } from "@/hooks/useCardTranslator";

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
  const { t } = useTranslation();
  const { getColorKey } = useCardTranslator();
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

  const cores = ["vermelho", "azul", "verde", "amarelo"];

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
            accessibilityLabel={t("Wild_card_played_acc")}
          >
            {t("Wild_card_played_title")}
          </Text>

          <Text style={styles.subtitulo}>{t("Choose_color_title")}</Text>

          {cores.map((corValor) => {
            const corChave = getColorKey(corValor);
            const nomeTraduzido = t(`colors.${corChave}`);

            return (
              <TouchableOpacity
                key={corValor}
                onPress={() => onEscolher(corValor)}
                style={styles.botaoCor}
                accessibilityLabel={t("Choose_color_btn_acc", {
                  color: nomeTraduzido,
                })}
                accessibilityRole="button"
              >
                <Text style={styles.opcao}>{nomeTraduzido}</Text>
              </TouchableOpacity>
            );
          })}
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
