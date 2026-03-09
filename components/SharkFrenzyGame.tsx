"use client";

import { useRef, useEffect, useCallback, useState } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
  WIDTH: 700,
  HEIGHT: 500,
  SHARK_RADIUS: 22,
  SHARK_SPEED: 240,
  FISH_RADIUS: 10,
  HOUSE_WIDTH: 60,
  HOUSE_HEIGHT: 80,
  FISH_WOBBLE: 30,
  EAT_RADIUS: 30,
} as const;

const C = CONFIG;

// ─── LEVELS ───────────────────────────────────────────────────────────────────

interface LevelConfig {
  name: string;
  totalFish: number;
  maxEscaped: number;
  fishSpeedBase: number;
  fishSpeedMax: number;
  spawnIntervalBase: number;
  spawnIntervalMin: number;
  difficultyInterval: number;
  speedBump: number;
  spawnDecrease: number;
}

const LEVELS: LevelConfig[] = [
  {
    name: "Level 1 — Slow Fish",
    totalFish: 20,
    maxEscaped: 5,
    fishSpeedBase: 35,
    fishSpeedMax: 65,
    spawnIntervalBase: 2200,
    spawnIntervalMin: 1200,
    difficultyInterval: 8000,
    speedBump: 5,
    spawnDecrease: 100,
  },
  {
    name: "Level 2 — Medium Fish",
    totalFish: 25,
    maxEscaped: 5,
    fishSpeedBase: 55,
    fishSpeedMax: 100,
    spawnIntervalBase: 1800,
    spawnIntervalMin: 800,
    difficultyInterval: 6000,
    speedBump: 8,
    spawnDecrease: 150,
  },
  {
    name: "Level 3 — Fast Fish",
    totalFish: 30,
    maxEscaped: 5,
    fishSpeedBase: 80,
    fishSpeedMax: 140,
    spawnIntervalBase: 1400,
    spawnIntervalMin: 500,
    difficultyInterval: 5000,
    speedBump: 10,
    spawnDecrease: 180,
  },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "playing" | "won" | "lost";

interface Fish {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  color: string;
  tailPhase: number;
}

interface GS {
  phase: Phase;
  level: number;
  fishes: Fish[];
  sharkX: number;
  sharkY: number;
  targetX: number;
  targetY: number;
  sharkAngle: number;
  eaten: number;
  escaped: number;
  spawned: number;
  spawnTimer: number;
  spawnInterval: number;
  difficultyTimer: number;
  fishSpeed: number;
  nextId: number;
  mouthOpen: number;
}

interface UiState {
  phase: Phase;
  level: number;
  eaten: number;
  escaped: number;
  remaining: number;
  totalFish: number;
  maxEscaped: number;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const FISH_COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6FD8",
  "#FF8C42", "#A66CFF", "#54BAB9", "#FF5E78", "#00C9A7",
];

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function normalize(dx: number, dy: number) {
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: dx / len, y: dy / len };
}

function makeInitialState(level: number): GS {
  const lv = LEVELS[level];
  return {
    phase: "idle",
    level,
    fishes: [],
    sharkX: C.WIDTH * 0.3,
    sharkY: C.HEIGHT / 2,
    targetX: C.WIDTH * 0.3,
    targetY: C.HEIGHT / 2,
    sharkAngle: 0,
    eaten: 0,
    escaped: 0,
    spawned: 0,
    spawnTimer: 0,
    spawnInterval: lv.spawnIntervalBase,
    difficultyTimer: 0,
    fishSpeed: lv.fishSpeedBase,
    nextId: 0,
    mouthOpen: 0,
  };
}

