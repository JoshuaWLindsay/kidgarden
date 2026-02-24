"use client";

import { useRef, useEffect, useCallback, useState } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// All tweakable constants live here.
export const CONFIG = {
  SIZE: 600,                    // Canvas width & height in px
  CARROT_ZONE_H: 70,            // Height of the carrot patch at the bottom
  HAWK_RADIUS: 18,              // Hawk circle radius
  HAWK_SPEED: 220,              // Hawk movement speed (px/s)
  RABBIT_RADIUS: 10,            // Rabbit circle radius
  RABBIT_SPEED_BASE: 70,        // Starting rabbit speed (px/s)
  RABBIT_SPEED_MAX: 155,        // Maximum rabbit speed after difficulty ramp
  SPAWN_INTERVAL_BASE: 2400,    // Starting ms between rabbit spawns
  SPAWN_INTERVAL_MIN: 800,      // Minimum ms between spawns (hardest)
  SCARE_RADIUS: 130,            // AOE radius for scare ability
  SCARE_DURATION: 700,          // ms the scare ring is visually shown
  SCARE_COOLDOWN: 3000,         // ms scare ability cooldown
  ATTACK_RADIUS: 55,            // Hawk attack range (px)
  ATTACK_COOLDOWN: 700,         // ms attack ability cooldown
  FEAR_DURATION: 2200,          // ms a scared rabbit flees before resuming
  CARROT_HEALTH_MAX: 100,       // Starting carrot health
  CARROT_DRAIN_RATE: 7,         // Carrot health drained per second per eating rabbit
  GAME_DURATION: 60,            // Seconds to survive for a win
  DIFFICULTY_INTERVAL: 8000,    // ms between difficulty bumps
  SPEED_INCREASE_PER_BUMP: 12,  // px/s speed added per difficulty bump
  SPAWN_DECREASE_PER_BUMP: 200, // ms removed from spawn interval per bump
} as const;

const C = CONFIG;

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "playing" | "won" | "lost";
type RabbitState = "moving" | "eating" | "fleeing";

interface Rabbit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: RabbitState;
  fearTimer: number;
  speed: number;
}

interface GS {
  phase: Phase;
  rabbits: Rabbit[];
  hawkX: number;
  hawkY: number;
  targetX: number;
  targetY: number;
  carrotHealth: number;
  score: number;
  timeLeft: number;
  scareCooldown: number;
  attackCooldown: number;
  scareTimer: number;
  scareX: number;
  scareY: number;
  spawnTimer: number;
  spawnInterval: number;
  difficultyTimer: number;
  rabbitSpeed: number;
  nextId: number;
}

interface UiState {
  phase: Phase;
  score: number;
  carrotHealth: number;
  timeLeft: number;
  scareCooldown: number;
  attackCooldown: number;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function normalize(dx: number, dy: number) {
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: dx / len, y: dy / len };
}

function makeInitialState(): GS {
  return {
    phase: "idle",
    rabbits: [],
    hawkX: C.SIZE / 2,
    hawkY: C.SIZE / 2,
    targetX: C.SIZE / 2,
    targetY: C.SIZE / 2,
    carrotHealth: C.CARROT_HEALTH_MAX,
    score: 0,
    timeLeft: C.GAME_DURATION,
    scareCooldown: 0,
    attackCooldown: 0,
    scareTimer: 0,
    scareX: 0,
    scareY: 0,
    spawnTimer: 0,
    spawnInterval: C.SPAWN_INTERVAL_BASE,
    difficultyTimer: 0,
    rabbitSpeed: C.RABBIT_SPEED_BASE,
    nextId: 0,
  };
}

function spawnRabbit(id: number, speed: number): Rabbit {
  const x = C.RABBIT_RADIUS * 2 + Math.random() * (C.SIZE - C.RABBIT_RADIUS * 4);
  const y = C.RABBIT_RADIUS;
  // Aim at a random point inside the carrot zone
  const tx = C.SIZE / 2 + (Math.random() - 0.5) * C.SIZE * 0.5;
  const ty = C.SIZE - C.CARROT_ZONE_H * 0.5;
  const dir = normalize(tx - x, ty - y);
  return { id, x, y, vx: dir.x * speed, vy: dir.y * speed, state: "moving", fearTimer: 0, speed };
}

// ─── ACTIONS (pure state transitions) ────────────────────────────────────────

