import React from 'react';
import { CellData, GameStatus } from '../types';
import { NUMBER_COLORS } from '../constants';
import { Flag, Bomb, X } from 'lucide-react';

interface CellProps {
  cell: CellData;
  gameStatus: GameStatus;
  onClick: (row: number, col: number) => void;
  onContextMenu: (e: React.MouseEvent, row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({ cell, gameStatus, onClick, onContextMenu }) => {
  const { isRevealed, isFlagged, isMine, neighborMines, row, col } = cell;

  // Determine appearance
  const getCellContent = () => {
    if (isFlagged) {
      // If game is lost and this flag was wrong (no mine here), show error
      if (gameStatus === GameStatus.LOST && !isMine) {
         return <X className="w-4 h-4 text-red-500" />;
      }
      return <Flag className="w-4 h-4 text-red-500 fill-red-500" />;
    }
    
    if (isRevealed) {
      if (isMine) {
        return <Bomb className="w-5 h-5 text-slate-900 fill-slate-900 animate-pulse" />;
      }
      if (neighborMines > 0) {
        return <span className={`font-bold text-lg ${NUMBER_COLORS[neighborMines]}`}>{neighborMines}</span>;
      }
      return null; // Empty cell
    }
    return null; // Covered cell
  };

  const getCellStyles = () => {
    const baseStyles = "w-8 h-8 sm:w-10 sm:h-10 border border-slate-700/50 flex items-center justify-center cursor-pointer select-none transition-all duration-100";
    
    if (isRevealed) {
      if (isMine) {
         return `${baseStyles} bg-red-500 border-red-600`;
      }
      return `${baseStyles} bg-slate-800 border-slate-700 cursor-default`;
    }

    if (gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST) {
       return `${baseStyles} bg-slate-600`;
    }

    return `${baseStyles} bg-slate-600 hover:bg-slate-500 active:bg-slate-700 shadow-inner`;
  };

  return (
    <div
      className={getCellStyles()}
      onClick={() => onClick(row, col)}
      onContextMenu={(e) => onContextMenu(e, row, col)}
      role="button"
      aria-label={`Cell at row ${row}, column ${col}`}
    >
      {getCellContent()}
    </div>
  );
};

export default React.memo(Cell);