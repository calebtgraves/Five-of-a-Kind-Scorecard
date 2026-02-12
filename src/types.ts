export type UpperCategory =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes';

export type LowerCategory =
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'fiveOfAKind'
  | 'chance';

export type ScoreCategory = UpperCategory | LowerCategory;

export type CategoryScores = Record<ScoreCategory, number | null>;

export interface Player {
  id: string;
  name: string;
}

export interface PlayerScores {
  playerId: string;
  categories: CategoryScores;
  fiveOfAKindBonusCount: number;
}

export interface PlayerTotals {
  upperSubtotal: number;
  upperBonus: number;
  upperTotal: number;
  lowerTotal: number;
  fiveOfAKindBonus: number;
  grandTotal: number;
}

export type GamePhase = 'setup' | 'playing' | 'gameOver';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  scores: PlayerScores[];
}

export type GameAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'SET_SCORE'; playerId: string; category: ScoreCategory; value: number }
  | { type: 'ADD_FIVE_OF_A_KIND_BONUS'; playerId: string }
  | { type: 'RESET_GAME' }
  | { type: 'RESTORE_STATE'; state: GameState };

export interface ScoreEntryTarget {
  playerId: string;
  category: ScoreCategory;
}

export interface CategoryMeta {
  key: ScoreCategory;
  label: string;
  shortDescription: string;
  scoring: string;
  section: 'upper' | 'lower';
  maxScore: number;
  validScores: number[];
  fixedScore?: boolean;
}
