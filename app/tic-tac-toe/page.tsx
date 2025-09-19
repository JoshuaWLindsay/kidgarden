/* eslint-disable max-lines-per-function, id-length */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Cell = "T" | "L" | null; // Tomato or Lettuce

const TOMATO = "🍅";
const LETTUCE = "🥬";

const winningLines: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function useTicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [tomatoTurn, setTomatoTurn] = useState(true);

  const winnerInfo = useMemo((): {
    winner: Cell;
    line: [number, number, number] | null;
  } => {
    for (const [a, b, col] of winningLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[col]) {
        return { winner: board[a], line: [a, b, col] };
      }
    }
    return { winner: null, line: null };
  }, [board]);

  const isDraw = useMemo(() => {
    const allFilled = board.every((cell) => cell !== null);
    return allFilled && !winnerInfo.winner;
  }, [board, winnerInfo.winner]);

  const gameOver = Boolean(winnerInfo.winner || isDraw);

  function handleClick(index: number) {
    if (board[index] || gameOver) return;
    const next = board.slice();
    next[index] = tomatoTurn ? "T" : "L";
    setBoard(next);
    setTomatoTurn((turn) => !turn);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setTomatoTurn(true);
  }

  function statusText(): string {
    if (winnerInfo.winner) {
      return winnerInfo.winner === "T" ? "Tomatoes win!" : "Lettuces win!";
    }
    if (isDraw) {
      return "It’s a draw!";
    }
    return tomatoTurn ? "Tomatoes to move" : "Lettuces to move";
  }

  return {
    board,
    tomatoTurn,
    winnerInfo,
    isDraw,
    gameOver,
    handleClick,
    reset,
    statusText,
  };
}

function renderCellSymbol(cell: Cell) {
  if (cell === "T") return TOMATO;
  if (cell === "L") return LETTUCE;
  return "";
}

type CellButtonProps = {
  index: number;
  value: Cell;
  onClick: (index: number) => void;
  disabled: boolean;
  highlight: boolean;
};

function cellAriaLabel(value: Cell, index: number): string {
  if (!value) return `Empty cell ${index + 1}`;
  return value === "T" ? "Tomato" : "Lettuce";
}

function CellButton(props: CellButtonProps) {
  const { index, value, onClick, disabled, highlight } = props;
  const label = cellAriaLabel(value, index);

  const classes =
    "aspect-square text-4xl md:text-6xl flex items-center justify-center " +
    "rounded-lg border transition-colors " +
    (highlight
      ? "bg-green-200/70 dark:bg-green-700/60 " +
        "border-green-400 dark:border-green-500"
      : "bg-green-50/70 dark:bg-green-900/40 border-green-300/70 " +
        "dark:border-green-700 hover:bg-green-100/70 " +
        "dark:hover:bg-green-800/60") +
    (value || disabled ? " opacity-90" : "");

  return (
    <button
      role="gridcell"
      aria-label={label}
      onClick={() => onClick(index)}
      disabled={disabled}
      className={classes}
    >
      <span>{renderCellSymbol(value)}</span>
    </button>
  );
}

function Board(props: {
  board: Cell[];
  gameOver: boolean;
  winningLine: [number, number, number] | null;
  onClick: (index: number) => void;
}) {
  const { board, gameOver, winningLine, onClick } = props;
  return (
    <div
      className="grid grid-cols-3 gap-2 md:gap-3 select-none w-[360px] md:w-[540px]"
      role="grid"
      aria-label="Tic Tac Toe board"
    >
      {board.map((cellValue, index) => (
        <CellButton
          key={index}
          index={index}
          value={cellValue}
          onClick={onClick}
          disabled={Boolean(cellValue) || gameOver}
          highlight={Boolean(winningLine?.includes(index))}
        />
      ))}
    </div>
  );
}

export default function GardenTicTacToePage() {
  const { board, winnerInfo, gameOver, handleClick, reset, statusText } =
    useTicTacToe();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 relative bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
      {/* Home icon link in top right corner (consistent with other pages) */}
      <Link
        href="/"
        className="absolute top-4 right-4 sm:top-8 sm:right-8 rounded-full bg-white/80 dark:bg-green-800/80 border border-black/10 dark:border-white/20 w-12 h-12 flex items-center justify-center text-2xl shadow-md hover:bg-white dark:hover:bg-green-700 transition-colors"
        aria-label="Go back to home page"
      >
        🏠
      </Link>

      <main className="flex flex-col gap-[16px] row-start-2 items-center w-full max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-200">
          Garden Tic‑Tac‑Toe
        </h1>

        <section className="bg-white/80 dark:bg-green-800/80 rounded-lg p-4 md:p-6 shadow">
          <p className="text-center text-lg md:text-xl font-medium text-green-800 dark:text-green-100 mb-4">
            {statusText()}
          </p>

          <Board
            board={board}
            gameOver={gameOver}
            winningLine={winnerInfo.line}
            onClick={handleClick}
          />

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors"
            >
              Play again
            </button>
          </div>
        </section>

        <footer className="mt-2 text-center text-green-700 dark:text-green-200">
          Tomatoes {TOMATO} vs Lettuce {LETTUCE}
        </footer>
      </main>
    </div>
  );
}
