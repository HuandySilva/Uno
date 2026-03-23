import { registerRootComponent } from "expo";
import * as AudioFactory from "expo-av";
import {
  View,
  Text,
  StyleSheet,
  Button,
  AccessibilityInfo,
} from "react-native";
import { useState, useEffect } from "react";
import { useUnoGame } from "@/hooks/useUnoGame";
import HistoricoMesa from "@/components/HistoricoMesa";
import PopupEscolherCor from "@/components/PopupEscolherCor";
import ChooseCard from "@/components/ChooseCard";
import ChosenColorBanner from "@/components/ChosenColorBanner";
import StatusBoard from "@/components/StatusBoard";
import { playUnoSound } from "../utils/soundUtils";
import { useTranslation } from "react-i18next";
import { useCardTranslator } from "@/hooks/useCardTranslator";
import { useGameAnnouncements } from "@/hooks/useGameAnnouncements";
import SortingModal from "@/components/SortingModal";

export default function GameScreen() {
  const {
    maoJogador,
    setMaoJogador,
    maoPC,
    cartaTopo,
    historicoMesa,
    vezDoJogador,
    setVezDoJogador,
    jaComprouNoTurno,
    corAtual,
    setCorAtual,
    aguardandoCor,
    setAguardandoCor,
    jogadorDisseUno,
    setJogadorDisseUno,
    jogarPorIndice,
    comprar,
  } = useUnoGame();

  const { t } = useTranslation();
  const { getColorKey, getActionKey } = useCardTranslator();
  const { anunciarCorEscolhida, anunciarTurno } = useGameAnnouncements();

  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mostrarBannerCor, setMostrarBannerCor] = useState(false);

  useEffect(() => {
    if (aguardandoCor && vezDoJogador) {
      setMostrarPopup(true);
      setAguardandoCor(false);
    }
  }, [aguardandoCor, vezDoJogador]);

  useEffect(() => {
    if (
      (corAtual && cartaTopo?.acaoEspecial === "coringa") ||
      cartaTopo?.acaoEspecial === "comprarQuatro"
    ) {
      setMostrarBannerCor(true);
    }
  }, [corAtual]);

  function escolherCor(cor: string) {
    setCorAtual(cor);
    setMostrarPopup(false);
    setVezDoJogador(false);
  }

  const verCartasJogador = () => {
    AccessibilityInfo.announceForAccessibility(
      t("My_hand_acc_label", { count: maoJogador.length }),
    );
  };

  const verCartasPC = () => {
    AccessibilityInfo.announceForAccessibility(
      t("Announce_draw_other", {
        name: t("Machine_name"),
        count: maoPC.length,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Top_card_label")}</Text>

      {cartaTopo && (
        <Text style={styles.cartaTopo}>
          {cartaTopo.acaoEspecial
            ? t(`actions.${getActionKey(cartaTopo.acaoEspecial)}`)
            : cartaTopo.numero}{" "}
          ({t(`colors.${getColorKey(cartaTopo.cor)}`)})
        </Text>
      )}

      <SortingModal maoJogador={maoJogador} setMaoJogador={setMaoJogador} />
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
      />

      <PopupEscolherCor
        visivel={mostrarPopup}
        onFechar={() => setMostrarPopup(false)}
        onEscolher={escolherCor}
      />

      <Button
        title={t("Uno")}
        onPress={() => {
          setJogadorDisseUno(true);
          playUnoSound();
          AccessibilityInfo.announceForAccessibility(t("Uno"));
        }}
        disabled={maoJogador.length !== 2 || jogadorDisseUno}
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
});
