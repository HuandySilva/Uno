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
      baralho.push({ cor, numero: i });
      if (i !== 0) baralho.push({ cor, numero: i }); // duas de cada, exceto o 0
    }

    baralho.push({ cor, acaoEspecial: "pular" });
    baralho.push({ cor, acaoEspecial: "pular" });

    baralho.push({ cor, acaoEspecial: "reverso" });
    baralho.push({ cor, acaoEspecial: "reverso" });

    baralho.push({ cor, acaoEspecial: "comprarDois" });
    baralho.push({ cor, acaoEspecial: "comprarDois" });
  }

  // coringas pretos
  for (let i = 0; i < 4; i++) {
    baralho.push({ cor: "preto", acaoEspecial: "coringa" });
    baralho.push({ cor: "preto", acaoEspecial: "comprarQuatro" });
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
  precisaComprar: boolean
): boolean {
  if (!cartaTopo) return false;

  if (precisaComprar) {
    if (
      cartaTopo?.acaoEspecial === "comprarDois" &&
      carta?.acaoEspecial === "comprarDois"
    ) {
      console.log(
        `carta: ${carta?.cor} ${carta?.numero}, ${carta?.acaoEspecial}`
      );
      console.log(
        `Carta topo: ${cartaTopo?.cor} ${cartaTopo?.numero} ${cartaTopo?.acaoEspecial}`
      );
      return true;
    }

    if (
      cartaTopo?.acaoEspecial === "comprarQuatro" &&
      carta?.acaoEspecial === "comprarQuatro"
    ) {
      console.log(
        `carta: ${carta?.cor} ${carta?.numero}, ${carta?.acaoEspecial}`
      );
      console.log(
        `Carta topo: ${cartaTopo?.cor} ${cartaTopo?.numero} ${cartaTopo?.acaoEspecial}`
      );
      console.log(`pode jogar: true`);
      return true;
    }

    console.log(
      `carta: ${carta?.cor} ${carta?.numero}, ${carta?.acaoEspecial}`
    );
    console.log(
      `Carta topo: ${cartaTopo?.cor} ${cartaTopo?.numero} ${cartaTopo?.acaoEspecial}`
    );
    console.log(`pode jogar: false`);
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

  console.log(
    `Carta topo: ${cartaTopo?.cor} ${cartaTopo?.numero} ${cartaTopo?.acaoEspecial}`
  );

  return podeJoga;
}

export function quantosComprar(
  topo: CartaUno | null,
  punicaoPorNaoDizerUno: boolean,
  precisaComprar: boolean,
  historicoMesa: CartaUno[]
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
