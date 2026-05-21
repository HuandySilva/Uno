import { UnoState } from "../types/UnoState";
import { CartaUno, CorCarta } from "../types/CartaUno";
import { ordenarMao, ehCartaDeBloqueio, ehCoringa } from "@/utils/gameHelpers";
import { MAPA_GERAL_DE_REGRAS } from "@/config/gameRules";
import * as TretaHelpers from "@/utils/tretaHelpers";

type Action =
  | { type: "INICIAR_JOGO"; payload: UnoState }
  | {
      type: "JOGAR_CARTA";
      payload: { carta: CartaUno; deQuem: "jogador" | "pc" };
    }
  | {
      type: "COMPRAR_CARTAS";
      payload: { cartas: CartaUno[]; paraQuem: "jogador" | "pc" };
    }
  | { type: "MUDAR_COR"; payload: CorCarta }
  | { type: "FINALIZAR_TURNO" }
  | { type: "SET_AGUARDANDO_UNO"; payload: boolean }
  | { type: "SET_UNO"; payload: { quem: "jogador" | "pc"; valor: boolean } }
  | { type: "REEMBARALHAR_HISTORICO"; payload: CartaUno[] }
  | { type: "ORDENAR_MAO"; payload: { tipo: "cor" | "valor" } }
  | { type: "LIMPAR_STATUS" };

export function unoReducer(state: UnoState, action: Action): UnoState {
  switch (action.type) {
    case "INICIAR_JOGO":
      return action.payload;

    case "JOGAR_CARTA": {
      const { carta, deQuem } = action.payload;
      const modo = state.modoAtivo || "classico";
      const acao = carta.acaoEspecial || "";

      // 1. BUSCA REGRA MODULAR (Strategy Pattern)
      // O Reducer não sabe o que a carta faz, ele pergunta para o Mapa do Modo
      const executarRegra = MAPA_GERAL_DE_REGRAS[modo]?.[acao];
      let mudancasTreta = executarRegra ? executarRegra(state) : {};

      // 2. LÓGICA DO GADO (Roubo de melhor carta)
      // Executamos aqui porque precisamos manipular as duas mãos ao mesmo tempo
      if (acao === "gado") {
        const maoAlvo = deQuem === "jogador" ? state.maoPC : state.maoJogador;
        const resultado = TretaHelpers.encontrarMelhorCarta(maoAlvo);

        if (resultado) {
          const novaMaoAlvo = [...maoAlvo];
          novaMaoAlvo.splice(resultado.indice, 1);

          const minhaMao =
            deQuem === "jogador" ? state.maoJogador : state.maoPC;
          // Removemos a carta Gado que acabou de ser jogada da mão do dono
          const minhaMaoSemGado = minhaMao.filter((c) => c.id !== carta.id);
          const minhaMaoComRoubo = [...minhaMaoSemGado, resultado.carta];

          mudancasTreta = {
            ...mudancasTreta,
            maoJogador: deQuem === "jogador" ? minhaMaoComRoubo : novaMaoAlvo,
            maoPC: deQuem === "pc" ? minhaMaoComRoubo : novaMaoAlvo,
            statusMensagem: `Muuuu! ${deQuem === "jogador" ? "Você" : "O PC"} roubou a melhor carta!`,
          };
        }
      }

      // 3. DEFINIÇÃO DE ESTADOS DE JOGO
      const bloqueio = ehCartaDeBloqueio(carta);
      const coringa = ehCoringa(carta);

      // Ataque: se for +2/+4 OU se a regra de treta (Bomba) mandou comprar
      const ataque =
        carta.acaoEspecial === "comprarDois" ||
        carta.acaoEspecial === "comprarQuatro" ||
        !!mudancasTreta.precisaComprar;

      return {
        ...state,
        ...mudancasTreta,
        cartaTopo: carta,
        historicoMesa: state.cartaTopo
          ? [...state.historicoMesa, state.cartaTopo]
          : state.historicoMesa,

        // Gerencia as mãos (Prioriza se a regra de Treta já alterou, senão faz o filter padrão)
        maoJogador:
          mudancasTreta.maoJogador ||
          (deQuem === "jogador"
            ? state.maoJogador.filter((c) => c.id !== carta.id)
            : state.maoJogador),
        maoPC:
          mudancasTreta.maoPC ||
          (deQuem === "pc"
            ? state.maoPC.filter((c) => c.id !== carta.id)
            : state.maoPC),

        // No 1v1, bloqueio e Olhar 43 mantêm o turno com quem jogou
        vezDoJogador:
          bloqueio || mudancasTreta.bloqueioAcumulado
            ? deQuem === "jogador"
            : state.vezDoJogador,

        precisaComprar: ataque,
        status: coringa ? "ESCOLHENDO_COR" : "JOGANDO",
        jaComprouNoTurno: false,
        corAtual: coringa
          ? state.corAtual
          : carta.cor !== "preto"
            ? carta.cor
            : state.corAtual,
      };
    }

    case "COMPRAR_CARTAS": {
      const { cartas, paraQuem } = action.payload;
      return {
        ...state,
        baralho: state.baralho.slice(0, state.baralho.length - cartas.length),
        maoJogador:
          paraQuem === "jogador"
            ? [...state.maoJogador, ...cartas]
            : state.maoJogador,
        maoPC: paraQuem === "pc" ? [...state.maoPC, ...cartas] : state.maoPC,
        jaComprouNoTurno: true,
        precisaComprar: false,
        quantidadeParaComprar: 0, // Reset após a bomba explodir
      };
    }

    case "FINALIZAR_TURNO": {
      // REGRA DO OLHAR 43 (Hipnose)
      // Se houver bloqueio sobrando, subtrai 1 e NÃO troca a vez
      if (state.bloqueioAcumulado && state.bloqueioAcumulado > 0) {
        return {
          ...state,
          bloqueioAcumulado: state.bloqueioAcumulado - 1,
          jaComprouNoTurno: false,
          status: "JOGANDO",
          // vezDoJogador fica como está!
        };
      }

      // Turno normal: apenas inverte a vez
      return {
        ...state,
        vezDoJogador: !state.vezDoJogador,
        jaComprouNoTurno: false,
        status: "JOGANDO",
      };
    }

    case "MUDAR_COR":
      return {
        ...state,
        corAtual: action.payload,
        status: "JOGANDO",
        vezDoJogador: !state.vezDoJogador,
      };

    case "SET_UNO":
      return {
        ...state,
        jogadorDisseUno:
          action.payload.quem === "jogador"
            ? action.payload.valor
            : state.jogadorDisseUno,
        pcDisseUno:
          action.payload.quem === "pc"
            ? action.payload.valor
            : state.pcDisseUno,
      };

    case "ORDENAR_MAO":
      return {
        ...state,
        maoJogador: ordenarMao(state.maoJogador, action.payload.tipo),
      };

    case "REEMBARALHAR_HISTORICO":
      return { ...state, baralho: action.payload, historicoMesa: [] };

    case "SET_AGUARDANDO_UNO":
      return { ...state, aguardandoUno: action.payload };

    case "LIMPAR_STATUS":
      return { ...state, statusMensagem: undefined };

    default:
      return state;
  }
}
