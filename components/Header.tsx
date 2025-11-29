import React from 'react';
import { Flag, Clock, RotateCcw } from 'lucide-react';
import { GameStatus } from '../types';

interface HeaderProps {
  minesLeft: number;
  timer: number;
  gameStatus: GameStatus;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ minesLeft, timer, gameStatus, onReset }) => {
  
  const getStatusMessage = () => {
    switch(gameStatus) {
        case GameStatus.WON: return <span className="text-emerald-400 font-bold">VICTORY!</span>;
        case GameStatus.LOST: return <span className="text-red-400 font-bold">GAME OVER</span>;
        default: return <span className="text-slate-400 font-medium">Minesweeper</span>;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl bg-slate-800 rounded-xl p-4 mb-6 shadow-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
      
      {/* Counters */}
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 min-w-[100px] justify-center">
            <Flag className="w-5 h-5 text-red-500" />
            <span className="text-xl font-mono font-bold text-red-100">{minesLeft}</span>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 min-w-[100px] justify-center">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-xl font-mono font-bold text-blue-100">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Status & Reset */}
      <div className="flex items-center gap-4">
        <div className="text-lg hidden sm:block">
            {getStatusMessage()}
        </div>
        
        <button 
            onClick={onReset}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2 font-medium px-4"
        >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default Header;