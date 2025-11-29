import { BoardData, CellData, DifficultyConfig } from '../types';

// Create an initial empty board
export const createEmptyBoard = (rows: number, cols: number): BoardData => {
  const board: BoardData = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      });
    }
    board.push(row);
  }
  return board;
};

// Generate mines ensuring the first click is safe
export const placeMines = (
  initialBoard: BoardData,
  mines: number,
  safeRow: number,
  safeCol: number
): BoardData => {
  const rows = initialBoard.length;
  const cols = initialBoard[0].length;
  const board = JSON.parse(JSON.stringify(initialBoard)) as BoardData; // Deep copy

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    // Don't place mine on existing mine
    if (board[r][c].isMine) continue;

    // Don't place mine on the first clicked cell or its immediate neighbors (optional, but safer)
    const distance = Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;
    if (distance) continue;

    board[r][c].isMine = true;
    minesPlaced++;
  }

  // Calculate numbers
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) {
        board[r][c].neighborMines = countNeighbors(board, r, c);
      }
    }
  }

  return board;
};

const countNeighbors = (board: BoardData, row: number, col: number): number => {
  let count = 0;
  const rows = board.length;
  const cols = board[0].length;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue;
      const nr = row + r;
      const nc = col + c;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr][nc].isMine) count++;
      }
    }
  }
  return count;
};

// Flood fill algorithm to reveal empty areas
export const revealCells = (board: BoardData, row: number, col: number): BoardData => {
  const newBoard = [...board]; // Shallow copy of rows
  const rows = newBoard.length;
  const cols = newBoard[0].length;

  // Helper for recursive reveal
  const revealRecursive = (r: number, c: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) {
      return;
    }

    // Mutate the cell (we will create a fresh reference for React state update at the end if needed, 
    // but here we are working on a cloned structure)
    // For immutable update pattern in React, we need to be careful. 
    // To be safe, let's clone the row before mutating.
    newBoard[r] = [...newBoard[r]];
    newBoard[r][c].isRevealed = true;

    if (newBoard[r][c].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          revealRecursive(r + dr, c + dc);
        }
      }
    }
  };

  revealRecursive(row, col);
  return newBoard;
};

export const checkWin = (board: BoardData): boolean => {
  const rows = board.length;
  const cols = board[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // If a non-mine cell is not revealed, game not won yet
      if (!board[r][c].isMine && !board[r][c].isRevealed) {
        return false;
      }
      // If a mine is revealed (shouldn't happen in checkWin context usually, but good for sanity), false
      if (board[r][c].isMine && board[r][c].isRevealed) {
        return false;
      }
    }
  }
  return true;
};

export const revealAllMines = (board: BoardData): BoardData => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  newBoard.forEach(row => {
    row.forEach(cell => {
      if (cell.isMine) {
        cell.isRevealed = true;
      }
    });
  });
  return newBoard;
};
