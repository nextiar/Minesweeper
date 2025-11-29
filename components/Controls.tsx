import React from 'react';
import { DifficultyLevel } from '../types';

interface ControlsProps {
  currentDifficulty: DifficultyLevel;
  onDifficultyChange: (diff: DifficultyLevel) => void;
}

const Controls: React.FC<ControlsProps> = ({ currentDifficulty, onDifficultyChange }) => {
  return (
    <div className="flex justify-center gap-2 mb-6 bg-slate-800/50 p-1.5 rounded-lg inline-flex self-center">
      {(Object.keys(DifficultyLevel) as Array<keyof typeof DifficultyLevel>).map((key) => {
        const isActive = currentDifficulty === DifficultyLevel[key];
        return (
          <button
            key={key}
            onClick={() => onDifficultyChange(DifficultyLevel[key])}
            className={`
              px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-slate-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}
            `}
          >
            {key.charAt(0) + key.slice(1).toLowerCase()}
          </button>
        );
      })}
    </div>
  );
};

export default Controls;