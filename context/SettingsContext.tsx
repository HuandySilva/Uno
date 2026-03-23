import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. Definição do "Contrato" (o que o contexto oferece)
interface SettingsContextData {
  musicaAtivada: boolean;
  sonsAtivados: boolean;
  setMusicaAtivada: (val: boolean) => Promise<void>;
  setSonsAtivados: (val: boolean) => Promise<void>;
}

// 2. Criação do Contexto
const SettingsContext = createContext<SettingsContextData>(
  {} as SettingsContextData,
);

// 3. O Provider (Provedor) que envolve o App
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [musicaAtivada, setMusicaAtivadaState] = useState(true);
  const [sonsAtivados, setSonsAtivadosState] = useState(true);

  // Carrega as configurações ao iniciar o app
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [m, s] = await Promise.all([
          AsyncStorage.getItem("@musica_ativada"),
          AsyncStorage.getItem("@sons_ativados"),
        ]);

        if (m !== null) setMusicaAtivadaState(m === "true");
        if (s !== null) setSonsAtivadosState(s === "true");
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    loadSettings();
  }, []);

  // Função para mudar e salvar a música
  const setMusicaAtivada = async (val: boolean) => {
    setMusicaAtivadaState(val);
    await AsyncStorage.setItem("@musica_ativada", String(val));
  };

  // Função para mudar e salvar os efeitos de som
  const setSonsAtivados = async (val: boolean) => {
    setSonsAtivadosState(val);
    await AsyncStorage.setItem("@sons_ativados", String(val));
  };

  return (
    <SettingsContext.Provider
      value={{
        musicaAtivada,
        sonsAtivados,
        setMusicaAtivada,
        setSonsAtivados,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// 4. Hook customizado para facilitar o uso nas telas
export const useSettings = () => useContext(SettingsContext);
