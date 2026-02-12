import type { CategoryMeta } from './types';

function upperScores(face: number): number[] {
  return Array.from({ length: 6 }, (_, i) => face * i);
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const CATEGORIES: CategoryMeta[] = [
  // Upper section
  { key: 'ones',   label: 'Ones',   shortDescription: 'Sum of all 1s', scoring: 'Count and add only Ones.',   section: 'upper', maxScore: 5,  validScores: upperScores(1) },
  { key: 'twos',   label: 'Twos',   shortDescription: 'Sum of all 2s', scoring: 'Count and add only Twos.',   section: 'upper', maxScore: 10, validScores: upperScores(2) },
  { key: 'threes', label: 'Threes', shortDescription: 'Sum of all 3s', scoring: 'Count and add only Threes.', section: 'upper', maxScore: 15, validScores: upperScores(3) },
  { key: 'fours',  label: 'Fours',  shortDescription: 'Sum of all 4s', scoring: 'Count and add only Fours.',  section: 'upper', maxScore: 20, validScores: upperScores(4) },
  { key: 'fives',  label: 'Fives',  shortDescription: 'Sum of all 5s', scoring: 'Count and add only Fives.',  section: 'upper', maxScore: 25, validScores: upperScores(5) },
  { key: 'sixes',  label: 'Sixes',  shortDescription: 'Sum of all 6s', scoring: 'Count and add only Sixes.',  section: 'upper', maxScore: 30, validScores: upperScores(6) },
  // Lower section
  { key: 'threeOfAKind',  label: 'Three of a Kind', shortDescription: '3 of the same',        scoring: 'At least three dice the same. Score the sum of all dice.',   section: 'lower', maxScore: 30, validScores: [0, ...range(5, 30)] },
  { key: 'fourOfAKind',   label: 'Four of a Kind',  shortDescription: '4 of the same',        scoring: 'At least four dice the same. Score the sum of all dice.',    section: 'lower', maxScore: 30, validScores: [0, ...range(5, 30)] },
  { key: 'fullHouse',     label: 'Full House',      shortDescription: '3 + 2 of a kind', scoring: 'Three of one number and two of another. Scores 25 points.',  section: 'lower', maxScore: 25, validScores: [0, 25], fixedScore: true },
  { key: 'smallStraight', label: 'Small Straight',  shortDescription: '4 in a row',           scoring: 'Four sequential dice (e.g. 1-2-3-4). Scores 30 points.',    section: 'lower', maxScore: 30, validScores: [0, 30], fixedScore: true },
  { key: 'largeStraight', label: 'Large Straight',  shortDescription: '5 in a row',           scoring: 'Five sequential dice (e.g. 1-2-3-4-5). Scores 40 points.',  section: 'lower', maxScore: 40, validScores: [0, 40], fixedScore: true },
  { key: 'fiveOfAKind',   label: 'Five of a Kind',  shortDescription: '5 of a kind',          scoring: 'All five dice the same. Scores 50 points.',                  section: 'lower', maxScore: 50, validScores: [0, 50], fixedScore: true },
  { key: 'chance',        label: 'Chance',           shortDescription: 'Any combination',      scoring: 'Any combination. Score the sum of all dice.',                section: 'lower', maxScore: 30, validScores: [0, ...range(5, 30)] },
];

export const UPPER_CATEGORIES = CATEGORIES.filter(c => c.section === 'upper');
export const LOWER_CATEGORIES = CATEGORIES.filter(c => c.section === 'lower');

/** Categories that can't be scored with 5 identical dice (used during bonus placement) */
export const BONUS_INVALID_CATEGORIES: Set<string> = new Set(['fullHouse', 'smallStraight', 'largeStraight']);

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 100;
export const UPPER_BONUS_THRESHOLD = 63;
export const UPPER_BONUS_VALUE = 35;
