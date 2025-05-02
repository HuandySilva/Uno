import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { AccessibilityInfo } from "react-native";
import { useState, useEffect } from "react";
import { useUnoGame } from "@/hooks/useUnoGame";
import { Picker } from "@react-native-picker/picker";
import HistoricoMesa from "@/components/HistoricoMesa";
import PopupEscolherCor from "@/components/PopupEscolherCor";
import ChooseCard from "@/components/ChooseCard";
import ChosenColorBanner from "@/components/ChosenColorBanner";
import { playUnoSound } from "../utils/soundUtils";
export default function GameScreen() {
  const {
    maoJogador,
    maoPC,
    cartaTopo,
    historicoMesa,
    vezDoJogador,
    setVezDoJogador,
    corAtual,
    baralho,
    jogoIniciado,
    setCorAtual, // 👈 Ative aqui quando quiser usar!
    aguardandoCor,
    setAguardandoCor,
    jogadorDisseUno,
    setJogadorDisseUno,
    iniciarJogo,
    jogarPorIndice,
    jogadaDoPC,
    comprar,
    efeitoEspecial,
  } = useUnoGame();

  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mostrarBannerCor, setMostrarBannerCor] = useState(false);

  useEffect(() => {
    if (aguardandoCor && vezDoJogador) {
      setMostrarPopup(true);
      setAguardandoCor(false); // zera pra não repetir
    }
  }, [aguardandoCor, vezDoJogador]);

  useEffect(() => {
    if (
      (corAtual && cartaTopo?.acaoEspecial === "coringa") ||
      cartaTopo?.acaoEspecial === "comprarQuatro"
    ) {
      setMostrarBannerCor(true);
    }
  }, [corAtual]);

  function escolherCor(cor: string) {
    setCorAtual(cor); // 👈 Ative isso quando precisar!
    setMostrarPopup(false);
    setVezDoJogador(false);
  }

  function anunciarCorEscolhida() {
    const isCoringa =
      cartaTopo?.acaoEspecial === "coringa" ||
      cartaTopo?.acaoEspecial === "comprarQuatro";

    const mensagem =
      isCoringa && corAtual
        ? `Cor escolhida: ${corAtual}`
        : "Não há carta coringa no topo da pilha.";

    console.log("[anúncio de cor]", mensagem);

    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(mensagem);
    }, 1000);
  }

  const handleComprar = () => {
    comprar();

    // Aguarda um pequeno tempo pro estado atualizar
    setTimeout(() => {}, 200); // 200ms geralmente é suficiente pra esperar o estado atualizar
  };

  const verCartasJogador = () => {
    const mensagem = `Você tem ${maoJogador.length} cartas.`;
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(mensagem);
    }, 1000);
  };

  const verCartasPC = () => {
    const mensagem = `O pc tem ${maoPC.length} cartas.`;
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(mensagem);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carta no topo:</Text>
      {cartaTopo && (
        <Text style={styles.cartaTopo}>
          {cartaTopo.acaoEspecial ?? cartaTopo.numero} ({cartaTopo.cor})
        </Text>
      )}

      {mostrarBannerCor && (
        <ChosenColorBanner
          cor={corAtual ?? ""}
          onDesaparecer={() => setMostrarBannerCor(false)}
        />
      )}
      <ChooseCard maoJogador={maoJogador} jogar={jogarPorIndice} />

      {mostrarHistorico && <HistoricoMesa historico={historicoMesa} />}

      <Button
        title="Comprar"
        onPress={handleComprar}
        disabled={!vezDoJogador && baralho.length > 0}
      />

      <Button title="Minhas cartas" onPress={verCartasJogador} />
      <Button title="Cartas do PC" onPress={verCartasPC} />

      <PopupEscolherCor
        visivel={mostrarPopup}
        onFechar={() => setMostrarPopup(false)}
        onEscolher={escolherCor}
      />

      <Button title="Cor escolhida" onPress={anunciarCorEscolhida} />

      <Button
        title="Dizer UNO!"
        onPress={() => {
          setJogadorDisseUno(true);
          playUnoSound();
          AccessibilityInfo.announceForAccessibility("Você disse UNO!");
        }}
        disabled={maoJogador.length !== 2 || jogadorDisseUno}
      />

      <Button
        title={mostrarHistorico ? "Ocultar histórico" : "Ver histórico"}
        onPress={() => setMostrarHistorico(!mostrarHistorico)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  cartaTopo: {
    fontSize: 18,
    marginBottom: 20,
    color: "tomato",
  },
  pensando: {
    fontStyle: "italic",
    color: "#666",
    marginTop: 10,
    fontSize: 16,
  },
});
