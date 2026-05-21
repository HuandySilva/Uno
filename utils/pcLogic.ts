import { CartaUno, CorCarta } from "@/types/CartaUno";
import { ModoJogoID } from "@/context/SettingsContext";
import { podeJogar, ehCoringa, ehCartaDeBloqueio } from "./gameHelpers";

function obterIndicesValidos(
  mao: CartaUno[],
  cartaTopo: CartaUno | null,
  corAtual: string | null,
  precisaComprar: boolean,
  modoAtivo: ModoJogoID,
): number[] {
  return mao
    .map((carta, index) =>
      podeJogar(carta, cartaTopo, corAtual, precisaComprar, modoAtivo)
        ? index
        : -1,
    )
    .filter((index) => index !== -1);
}

function contarCoresNaMao(mao: CartaUno[]): Record<CorCarta, number> {
  const contagem: Record<CorCarta, number> = {
    vermelho: 0,
    azul: 0,
    verde: 0,
    amarelo: 0,
    preto: 0,
  };

  mao.forEach((carta) => {
    if (carta.cor) {
      contagem[carta.cor]++;
    }
  });

  return contagem;
}

function escolherMelhorCor(mao: CartaUno[]): CorCarta {
  const contagem = contarCoresNaMao(mao);
  let melhorCor: CorCarta = "vermelho";
  let maiorQuantidade = -1;

  (Object.keys(contagem) as CorCarta[]).forEach((cor) => {
    if (cor !== "preto" && contagem[cor] > maiorQuantidade) {
      maiorQuantidade = contagem[cor];
      melhorCor = cor;
    }
  });

  return melhorCor;
}

function selecionarIndicePorPrioridade(
  indices: number[],
  mao: CartaUno[],
): number {
  const acao = indices.filter(
    (i) => ehCartaDeBloqueio(mao[i]) || mao[i].acaoEspecial === "comprarDois",
  );
  if (acao.length > 0) return acao[0];

  const numericas = indices.filter((i) => !mao[i].acaoEspecial);
  if (numericas.length > 0) return numericas[0];

  const coringas = indices.filter((i) => ehCoringa(mao[i]));
  if (coringas.length > 0) return coringas[0];

  return indices[0];
}

export function decidirJogadaPC(
  maoPC: CartaUno[],
  cartaTopo: CartaUno | null,
  corAtual: string | null,
  precisaComprar: boolean,
  modoAtivo: ModoJogoID,
) {
  const indicesValidos = obterIndicesValidos(
    maoPC,
    cartaTopo,
    corAtual,
    precisaComprar,
    modoAtivo,
  );

  if (indicesValidos.length === 0) {
    return { indice: -1, corEscolhida: null };
  }

  const indiceEscolhido = selecionarIndicePorPrioridade(indicesValidos, maoPC);
  const cartaEscolhida = maoPC[indiceEscolhido];

  let corEscolhida: CorCarta | null = null;
  if (ehCoringa(cartaEscolhida)) {
    corEscolhida = escolherMelhorCor(maoPC);
  }

  return {
    indice: indiceEscolhido,
    corEscolhida,
  };
}
