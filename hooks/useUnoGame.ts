import { useState, useEffect, useRef, useReducer } from "react";
import { CartaUno } from "../types/CartaUno";
import { useRouter } from "expo-router"; // se você estiver usando expo-router
import {
  gerarBaralho,
  shuffle,
  calcularPontos,
  podeJogar,
  quantosComprar,
  temCartaJogavel,
} from "../utils/gameHelpers";
import { useGameAnnouncements } from "./useGameAnnouncements";
import * as StatsService from "../utils/StatsUtils";
import { useShakeDetector } from "./useShakeDetector";
import { useUnoAudio } from "./useUnoAudio";
import { unoReducer } from "./unoReducer";
import { UnoState } from "@/types/UnoState";
import { decidirJogadaPC } from "@/utils/pcLogic";
import { ehCartaDeBloqueio, ehCoringa } from "@/utils/gameHelpers";
import { useSettings } from "../context/SettingsContext";

const initialState: UnoState = {
  baralho: [],
  maoJogador: [],
  maoPC: [],
  cartaTopo: null,
  historicoMesa: [],
  vezDoJogador: true,
  corAtual: null,
  precisaComprar: false,
  jaComprouNoTurno: false,
  status: "INICIO",
  aguardandoUno: false,
  jogadorDisseUno: false,
  pcDisseUno: false,
};

