import type { GameState, GameAction, CategoryScores, ScoreCategory } from '../types';

const ALL_CATEGORIES: ScoreCategory[] = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
  'threeOfAKind', 'fourOfAKind', 'fullHouse',
  'smallStraight', 'largeStraight', 'fiveOfAKind', 'chance',
];

function createEmptyScores(): CategoryScores {
  const scores = {} as CategoryScores;
  for (const cat of ALL_CATEGORIES) {
    scores[cat] = null;
  }
  return scores;
}

export const initialGameState: GameState = {
  phase: 'setup',
  players: [],
  scores: [],
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        phase: 'playing',
        players: action.players,
        scores: action.players.map((p) => ({
          playerId: p.id,
          categories: createEmptyScores(),
          fiveOfAKindBonusCount: 0,
        })),
      };

    case 'SET_SCORE': {
      const newScores = state.scores.map((ps) => {
        if (ps.playerId !== action.playerId) return ps;
        if (ps.categories[action.category] !== null) return ps;
        return {
          ...ps,
          categories: { ...ps.categories, [action.category]: action.value },
        };
      });

      const allFilled = newScores.every((ps) =>
        Object.values(ps.categories).every((v) => v !== null)
      );

      return {
        ...state,
        scores: newScores,
        phase: allFilled ? 'gameOver' : 'playing',
      };
    }

    case 'ADD_FIVE_OF_A_KIND_BONUS': {
      const newScores = state.scores.map((ps) => {
        if (ps.playerId !== action.playerId) return ps;
        if (ps.categories.fiveOfAKind !== 50) return ps;
        return { ...ps, fiveOfAKindBonusCount: ps.fiveOfAKindBonusCount + 1 };
      });
      return { ...state, scores: newScores };
    }

    case 'RESET_GAME':
      return initialGameState;
  }
}
