import { useEffect, useRef, useCallback } from "react";
import * as SoundUtils from "../utils/soundUtils";
import { useSettings } from "../context/SettingsContext";
import { CartaUno } from "../types/CartaUno";

// Definimos os tipos de sons possíveis para o TypeScript nos ajudar
type SoundType = "card" | "draw" | "uno" | "punishment" | "shuffle" | "ending";

export function useUnoAudio() {
  const { musicaAtivada, sonsAtivados } = useSettings();
  const musicaRef = useRef<any>(null);

  // Música de Fundo: Gerencia o ciclo de vida
  useEffect(() => {
    const gerenciarMusica = async () => {
      if (musicaAtivada) {
        if (!musicaRef.current) {
          musicaRef.current = await SoundUtils.playBackgroundMusic();
        }
      } else if (musicaRef.current) {
        await musicaRef.current.stopAsync();
        await musicaRef.current.unloadAsync();
        musicaRef.current = null;
      }
    };

    gerenciarMusica();

    return () => {
      if (musicaRef.current) {
        musicaRef.current.stopAsync();
        musicaRef.current.unloadAsync();
      }
    };
  }, [musicaAtivada]);

  /**
   * Função para tocar efeitos sonoros.
   * Se o tipo for 'card', o payload deve ser uma CartaUno.
   * Se for 'ending', o payload deve ser 'winner' | 'loser' | 'draw'.
   */
  const tocarSom = useCallback(
    async (tipo: SoundType, payload?: any) => {
      if (!sonsAtivados) return;

      try {
        switch (tipo) {
          case "card":
            // O payload aqui é a carta que veio do jogo
            await SoundUtils.playCardSound(payload as CartaUno);
            break;
          case "draw":
            await SoundUtils.playDrawSound();
            break;
          case "uno":
            await SoundUtils.playUnoSound();
            break;
          case "punishment":
            await SoundUtils.playPunishmentSound();
            break;
          case "shuffle":
            await SoundUtils.playShuffleSound();
            break;
          case "ending":
            await SoundUtils.playEndingSound(payload as string);
            break;
        }
      } catch (error) {
        console.warn(`[useUnoAudio] Erro ao tocar som ${tipo}:`, error);
      }
    },
    [sonsAtivados],
  );

  return { tocarSom };
}