function doScare(gs: GS): GS {
  if (gs.scareCooldown > 0 || gs.phase !== "playing") return gs;
  const rabbits = gs.rabbits.map((r) => {
    if (dist(r.x, r.y, gs.hawkX, gs.hawkY) > C.SCARE_RADIUS) return r;
    const dir = normalize(r.x - gs.hawkX, r.y - gs.hawkY);
    return {
      ...r,
      state: "fleeing" as RabbitState,
      fearTimer: C.FEAR_DURATION,
      vx: dir.x * r.speed * 1.6,
      vy: dir.y * r.speed * 1.6,
    };
  });
  return {
    ...gs,
    rabbits,
    scareCooldown: C.SCARE_COOLDOWN,
    scareTimer: C.SCARE_DURATION,
    scareX: gs.hawkX,
    scareY: gs.hawkY,
  };
}

function doAttack(gs: GS): GS {
  if (gs.attackCooldown > 0 || gs.phase !== "playing") return gs;
  let nearest: Rabbit | null = null;
  let nearestDist: number = C.ATTACK_RADIUS;
  for (const r of gs.rabbits) {
    const d = dist(r.x, r.y, gs.hawkX, gs.hawkY);
    if (d < nearestDist) { nearestDist = d; nearest = r; }
  }
  if (!nearest) return gs;
  return {
    ...gs,
    rabbits: gs.rabbits.filter((r) => r.id !== nearest!.id),
    score: gs.score + 10,
    attackCooldown: C.ATTACK_COOLDOWN,
  };
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

function update(gs: GS, dt: number, keys: Set<string>): GS {
  if (gs.phase !== "playing") return gs;
  const sec = dt / 1000;

  // Timers
  let timeLeft = Math.max(0, gs.timeLeft - sec);
  let scareCooldown = Math.max(0, gs.scareCooldown - dt);
  let attackCooldown = Math.max(0, gs.attackCooldown - dt);
  let scareTimer = Math.max(0, gs.scareTimer - dt);
  let spawnTimer = gs.spawnTimer + dt;
  let difficultyTimer = gs.difficultyTimer + dt;
  let spawnInterval = gs.spawnInterval;
  let rabbitSpeed = gs.rabbitSpeed;
  let nextId = gs.nextId;

  // Difficulty ramp
  if (difficultyTimer >= C.DIFFICULTY_INTERVAL) {
    difficultyTimer -= C.DIFFICULTY_INTERVAL;
    rabbitSpeed = Math.min(C.RABBIT_SPEED_MAX, rabbitSpeed + C.SPEED_INCREASE_PER_BUMP);
    spawnInterval = Math.max(C.SPAWN_INTERVAL_MIN, spawnInterval - C.SPAWN_DECREASE_PER_BUMP);
  }

  let rabbits = [...gs.rabbits];

  // Spawn
  if (spawnTimer >= spawnInterval) {
    spawnTimer -= spawnInterval;
    rabbits.push(spawnRabbit(nextId++, rabbitSpeed));
  }

  // Hawk movement
  let hawkX = gs.hawkX;
  let hawkY = gs.hawkY;
  let targetX = gs.targetX;
  let targetY = gs.targetY;

  let kdx = 0;
  let kdy = 0;
  if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) kdy -= 1;
  if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) kdy += 1;
  if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) kdx -= 1;
  if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) kdx += 1;

  if (kdx !== 0 || kdy !== 0) {
    const n = normalize(kdx, kdy);
    hawkX += n.x * C.HAWK_SPEED * sec;
    hawkY += n.y * C.HAWK_SPEED * sec;
    // Cancel click-to-move when keyboard is used
    targetX = hawkX;
    targetY = hawkY;
  } else {
    const cdx = targetX - hawkX;
    const cdy = targetY - hawkY;
    const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
    if (cdist > 2) {
      const step = Math.min(C.HAWK_SPEED * sec, cdist);
      const n = normalize(cdx, cdy);
      hawkX += n.x * step;
      hawkY += n.y * step;
    }
  }

  // Clamp hawk inside garden
  hawkX = Math.max(C.HAWK_RADIUS, Math.min(C.SIZE - C.HAWK_RADIUS, hawkX));
  hawkY = Math.max(C.HAWK_RADIUS, Math.min(C.SIZE - C.HAWK_RADIUS, hawkY));

  // Rabbit updates
  let carrotDrain = 0;
  rabbits = rabbits.map((r) => {
    if (r.state === "eating") {
      carrotDrain += C.CARROT_DRAIN_RATE * sec;
      return r;
    }

    if (r.state === "fleeing") {
      const fearTimer = Math.max(0, r.fearTimer - dt);
      const nx = r.x + r.vx * sec;
      const ny = r.y + r.vy * sec;
      if (fearTimer <= 0) {
        // Resume heading toward carrot zone
        const tx = C.SIZE / 2 + (Math.random() - 0.5) * C.SIZE * 0.4;
        const ty = C.SIZE - C.CARROT_ZONE_H - C.RABBIT_RADIUS;
        const dir = normalize(tx - nx, ty - ny);
        return { ...r, x: nx, y: ny, vx: dir.x * r.speed, vy: dir.y * r.speed, state: "moving" as RabbitState, fearTimer: 0 };
      }
      return { ...r, x: nx, y: ny, fearTimer };
    }

    // moving
    const nx = r.x + r.vx * sec;
    const ny = r.y + r.vy * sec;
    if (ny + C.RABBIT_RADIUS >= C.SIZE - C.CARROT_ZONE_H) {
      return { ...r, x: nx, y: C.SIZE - C.CARROT_ZONE_H - C.RABBIT_RADIUS, vx: 0, vy: 0, state: "eating" as RabbitState };
    }
    return { ...r, x: nx, y: ny };
  });

  // Remove rabbits that fled off the top edge
  rabbits = rabbits.filter((r) => r.y > -C.RABBIT_RADIUS * 4);

  const carrotHealth = Math.max(0, gs.carrotHealth - carrotDrain);

  let phase: Phase = "playing";
  if (carrotHealth <= 0) phase = "lost";
  else if (timeLeft <= 0) phase = "won";

  return {
    phase,
    rabbits,
    hawkX, hawkY, targetX, targetY,
    carrotHealth,
    score: gs.score,
    timeLeft,
    scareCooldown, attackCooldown,
    scareTimer, scareX: gs.scareX, scareY: gs.scareY,
    spawnTimer, spawnInterval,
    difficultyTimer, rabbitSpeed,
    nextId,
  };
}

