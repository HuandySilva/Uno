import { useTranslation } from "react-i18next";
import { CartaUno } from "@/types/CartaUno";

const colorKeys: Record<string, string> = {
  vermelho: "red",
  azul: "blue",
  verde: "green",
  amarelo: "yellow",
};

const actionKeys: Record<string, string> = {
  pular: "skip",
  reverso: "reverse",
  comprarDois: "drawTwo",
  comprarQuatro: "drawFour",
  coringa: "wild",
};

export const useCardTranslator = () => {
  const { t } = useTranslation();

  const getActionKey = (acao: string) => actionKeys[acao] || acao;
  const getColorKey = (cor: string) => colorKeys[cor] || "special";

  const getCardTranslation = (item: CartaUno) => {
    const actionKey = getActionKey(item.acaoEspecial || "");
    const colorKey = getColorKey(item.cor || "");

    const valor = item.acaoEspecial ? t(`actions.${actionKey}`) : item.numero;

    const corTraduzida = t(`colors.${colorKey}`);

    return {
      valor,
      cor: corTraduzida,
      colorKey,
      full: `${valor} (${corTraduzida})`,
    };
  };

  return {
    getCardTranslation,
    getColorKey,
    getActionKey,
  };
};
