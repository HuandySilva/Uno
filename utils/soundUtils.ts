import { Audio } from "expo-av";
import { CartaUno } from "../types/CartaUno";

/**
 * Função genérica blindada para Android SDK 55
 */
async function playSound(path: any, volume: number = 1.0) {
  try {
    // Configura o modo de áudio antes de tocar (ajuda o Android a achar o módulo)
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    const { sound } = await Audio.Sound.createAsync(path, {
      shouldPlay: false,
      volume: volume,
    });

    await sound.playAsync();

    // Liberação de memória obrigatória para evitar erro de ExponentAV
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    console.warn("Erro ao processar áudio no Android:", error);
  }
}

export async function playShuffleSound() {
  await playSound(require("@/assets/sounds/shuffle.mp3"), 0.7);
}

export async function playDrawSound() {
  await playSound(require("@/assets/sounds/draw.mp3"), 0.7);
}

export async function playUnoSound() {
  await playSound(require("@/assets/sounds/uno.mp3"), 1.0);
}

export async function playPunishmentSound() {
  await playSound(require("@/assets/sounds/punishment.mp3"), 1.0);
}

/**
 * Toca música de fundo de forma segura
 */
export async function playBackgroundMusic(): Promise<Audio.Sound | null> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/background.mp3"),
      { isLooping: true, volume: 0.1 },
    );
    await sound.playAsync();
    return sound;
  } catch (e) {
    console.error("Erro na música de fundo:", e);
    return null;
  }
}

export async function playCardSound(carta: CartaUno) {
  let soundPath = require("@/assets/sounds/card.mp3");

  if (
    carta.acaoEspecial === "comprarQuatro" ||
    carta.acaoEspecial === "comprarDois"
  ) {
    soundPath = require("@/assets/sounds/beep.mp3");
  } else if (carta.acaoEspecial === "pular") {
    soundPath = require("@/assets/sounds/skip.mp3");
  } else if (carta.acaoEspecial === "reverso") {
    soundPath = require("@/assets/sounds/reverse.mp3");
  } else if (carta.acaoEspecial === "coringa") {
    soundPath = require("@/assets/sounds/wild.mp3");
  }

  await playSound(soundPath);
}

function getEndingSound(ending: string) {
  switch (ending) {
    case "winner":
      return require("@/assets/sounds/winner.mp3");
    case "loser":
      return require("@/assets/sounds/loser.mp3");
    case "draw":
      return require("@/assets/sounds/draw.mp3");
    default:
      return null;
  }
}

export async function playEndingSound(ending: string) {
  const sound = getEndingSound(ending);
  if (sound) {
    await playSound(sound, 1.0);
  }
}
