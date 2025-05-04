import { AccessibilityInfo } from "react-native";
import { CartaUno } from "../types/CartaUno";

let isScreenReaderActive: boolean | null = null;
let lastMessage: string | null = null;

export async function checkScreenReader() {
  isScreenReaderActive = await AccessibilityInfo.isScreenReaderEnabled();
  return isScreenReaderActive;
}

export async function announce(message: string) {
  if (message === lastMessage) return;
  if (isScreenReaderActive === null) await checkScreenReader();

  if (isScreenReaderActive) {
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(message);
    }, 1000);
    lastMessage = message;
  }
}

export function anunciarCompra(quem: "jogador" | "pc", quantidade: number) {
  const sujeito = quem === "jogador" ? "Você" : "O PC";
  const cartaOuCartas = quantidade === 1 ? "carta" : "cartas";
  const mensagem = `${sujeito} comprou ${quantidade} ${cartaOuCartas}.`;

  announce(mensagem);
}

export function anunciarPunicao(quem: "jogador" | "pc") {
  const mensagem =
    quem === "jogador"
      ? "Você foi punido por não dizer Uno."
      : "O PC foi punido por não dizer Uno.";
  announce(mensagem);
}

export function anunciarCarta(carta: CartaUno, quem: "jogador" | "pc") {
  const nome = quem === "jogador" ? "Você" : "O PC";

  const mensagem = `${nome} jogou ${carta.acaoEspecial ?? carta.numero}${
    carta.cor ? ` da cor ${carta.cor}` : ""
  }`;
  announce(mensagem);
}

export function anunciarCorEscolhida(cartaTopo: CartaUno, corAtual: string) {
  const isCoringa =
    cartaTopo?.acaoEspecial === "coringa" ||
    cartaTopo?.acaoEspecial === "comprarQuatro";

  const mensagem =
    isCoringa && corAtual
      ? `Cor escolhida: ${corAtual}`
      : "Não há carta coringa no topo da pilha.";

  announce(mensagem);
}
