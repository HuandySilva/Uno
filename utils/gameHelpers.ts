import { CartaUno } from "../types/CartaUno";
import { AccessibilityInfo } from "react-native";

export function pcEscolheCor(): string {
  const cores = ["azul", "amarelo", "vermelho", "verde"];
  return cores[Math.floor(Math.random() * cores.length)];
}

export function gerarBaralho(): CartaUno[] {
  const cores = ["vermelho", "amarelo", "verde", "azul"] as const;
  const baralho: CartaUno[] = [];

  for (const cor of cores) {
    for (let i = 0; i <= 9; i++) {
      baralho.push({ id: gerarIdUnico(`${cor}-${i}`), cor, numero: i });
      if (i !== 0) {
        baralho.push({ id: gerarIdUnico(`${cor}-${i}`), cor, numero: i });
      } // duas de cada, exceto o 0
    }

    baralho.push({
      id: gerarIdUnico(`${cor}-pular`),
      cor,
      acaoEspecial: "pular",
    });
    baralho.push({
      id: gerarIdUnico(`${cor}-pular`),
      cor,
      acaoEspecial: "pular",
    });

    baralho.push({
      id: gerarIdUnico(`${cor}-reverso`),
      cor,
      acaoEspecial: "reverso",
    });
    baralho.push({
      id: gerarIdUnico(`${cor}-reverso`),
      cor,
      acaoEspecial: "reverso",
    });

    baralho.push({
      id: gerarIdUnico(`${cor}-comprarDois`),
      cor,
      acaoEspecial: "comprarDois",
    });
    baralho.push({
      id: gerarIdUnico(`${cor}-comprarDois`),
      cor,
      acaoEspecial: "comprarDois",
    });
  }
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

  return baralho;
}

export function shuffle(array: CartaUno[]): CartaUno[] {
  const baralhoEmbaralhado: CartaUno[] = [];
  const copia = [...array];

  while (copia.length !== 0) {
    const i = Math.floor(Math.random() * copia.length);
    baralhoEmbaralhado.push(copia[i]);
    copia.splice(i, 1);
  }

  return baralhoEmbaralhado;
}

export function calcularPontos(mao: CartaUno[]): number {
  let total = 0;

  for (const carta of mao) {
    if (carta.numero !== undefined) {
      total += carta.numero;
    }

    switch (carta.acaoEspecial) {
      case "comprarDois":
        total += 20;
        break;
      case "comprarQuatro":
      case "coringa":
        total += 50;
        break;
    }
  }

  return total;
}

export function podeJogar(
  carta: CartaUno,
  cartaTopo: CartaUno | null,
  corAtual: string | null,
  precisaComprar: boolean,
): boolean {
  if (!cartaTopo) return false;

  if (precisaComprar) {
    if (
      cartaTopo?.acaoEspecial === "comprarDois" &&
      carta?.acaoEspecial === "comprarDois"
    ) {
      /*console.log(
        `carta: ${carta?.cor} ${carta?.numero}, ${carta?.acaoEspecial}`,
      );*/
      /*console.log(
        `Carta topo: ${cartaTopo?.cor} ${cartaTopo?.numero} ${cartaTopo?.acaoEspecial}`,
      );*/
      return true;
    }

    if (
      cartaTopo?.acaoEspecial === "comprarQuatro" &&
      carta?.acaoEspecial === "comprarQuatro"
    ) {
      /*console.log(
        `carta: ${carta?.cor} ${carta?.numero}, ${carta?.acaoEspecial}`,
      );
      console.log(
        `Carta topo: ${cartaTopo?.cor} ${cartaTopo?.numero} ${cartaTopo?.acaoEspecial}`,
      );
      console.log(`pode jogar: true`);*/
      return true;
    }

    /*console.log(
      `carta: ${carta?.cor} ${carta?.numero}, ${carta?.acaoEspecial}`,
    );
    console.log(
      `Carta topo: ${cartaTopo?.cor} ${cartaTopo?.numero} ${cartaTopo?.acaoEspecial}`,
    );
    console.log(`pode jogar: false`);*/
    return false;
  }

  let podeJoga = false;

  if (
    carta?.numero !== undefined &&
    cartaTopo?.numero !== undefined &&
    carta.numero === cartaTopo.numero
  ) {
    podeJoga = true;
  }

  if (
    carta?.cor !== undefined &&
    cartaTopo?.cor !== undefined &&
    carta.cor === cartaTopo.cor
  ) {
    podeJoga = true;
  }

  if (carta?.acaoEspecial === "coringa") {
    podeJoga = true;
  }

  if (carta?.acaoEspecial === "comprarQuatro") {
    podeJoga = true;
  }

  if (
    carta?.acaoEspecial &&
    cartaTopo?.acaoEspecial &&
    carta.acaoEspecial === cartaTopo.acaoEspecial
  ) {
    podeJoga = true;
  }

  if (
    cartaTopo?.acaoEspecial &&
    (cartaTopo.acaoEspecial === "coringa" ||
      cartaTopo.acaoEspecial === "comprarQuatro") &&
    corAtual !== null &&
    carta?.cor !== undefined &&
    carta.cor === corAtual
  ) {
    podeJoga = true;
  }

  /*console.log(
    `Carta topo: ${cartaTopo?.cor} ${cartaTopo?.numero} ${cartaTopo?.acaoEspecial}`,
  );*/

  return podeJoga;
}

