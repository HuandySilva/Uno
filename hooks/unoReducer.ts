import { UnoState } from "../types/UnoState";
import { CartaUno } from "../types/CartaUno";
import { ordenarMao } from "@/utils/gameHelpers";

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
  | { type: "MUDAR_COR"; payload: string }
  | { type: "FINALIZAR_TURNO" }
  | { type: "SET_AGUARDANDO_UNO"; payload: boolean }
  | { type: "SET_UNO"; payload: { quem: "jogador" | "pc"; valor: boolean } }
  | { type: "REEMBARALHAR_HISTORICO"; payload: CartaUno[] }
  | { type: "ORDENAR_MAO"; payload: { tipo: "cor" | "valor" } };

export function unoReducer(state: UnoState, action: Action): UnoState {
  switch (action.type) {
    case "INICIAR_JOGO":
      return action.payload;

    case "JOGAR_CARTA": {
      const { carta, deQuem } = action.payload;

      const ehBloqueio =
        carta.acaoEspecial === "pular" || carta.acaoEspecial === "reverso";
      const ehCoringa =
        carta.acaoEspecial === "coringa" ||
        carta.acaoEspecial === "comprarQuatro";
      const geraAtaque =
        carta.acaoEspecial === "comprarDois" ||
        carta.acaoEspecial === "comprarQuatro";

      return {
        ...state,
        cartaTopo: carta,
        historicoMesa: state.cartaTopo
          ? [...state.historicoMesa, state.cartaTopo]
          : state.historicoMesa,

        maoJogador:
          deQuem === "jogador"
            ? state.maoJogador.filter((c) => c.id !== carta.id)
            : state.maoJogador,
        maoPC:
          deQuem === "pc"
            ? state.maoPC.filter((c) => c.id !== carta.id)
            : state.maoPC,

        vezDoJogador: ehBloqueio ? deQuem === "jogador" : state.vezDoJogador,

        precisaComprar: geraAtaque,

        // Gerencia o status de fluxo
        status: ehCoringa ? "ESCOLHENDO_COR" : "JOGANDO",

        // Reset de estados de turno
        jaComprouNoTurno: false,
        corAtual: ehCoringa ? state.corAtual : null, // Limpa cor anterior se não for coringa
      };
    }

    case "COMPRAR_CARTAS": {
      const { cartas, paraQuem } = action.payload;
      return {
        ...state,
        // Remove as cartas do topo do baralho (final do array)
        baralho: state.baralho.slice(0, state.baralho.length - cartas.length),

        maoJogador:
          paraQuem === "jogador"
            ? [...state.maoJogador, ...cartas]
            : state.maoJogador,
        maoPC: paraQuem === "pc" ? [...state.maoPC, ...cartas] : state.maoPC,

        jaComprouNoTurno: true,
        precisaComprar: false, // O jogador aceitou a punição/compra, limpa o estado
      };
    }

    case "FINALIZAR_TURNO":
      return {
        ...state,
        vezDoJogador: !state.vezDoJogador,
        jaComprouNoTurno: false,
        status: "JOGANDO",
      };

    case "MUDAR_COR":
      return {
        ...state,
        corAtual: action.payload,
        status: "JOGANDO",
        vezDoJogador: !state.vezDoJogador, // Após escolher a cor, a vez passa obrigatoriamente
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

    case "SET_AGUARDANDO_UNO":
      return {
        ...state,
        aguardandoUno: action.payload,
      };

    case "REEMBARALHAR_HISTORICO":
      return {
        ...state,
        baralho: action.payload,
        historicoMesa: [], // Limpa o lixo
      };
    case "ORDENAR_MAO": {
      const { tipo } = action.payload;
      const novaMao = ordenarMao(state.maoJogador, tipo);
      return {
        ...state,
        maoJogador: novaMao,
      };
    }
    default:
      return state;
  }
}
