"use client";

import type { KeyboardEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';

type CircleRegion = {
  color: string;
  cx: number;
  cy: number;
  id: string;
  kind: 'circle';
  label: string;
  r: number;
};

type EllipseRegion = {
  color: string;
  cx: number;
  cy: number;
  id: string;
  kind: 'ellipse';
  label: string;
  rx: number;
  ry: number;
};

type RectRegion = {
  color: string;
  height: number;
  id: string;
  kind: 'rect';
  label: string;
  rx?: number;
  ry?: number;
  width: number;
  x: number;
  y: number;
};

type PathRegion = {
  color: string;
  d: string;
  id: string;
  kind: 'path';
  label: string;
};

type Region = CircleRegion | EllipseRegion | RectRegion | PathRegion;

const PALETTE = ['#f97316', '#ef4444', '#facc15', '#22c55e', '#0ea5e9', '#8b5cf6', '#ec4899', '#a855f7', '#7c3aed', '#f1f5f9'];
const DEFAULT_REGION_COLOR = '#f4f4f5';

const createInitialRegions = (): Region[] => [
  { id: 'petal-top', label: 'Top petal', kind: 'ellipse', cx: 160, cy: 70, rx: 45, ry: 60, color: DEFAULT_REGION_COLOR },
  { id: 'petal-top-right', label: 'Top right petal', kind: 'ellipse', cx: 225, cy: 95, rx: 45, ry: 60, color: DEFAULT_REGION_COLOR },
  { id: 'petal-bottom-right', label: 'Bottom right petal', kind: 'ellipse', cx: 225, cy: 160, rx: 45, ry: 60, color: DEFAULT_REGION_COLOR },
  { id: 'petal-bottom', label: 'Bottom petal', kind: 'ellipse', cx: 160, cy: 210, rx: 45, ry: 60, color: DEFAULT_REGION_COLOR },
  { id: 'petal-bottom-left', label: 'Bottom left petal', kind: 'ellipse', cx: 95, cy: 160, rx: 45, ry: 60, color: DEFAULT_REGION_COLOR },
  { id: 'petal-top-left', label: 'Top left petal', kind: 'ellipse', cx: 95, cy: 95, rx: 45, ry: 60, color: DEFAULT_REGION_COLOR },
  { id: 'center', label: 'Flower center', kind: 'circle', cx: 160, cy: 140, r: 42, color: '#fde68a' },
  { id: 'stem', label: 'Stem', kind: 'rect', x: 150, y: 180, width: 20, height: 120, rx: 10, ry: 10, color: '#bbf7d0' },
  { id: 'leaf-left', label: 'Left leaf', kind: 'path', d: 'M150 220 C90 210, 80 270, 150 260 Z', color: '#bbf7d0' },
  { id: 'leaf-right', label: 'Right leaf', kind: 'path', d: 'M170 220 C230 210, 240 270, 170 260 Z', color: '#bbf7d0' },
];

const handleRegionKeyboard = (
  event: KeyboardEvent<SVGElement>,
  id: string,
  onActivate: (regionId: string) => void,
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onActivate(id);
  }
};

export default function SimpleColoringGame() {
  const [regions, setRegions] = useState<Region[]>(() => createInitialRegions());
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);

  const handleColorPick = (color: string) => {
    setSelectedColor(color);
  };

  const paintRegion = (regionId: string) => {
    setRegions((prev) =>
      prev.map((region) =>
        region.id === regionId
          ? {
              ...region,
              color: selectedColor,
            }
          : region,
      ),
    );
  };

  const resetPainting = () => {
    setRegions(createInitialRegions());
    setSelectedColor(PALETTE[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900 dark:from-green-900 dark:to-green-800 dark:text-green-100">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
        {/* Home icon link in top right corner (consistent with other pages) */}
        <Link
          href="/"
          className="absolute top-4 right-4 sm:top-8 sm:right-8 rounded-full bg-white/80 dark:bg-green-800/80 border border-black/10 dark:border-white/20 w-12 h-12 flex items-center justify-center text-2xl shadow-md hover:bg-white dark:hover:bg-green-700 transition-colors"
          aria-label="Go back to home page"
        >
          🏠
        </Link>

        <div className="rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur dark:bg-green-800/80">
          <h1 className="text-center text-4xl font-bold text-green-700 dark:text-green-100">
            Simple Garden Coloring
          </h1>
          <p className="mt-3 text-center text-lg text-green-700/80 dark:text-green-100/80">
            Pick a color and click a part of the flower to fill it in. Try different color combos!
          </p>

          <section className="mt-6 flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-1 flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-3">
                {PALETTE.map((color) => {
                  const isActive = color === selectedColor;
                  return (
                    <button
                      key={color}
                      aria-label={`Choose color ${color}`}
                      aria-pressed={isActive}
                      className={`h-10 w-10 rounded-full border-2 border-white shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:border-green-900 ${
                        isActive ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-white dark:ring-offset-green-900' : ''
                      }`}
                      onClick={() => handleColorPick(color)}
                      style={{ backgroundColor: color }}
                      type="button"
                    />
                  );
                })}
              </div>
              <button
                className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:bg-green-600 dark:hover:bg-green-500 dark:focus:ring-green-300 dark:focus:ring-offset-green-900"
                onClick={resetPainting}
                type="button"
              >
                Start over
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <svg
                aria-label="Coloring flower"
                className="max-w-full"
                height="340"
                role="img"
                viewBox="0 0 320 360"
                width="320"
              >
                <rect fill="#ecfccb" height="360" rx="24" width="320" />
                {regions.map((region) => {
                  const commonProps = {
                    key: region.id,
                    fill: region.color,
                    onClick: () => paintRegion(region.id),
                    onKeyDown: (event: KeyboardEvent<SVGElement>) =>
                      handleRegionKeyboard(event, region.id, paintRegion),
                    role: 'button',
                    stroke: '#14532d',
                    strokeWidth: 2,
                    tabIndex: 0,
                    'aria-label': region.label,
                    className:
                      'cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2',
                  };

                  if (region.kind === 'circle') {
                    const { cx, cy, r } = region;
                    return <circle {...commonProps} cx={cx} cy={cy} r={r} />;
                  }

                  if (region.kind === 'ellipse') {
                    const { cx, cy, rx, ry } = region;
                    return <ellipse {...commonProps} cx={cx} cy={cy} rx={rx} ry={ry} />;
                  }

                  if (region.kind === 'rect') {
                    const { x, y, width, height, rx, ry } = region;
                    return <rect {...commonProps} height={height} rx={rx} ry={ry} width={width} x={x} y={y} />;
                  }

                  const { d } = region;
                  return <path {...commonProps} d={d} />;
                })}
              </svg>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
