"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopRightNav from "@/components/TopRightNav";

type LevelDefinition = {
  name: string;
  rows: string[];
  tip?: string;
};

type Position = {
  x: number;
  y: number;
};

type ParsedLevel = LevelDefinition & {
  width: number;
  height: number;
  start: Position;
  exit: Position;
  nectarPositions: Set<string>;
  nectarTotal: number;
};

const LEVELS: LevelDefinition[] = [
  {
    name: "Meadow Loop",
    tip: "Follow the sunny path across the top to reach the deeper maze.",
    rows: [
      "#########",
      "#S....N.#",
      "#.###...#",
      "#...#.#.#",
      "###.#.#.#",
      "#...#...#",
      "#.#.###.#",
      "#...N..F#",
      "#########",
    ],
  },
  {
    name: "Hedge Weave",
    tip: "Use the middle corridor to weave between the two nectar drops.",
    rows: [
      "#########",
      "#S..#..N#",
      "#.#.#.#.#",
      "#.#...#.#",
      "#.###.#.#",
      "#...#...#",
      "#.#.#.###",
      "#N..#..F#",
      "#########",
    ],
  },
];

const parseLevel = (level: LevelDefinition): ParsedLevel => {
  const width = level.rows[0]?.length ?? 0;
  const height = level.rows.length;
  let start: Position = { x: 0, y: 0 };
  let exit: Position = { x: 0, y: 0 };
  const nectarPositions = new Set<string>();

  level.rows.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell === "S") start = { x, y };
      if (cell === "F") exit = { x, y };
      if (cell === "N") nectarPositions.add(`${x},${y}`);
    });
  });

  return {
    ...level,
    width,
    height,
    start,
    exit,
    nectarPositions,
    nectarTotal: nectarPositions.size,
  };
};

const LEVEL_DATA = LEVELS.map(parseLevel);

