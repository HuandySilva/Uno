import { useState, useEffect, useRef } from "react";
import { CartaUno } from "../types/CartaUno";
import { AccessibilityInfo } from "react-native";
import { useRouter } from "expo-router"; // se você estiver usando expo-router
import {
  gerarBaralho,
  pcEscolheCor,
  shuffle,
  calcularPontos,
  podeJogar,
  quantosComprar,
  temCartaJogavel,
} from "../utils/gameHelpers";
import {
  playBackgroundMusic,
  playDrawSound,
  playShuffleSound,
  playCardSound,
  playPunishmentSound,
} from "../utils/soundUtils";
import { useGameAnnouncements } from "./useGameAnnouncements";
import { useSettings } from "../context/SettingsContext";

export function useUnoGame() {
  const { musicaAtivada, sonsAtivados } = useSettings();
  const { anunciarCarta, anunciarPunicao, anunciarCompra } =
    useGameAnnouncements();
  const [baralho, setBaralho] = useState<CartaUno[]>([]); // cartas que sobraram no monte
  const [maoJogador, setMaoJogador] = useState<CartaUno[]>([]); // cartas do player
  const [maoPC, setMaoPC] = useState<CartaUno[]>([]); // cartas do computador
  const [cartaTopo, setCartaTopo] = useState<CartaUno | null>(null); // carta atual
  const [vezDoJogador, setVezDoJogador] = useState<boolean>(true); // de quem é a vez
  const [historicoMesa, setHistoricoMesa] = useState<CartaUno[]>([]); // historico de cartas jogadas
  const [corAtual, setCorAtual] = useState<string | null>(null);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [aguardandoCor, setAguardandoCor] = useState(false);
  const [jogadorDisseUno, setJogadorDisseUno] = useState(false);
  const [pcDisseUno, setPcDisseUno] = useState(false);
  const punicaoPorNaoDizerUno = useRef(false);
  const precisaComprar = useRef(false);
  const musicaRef = useRef<any>(null);
  const [jaComprouNoTurno, setJaComprouNoTurno] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const pararMusica = async () => {
      if (musicaRef.current) {
        await musicaRef.current.stopAsync();
        await musicaRef.current.unloadAsync();
        musicaRef.current = null;
      }
    };

    if (jogoIniciado) {
      if (
        maoJogador.length === 0 ||
        maoPC.length === 0 ||
        (baralho.length === 0 && !alguemPodeJogar())
      ) {
        pararMusica(); // Para a música antes de navegar

        if (maoJogador.length === 0 && maoPC.length > 0) {
          router.replace("/WinScreen");
        } else if (maoPC.length === 0 && maoJogador.length > 0) {
          router.replace("/LoseScreen");
        } else {
          router.replace("/DrawScreen");
        }
      }
    }
  }, [maoJogador.length, maoPC.length, baralho.length]);

  useEffect(() => {
    if (!jogoIniciado) return;

    // Punição do jogador
    if (maoJogador.length === 1 && !jogadorDisseUno) {
      playPunishmentSound();
      punicaoPorNaoDizerUno.current = true;
      precisaComprar.current = true;
      anunciarPunicao("jogador");
    }

    // (Opcional) Punição do PC
    if (maoPC.length === 1 && !pcDisseUno) {
      punicaoPorNaoDizerUno.current = true;
      anunciarPunicao("pc");
    }
  }, [maoJogador.length, maoPC.length]);

  useEffect(() => {
    if (!vezDoJogador) {
      const timeout = setTimeout(() => {
        jogadaDoPC();
      }, 800); // pequeno delay pro "pensando..."
      return () => clearTimeout(timeout);
    }
  }, [vezDoJogador, maoPC.length]);

  useEffect(() => {
    const configurarMusica = async () => {
      if (musicaAtivada) {
        musicaRef.current = await playBackgroundMusic();
      }
    };

    configurarMusica();
    iniciarJogo();

    return () => {
      if (musicaRef.current) {
        musicaRef.current.stopAsync();
        musicaRef.current.unloadAsync();
      }
    };
  }, [musicaAtivada]);

  useEffect(() => {
    if (
      cartaTopo?.acaoEspecial === "comprarDois" ||
      cartaTopo?.acaoEspecial == "comprarQuatro"
    ) {
      precisaComprar.current = true;
    }
  }, [cartaTopo]);

  useEffect(() => {
    if (
      cartaTopo?.acaoEspecial === "pular" ||
      cartaTopo?.acaoEspecial === "reverso"
    ) {
      efeitoEspecial();
    }
  }, [cartaTopo]);

  function iniciarJogo() {
    let baralho = gerarBaralho();

    do {
      baralho = shuffle(baralho);
    } while (baralho[baralho.length - 1].acaoEspecial);
    playShuffleSound();
    const vezDoJogador = Math.random() < 0.5;
    setCartaTopo(baralho.pop() || null); // pega a última carta do baralho

    setMaoJogador(baralho.splice(0, 7)); // pega 7 do começo
    setMaoPC(baralho.splice(0, 7)); // pega mais 7
    setBaralho(baralho); // o resto é o monte
    setVezDoJogador(vezDoJogador);
    setJogoIniciado(true);
  }

  function jogarPorIndice(indice: number) {
    console.log("jogada do jogador ja comprou no turno: ", jaComprouNoTurno);
    const carta = maoJogador[indice];
    if (podeJogar(carta, cartaTopo, corAtual, precisaComprar.current)) {
      if (cartaTopo) {
        setHistoricoMesa((prev) => [...prev, cartaTopo]);
      }
      setCartaTopo(carta);
      setMaoJogador((prev) => prev.filter((_, i) => i !== indice));
      playCardSound(carta);
      anunciarCarta(carta, "jogador");
      if (
        carta.acaoEspecial === "coringa" ||
        carta.acaoEspecial === "comprarQuatro"
      ) {
        setAguardandoCor(true);
      } else {
        setCorAtual(null);
        setVezDoJogador(false);
        setJaComprouNoTurno(false);
      }
    } else {
      AccessibilityInfo.announceForAccessibility(
        "Você não pode jogar essa carta!",
      );
    }
  }

  function efeitoEspecial() {
    if (
      cartaTopo?.acaoEspecial === "reverso" ||
      cartaTopo?.acaoEspecial === "pular"
    ) {
      // Inverte novamente, pulando o próximo turno
      setVezDoJogador((prev) => !prev);
    }
  }

  function reembaralharHistorico() {
    if (historicoMesa.length > 0) {
      const novoBaralho = shuffle([...historicoMesa]);

      setBaralho(novoBaralho);
      setHistoricoMesa([]);

      playShuffleSound();
      // announcementUtils.anunciarReembaralhamento();
    }
  }

  function jogadaDoPC() {
    console.log("jogada do pc, ja comprou no turno: ", jaComprouNoTurno);
    const cartaJogavel = maoPC.find((carta) =>
      podeJogar(carta, cartaTopo, corAtual, precisaComprar.current),
    );

    if (cartaJogavel) {
      if (cartaTopo) {
        setHistoricoMesa((prev) => [...prev, cartaTopo]);
      }
      if (
        cartaJogavel.acaoEspecial === "coringa" ||
        cartaJogavel.acaoEspecial === "comprarQuatro"
      ) {
        setCorAtual(pcEscolheCor());
      }
      setCartaTopo(cartaJogavel);
      setMaoPC((prev) => prev.filter((c) => c !== cartaJogavel));
      setVezDoJogador(true); // passa a vez
      setJaComprouNoTurno(false);
      playCardSound(cartaJogavel);
      anunciarCarta(cartaJogavel, "pc");
      if (maoPC.length - 1 === 1) {
        setPcDisseUno(Math.random() < 0.75);
      }
    } else if (baralho.length > 0 && !jaComprouNoTurno) {
      comprar(); // isso vai alterar maoPC, o que reativa o useEffect
    }
  }

  function comprar() {
    if (jaComprouNoTurno) return;

    if (baralho.length === 0) {
      reembaralharHistorico();
      //console.log("Histórico foi embaralhado.");
    }

    const novoBaralho = [...baralho];
    //console.log("novo baralho", novoBaralho);
    const quantidade = quantosComprar(
      cartaTopo,
      punicaoPorNaoDizerUno.current,
      precisaComprar.current,
      historicoMesa,
    );
    //console.log("Número de cartas a comprar:", quantidade);
    const compradas: CartaUno[] = [];
    //console.log(`compradas esta vazio: ${compradas.length === 0}`);
    let i = 0;
    while (novoBaralho.length > 0 && i < quantidade) {
      const carta = novoBaralho.pop();
      if (carta) compradas.push(carta);
      i++;
    }

    //console.log("medida do compradas:", compradas.length);
    setBaralho(novoBaralho);

    playDrawSound();

    if (vezDoJogador) {
      setMaoJogador((prev) => {
        const novaMao = [...prev, ...compradas];

        if (
          !temCartaJogavel(novaMao, cartaTopo, corAtual, precisaComprar.current)
        ) {
          setVezDoJogador(false);
          setJaComprouNoTurno(false);

          //console.log("Caiu no if onde não tem carta jogável");
          //console.log("observer o vez do jogador", vezDoJogador);
        }

        return novaMao;
      });

      anunciarCompra("jogador", quantidade);
      setJogadorDisseUno(false);
    } else {
      setMaoPC((prev) => {
        const novaMao = [...prev, ...compradas];

        if (
          !temCartaJogavel(novaMao, cartaTopo, corAtual, precisaComprar.current)
        ) {
          setVezDoJogador(true);
          setJaComprouNoTurno(false);

          /*console.log(
            "Caiu onde não tem cartas do pc, observe o vez do jogador pra ver se tá correto",
          );
          console.log("vez do jogador:", vezDoJogador);*/
        }

        return novaMao;
      });

      anunciarCompra("pc", quantidade);
      setPcDisseUno(false);
    }

    if (punicaoPorNaoDizerUno.current) {
      punicaoPorNaoDizerUno.current = false;
    }

    precisaComprar.current = false;
    setJaComprouNoTurno(true);

    //console.log("precisa comporar: ", precisaComprar.current);
    //console.log("ja comprou: ", jaComprouNoTurno);
    //console.log("Vez do jogoador: ", vezDoJogador);
  }

  function alguemPodeJogar(): boolean {
    return (
      maoJogador.some((carta) =>
        podeJogar(carta, cartaTopo, corAtual, precisaComprar.current),
      ) ||
      maoPC.some((carta) =>
        podeJogar(carta, cartaTopo, corAtual, precisaComprar.current),
      )
    );
  }

  return {
    maoJogador,
    setMaoJogador,
    maoPC,
    baralho,
    cartaTopo,
    vezDoJogador,
    setVezDoJogador,
    jaComprouNoTurno,
    historicoMesa,
    corAtual,
    setCorAtual,
    jogoIniciado,
    aguardandoCor,
    setAguardandoCor,
    jogadorDisseUno,
    setJogadorDisseUno,
    iniciarJogo,
    jogarPorIndice,
    jogadaDoPC,
    comprar,
    efeitoEspecial,
  };
}
