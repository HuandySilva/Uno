import AsyncStorage from "@react-native-async-storage/async-storage";

const STATS_KEY = "@uno_stats_v2"; // Mudei a versão para resetar o storage com os novos campos

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  cardsPlayed: number;
  specialCardsUsed: number;
  totalCardsDrawn: number; // Quantas comprou no total
  totalPlayTime: number; // Tempo total em segundos
  shortestWin: number | null; // Recorde: vitória mais rápida (em segundos)
  longestMatch: number; // Recorde: partida mais longa (em segundos),
  totalPoints: number;
  maxPointsInWin: number;
  totalPointsLost: number; // Soma de pontos que ficaram na sua mão quando o PC ganhou
  maxPointsInLoss: number; // O maior "prejuízo" que você já teve em uma derrota
}

const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  cardsPlayed: 0,
  specialCardsUsed: 0,
  totalCardsDrawn: 0,
  totalPlayTime: 0,
  shortestWin: null,
  longestMatch: 0,
  totalPoints: 0,
  maxPointsInWin: 0,
  totalPointsLost: 0,
  maxPointsInLoss: 0,
};

export const getStats = async (): Promise<GameStats> => {
  const data = await AsyncStorage.getItem(STATS_KEY);
  return data ? { ...INITIAL_STATS, ...JSON.parse(data) } : INITIAL_STATS;
};

export const saveMatchResult = async (
  win: boolean,
  durationSeconds: number,
  cardsDrawn: number,
  points: number = 0,
) => {
  const current = await getStats();
  const updated: GameStats = {
    ...current,
    gamesPlayed: current.gamesPlayed + 1,
    wins: win ? current.wins + 1 : current.wins,
    losses: !win ? current.losses + 1 : current.losses,
    totalPlayTime: current.totalPlayTime + durationSeconds,
    totalCardsDrawn: current.totalCardsDrawn + cardsDrawn,

    // Lógica de Pontos Ganhos (Vitória)
    totalPoints: current.totalPoints + (win ? points : 0),
    maxPointsInWin: win
      ? Math.max(current.maxPointsInWin, points)
      : current.maxPointsInWin,

    // Lógica de Pontos Perdidos (Derrota) - NOVO!
    totalPointsLost: current.totalPointsLost + (!win ? points : 0),
    maxPointsInLoss: !win
      ? Math.max(current.maxPointsInLoss, points)
      : current.maxPointsInLoss,

    longestMatch: Math.max(current.longestMatch, durationSeconds),
    shortestWin: win
      ? current.shortestWin
        ? Math.min(current.shortestWin, durationSeconds)
        : durationSeconds
      : current.shortestWin,
  };
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(updated));
};

export const trackCardPlay = async (isSpecial: boolean) => {
  const current = await getStats();
  current.cardsPlayed += 1;
  if (isSpecial) current.specialCardsUsed += 1;
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(current));
};