function spawnFish(id: number, speed: number): Fish {
  const y = 40 + Math.random() * (C.HEIGHT - 80);
  const houseTargetX = C.WIDTH - C.HOUSE_WIDTH / 2;
  const houseTargetY = C.HEIGHT / 2 + (Math.random() - 0.5) * C.HOUSE_HEIGHT * 0.6;
  const dir = normalize(houseTargetX - (-C.FISH_RADIUS), houseTargetY - y);
  const s = speed + (Math.random() - 0.5) * 20;
  return {
    id,
    x: -C.FISH_RADIUS,
    y,
    vx: dir.x * s,
    vy: dir.y * s,
    speed: s,
    wobbleOffset: Math.random() * Math.PI * 2,
    wobbleSpeed: 1.5 + Math.random() * 2,
    color: FISH_COLORS[id % FISH_COLORS.length],
    tailPhase: Math.random() * Math.PI * 2,
  };
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

function update(gs: GS, dt: number, keys: Set<string>): GS {
  if (gs.phase !== "playing") return gs;
  const sec = dt / 1000;
  const lv = LEVELS[gs.level];

  let {
    spawnTimer, spawnInterval, difficultyTimer, fishSpeed,
    spawned, nextId, eaten, escaped, mouthOpen,
  } = gs;

  // Difficulty ramp
  difficultyTimer += dt;
  if (difficultyTimer >= lv.difficultyInterval) {
    difficultyTimer -= lv.difficultyInterval;
    fishSpeed = Math.min(lv.fishSpeedMax, fishSpeed + lv.speedBump);
    spawnInterval = Math.max(lv.spawnIntervalMin, spawnInterval - lv.spawnDecrease);
  }

  let fishes = [...gs.fishes];

  // Spawn fish
  spawnTimer += dt;
  if (spawnTimer >= spawnInterval && spawned < lv.totalFish) {
    spawnTimer -= spawnInterval;
    fishes.push(spawnFish(nextId++, fishSpeed));
    spawned++;
  }

  // Shark movement
  let sharkX = gs.sharkX;
  let sharkY = gs.sharkY;
  let targetX = gs.targetX;
  let targetY = gs.targetY;
  let sharkAngle = gs.sharkAngle;

  let kdx = 0;
  let kdy = 0;
  if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) kdy -= 1;
  if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) kdy += 1;
  if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) kdx -= 1;
  if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) kdx += 1;

  if (kdx !== 0 || kdy !== 0) {
    const n = normalize(kdx, kdy);
    sharkX += n.x * C.SHARK_SPEED * sec;
    sharkY += n.y * C.SHARK_SPEED * sec;
    targetX = sharkX;
    targetY = sharkY;
    sharkAngle = Math.atan2(n.y, n.x);
  } else {
    const cdx = targetX - sharkX;
    const cdy = targetY - sharkY;
    const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
    if (cdist > 3) {
      const step = Math.min(C.SHARK_SPEED * sec, cdist);
      const n = normalize(cdx, cdy);
      sharkX += n.x * step;
      sharkY += n.y * step;
      sharkAngle = Math.atan2(n.y, n.x);
    }
  }

  sharkX = Math.max(C.SHARK_RADIUS, Math.min(C.WIDTH - C.SHARK_RADIUS, sharkX));
  sharkY = Math.max(C.SHARK_RADIUS, Math.min(C.HEIGHT - C.SHARK_RADIUS, sharkY));

  // Mouth animation decay
  mouthOpen = Math.max(0, mouthOpen - sec * 4);

  // Move fish & check collisions
  const survivingFish: Fish[] = [];
  for (const f of fishes) {
    const wobble = Math.sin(f.wobbleOffset + f.wobbleSpeed * (Date.now() / 1000)) * C.FISH_WOBBLE * sec;
    const nx = f.x + f.vx * sec;
    const ny = Math.max(C.FISH_RADIUS, Math.min(C.HEIGHT - C.FISH_RADIUS, f.y + f.vy * sec + wobble));

    if (dist(sharkX, sharkY, nx, ny) < C.EAT_RADIUS) {
      eaten++;
      mouthOpen = 1;
      continue;
    }

    const houseY = C.HEIGHT / 2;
    if (nx >= C.WIDTH - C.HOUSE_WIDTH && Math.abs(ny - houseY) < C.HOUSE_HEIGHT / 2 + C.FISH_RADIUS) {
      escaped++;
      continue;
    }

    if (nx > C.WIDTH + C.FISH_RADIUS * 2) {
      escaped++;
      continue;
    }

    survivingFish.push({ ...f, x: nx, y: ny, tailPhase: f.tailPhase + sec * 8 });
  }
  fishes = survivingFish;

  let phase: Phase = "playing";
  if (escaped >= lv.maxEscaped) {
    phase = "lost";
  } else if (eaten >= lv.totalFish) {
    phase = "won";
  } else if (eaten + escaped >= lv.totalFish && fishes.length === 0) {
    phase = "lost";
  }

  return {
    phase, level: gs.level, fishes, sharkX, sharkY, targetX, targetY, sharkAngle,
    eaten, escaped, spawned, spawnTimer, spawnInterval,
    difficultyTimer, fishSpeed, nextId, mouthOpen,
  };
}

