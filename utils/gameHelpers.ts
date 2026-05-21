import { CartaUno, CorCarta, AcaoEspecial } from "../types/CartaUno";
import { ModoJogoID } from "../context/SettingsContext";
import { CONFIG_MODOS } from "../config/gameModes";
import { MAPA_GERAL_DE_REGRAS } from "@/config/gameRules";

const CORES_VIVAS: CorCarta[] = ["vermelho", "azul", "verde", "amarelo"];
const CORES_ORDEM: CorCarta[] = [...CORES_VIVAS, "preto"];
const ACOES_ORDEM: AcaoEspecial[] = [
  "pular",
  "reverso",
  "comprarDois",
  "coringa",
  "comprarQuatro",
];

function gerarIdUnico(prefixo: string): string {
  return `${prefixo}-${Math.random().toString(36).substring(2, 9)}`;
}

export function gerarBaralho(modo: ModoJogoID = "classico"): CartaUno[] {
  const baralho: CartaUno[] = [];
  // --- 1. GERAÇÃO DO CORPO BÁSICO (UNO PADRÃO) ---
  for (const cor of CORES_VIVAS) {
    // Cartas de 0 a 9
    for (let i = 0; i <= 9; i++) {
      baralho.push({ id: gerarIdUnico(`${cor}-${i}`), cor, numero: i });
      // O zero é a única carta que só tem uma cópia por cor
      if (i !== 0) {
        baralho.push({ id: gerarIdUnico(`${cor}-${i}`), cor, numero: i });
      }
    }

    // Ações Coloridas (Pular, Reverso, +2) - 2 de cada por cor
    const acoesColoridas: AcaoEspecial[] = ["pular", "reverso", "comprarDois"];
    acoesColoridas.forEach((acao) => {
      baralho.push({
        id: gerarIdUnico(`${cor}-${acao}`),
        cor,
        acaoEspecial: acao,
      });
      baralho.push({
        id: gerarIdUnico(`${cor}-${acao}`),
        cor,
        acaoEspecial: acao,
      });
    });
  }

  // Coringas Clássicos (Coringa e +4) - 4 de cada
  for (let i = 0; i < 4; i++) {
    baralho.push({
      id: gerarIdUnico("preto-coringa"),
      cor: "preto",
      acaoEspecial: "coringa",
    });
    baralho.push({
      id: gerarIdUnico("preto-comprarQuatro"),
      cor: "preto",
      acaoEspecial: "comprarQuatro",
    });
  }
  const cartasExtras: AcaoEspecial[] = CONFIG_MODOS[modo] || [];

  if (cartasExtras.length > 0) {
    cartasExtras.forEach((acao) => {
      for (let i = 0; i < 2; i++) {
        baralho.push({
          id: gerarIdUnico(`extra-${modo}-${acao}-${i}`),
          cor: "preto", // Cartas de modo funcionam como coringas (jogáveis sobre qualquer cor)
          acaoEspecial: acao,
        });
      }
    });
  }
  return baralho;
}

