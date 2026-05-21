import { UnoState } from "@/types/UnoState";
import { RegraExecutora } from "@/types/UnoRules";
import * as TretaHelpers from "@/utils/tretaHelpers";

export const REGRAS_TRETA: Record<string, RegraExecutora> = {
  bomba: (state) => ({
    precisaComprar: true,
    quantidadeParaComprar: 12,
    statusMensagem: "BOOOM! Receba 12 cartas de presente!",
  }),

  // GADO: O oponente é gado e te dá a melhor carta dele de presente
  gado: (state) => {
    // Quem jogou a carta (o malandro) e quem perde (o gado)
    const quemJogou = state.vezDoJogador ? "jogador" : "pc";
    const maoDoGado =
      quemJogou === "jogador" ? [...state.maoPC] : [...state.maoJogador];
    const minhaMao =
      quemJogou === "jogador" ? [...state.maoJogador] : [...state.maoPC];

    // Encontra a melhor carta na mão do "Gado"
    const resultado = TretaHelpers.encontrarMelhorCarta(maoDoGado);

    if (!resultado) {
      return { statusMensagem: "O oponente é gado, mas está sem cartas!" };
    }

    // A Mágica: Remove do gado e coloca na sua mão
    maoDoGado.splice(resultado.indice, 1);
    minhaMao.push(resultado.carta);

    return {
      maoJogador: quemJogou === "jogador" ? minhaMao : maoDoGado,
      maoPC: quemJogou === "pc" ? minhaMao : maoDoGado,
      statusMensagem: `Muuuu! O ${quemJogou === "jogador" ? "PC" : "Jogador"} foi gado e te deu um(a) ${resultado.carta.acaoEspecial || resultado.numero}!`,
    };
  },

  olhar_43: (state) => ({
    bloqueioAcumulado: 3,
    statusMensagem: "Aquele olhar 43... você fica 3 turnos sem jogar!",
  }),

  cachaca: (state) => {
    const efeito = TretaHelpers.sortearEfeitoCachaca();
    return { statusMensagem: `Bebeu cachaça! O efeito foi: ${efeito}` };
  },

  lata_lixo: (state) => {
    const quemJoga = state.vezDoJogador ? "jogador" : "pc";
    const maoDono =
      quemJoga === "jogador" ? [...state.maoJogador] : [...state.maoPC];
    const maoAlvo =
      quemJoga === "jogador" ? [...state.maoPC] : [...state.maoJogador];

    const { cartas, indices } = TretaHelpers.encontrarPioresCartas(maoDono, 2);
    if (cartas.length === 0) return { statusMensagem: "Lata de lixo vazia!" };

    indices.sort((a, b) => b - a).forEach((idx) => maoDono.splice(idx, 1));
    maoAlvo.push(...cartas);

    return {
      maoJogador: quemJoga === "jogador" ? maoDono : maoAlvo,
      maoPC: quemJoga === "pc" ? maoDono : maoAlvo,
      statusMensagem:
        "Lata de lixo! Suas piores cartas agora são do adversário.",
    };
  },

  propina: (state) => {
    const quemJoga = state.vezDoJogador ? "jogador" : "pc";
    const maoAlvo =
      quemJoga === "jogador" ? [...state.maoPC] : [...state.maoJogador];

    const coringaSuborno = {
      id: `propina-${Math.random()}`,
      cor: "preto",
      acaoEspecial: "coringa",
      valorPontos: 50,
    };

    return {
      maoJogador:
        quemJoga === "jogador"
          ? state.maoJogador
          : [...maoAlvo, coringaSuborno],
      maoPC:
        quemJoga === "pc" ? state.maoJogador : [...maoAlvo, coringaSuborno],
      vezDoJogador: quemJoga === "jogador",
      statusMensagem:
        "Propina aceita! Você deu um Coringa e comprou o turno do outro.",
    };
  },
};

export const MAPA_GERAL_DE_REGRAS: Record<
  string,
  Record<string, RegraExecutora>
> = {
  treta: REGRAS_TRETA,
  classico: {},
};
