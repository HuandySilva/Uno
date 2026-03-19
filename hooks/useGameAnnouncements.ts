import { AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";
import { useCardTranslator } from "./useCardTranslator";
import { CartaUno } from "../types/CartaUno";
import { useRef } from "react";

export function useGameAnnouncements() {
  const { t } = useTranslation();
  const { getCardTranslation } = useCardTranslator();
  const lastMessage = useRef<string | null>(null);

  const announce = async (message: string) => {
    if (message === lastMessage.current) return;

    const isActive = await AccessibilityInfo.isScreenReaderEnabled();

    if (isActive) {
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(message);
      }, 500);
      lastMessage.current = message;
    }
  };

  const anunciarCompra = (quem: "jogador" | "pc", quantidade: number) => {
    const nome = quem === "jogador" ? t("Player_name_you") : t("Machine_name");
    const mensagem =
      quantidade === 1
        ? t("Announce_draw_one", { name: nome })
        : t("Announce_draw_other", { name: nome, count: quantidade });

    announce(mensagem);
  };

  const anunciarCarta = (carta: CartaUno, quem: "jogador" | "pc") => {
    const nome = quem === "jogador" ? t("Player_name_you") : t("Machine_name");
    const { full } = getCardTranslation(carta);
    const mensagem = t("Announce_played", { name: nome, card: full });
    announce(mensagem);
  };

  const anunciarPunicao = (quem: "jogador" | "pc") => {
    const nome = quem === "jogador" ? t("Player_name_you") : t("Machine_name");
    announce(t("Punish_no_uno", { name: nome }));
  };

  const anunciarCorEscolhida = (cor: string) => {
    const corTraduzida = t(`colors.${cor}`) || cor;
    announce(t("Chosen_color_announce", { color: corTraduzida }));
  };

  const anunciarTurno = (isPlayerTurn: boolean) => {
    announce(isPlayerTurn ? t("turn_player") : t("turn_machine"));
  };

  return {
    anunciarCompra,
    anunciarCarta,
    anunciarPunicao,
    anunciarCorEscolhida,
    anunciarTurno,
    announce,
  };
}
