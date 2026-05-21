import { CartaUno } from "./CartaUno";

export interface UnoState {
  baralho: CartaUno[];
  maoJogador: CartaUno[];
  maoPC: CartaUno[];
  cartaTopo: CartaUno | null;
  historicoMesa: CartaUno[];
  vezDoJogador: boolean;
  corAtual: string | null;
  precisaComprar: boolean; // Era seu useRef
  jaComprouNoTurno: boolean;
  status: "INICIO" | "JOGANDO" | "ESCOLHENDO_COR" | "FIM";
  aguardandoUno: boolean;
  jogadorDisseUno: boolean;
  pcDisseUno: boolean;
  quantidadeParaComprar?: number;
  statusMensagem?: string;
  pendenteRouboMelhorCarta?: boolean; // Para a regra do Gado
  efeitoAleatorioAtivo?: boolean; // Para a Cachaça
  bloqueioAcumulado?: number; // Para o Olhar 43
}