export default function PollinatorPath() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = LEVEL_DATA[levelIndex];
  const [player, setPlayer] = useState<Position>(level.start);
  const [moves, setMoves] = useState(0);
  const [collected, setCollected] = useState<Set<string>>(() => new Set());
  const collectedRef = useRef<Set<string>>(new Set());
  const [won, setWon] = useState(false);

  const resetLevel = useCallback(() => {
    setPlayer(level.start);
    setMoves(0);
    const empty = new Set<string>();
    collectedRef.current = empty;
    setCollected(empty);
    setWon(false);
  }, [level]);

  useEffect(() => {
    resetLevel();
  }, [resetLevel]);

  const remainingNectar = level.nectarTotal - collected.size;
  const flowerOpen = remainingNectar <= 0;

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (won) return;

      setPlayer((prev) => {
        const nextX = prev.x + dx;
        const nextY = prev.y + dy;

        if (
          nextX < 0 ||
          nextX >= level.width ||
          nextY < 0 ||
          nextY >= level.height
        ) {
          return prev;
        }

        const cell = level.rows[nextY][nextX];
        if (cell === "#") {
          return prev;
        }

        const nextKey = `${nextX},${nextY}`;
        let nextCollected = collectedRef.current;

        if (level.nectarPositions.has(nextKey) && !nextCollected.has(nextKey)) {
          nextCollected = new Set(nextCollected);
          nextCollected.add(nextKey);
          collectedRef.current = nextCollected;
          setCollected(nextCollected);
        }

        setMoves((current) => current + 1);

        if (
          nextX === level.exit.x &&
          nextY === level.exit.y &&
          nextCollected.size >= level.nectarTotal
        ) {
          setWon(true);
        }

        return { x: nextX, y: nextY };
      });
    },
    [level, won],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (["arrowup", "w"].includes(key)) {
        event.preventDefault();
        movePlayer(0, -1);
      }
      if (["arrowdown", "s"].includes(key)) {
        event.preventDefault();
        movePlayer(0, 1);
      }
      if (["arrowleft", "a"].includes(key)) {
        event.preventDefault();
        movePlayer(-1, 0);
      }
      if (["arrowright", "d"].includes(key)) {
        event.preventDefault();
        movePlayer(1, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  const cellRows = useMemo(() => level.rows.map((row) => row.split("")), [level]);

  const nextLevel = () => {
    if (levelIndex === LEVEL_DATA.length - 1) {
      setLevelIndex(0);
    } else {
      setLevelIndex((current) => current + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-green-50 to-emerald-100 text-emerald-900 dark:from-emerald-950 dark:via-emerald-900 dark:to-emerald-800 dark:text-emerald-50">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
        <TopRightNav />

        <header className="rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur dark:bg-emerald-900/70">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600/80 dark:text-emerald-200/70">
                Pollinator Path
              </p>
              <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-50">
                Guide the Bee Through the Maze
              </h1>
              <p className="max-w-2xl text-lg text-emerald-700/80 dark:text-emerald-100/80">
                Collect every drop of nectar to unlock the flower. Use arrow
                keys or tap the controls to move.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-800/70 dark:text-emerald-100">
                Level {levelIndex + 1} / {LEVEL_DATA.length}: {level.name}
              </div>
              <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-100">
                Nectar: {collected.size} / {level.nectarTotal}
              </div>
              <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-800/70 dark:text-emerald-100">
                Moves: {moves}
              </div>
            </div>

            {level.tip ? (
              <p className="text-center text-sm text-emerald-700/80 dark:text-emerald-100/70">
                Tip: {level.tip}
              </p>
            ) : null}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
          <div className="rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur dark:bg-emerald-900/70">
            <div
              className="grid gap-1 rounded-2xl bg-white/90 p-4 shadow-inner backdrop-blur [--tile-size:2.25rem] sm:[--tile-size:2.75rem] dark:bg-emerald-950/60"
              style={{
                gridTemplateColumns: `repeat(${level.width}, var(--tile-size))`,
              }}
            >
              {cellRows.map((row, y) =>
                row.map((cell, x) => {
                  const key = `${x},${y}`;
                  const isPlayer = player.x === x && player.y === y;
                  const isWall = cell === "#";
                  const isExit = cell === "F";
                  const isStart = cell === "S";
                  const isNectar =
                    cell === "N" && !collected.has(key);

                  let content = "";
                  if (isPlayer) {
                    content = "🐝";
                  } else if (isExit) {
                    content = flowerOpen ? "🌸" : "🌱";
                  } else if (isNectar) {
                    content = "🍯";
                  } else if (isStart) {
                    content = "🏡";
                  }

                  return (
                    <div
                      key={key}
                      className={`flex h-[var(--tile-size)] w-[var(--tile-size)] items-center justify-center rounded-lg text-lg ${
                        isWall
                          ? "bg-emerald-900/70 shadow-inner dark:bg-emerald-950"
                          : "bg-emerald-50/90 text-emerald-800 dark:bg-emerald-800/60 dark:text-emerald-50"
                      } ${isPlayer ? "ring-2 ring-amber-300" : ""}`}
                    >
                      <span className="select-none">{content}</span>
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur dark:bg-emerald-900/70">
              <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-50">
                How to Play
              </h2>
              <ul className="mt-3 space-y-2 text-emerald-700/80 dark:text-emerald-100/80">
                <li>Move the bee with arrow keys or WASD.</li>
                <li>Collect all nectar drops 🍯.</li>
                <li>The flower opens when nectar is complete.</li>
                <li>Reach the flower 🌸 to finish the level.</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur dark:bg-emerald-900/70">
              <div className="grid grid-cols-3 gap-2 justify-items-center">
                <div />
                <Button
                  aria-label="Move up"
                  className="rounded-full"
                  size="icon"
                  type="button"
                  variant="secondary"
                  onClick={() => movePlayer(0, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <div />
                <Button
                  aria-label="Move left"
                  className="rounded-full"
                  size="icon"
                  type="button"
                  variant="secondary"
                  onClick={() => movePlayer(-1, 0)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center text-xs text-emerald-700/80 dark:text-emerald-100/80">
                  Tap to move
                </div>
                <Button
                  aria-label="Move right"
                  className="rounded-full"
                  size="icon"
                  type="button"
                  variant="secondary"
                  onClick={() => movePlayer(1, 0)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div />
                <Button
                  aria-label="Move down"
                  className="rounded-full"
                  size="icon"
                  type="button"
                  variant="secondary"
                  onClick={() => movePlayer(0, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <div />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetLevel}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset level
                </Button>
                {won ? (
                  <Button type="button" onClick={nextLevel}>
                    {levelIndex === LEVEL_DATA.length - 1
                      ? "Play again"
                      : "Next level"}
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur dark:bg-emerald-900/70">
              {won ? (
                <p className="text-center text-lg font-semibold text-emerald-800 dark:text-emerald-50">
                  Great flight! You delivered all the nectar. 🌼
                </p>
              ) : (
                <p className="text-center text-sm text-emerald-700/80 dark:text-emerald-100/80">
                  {flowerOpen
                    ? "The flower is open. Head to the petals!"
                    : `Collect ${remainingNectar} more nectar drop${
                        remainingNectar === 1 ? "" : "s"
                      } to open the flower.`}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
