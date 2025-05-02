
export type CorCarta = 'vermelho' | 'amarelo' | 'verde' | 'azul' | 'preto';

export type AcaoEspecial = 
  | 'pular'
  | 'reverso'
  | 'comprarDois'
  | 'comprarQuatro'
  | 'coringa';

export interface CartaUno {
  cor?: CorCarta;
  numero?: number; // cartas especiais não têm número
  acaoEspecial?: AcaoEspecial | null; // null ou undefined = carta comum
}
