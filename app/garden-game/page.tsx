"use client";
/* eslint-disable max-lines-per-function, id-length, no-mixed-operators, max-len, max-statements, indent */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function FrogInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);

  const canvasWidth = 800;
  const canvasHeight = 600;

  // Frog state – positioned at the bottom center
  const frog = useRef({
    x: canvasWidth / 2 - 20,
    y: canvasHeight - 60,
    width: 40,
    height: 40,
  });

  // Tongue state: null when inactive; when active, it extends upward from the frog
  const tongue = useRef<any>(null);

  // Invaders: arranged in a grid
  const invaders = useRef<any[]>([]);
  const invaderRows = 3;
  const invaderCols = 8;
  const invaderWidth = 40;
  const invaderHeight = 40;
  const invaderSpacingX = 20;
  const invaderSpacingY = 20;
  const invaderSpeed = 1; // horizontal speed (pixels per frame)
  const invaderDrop = 20; // drop down when hitting an edge
  const invaderDirection = useRef(1); // 1 for right, -1 for left

  // Initialize invaders in a grid
  const initInvaders = () => {
    const invs = [];
    const startX = 50;
    const startY = 50;
    for (let row = 0; row < invaderRows; row++) {
      for (let col = 0; col < invaderCols; col++) {
        invs.push({
          x: startX + col * (invaderWidth + invaderSpacingX),
          y: startY + row * (invaderHeight + invaderSpacingY),
          width: invaderWidth,
          height: invaderHeight,
          captured: false,
        });
      }
    }
    invaders.current = invs;
  };

  // Keep refs in sync with state
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  // Set up the invaders when the component mounts
  useEffect(() => {
    initInvaders();
  }, []);

  // Handle key events:
  // - Left/Right arrow keys move the frog horizontally.
  // - Space bar throws the tongue (if not already active).
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.code === 'ArrowLeft') {
        frog.current.x = Math.max(0, frog.current.x - 20);
      } else if (e.code === 'ArrowRight') {
        frog.current.x = Math.min(
          canvasWidth - frog.current.width,
          frog.current.x + 20
        );
      } else if (e.code === 'Space') {
        if (!tongue.current) {
          tongue.current = {
            x: frog.current.x + frog.current.width / 2 - 5, // tongue width of 10px
            height: 0,
            active: true,
          };
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Main game loop using requestAnimationFrame
  const gameLoopRef = useRef<number>();
  const updateGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background – a garden green
    ctx.fillStyle = "#A3D977";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw the frog using an emoji
    ctx.font = "40px sans-serif";
    ctx.fillText(
      "🐸",
      frog.current.x,
      frog.current.y + frog.current.height - 5
    );

    // Update and draw the tongue if active
    if (tongue.current) {
      // Extend the tongue upward by increasing its height
      const t = tongue.current;
      t.height += 15;
      const tHeight = t.height;
      const tX = t.x;
      ctx.fillStyle = "red";
      // Draw the tongue as a rectangle starting from the frog’s mouth upward
      ctx.fillRect(
        tX,
        frog.current.y - tHeight,
        10,
        tHeight
      );

      // Check collision of tongue with each invader (using simple AABB collision)
      invaders.current.forEach((invader) => {
        if (!invader.captured) {
          const tongueTop = frog.current.y - tHeight;
          const tongueBottom = frog.current.y;
          const tongueLeft = tX;
          const tongueRight = tX + 10;

          const invLeft = invader.x;
          const invRight = invader.x + invader.width;
          const invTop = invader.y;
          const invBottom = invader.y + invader.height;

          if (
            tongueRight > invLeft &&
            tongueLeft < invRight &&
            tongueTop < invBottom &&
            tongueBottom > invTop
          ) {
            invader.captured = true;
            setScore((prev) => prev + 1);
            // Reset tongue once it captures an invader
            tongue.current = null;
          }
        }
      });

      // If the tongue extends off the top of the canvas, remove it
      if (frog.current.y - tHeight <= 0) {
        tongue.current = null;
      }
    }

    // Update invaders' positions: move horizontally
    let hitEdge = false;
    invaders.current.forEach((invader) => {
      if (!invader.captured) {
        invader.x += invaderDirection.current * invaderSpeed;
        // Check if any invader hits the left or right edge
        if (invader.x <= 0 || invader.x + invader.width >= canvasWidth) {
          hitEdge = true;
        }
      }
    });

    // If an edge is hit, drop all invaders down and reverse their horizontal direction
    if (hitEdge) {
      invaderDirection.current *= -1;
      invaders.current.forEach((invader) => {
        if (!invader.captured) {
          invader.y += invaderDrop;
          // If any invader reaches the frog's level, it's game over
          if (invader.y + invader.height >= frog.current.y) {
            setGameOver(true);
          }
        }
      });
    }

    // Draw invaders – using a fly emoji for a playful look
    ctx.font = "40px sans-serif";
    invaders.current.forEach((invader) => {
      if (!invader.captured) {
        ctx.fillText("🪰", invader.x, invader.y + invader.height - 5);
      }
    });

    // Display score
    ctx.fillStyle = "black";
    ctx.font = "20px sans-serif";
    ctx.fillText(`Score: ${scoreRef.current}`, 10, 30);

    // Win condition: all invaders captured
    const remaining = invaders.current.filter((inv) => !inv.captured);
    if (remaining.length === 0) {
      setGameOver(true);
      // End this frame; effect will handle stopping the loop.
      return;
    }

    // Continue the game loop if not over
    if (!gameOverRef.current) {
      gameLoopRef.current = requestAnimationFrame(updateGame);
    }
  };

  // Start the game loop when the component mounts
  useEffect(() => {
    if (!gameOverRef.current) {
      // Cancel any existing loop just in case
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameOver]);

  // Restart the game by resetting all game state
  const handleRestart = () => {
    frog.current = {
      x: canvasWidth / 2 - 20,
      y: canvasHeight - 60,
      width: 40,
      height: 40,
    };
    tongue.current = null;
    initInvaders();
    invaderDirection.current = 1;
    setScore(0);
    setGameOver(false);
    // Do not schedule a new loop here; the effect watching `gameOver`
    // will start the loop after we set it to false.
  };

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

      <main className="flex flex-col gap-[16px] row-start-2 items-center w-full max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-200">
          Frog Invaders
        </h1>
        <p className="text-center text-green-800 dark:text-green-100">
          Help the frog (🐸) capture the garden invaders by throwing its tongue!
        </p>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "2px solid #555", backgroundColor: "#A3D977" }}
        />
        {gameOver && (
          <div className="mt-5 text-center">
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-100">Game Over</h2>
            <p className="mt-1 text-green-700 dark:text-green-200">Your score: {score}</p>
            <button
              onClick={handleRestart}
              className="mt-3 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors"
            >
              Restart Game
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