export function shuffle(array: CartaUno[]): CartaUno[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export function calcularPontos(mao: CartaUno[]): number {
  return mao.reduce((total, carta) => {
    if (carta.numero !== undefined) return total + carta.numero;
    if (carta.acaoEspecial === "comprarDois") return total + 20;
    if (ehCoringa(carta)) return total + 50;
    return total + 20; // Pular e Reverso valem 20
  }, 0);
}

export function podeJogar(
  carta: CartaUno,
  cartaTopo: CartaUno | null,
  corAtual: string | null,
  precisaComprar: boolean,
  modoAtivo: ModoJogoID,
): boolean {
  // 1. Se não tem nada na mesa (início/reset), qualquer carta vale.
  if (!cartaTopo) return true;

  // 2. BLOQUEIO DE ATAQUE (Sua regra: se precisa comprar, ignora especial)
  if (precisaComprar) {
    // Só deixa passar se for o exato contra-ataque
    if (
      cartaTopo?.acaoEspecial === "comprarDois" &&
      carta?.acaoEspecial === "comprarDois"
    ) {
      return true;
    }
    if (
      cartaTopo?.acaoEspecial === "comprarQuatro" &&
      carta?.acaoEspecial === "comprarQuatro"
    ) {
      return true;
    }
    // Se caiu aqui, não pode jogar mais nada, nem Especial, nem Bomba.
    return false;
  }

  // --- DEBUG START ---
  console.log("=== DEBUG PODE JOGAR ===");
  console.log("Modo Ativo Recebido:", modoAtivo);
  console.log("Ação da Carta Atual:", carta?.acaoEspecial || "Nenhuma");

  const mapaDoModo = MAPA_GERAL_DE_REGRAS[modoAtivo];
  console.log("Mapa do Modo Encontrado?:", !!mapaDoModo);

  if (mapaDoModo) {
    console.log("Regras disponíveis neste modo:", Object.keys(mapaDoModo));
    const regraEspecifica = mapaDoModo[carta.acaoEspecial || ""];
    console.log("Regra específica para esta carta existe?:", !!regraEspecifica);
  } else {
    console.log(
      "ERRO: Modo '" + modoAtivo + "' não existe no MAPA_GERAL_DE_REGRAS!",
    );
  }

  const temRegraEspecial = !!mapaDoModo?.[carta.acaoEspecial || ""];
  console.log("Resultado Final temRegraEspecial:", temRegraEspecial);
  console.log("========================");
  // --- DEBUG END ---

  // 3. SE NÃO ESTÁ SOB ATAQUE, VERIFICAMOS A TRETA
  /*  const temRegraEspecial =
    !!MAPA_GERAL_DE_REGRAS[modoAtivo]?.[carta.acaoEspecial || ""]; */

  if (
    temRegraEspecial ||
    carta?.acaoEspecial === "coringa" ||
    carta?.acaoEspecial === "comprarQuatro"
  ) {
    return true;
  }

  const corDeReferencia = corAtual || cartaTopo.cor;

  const mesmaCor = carta?.cor !== undefined && carta.cor === corDeReferencia;
  const mesmoNumero =
    carta?.numero !== undefined &&
    cartaTopo?.numero !== undefined &&
    carta.numero === cartaTopo.numero;
  const mesmaAcao =
    carta?.acaoEspecial &&
    cartaTopo?.acaoEspecial &&
    carta.acaoEspecial === cartaTopo.acaoEspecial;

  return mesmaCor || mesmoNumero || mesmaAcao;
}

export function quantosComprar(
  topo: CartaUno | null,
  punicaoPorNaoDizerUno: boolean,
  precisaComprar: boolean,
  historicoMesa: CartaUno[],
): number {
  if (punicaoPorNaoDizerUno) return 2;
  if (!topo || !precisaComprar) return 1;

  const acao = topo.acaoEspecial;
  if (acao === "comprarDois" || acao === "comprarQuatro") {
    let acumulado = 0;
    // Percorre o histórico de trás pra frente somando o valor das cartas de compra seguidas
    for (let i = historicoMesa.length - 1; i >= 0; i--) {
      if (historicoMesa[i].acaoEspecial === acao) {
        acumulado += acao === "comprarDois" ? 2 : 4;
      } else {
        break;
      }
    }
    return acumulado || (acao === "comprarDois" ? 2 : 4);
  }

  return 1;
}

export function temCartaJogavel(
  mao: CartaUno[],
  cartaTopo: CartaUno | null,
  corAtual: string | null,
  precisaComprar: boolean,
): boolean {
  return mao.some((c) => podeJogar(c, cartaTopo, corAtual, precisaComprar));
}

export const ordenarMao = (mao: CartaUno[], prioridade: "cor" | "valor") => {
  const calcularRank = (carta: CartaUno) => {
    const corIdx = CORES_ORDEM.indexOf(carta.cor || "preto");
    const valIdx =
      carta.numero ?? ACOES_ORDEM.indexOf(carta.acaoEspecial!) + 10;
    return prioridade === "cor" ? corIdx * 100 + valIdx : valIdx * 100 + corIdx;
  };

  return [...mao].sort((a, b) => calcularRank(a) - calcularRank(b));
};

export function ehCartaDeBloqueio(carta: CartaUno | null): boolean {
  return carta?.acaoEspecial === "pular" || carta?.acaoEspecial === "reverso";
}

export function ehCoringa(carta: CartaUno | null): boolean {
  return (
    carta?.acaoEspecial === "coringa" || carta?.acaoEspecial === "comprarQuatro"
  );
}
