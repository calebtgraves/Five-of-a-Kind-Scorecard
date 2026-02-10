import type { CategoryScores, PlayerTotals, UpperCategory, LowerCategory } from '../types';
import { UPPER_BONUS_THRESHOLD, UPPER_BONUS_VALUE } from '../constants';

const UPPER_KEYS: UpperCategory[] = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
];

const LOWER_KEYS: LowerCategory[] = [
  'threeOfAKind', 'fourOfAKind', 'fullHouse',
  'smallStraight', 'largeStraight', 'fiveOfAKind', 'chance',
];

export function computeTotals(categories: CategoryScores): PlayerTotals {
  const upperSubtotal = UPPER_KEYS.reduce(
    (sum, key) => sum + (categories[key] ?? 0), 0
  );
  const upperBonus = upperSubtotal >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS_VALUE : 0;
  const upperTotal = upperSubtotal + upperBonus;
  const lowerTotal = LOWER_KEYS.reduce(
    (sum, key) => sum + (categories[key] ?? 0), 0
  );
  return {
    upperSubtotal,
    upperBonus,
    upperTotal,
    lowerTotal,
    grandTotal: upperTotal + lowerTotal,
  };
}
