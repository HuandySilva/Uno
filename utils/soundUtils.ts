import { CartaUno } from "../types/CartaUno";
import { Audio } from "expo-av";
import backgroundMusic from "@/assets/sounds/background.mp3";

/**
 * Função genérica que toca qualquer som
 */
async function playSound(path: any, volume: number = 1.0) {
  const { sound } = await Audio.Sound.createAsync(path);
  await sound.setVolumeAsync(volume);
  await sound.playAsync();
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      sound.unloadAsync();
    }
  });
}

/**
 * Toca som de embaralhar
 */
export async function playShuffleSound() {
  await playSound(require("@/assets/sounds/shuffle.mp3"), 0.7);
}

/**
 * Toca som de compra de carta
 */
export async function playDrawSound() {
  await playSound(require("@/assets/sounds/draw.mp3"), 0.7);
}

/**
 * Toca som quando alguém diz UNO
 */
export async function playUnoSound() {
  await playSound(require("@/assets/sounds/uno.mp3"), 1.0);
}

/**
 * Toca música de fundo (retorna o objeto pra parar depois, se quiser)
 */
export async function playBackgroundMusic(): Promise<Audio.Sound> {
  const { sound } = await Audio.Sound.createAsync(
    require("@/assets/sounds/background.mp3"),
    { isLooping: true, volume: 0.1 }
  );
  await sound.playAsync();
  return sound;
}

export async function playCardSound(carta: CartaUno) {
  if (carta.acaoEspecial === "comprarQuatro") {
    await playSound(require("@/assets/sounds/beep.mp3"));
  } else if (carta.acaoEspecial === "comprarDois") {
    await playSound(require("@/assets/sounds/beep.mp3"));
  } else if (carta.acaoEspecial === "pular") {
    await playSound(require("@/assets/sounds/skip.mp3"));
  } else if (carta.acaoEspecial === "reverso") {
    await playSound(require("@/assets/sounds/reverse.mp3"));
  } else if (carta.acaoEspecial === "coringa") {
    await playSound(require("@/assets/sounds/wild.mp3"));
  } else {
    await playSound(require("@/assets/sounds/card.mp3"));
  }
}

/**
 * Toca som quando alguém esquece de dizer uno UNO
 */
export async function playPunishmentSound() {
  await playSound(require("@/assets/sounds/punishment.mp3"), 1.0);
}
