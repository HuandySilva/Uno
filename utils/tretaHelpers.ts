import { CartaUno } from "../types/CartaUno";
import { UnoState } from "../types/UnoState";

/**
 * Lógica do GADO: Encontra a carta com maior valor de pontos na mão.
 * Se houver empate, pega a primeira que encontrar.
 */
export const encontrarMelhorCarta = (
  mao: CartaUno[],
): { carta: CartaUno; indice: number } | null => {
  if (mao.length === 0) return null;

  let melhorIndice = 0;
  for (let i = 1; i < mao.length; i++) {
    if ((mao[i].valorPontos || 0) > (mao[melhorIndice].valorPontos || 0)) {
      melhorIndice = i;
    }
  }

  return { carta: mao[melhorIndice], indice: melhorIndice };
};

/**
 * Lógica da CACHAÇA: Retorna uma ação aleatória para o jogador.
 * Pode ser 'comprar', 'pular' ou 'jogar_aleatoria'.
 */
export const sortearEfeitoCachaca = () => {
  const efeitos = ["comprar", "pular", "jogar_aleatoria"];
  return efeitos[Math.floor(Math.random() * efeitos.length)];
};

/**
 * Helper para o OLHAR 43: Gerencia a contagem de turnos bloqueados.
 */
export const atualizarBloqueioOlhar43 = (bloqueioAtual: number): number => {
  return Math.max(0, bloqueioAtual - 1);
};

/**
 * Lógica da LATA DE LIXO: Encontra as X cartas com maiores valores numéricos.
 */
export const encontrarPioresCartas = (
  mao: CartaUno[],
  quantidade: number,
): { cartas: CartaUno[]; indices: number[] } => {
  // Filtramos apenas as que têm número e ordenamos do maior para o menor
  const numericas = mao
    .map((c, index) => ({ ...c, indexOriginal: index }))
    .filter((c) => c.numero !== undefined)
    .sort((a, b) => (b.numero || 0) - (a.numero || 0));

  const selecionadas = numericas.slice(0, quantidade);

  return {
    cartas: selecionadas.map((c) => ({ ...c, indexOriginal: undefined })), // Limpa o helper
    indices: selecionadas.map((c) => c.indexOriginal).sort((a, b) => b - a), // Ordena decrescente para o splice não quebrar
  };
};
