import type { CategoryMeta } from './types';

function upperScores(face: number): number[] {
  return Array.from({ length: 6 }, (_, i) => face * i);
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const CATEGORIES: CategoryMeta[] = [
  // Upper section: 0 or multiples of face value
  { key: 'ones',           label: 'Ones',            section: 'upper', maxScore: 5,  validScores: upperScores(1) },
  { key: 'twos',           label: 'Twos',            section: 'upper', maxScore: 10, validScores: upperScores(2) },
  { key: 'threes',         label: 'Threes',          section: 'upper', maxScore: 15, validScores: upperScores(3) },
  { key: 'fours',          label: 'Fours',           section: 'upper', maxScore: 20, validScores: upperScores(4) },
  { key: 'fives',          label: 'Fives',           section: 'upper', maxScore: 25, validScores: upperScores(5) },
  { key: 'sixes',          label: 'Sixes',           section: 'upper', maxScore: 30, validScores: upperScores(6) },
  // Lower section: sum-based or fixed
  { key: 'threeOfAKind',   label: 'Three of a Kind', section: 'lower', maxScore: 30, validScores: [0, ...range(5, 30)] },
  { key: 'fourOfAKind',    label: 'Four of a Kind',  section: 'lower', maxScore: 30, validScores: [0, ...range(5, 30)] },
  { key: 'fullHouse',      label: 'Full House',      section: 'lower', maxScore: 25, validScores: [0, 25], fixedScore: true },
  { key: 'smallStraight',  label: 'Small Straight',  section: 'lower', maxScore: 30, validScores: [0, 30], fixedScore: true },
  { key: 'largeStraight',  label: 'Large Straight',  section: 'lower', maxScore: 40, validScores: [0, 40], fixedScore: true },
  { key: 'yahtzee',        label: 'Yahtzee',         section: 'lower', maxScore: 50, validScores: [0, 50], fixedScore: true },
  { key: 'chance',         label: 'Chance',          section: 'lower', maxScore: 30, validScores: [0, ...range(5, 30)] },
];

export const UPPER_CATEGORIES = CATEGORIES.filter(c => c.section === 'upper');
export const LOWER_CATEGORIES = CATEGORIES.filter(c => c.section === 'lower');

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 6;
export const UPPER_BONUS_THRESHOLD = 63;
export const UPPER_BONUS_VALUE = 35;
