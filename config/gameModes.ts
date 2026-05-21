import { AcaoEspecial } from "../types/CartaUno";
import { ModoJogoID } from "../context/SettingsContext";

export const CONFIG_MODOS: Record<ModoJogoID, AcaoEspecial[]> = {
  classico: [],
  treta: ["gado", "bomba", "cachaca", "olhar_43", "lata_lixo", "propina"],
  // Quando quiser o Modo 3, é só adicionar a linha aqui:
  // unifei: ["dp", "greve", "xerox"],
};
