import {
  View,
  Text,
  StyleSheet,
  Button,
  AccessibilityInfo,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { useUnoGame } from "@/hooks/useUnoGame";
import HistoricoMesa from "@/components/HistoricoMesa";
import PopupEscolherCor from "@/components/PopupEscolherCor";
import ChooseCard from "@/components/ChooseCard";
import ChosenColorBanner from "@/components/ChosenColorBanner";
import StatusBoard from "@/components/StatusBoard";
import { useTranslation } from "react-i18next";
import { useCardTranslator } from "@/hooks/useCardTranslator";
import { useGameAnnouncements } from "@/hooks/useGameAnnouncements";
import SortingModal from "@/components/SortingModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function GameScreen() {
  const {
    maoJogador,
    maoPC,
    cartaTopo,
    historicoMesa,
    vezDoJogador,
    jaComprouNoTurno,
    corAtual,
    status,
    aguardandoUno,
    jogadorDisseUno,
    jogarPorIndice,
    comprar,
    desistirPartida,
    dispatch,
  } = useUnoGame();

  const { t } = useTranslation();
  const { getColorKey, getActionKey } = useCardTranslator();

  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [mostrarBannerCor, setMostrarBannerCor] = useState(false);
  const [mostrarConfirmarSaida, setMostrarConfirmarSaida] = useState(false);
  const mostrarPopupCor = status === "ESCOLHENDO_COR" && vezDoJogador;

  const handleConfirmarDesistencia = () => {
    setMostrarConfirmarSaida(false);
    desistirPartida();
  };
  useEffect(() => {
    if (corAtual) {
      setMostrarBannerCor(true);
    }
  }, [corAtual]);

  function escolherCor(cor: string) {
    dispatch({ type: "MUDAR_COR", payload: cor });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Top_card_label")}</Text>

      {cartaTopo && (
        <Text style={styles.cartaTopo}>
          {cartaTopo.acaoEspecial
            ? t(`actions.${getActionKey(cartaTopo.acaoEspecial)}`)
            : cartaTopo.numero}{" "}
          ({t(`colors.${getColorKey(cartaTopo.cor || corAtual)}`)})
        </Text>
      )}

      <SortingModal maoJogador={maoJogador} dispatch={dispatch} />
      {mostrarBannerCor && (
        <ChosenColorBanner
          cor={corAtual ?? ""}
          onDesaparecer={() => setMostrarBannerCor(false)}
        />
      )}

      <ChooseCard maoJogador={maoJogador} jogar={jogarPorIndice} />

      {mostrarHistorico && <HistoricoMesa historico={historicoMesa} />}

      <Button
        title={jaComprouNoTurno ? t("Drawn") : t("Draw")}
        onPress={comprar}
        disabled={!vezDoJogador || status !== "JOGANDO"}
      />

      <PopupEscolherCor
        visivel={mostrarPopupCor}
        onFechar={() => {}} // No Uno, você é obrigado a escolher a cor
        onEscolher={escolherCor}
      />

      <Button
        title={mostrarHistorico ? t("Hide_history") : t("Show_history")}
        onPress={() => setMostrarHistorico(!mostrarHistorico)}
      />

      <StatusBoard
        vezDoJogador={vezDoJogador}
        maoJogadorCount={maoJogador.length}
        maoPCCount={maoPC.length}
        corAtual={corAtual}
      />

      <TouchableOpacity
        style={styles.btnDesistir}
        onPress={() => setMostrarConfirmarSaida(true)}
        accessibilityRole="button"
        accessibilityLabel={t("quit_btn")}
      >
        <Text style={styles.txtDesistir}>X</Text>
      </TouchableOpacity>

      <ConfirmDialog
        visivel={mostrarConfirmarSaida}
        onConfirmar={handleConfirmarDesistencia}
        onCancelar={() => setMostrarConfirmarSaida(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  cartaTopo: {
    fontSize: 18,
    marginBottom: 20,
    color: "tomato",
  },

  btnDesistir: {
    position: "absolute",
    top: 50, // Ajuste conforme o SafeArea
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Garante que fique por cima de tudo
  },
  txtDesistir: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