export function useUnoGame() {
  const { tocarSom } = useUnoAudio();
  const { anunciarCarta, anunciarPunicao, anunciarCompra, announce } =
    useGameAnnouncements();
  const startTime = useRef<number>(Date.now());
  const totalDrawnInMatch = useRef<number>(0);
  const timerUnoRef = useRef<NodeJS.Timeout | null>(null);
  const finalizouRef = useRef(false);
  const router = useRouter();
  const [state, dispatch] = useReducer(unoReducer, initialState);
  const {
    baralho,
    maoJogador,
    maoPC,
    status,
    cartaTopo,
    vezDoJogador,
    historicoMesa,
    corAtual,
    jaComprouNoTurno,
    precisaComprar,
    aguardandoUno,
    jogadorDisseUno,
  } = state;
  const { modoAtivo } = useSettings();

  useShakeDetector(
    () => finalizarJanelaUno(true), // O que fazer quando balançar
    aguardandoUno, // Só ativa quando estiver no modo "Aguardando Uno"
  );

  useEffect(() => {
    // 1. O Juiz só olha o placar se a bola estiver rolando
    if (status === "JOGANDO" && !finalizouRef.current) {
      const matchDuration = Math.floor((Date.now() - startTime.current) / 1000);

      // Condição A: Jogador venceu
      if (maoJogador.length === 0) {
        finalizarPartida(true, matchDuration, "/WinScreen");
        return; // Para a execução aqui
      }

      // Condição B: PC venceu
      if (maoPC.length === 0) {
        finalizarPartida(false, matchDuration, "/LoseScreen");
        return;
      }

      // O empate foi removido. Se o baralho chegar a 0,
      // a sua função 'comprar' já chama o 'reembaralharHistorico'.
    }
  }, [maoJogador.length, maoPC.length, status]);

  function finalizarPartida(venceu: boolean, duracao: number, rota: any) {
    const pontos = calcularPontos(venceu ? maoPC : maoJogador);

    StatsService.saveMatchResult(
      venceu,
      duracao,
      totalDrawnInMatch.current,
      pontos,
    );

    finalizouRef.current = true;
    tocarSom("ending", venceu ? "winner" : "loser"); // Som de vitória/derrota antes de sair
    router.replace(rota);
  }

  useEffect(() => {
    if (!vezDoJogador) {
      const timeout = setTimeout(() => {
        jogadaDoPC();
      }, 800); // pequeno delay pro "pensando..."
      return () => clearTimeout(timeout);
    }
  }, [vezDoJogador, maoPC.length]);

  useEffect(() => {
    iniciarJogo();
  }, []);

  function aplicarPunicaoUno() {
    tocarSom("punishment");
    anunciarPunicao("jogador");

    const cartasPunicao = baralho.slice(-2);

    dispatch({
      type: "COMPRAR_CARTAS",
      payload: {
        cartas: cartasPunicao,
        paraQuem: "jogador",
      },
    });

    dispatch({ type: "SET_AGUARDANDO_UNO", payload: false });
  }

  function finalizarJanelaUno(disseUno: boolean) {
    // 1. Limpa o timer (isso continua sendo via Ref, pois é um recurso do sistema)
    if (timerUnoRef.current) {
      clearTimeout(timerUnoRef.current);
      timerUnoRef.current = null;
    }

    // 2. Avisa ao Reducer que a janela fechou
    dispatch({ type: "SET_AGUARDANDO_UNO", payload: false });

    if (disseUno) {
      // 3. Sucesso: O jogador foi rápido o suficiente
      dispatch({ type: "SET_UNO", payload: { quem: "jogador", valor: true } });

      tocarSom("uno");
      announce("Uno registrado com sucesso!");
    } else {
      // 4. Falha: O tempo acabou ou ele esqueceu
      aplicarPunicaoUno();
    }
  }

  function iniciarJanelaUno() {
    // 1. Limpa qualquer timer anterior (segurança)
    if (timerUnoRef.current) clearTimeout(timerUnoRef.current);

    dispatch({ type: "SET_AGUARDANDO_UNO", payload: true });
    dispatch({ type: "SET_UNO", payload: { quem: "jogador", valor: false } });

    timerUnoRef.current = setTimeout(() => {
      finalizarJanelaUno(false); // Se o tempo acabar, chama a punição
    }, 5000);
  }

  function iniciarJogo() {
    finalizouRef.current = false;
    startTime.current = Date.now();
    totalDrawnInMatch.current = 0;

    let novoBaralho = gerarBaralho(modoAtivo);
    do {
      novoBaralho = shuffle(novoBaralho);
    } while (novoBaralho[novoBaralho.length - 1].numero);

    tocarSom("shuffle");

    // Pegamos as fatias do baralho
    const maoJogadorInicial = novoBaralho.splice(0, 7);
    const maoPCInicial = novoBaralho.splice(0, 7);
    const primeiraCarta = novoBaralho.pop() || null;

    // O Juiz (Reducer) recebe tudo de uma vez
    dispatch({
      type: "INICIAR_JOGO",
      payload: {
        ...initialState,
        baralho: novoBaralho,
        maoJogador: maoJogadorInicial,
        maoPC: maoPCInicial,
        cartaTopo: primeiraCarta,
        vezDoJogador: Math.random() < 0.5,
        status: "JOGANDO",
      },
    });
  }

  function jogarPorIndice(indice: number) {
    const carta = maoJogador[indice];

    if (podeJogar(carta, cartaTopo, corAtual, precisaComprar, modoAtivo)) {
      // --- EFEITOS LATERAIS (SOM, VOZ E ESTATÍSTICA) ---
      tocarSom("card", carta);
      anunciarCarta(carta, "jogador");

      StatsService.trackCardPlay(!!carta.acaoEspecial);

      dispatch({
        type: "JOGAR_CARTA",
        payload: { carta, deQuem: "jogador" },
      });

      if (maoJogador.length === 2) {
        iniciarJanelaUno();
      }
      const ehBloqueio =
        carta.acaoEspecial === "pular" || carta.acaoEspecial === "reverso";

      if (
        carta.acaoEspecial !== "coringa" &&
        carta.acaoEspecial !== "comprarQuatro" &&
        !ehBloqueio
      ) {
        dispatch({ type: "FINALIZAR_TURNO" });
      }
    }
  }

  function reembaralharHistorico() {
    if (historicoMesa.length > 0) {
      const novoBaralho = shuffle([...historicoMesa]);

      dispatch({ type: "REEMBARALHAR_HISTORICO", payload: novoBaralho });

      tocarSom("shuffle");
    }
  }

  function jogadaDoPC() {
    const { indice, corEscolhida } = decidirJogadaPC(
      maoPC,
      cartaTopo,
      corAtual,
      precisaComprar,
      modoAtivo,
    );

    if (indice !== -1) {
      const cartaJogavel = maoPC[indice];

      if (corEscolhida) {
        dispatch({ type: "MUDAR_COR", payload: corEscolhida });
      }

      dispatch({
        type: "JOGAR_CARTA",
        payload: { carta: cartaJogavel, deQuem: "pc" },
      });

      tocarSom("card", cartaJogavel);
      anunciarCarta(cartaJogavel, "pc");
      StatsService.trackCardPlay(!!cartaJogavel.acaoEspecial);

      if (maoPC.length === 2) {
        const disseUno = Math.random() < 0.75;
        dispatch({ type: "SET_UNO", payload: { quem: "pc", valor: disseUno } });
        if (disseUno) tocarSom("uno");
      }

      if (!ehCartaDeBloqueio(cartaJogavel)) {
        dispatch({ type: "FINALIZAR_TURNO" });
      }
    } else if (baralho.length > 0 && !jaComprouNoTurno) {
      comprar();
    }
  }

  function comprar() {
    if (jaComprouNoTurno) return;

    if (baralho.length === 0) {
      reembaralharHistorico();
    }

    const quantidade = quantosComprar(
      cartaTopo,
      false,
      precisaComprar,
      historicoMesa,
    );
    const compradas = baralho.slice(-quantidade);
    const quem = vezDoJogador ? "jogador" : "pc";

    dispatch({
      type: "COMPRAR_CARTAS",
      payload: { cartas: compradas, paraQuem: quem },
    });

    tocarSom("draw");
    anunciarCompra(quem, quantidade);

    // Reseta o estado de Uno para quem comprou
    dispatch({ type: "SET_UNO", payload: { quem, valor: false } });

    if (vezDoJogador) totalDrawnInMatch.current += quantidade;

    // Lógica de Verificação de Jogada
    const maoAtualizada = vezDoJogador
      ? [...maoJogador, ...compradas]
      : [...maoPC, ...compradas];
    const temJogada = temCartaJogavel(
      maoAtualizada,
      cartaTopo,
      corAtual,
      false,
    );

    if (!temJogada) {
      dispatch({ type: "FINALIZAR_TURNO" });
      return;
    }
  }

  function desistirPartida() {
    const duracao = Math.floor((Date.now() - startTime.current) / 1000);

    StatsService.saveMatchResult(false, duracao, totalDrawnInMatch.current, 0);

    if (timerUnoRef.current) {
      clearTimeout(timerUnoRef.current);
    }

    announce("Partida encerrada. Retornando ao menu principal.");
    router.replace("/");
  }

  return {
    maoJogador,
    maoPC,
    baralho,
    cartaTopo,
    vezDoJogador,
    jaComprouNoTurno,
    historicoMesa,
    corAtual,
    status,
    aguardandoUno,
    jogadorDisseUno,
    iniciarJogo,
    jogarPorIndice,
    jogadaDoPC,
    comprar,
    precisaComprar,
    desistirPartida,
    dispatch,
  };
}
