import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ModoJogoID = "classico" | "treta";

interface SettingsContextData {
  musicaAtivada: boolean;
  sonsAtivados: boolean;
  modoAtivo: ModoJogoID;
  setMusicaAtivada: (val: boolean) => Promise<void>;
  setSonsAtivados: (val: boolean) => Promise<void>;
  setModoAtivo: (modo: ModoJogoID) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextData>(
  {} as SettingsContextData,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [musicaAtivada, setMusicaAtivadaState] = useState(true);
  const [sonsAtivados, setSonsAtivadosState] = useState(true);
  const [modoAtivo, setModoAtivoState] = useState<ModoJogoID>("classico");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [m, s, mode] = await Promise.all([
          AsyncStorage.getItem("@musica_ativada"),
          AsyncStorage.getItem("@sons_ativados"),
          AsyncStorage.getItem("@modo_ativo"),
        ]);

        if (m !== null) setMusicaAtivadaState(m === "true");
        if (s !== null) setSonsAtivadosState(s === "true");
        // Se o modo salvo for válido, aplica. Senão, mantém "classico"
        if (mode !== null) setModoAtivoState(mode as ModoJogoID);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    loadSettings();
  }, []);

  const setMusicaAtivada = async (val: boolean) => {
    setMusicaAtivadaState(val);
    await AsyncStorage.setItem("@musica_ativada", String(val));
  };

  const setSonsAtivados = async (val: boolean) => {
    setSonsAtivadosState(val);
    await AsyncStorage.setItem("@sons_ativados", String(val));
  };

  const setModoAtivo = async (modo: ModoJogoID) => {
    setModoAtivoState(modo);
    await AsyncStorage.setItem("@modo_ativo", modo);
  };

  return (
    <SettingsContext.Provider
      value={{
        musicaAtivada,
        sonsAtivados,
        modoAtivo,
        setMusicaAtivada,
        setSonsAtivados,
        setModoAtivo,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
