import type { CategoryScores, PlayerTotals, UpperCategory, LowerCategory } from '../types';
import { UPPER_BONUS_THRESHOLD, UPPER_BONUS_VALUE } from '../constants';

const UPPER_KEYS: UpperCategory[] = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
];

const LOWER_KEYS: LowerCategory[] = [
  'threeOfAKind', 'fourOfAKind', 'fullHouse',
  'smallStraight', 'largeStraight', 'fiveOfAKind', 'chance',
];

export const FIVE_OF_A_KIND_BONUS_VALUE = 100;

export function computeTotals(categories: CategoryScores, fiveOfAKindBonusCount = 0): PlayerTotals {
  const upperSubtotal = UPPER_KEYS.reduce(
    (sum, key) => sum + (categories[key] ?? 0), 0
  );
  const upperBonus = upperSubtotal >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS_VALUE : 0;
  const upperTotal = upperSubtotal + upperBonus;
  const lowerTotal = LOWER_KEYS.reduce(
    (sum, key) => sum + (categories[key] ?? 0), 0
  );
  const fiveOfAKindBonus = fiveOfAKindBonusCount * FIVE_OF_A_KIND_BONUS_VALUE;
  return {
    upperSubtotal,
    upperBonus,
    upperTotal,
    lowerTotal,
    fiveOfAKindBonus,
    grandTotal: upperTotal + lowerTotal + fiveOfAKindBonus,
  };
}
