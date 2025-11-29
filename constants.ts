import { DifficultyLevel, DifficultyConfig } from './types';

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, DifficultyConfig> = {
  [DifficultyLevel.EASY]: {
    rows: 9,
    cols: 9,
    mines: 10,
    label: 'Easy'
  },
  [DifficultyLevel.MEDIUM]: {
    rows: 16,
    cols: 16,
    mines: 40,
    label: 'Medium'
  },
  [DifficultyLevel.HARD]: {
    rows: 16,
    cols: 30,
    mines: 99,
    label: 'Hard'
  }
};

// Colors for numbers 1-8
export const NUMBER_COLORS: string[] = [
  '', // 0
  'text-blue-400', // 1
  'text-emerald-400', // 2
  'text-red-400', // 3
  'text-purple-400', // 4
  'text-orange-400', // 5
  'text-cyan-400', // 6
  'text-pink-400', // 7
  'text-gray-400', // 8
];