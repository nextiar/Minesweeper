import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BoardData, DifficultyLevel, GameStatus } from './types';
import { DIFFICULTY_SETTINGS } from './constants';
import * as GameLogic from './utils/gameLogic';
import Cell from './components/Cell';
import Header from './components/Header';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.EASY);
  const [board, setBoard] = useState<BoardData>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [timer, setTimer] = useState<number>(0);
  const [flagCount, setFlagCount] = useState<number>(0);
  
  const timerRef = useRef<number | null>(null);

  // Initialize Game
  const initGame = useCallback((diff: DifficultyLevel = difficulty) => {
    const config = DIFFICULTY_SETTINGS[diff];
    const newBoard = GameLogic.createEmptyBoard(config.rows, config.cols);
    setBoard(newBoard);
    setGameStatus(GameStatus.IDLE);
    setTimer(0);
    setFlagCount(0);
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, [difficulty]);

  // Initial Load
  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [initGame]);

  // Timer Logic
  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING) {
      timerRef.current = window.setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // Handle Left Click
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST) return;
    
    // Prevent clicking flagged cells
    if (board[row][col].isFlagged) return;

    let newBoard = [...board];

    // First Click Initialization
    if (gameStatus === GameStatus.IDLE) {
      setGameStatus(GameStatus.PLAYING);
      const config = DIFFICULTY_SETTINGS[difficulty];
      newBoard = GameLogic.placeMines(newBoard, config.mines, row, col);
    }

    const cell = newBoard[row][col];

    // Clicked on Mine
    if (cell.isMine) {
      setGameStatus(GameStatus.LOST);
      const revealedBoard = GameLogic.revealAllMines(newBoard);
      // Mark the clicked mine specifically (optional visual flare, handled by revealAll usually)
      revealedBoard[row][col].isRevealed = true; 
      setBoard(revealedBoard);
      return;
    }

    // Reveal Safe Cell
    newBoard = GameLogic.revealCells(newBoard, row, col);
    setBoard(newBoard);

    // Check Win
    if (GameLogic.checkWin(newBoard)) {
      setGameStatus(GameStatus.WON);
      setFlagCount(DIFFICULTY_SETTINGS[difficulty].mines); // Auto flag rest for aesthetics
    }
  };

  // Handle Right Click (Flag)
  const handleCellContextMenu = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST) return;
    if (board[row][col].isRevealed) return;

    const newBoard = [...board];
    const cell = newBoard[row] = [...newBoard[row]]; // Clone row
    const targetCell = cell[col] = { ...cell[col] }; // Clone cell
    
    // Toggle flag
    if (!targetCell.isFlagged) {
        targetCell.isFlagged = true;
        setFlagCount(prev => prev + 1);
    } else {
        targetCell.isFlagged = false;
        setFlagCount(prev => prev - 1);
    }
    
    setBoard(newBoard);
  };

  const handleDifficultyChange = (newDiff: DifficultyLevel) => {
    setDifficulty(newDiff);
    initGame(newDiff);
  };

  const minesTotal = DIFFICULTY_SETTINGS[difficulty].mines;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      
      <div className="flex flex-col items-center w-full max-w-min">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-8 tracking-tight">
          MINESWEEPER
        </h1>

        <Controls 
          currentDifficulty={difficulty} 
          onDifficultyChange={handleDifficultyChange} 
        />

        <Header 
          minesLeft={minesTotal - flagCount} 
          timer={timer} 
          gameStatus={gameStatus} 
          onReset={() => initGame()} 
        />

        {/* Game Board Container */}
        <div className="bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-700 overflow-x-auto max-w-[95vw] no-scrollbar">
          <div 
            className="grid gap-1 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[difficulty].cols}, minmax(0, 1fr))` 
            }}
          >
            {board.map((row, rIndex) => (
              row.map((cell, cIndex) => (
                <Cell 
                  key={`${rIndex}-${cIndex}`} 
                  cell={cell} 
                  gameStatus={gameStatus}
                  onClick={handleCellClick}
                  onContextMenu={handleCellContextMenu}
                />
              ))
            ))}
          </div>
        </div>

        <div className="mt-6 text-slate-500 text-sm font-medium">
            Left click to reveal • Right click to flag
        </div>

      </div>
    </div>
  );
};

export default App;