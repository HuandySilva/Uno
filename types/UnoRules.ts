import { UnoState } from "./UnoState";

// Toda regra de treta deve seguir esse molde
export type RegraExecutora = (state: UnoState) => Partial<UnoState>;

// Um dicionário que mapeia o ID da carta para a sua função
export type MapaDeRegras = Record<string, RegraExecutora>;
