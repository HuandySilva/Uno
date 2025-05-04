import { useState, useEffect, useRef, act } from "react";
import { CartaUno } from "../types/CartaUno";
import { AccessibilityInfo } from "react-native";
import { useRouter } from "expo-router"; // se você estiver usando expo-router
import {
  pcEscolheCor,
  gerarBaralho,
  shuffle,
  calcularPontos,
  podeJogar,
  quantosComprar,
} from "../utils/gameHelpers";
import {
  playBackgroundMusic,
  playDrawSound,
  playShuffleSound,
  playCardSound,
  playPunishmentSound,
} from "../utils/soundUtils";
import {
  anunciarCarta,
  anunciarPunicao,
  anunciarCompra,
} from "../utils/announcementUtils";

export function useUnoGame() {
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
  const router = useRouter();

  useEffect(() => {
    if (jogoIniciado) {
      if (maoJogador.length === 0 && maoPC.length > 0) {
        router.replace("/WinScreen");
      } else if (maoPC.length === 0 && maoJogador.length > 0) {
        router.replace("/LoseScreen");
      } else if (maoJogador.length === 0 && maoPC.length === 0) {
        router.replace("/DrawScreen");
      } else if (baralho.length === 0 && !alguemPodeJogar()) {
        // Baralho acabou e ninguém venceu = empate
        router.replace("/DrawScreen");
      }
    }
  }, [maoJogador, maoPC, baralho]);

  useEffect(() => {
    if (!jogoIniciado) return;

    // Punição do jogador
    if (maoJogador.length === 1 && !jogadorDisseUno) {
      playPunishmentSound();
      punicaoPorNaoDizerUno.current = true;
      comprar();
      anunciarPunicao("jogador");
    }

    // (Opcional) Punição do PC
    if (maoPC.length === 1 && !pcDisseUno) {
      punicaoPorNaoDizerUno.current = true;
      comprar();
      anunciarPunicao("pc");
    }
  }, [maoJogador, maoPC]);

  useEffect(() => {
    if (!vezDoJogador) {
      const timeout = setTimeout(() => {
        jogadaDoPC();
      }, 800); // pequeno delay pro "pensando..."
      return () => clearTimeout(timeout);
    }
  }, [maoPC, vezDoJogador]);

  useEffect(() => {
    const backgroundMusic = playBackgroundMusic();
    iniciarJogo();
  }, []);

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
      }
    } else {
      AccessibilityInfo.announceForAccessibility(
        "Você não pode jogar essa carta!"
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

  function jogadaDoPC() {
    const cartaJogavel = maoPC.find((carta) =>
      podeJogar(carta, cartaTopo, corAtual, precisaComprar.current)
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
      playCardSound(cartaJogavel);
      anunciarCarta(cartaJogavel, "pc");
      if (maoPC.length - 1 === 1) {
        setPcDisseUno(Math.random() < 0.75);
      }
    } else if (baralho.length > 0) {
      comprar(); // isso vai alterar maoPC, o que reativa o useEffect
    } else {
      setVezDoJogador(true); // baralho acabou, PC passa a vez
    }
  }

  function comprar() {
    if (!baralho || baralho.length === 0) return;

    const novoBaralho = [...baralho];
    const quantidade = quantosComprar(
      cartaTopo,
      punicaoPorNaoDizerUno.current,
      precisaComprar.current,
      historicoMesa
    );
    const compradas: CartaUno[] = [];

    let i = 0;
    while (novoBaralho.length > 0 && i < quantidade) {
      const carta = novoBaralho.pop();
      if (carta) compradas.push(carta);
      i++;
    }

    setBaralho(novoBaralho);
    playDrawSound();
    if (vezDoJogador) {
      setMaoJogador((prev) => [...prev, ...compradas]);
      anunciarCompra("jogador", quantidade);
      setJogadorDisseUno(false);
    } else {
      setMaoPC((prev) => [...prev, ...compradas]);
      anunciarCompra("pc", quantidade);
      setPcDisseUno(false);
    }
    if (punicaoPorNaoDizerUno.current) {
      punicaoPorNaoDizerUno.current = false;
    }
    precisaComprar.current = false;
  }

  function alguemPodeJogar(): boolean {
    return (
      maoJogador.some((carta) =>
        podeJogar(carta, cartaTopo, corAtual, precisaComprar.current)
      ) ||
      maoPC.some((carta) =>
        podeJogar(carta, cartaTopo, corAtual, precisaComprar.current)
      )
    );
  }

  return {
    maoJogador,
    maoPC,
    baralho,
    cartaTopo,
    vezDoJogador,
    setVezDoJogador,
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