// ─── DRAWING ──────────────────────────────────────────────────────────────────

function drawOceanBackground(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(0, 0, 0, C.HEIGHT);
  grad.addColorStop(0, "#0077B6");
  grad.addColorStop(0.5, "#005A8D");
  grad.addColorStop(1, "#003D5C");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, C.WIDTH, C.HEIGHT);

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  const t = Date.now() / 2000;
  for (let wy = 30; wy < C.HEIGHT; wy += 40) {
    ctx.beginPath();
    for (let wx = 0; wx <= C.WIDTH; wx += 5) {
      const y = wy + Math.sin(wx * 0.02 + t + wy * 0.1) * 6;
      wx === 0 ? ctx.moveTo(wx, y) : ctx.lineTo(wx, y);
    }
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 12; i++) {
    const bx = ((i * 67 + 30) % C.WIDTH);
    const by = ((i * 43 + Math.sin(t + i) * 20 + 100) % C.HEIGHT);
    ctx.beginPath();
    ctx.arc(bx, by, 3 + (i % 4), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRainbowHouse(ctx: CanvasRenderingContext2D) {
  const hx = C.WIDTH - C.HOUSE_WIDTH;
  const hy = C.HEIGHT / 2 - C.HOUSE_HEIGHT / 2;

  const grad = ctx.createLinearGradient(hx, hy, hx, hy + C.HOUSE_HEIGHT);
  grad.addColorStop(0, "#FF0000");
  grad.addColorStop(0.17, "#FF8C00");
  grad.addColorStop(0.33, "#FFD700");
  grad.addColorStop(0.5, "#00C853");
  grad.addColorStop(0.67, "#2196F3");
  grad.addColorStop(0.83, "#4A148C");
  grad.addColorStop(1, "#E040FB");
  ctx.fillStyle = grad;
  ctx.fillRect(hx, hy, C.HOUSE_WIDTH, C.HOUSE_HEIGHT);

  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.moveTo(hx - 8, hy);
  ctx.lineTo(hx + C.HOUSE_WIDTH / 2, hy - 25);
  ctx.lineTo(hx + C.HOUSE_WIDTH + 8, hy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#DAA520";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#8B4513";
  ctx.fillRect(hx + C.HOUSE_WIDTH / 2 - 10, hy + C.HOUSE_HEIGHT - 30, 20, 30);

  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(hx + C.HOUSE_WIDTH / 2 + 5, hy + C.HOUSE_HEIGHT - 15, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(135, 206, 250, 0.8)";
  ctx.fillRect(hx + 8, hy + 12, 16, 14);
  ctx.strokeStyle = "#DAA520";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(hx + 8, hy + 12, 16, 14);

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2;
  ctx.strokeRect(hx, hy, C.HOUSE_WIDTH, C.HOUSE_HEIGHT);

  ctx.save();
  ctx.shadowColor = "#FFD700";
  ctx.shadowBlur = 15;
  ctx.strokeStyle = "rgba(255,215,0,0.3)";
  ctx.lineWidth = 3;
  ctx.strokeRect(hx - 2, hy - 2, C.HOUSE_WIDTH + 4, C.HOUSE_HEIGHT + 4);
  ctx.restore();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("HOME", hx + C.HOUSE_WIDTH / 2, hy - 28);
  ctx.textAlign = "start";
}

function drawFish(ctx: CanvasRenderingContext2D, f: Fish) {
  ctx.save();
  ctx.translate(f.x, f.y);

  const tailSwing = Math.sin(f.tailPhase) * 0.3;

  ctx.fillStyle = f.color;
  ctx.beginPath();
  ctx.moveTo(-C.FISH_RADIUS - 2, 0);
  ctx.lineTo(-C.FISH_RADIUS - 10, -7 + tailSwing * 10);
  ctx.lineTo(-C.FISH_RADIUS - 10, 7 + tailSwing * 10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = f.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, C.FISH_RADIUS, C.FISH_RADIUS * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 2, C.FISH_RADIUS * 0.7, C.FISH_RADIUS * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(C.FISH_RADIUS * 0.5, -C.FISH_RADIUS * 0.15, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111111";
  ctx.beginPath();
  ctx.arc(C.FISH_RADIUS * 0.6, -C.FISH_RADIUS * 0.15, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = f.color;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(-3, -C.FISH_RADIUS * 0.6);
  ctx.lineTo(2, -C.FISH_RADIUS - 4);
  ctx.lineTo(6, -C.FISH_RADIUS * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawShark(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, mouthOpen: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const r = C.SHARK_RADIUS;
  const mouthAngle = 0.15 + mouthOpen * 0.35;

  ctx.fillStyle = "#6B7B8D";
  ctx.beginPath();
  ctx.moveTo(-r - 5, 0);
  ctx.lineTo(-r - 20, -14);
  ctx.lineTo(-r - 12, 0);
  ctx.lineTo(-r - 20, 14);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#7B8FA0";
  ctx.beginPath();
  ctx.ellipse(0, 0, r + 5, r * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#C8D6E0";
  ctx.beginPath();
  ctx.ellipse(2, r * 0.15, r * 0.8, r * 0.35, 0, 0, Math.PI);
  ctx.fill();

  ctx.fillStyle = "#5A6A7A";
  ctx.beginPath();
  ctx.moveTo(-5, -r * 0.6);
  ctx.lineTo(0, -r - 12);
  ctx.lineTo(8, -r * 0.55);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#CC3333";
  ctx.beginPath();
  ctx.moveTo(r + 5, 0);
  ctx.lineTo(r - 5, -r * mouthAngle * 2.5);
  ctx.lineTo(r - 5, r * mouthAngle * 2.5);
  ctx.closePath();
  ctx.fill();

  if (mouthOpen > 0.2) {
    ctx.fillStyle = "#FFFFFF";
    const teethCount = 4;
    for (let i = 0; i < teethCount; i++) {
      const t = (i + 0.5) / teethCount;
      const tx = r + 5 - t * 10;
      const topY = -r * mouthAngle * 2.5 * (1 - t);
      ctx.beginPath();
      ctx.moveTo(tx - 1.5, topY);
      ctx.lineTo(tx, topY + 3);
      ctx.lineTo(tx + 1.5, topY);
      ctx.closePath();
      ctx.fill();
      const botY = r * mouthAngle * 2.5 * (1 - t);
      ctx.beginPath();
      ctx.moveTo(tx - 1.5, botY);
      ctx.lineTo(tx, botY - 3);
      ctx.lineTo(tx + 1.5, botY);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(r * 0.35, -r * 0.3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111111";
  ctx.beginPath();
  ctx.arc(r * 0.4, -r * 0.3, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#6B7B8D";
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(-2, r * 0.5);
  ctx.lineTo(-10, r + 6);
  ctx.lineTo(6, r * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
}

function render(ctx: CanvasRenderingContext2D, gs: GS) {
  drawOceanBackground(ctx);
  drawRainbowHouse(ctx);
  for (const f of gs.fishes) drawFish(ctx, f);
  drawShark(ctx, gs.sharkX, gs.sharkY, gs.sharkAngle, gs.mouthOpen);

  ctx.strokeStyle = "rgba(0,119,182,0.4)";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, C.WIDTH - 4, C.HEIGHT - 4);
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function SharkFrenzyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS>(makeInitialState(0));
  const keysRef = useRef<Set<string>>(new Set());

  const [ui, setUi] = useState<UiState>({
    phase: "idle",
    level: 0,
    eaten: 0,
    escaped: 0,
    remaining: LEVELS[0].totalFish,
    totalFish: LEVELS[0].totalFish,
    maxEscaped: LEVELS[0].maxEscaped,
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
      const lv = LEVELS[gs.level];
      setUi({
        phase: gs.phase,
        level: gs.level,
        eaten: gs.eaten,
        escaped: gs.escaped,
        remaining: lv.totalFish - gs.eaten - gs.escaped,
        totalFish: lv.totalFish,
        maxEscaped: lv.maxEscaped,
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
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);

    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("keyup", onKeyUp, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("keyup", onKeyUp, { capture: true });
    };
  }, []);

  const startLevel = useCallback((level: number) => {
    gsRef.current = { ...makeInitialState(level), phase: "playing" };
    keysRef.current.clear();
    // Blur button so it doesn't capture arrow key events
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (C.WIDTH / rect.width);
    const my = (e.clientY - rect.top) * (C.HEIGHT / rect.height);
    const gs = gsRef.current;
    if (gs.phase !== "playing") return;
    gsRef.current = { ...gs, targetX: mx, targetY: my };
  }, []);

  const isLastLevel = ui.level >= LEVELS.length - 1;

  return (
    <div className="flex flex-col items-center gap-4 select-none font-sans">

      {/* HUD — only show during play/win/lose */}
      {ui.phase !== "idle" && (
        <div className="flex items-center gap-5 w-full max-w-[700px] px-4 py-2 bg-blue-900/80 rounded-xl text-white text-sm font-medium">
          {/* Level indicator */}
          <div className="text-center shrink-0">
            <div className="text-xs text-blue-300">Level</div>
            <div className="text-lg font-bold tabular-nums">{ui.level + 1}</div>
          </div>
          {/* Fish eaten */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex justify-between text-xs text-blue-300">
              <span>Fish Eaten</span>
              <span>{ui.eaten} / {ui.totalFish}</span>
            </div>
            <div className="h-3 bg-blue-950 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-75 bg-green-400"
                style={{ width: `${(ui.eaten / ui.totalFish) * 100}%` }}
              />
            </div>
          </div>
          {/* Escaped */}
          <div className="text-center shrink-0">
            <div className="text-xs text-blue-300">Escaped</div>
            <div className={`text-lg font-bold tabular-nums ${ui.escaped >= ui.maxEscaped - 1 ? "text-red-400" : ""}`}>
              {ui.escaped} / {ui.maxEscaped}
            </div>
          </div>
          {/* Swimming */}
          <div className="text-center shrink-0">
            <div className="text-xs text-blue-300">Swimming</div>
            <div className="text-lg font-bold tabular-nums">{ui.remaining}</div>
          </div>
        </div>
      )}

      {/* Canvas + overlays */}
      <div className="relative w-full max-w-[700px]">
        <canvas
          ref={canvasRef}
          width={C.WIDTH}
          height={C.HEIGHT}
          onClick={handleClick}
          className="w-full rounded-lg shadow-2xl cursor-crosshair block"
          style={{ touchAction: "none", aspectRatio: `${C.WIDTH}/${C.HEIGHT}` }}
        />

        {/* Idle overlay — Level select */}
        {ui.phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg gap-4">
            <div className="text-white text-4xl font-bold drop-shadow">Shark Frenzy</div>
            <div className="text-blue-200 text-center text-sm max-w-[340px] leading-relaxed">
              Fish are trying to swim home to their rainbow house.
              Control the shark and eat them all before they escape!
            </div>
            <div className="text-blue-300 text-xs text-center max-w-[280px] bg-black/30 rounded-lg px-3 py-2">
              <span className="font-bold">Move:</span> WASD / Arrow keys or click<br />
              <span className="font-bold">Eat:</span> Swim into fish to chomp them!
            </div>
            <div className="flex flex-col gap-2 mt-1 w-full max-w-[280px]">
              {LEVELS.map((lv, i) => (
                <button
                  key={i}
                  onClick={() => startLevel(i)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl text-base transition-colors shadow-lg"
                >
                  {lv.name}
                  <span className="block text-xs font-normal text-blue-200 mt-0.5">
                    {lv.totalFish} fish — max {lv.maxEscaped} can escape
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Win overlay */}
        {ui.phase === "won" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 rounded-lg gap-3">
            <div className="text-yellow-300 text-4xl font-bold drop-shadow">
              {isLastLevel ? "You Beat the Game!" : "Level Complete!"}
            </div>
            <div className="text-white text-2xl">All {ui.totalFish} fish eaten!</div>
            <div className="text-blue-200">
              {isLastLevel
                ? "You conquered all 3 levels!"
                : "Get ready for faster fish..."}
            </div>
            <div className="flex gap-3 mt-2">
              {!isLastLevel && (
                <button
                  onClick={() => startLevel(ui.level + 1)}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
                >
                  Next Level
                </button>
              )}
              <button
                onClick={() => startLevel(ui.level)}
                className="px-6 py-3 bg-blue-800 hover:bg-blue-700 active:bg-blue-900 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
              >
                Replay
              </button>
              <button
                onClick={() => { gsRef.current = makeInitialState(0); }}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
              >
                Menu
              </button>
            </div>
          </div>
        )}

        {/* Lose overlay */}
        {ui.phase === "lost" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 rounded-lg gap-3">
            <div className="text-red-400 text-4xl font-bold drop-shadow">Oh no!</div>
            <div className="text-white text-xl text-center">
              {ui.escaped} fish escaped to the rainbow house!
            </div>
            <div className="text-blue-200 text-xl">You ate {ui.eaten} out of {ui.totalFish}</div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => startLevel(ui.level)}
                className="px-8 py-3 bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => { gsRef.current = makeInitialState(0); }}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
              >
                Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