export function quantosComprar(
  topo: CartaUno | null,
  punicaoPorNaoDizerUno: boolean,
  precisaComprar: boolean,
  historicoMesa: CartaUno[],
): number {
  if (!topo) return 1;
  if (punicaoPorNaoDizerUno) return 2;

  const acao = topo.acaoEspecial;

  if ((acao === "comprarDois" || acao === "comprarQuatro") && precisaComprar) {
    let fatorMultiplicador = 1;
    let i = historicoMesa.length - 1;

    while (i >= 0 && historicoMesa[i].acaoEspecial === acao) {
      fatorMultiplicador++;
      i--;
    }
    return (acao === "comprarDois" ? 2 : 4) * fatorMultiplicador;
  }

  return 1;
}

export function temCartaJogavel(
  mao: CartaUno[],
  cartaTopo: CartaUno | null,
  corAtual: string | null,
  precisaComprar: boolean,
): boolean {
  if (!cartaTopo) return false;

  return mao.some((carta) =>
    podeJogar(carta, cartaTopo, corAtual, precisaComprar),
  );
}

const CORES_ORDEM = ["vermelho", "azul", "verde", "amarelo", "preto"];
const ACOES_ORDEM = [
  "pular",
  "reverso",
  "comprarDois",
  "coringa",
  "comprarQuatro",
];

// Cria um mapa de valor único para cada carta: (Peso da Cor * 100) + Valor
// Isso gera um ranking numérico fixo para cada combinação de carta.
const calcularRank = (carta: CartaUno, prioridade: "cor" | "valor") => {
  const corIdx = CORES_ORDEM.indexOf(carta.cor || "preto");
  const valIdx = carta.numero ?? ACOES_ORDEM.indexOf(carta.acaoEspecial!) + 10;

  return prioridade === "cor" ? corIdx * 100 + valIdx : valIdx * 100 + corIdx;
};

export const ordenarMao = (mao: CartaUno[], tipo: "cor" | "valor") => {
  return [...mao].sort((a, b) => calcularRank(a, tipo) - calcularRank(b, tipo));
};

export function ehCartaDeBloqueio(carta: CartaUno | null): boolean {
  if (!carta) return false;
  return carta.acaoEspecial === "pular" || carta.acaoEspecial === "reverso";
}

export function ehCoringa(carta: CartaUno | null): boolean {
  if (!carta) return false;
  return (
    carta.acaoEspecial === "coringa" || carta.acaoEspecial === "comprarQuatro"
  );
}
function gerarIdUnico(prefixo: string): string {
  return `${prefixo}-${Math.random().toString(36).substring(2, 9)}`;
}