// ─── DRAWING HELPERS ──────────────────────────────────────────────────────────

function drawCarrot(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Body
  ctx.fillStyle = "#FF6600";
  ctx.beginPath();
  ctx.moveTo(cx, cy + 15);
  ctx.lineTo(cx - 5, cy - 2);
  ctx.lineTo(cx + 5, cy - 2);
  ctx.closePath();
  ctx.fill();
  // Leaves
  ctx.strokeStyle = "#22A010";
  ctx.lineWidth = 1.5;
  for (const angle of [-0.4, 0, 0.4]) {
    ctx.save();
    ctx.translate(cx, cy - 2);
    ctx.rotate(angle - Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -9);
    ctx.stroke();
    ctx.restore();
  }
}

function drawRabbit(ctx: CanvasRenderingContext2D, r: Rabbit) {
  ctx.save();

  const bodyColor =
    r.state === "fleeing" ? "#AAAAAA" :
    r.state === "eating"  ? "#C8A870" :
    "#EEE8CC";
  const earColor = r.state === "fleeing" ? "#888" : "#D4C89C";
  const eyeColor = r.state === "fleeing" ? "#CC0000" : "#222222";

  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(r.x, r.y, C.RABBIT_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = earColor;
  ctx.beginPath();
  ctx.ellipse(r.x - 3, r.y - C.RABBIT_RADIUS - 4, 2.5, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(r.x + 3, r.y - C.RABBIT_RADIUS - 4, 2.5, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = eyeColor;
  ctx.beginPath();
  ctx.arc(r.x + 4, r.y - 2, 2, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = "#FFB0B0";
  ctx.beginPath();
  ctx.arc(r.x + C.RABBIT_RADIUS, r.y + 1, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawHawk(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();

  // Wings (behind body)
  ctx.fillStyle = "#5C2A08";
  ctx.beginPath();
  ctx.ellipse(x - C.HAWK_RADIUS + 1, y + 3, 10, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + C.HAWK_RADIUS - 1, y + 3, 10, 5, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = "#7B3A10";
  ctx.beginPath();
  ctx.arc(x, y, C.HAWK_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Chest
  ctx.fillStyle = "#C8906A";
  ctx.beginPath();
  ctx.ellipse(x, y + 5, 7, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye ring
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(x + 6, y - 5, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(x + 7, y - 5, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = "#D49000";
  ctx.beginPath();
  ctx.moveTo(x + C.HAWK_RADIUS - 2, y - 3);
  ctx.lineTo(x + C.HAWK_RADIUS + 8, y + 1);
  ctx.lineTo(x + C.HAWK_RADIUS - 2, y + 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function render(ctx: CanvasRenderingContext2D, gs: GS) {
  // Garden background
  ctx.fillStyle = "#5a8a4a";
  ctx.fillRect(0, 0, C.SIZE, C.SIZE);

  // Subtle row lines
  ctx.strokeStyle = "rgba(0,0,0,0.07)";
  ctx.lineWidth = 1;
  for (let ry = 0; ry < C.SIZE - C.CARROT_ZONE_H; ry += 24) {
    ctx.beginPath(); ctx.moveTo(0, ry); ctx.lineTo(C.SIZE, ry); ctx.stroke();
  }

  // Spawn edge hint (top)
  ctx.fillStyle = "rgba(120,180,255,0.12)";
  ctx.fillRect(0, 0, C.SIZE, 6);

  // Carrot zone (soil)
  const czY = C.SIZE - C.CARROT_ZONE_H;
  ctx.fillStyle = "#7A4010";
  ctx.fillRect(0, czY, C.SIZE, C.CARROT_ZONE_H);
  // Darker soil edge
  ctx.fillStyle = "#5A2E08";
  ctx.fillRect(0, czY, C.SIZE, 5);

  // Carrots
  const carrotCount = 28;
  for (let i = 0; i < carrotCount; i++) {
    drawCarrot(ctx, (C.SIZE / (carrotCount + 1)) * (i + 1), czY + C.CARROT_ZONE_H * 0.55);
  }

  // Garden border
  ctx.strokeStyle = "#3a6030";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, C.SIZE - 4, C.SIZE - 4);

  // Scare wave animation
  if (gs.scareTimer > 0) {
    const alpha = gs.scareTimer / C.SCARE_DURATION;
    const expansion = 1 - alpha * 0.25; // ring expands outward slightly
    ctx.save();
    ctx.strokeStyle = `rgba(255, 220, 0, ${alpha * 0.9})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(gs.scareX, gs.scareY, C.SCARE_RADIUS * expansion, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.15;
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.restore();
  }

  // Rabbits
  for (const r of gs.rabbits) drawRabbit(ctx, r);

  // Attack range ring (shown when ready)
  if (gs.attackCooldown === 0 && gs.phase === "playing") {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#FF4444";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(gs.hawkX, gs.hawkY, C.ATTACK_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Hawk (drawn last so it's on top)
  drawHawk(ctx, gs.hawkX, gs.hawkY);
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function HawkGardenGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS>(makeInitialState());
  const keysRef = useRef<Set<string>>(new Set());

  const [ui, setUi] = useState<UiState>({
    phase: "idle",
    score: 0,
    carrotHealth: C.CARROT_HEALTH_MAX,
    timeLeft: C.GAME_DURATION,
    scareCooldown: 0,
    attackCooldown: 0,
  });

  // ── Game loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;

    function loop(now: number) {
      const dt = lastTime === 0 ? 0 : Math.min(now - lastTime, 50);
      lastTime = now;

      gsRef.current = update(gsRef.current, dt, keysRef.current);
      render(ctx!, gsRef.current);

      const gs = gsRef.current;
      setUi({
        phase: gs.phase,
        score: gs.score,
        carrotHealth: gs.carrotHealth,
        timeLeft: Math.ceil(gs.timeLeft),
        scareCooldown: gs.scareCooldown,
        attackCooldown: gs.attackCooldown,
      });

      animId = requestAnimationFrame(loop);
    }

    render(ctx, gsRef.current);
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // ── Keyboard input ──
  useEffect(() => {
    const PREVENT = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "]);

    const onKeyDown = (e: KeyboardEvent) => {
      if (PREVENT.has(e.key)) e.preventDefault();
      keysRef.current.add(e.key);
      if (e.key === " ") gsRef.current = doScare(gsRef.current);
      if (e.key === "e" || e.key === "E") gsRef.current = doAttack(gsRef.current);
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // ── Start / restart ──
  const startGame = useCallback(() => {
    gsRef.current = { ...makeInitialState(), phase: "playing" };
    keysRef.current.clear();
  }, []);

  // ── Canvas click: attack or click-to-move ──
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (C.SIZE / rect.width);
    const my = (e.clientY - rect.top) * (C.SIZE / rect.height);
    const gs = gsRef.current;
    if (gs.phase !== "playing") return;

    // Attack if a rabbit is both near the click point AND within hawk attack range
    const nearClick = gs.rabbits.find((r) => dist(r.x, r.y, mx, my) < C.RABBIT_RADIUS * 2.5);
    if (nearClick && dist(nearClick.x, nearClick.y, gs.hawkX, gs.hawkY) < C.ATTACK_RADIUS) {
      gsRef.current = doAttack(gs);
    } else {
      gsRef.current = { ...gs, targetX: mx, targetY: my };
    }
  }, []);

  // ── Derived UI values ──
  const hpPct = Math.max(0, (ui.carrotHealth / C.CARROT_HEALTH_MAX) * 100);
  const hpColor = hpPct > 50 ? "#22c55e" : hpPct > 25 ? "#eab308" : "#ef4444";
  const scareReady = ui.scareCooldown === 0;
  const attackReady = ui.attackCooldown === 0;

  return (
    <div className="flex flex-col items-center gap-4 select-none font-sans">

      {/* HUD */}
      <div className="flex items-center gap-5 w-full max-w-[600px] px-3 py-2 bg-green-900/80 rounded-xl text-white text-sm font-medium">
        {/* Carrot health */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex justify-between text-xs text-green-300">
            <span>🥕 Carrots</span>
            <span>{Math.ceil(ui.carrotHealth)}%</span>
          </div>
          <div className="h-3 bg-green-950 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{ width: `${hpPct}%`, backgroundColor: hpColor }}
            />
          </div>
        </div>
        {/* Timer */}
        <div className="text-center shrink-0">
          <div className="text-xs text-green-300">Time</div>
          <div className="text-lg font-bold tabular-nums">{ui.timeLeft}s</div>
        </div>
        {/* Score */}
        <div className="text-center shrink-0">
          <div className="text-xs text-green-300">Score</div>
          <div className="text-lg font-bold tabular-nums">{ui.score}</div>
        </div>
      </div>

      {/* Canvas + overlays */}
      <div className="relative w-full max-w-[600px]">
        <canvas
          ref={canvasRef}
          width={C.SIZE}
          height={C.SIZE}
          onClick={handleClick}
          className="w-full aspect-square rounded-lg shadow-2xl cursor-crosshair block"
          style={{ touchAction: "none" }}
        />

        {/* Idle overlay */}
        {ui.phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 rounded-lg gap-3">
            <div className="text-white text-4xl font-bold drop-shadow">🦅 Hawk Garden</div>
            <div className="text-green-200 text-center text-sm max-w-[280px] leading-relaxed">
              Protect the carrot patch from hungry rabbits!
              Scare them away or catch them before they eat your carrots.
            </div>
            <div className="text-green-300 text-xs text-center max-w-[280px] bg-black/30 rounded-lg px-3 py-2">
              <span className="font-bold">Move:</span> WASD / Arrow keys or click<br />
              <span className="font-bold">Scare:</span> Space &nbsp;·&nbsp;
              <span className="font-bold">Attack:</span> Click rabbit or E key
            </div>
            <button
              onClick={startGame}
              className="mt-1 px-8 py-3 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Win overlay */}
        {ui.phase === "won" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 rounded-lg gap-3">
            <div className="text-yellow-300 text-4xl font-bold drop-shadow">You Win! 🎉</div>
            <div className="text-white text-2xl">Score: {ui.score}</div>
            <div className="text-green-200">The garden is safe!</div>
            <button
              onClick={startGame}
              className="mt-2 px-8 py-3 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Lose overlay */}
        {ui.phase === "lost" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 rounded-lg gap-3">
            <div className="text-red-400 text-4xl font-bold drop-shadow">Oh no! 🥕</div>
            <div className="text-white text-xl text-center">The rabbits ate all the carrots!</div>
            <div className="text-green-200 text-xl">Score: {ui.score}</div>
            <button
              onClick={startGame}
              className="mt-2 px-8 py-3 bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Ability cooldown legend (only while playing) */}
      {ui.phase === "playing" && (
        <div className="flex gap-3 text-xs">
          <span
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              scareReady
                ? "bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-200"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            }`}
          >
            Space: Scare {scareReady ? "✓" : `(${(ui.scareCooldown / 1000).toFixed(1)}s)`}
          </span>
          <span
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              attackReady
                ? "bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            }`}
          >
            Click/E: Attack {attackReady ? "✓" : `(${(ui.attackCooldown / 1000).toFixed(1)}s)`}
          </span>
        </div>
      )}
    </div>
  );
}
