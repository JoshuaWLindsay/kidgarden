# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

Note: The npm scripts use a custom wrapper (`scripts/with-next.js`) that handles SWC binary resolution for cross-platform compatibility. Use `npm run dev` rather than `npx next dev` directly.

## Architecture

**Stack:** Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS + Shadcn/ui

This is a children's garden-themed educational web app with interactive games.

### App Router structure

All pages live under `app/` using Next.js App Router conventions. Each subdirectory is a route with a `page.tsx`.

- **Server components** (no `"use client"`) — used for static/display pages like the home page
- **Client components** (`"use client"`) — used for all interactive games, with `useState`/`useEffect`/`useRef`

### Components

- `components/TopRightNav.tsx` — navigation bar included on game pages for returning home
- `components/Carousel.tsx` — reusable carousel
- `components/ui/button.tsx` — Shadcn/ui button (style: "new-york", base color: neutral)

### Styling conventions

- Tailwind CSS utility classes throughout; no CSS modules
- Green/emerald color scheme (`from-green-50 to-emerald-100` gradients) for garden aesthetic
- Dark mode via `dark:` Tailwind prefix (class strategy)
- CSS custom properties (HSL format) for theme colors defined in `globals.css`
- `@/*` path alias maps to the repo root

### Game pattern

Interactive games follow a consistent pattern:
1. `"use client"` directive at top
2. TypeScript interfaces for game state (e.g., `Card`, `GameState`)
3. State managed entirely with React hooks
4. `useRef` for timeout cleanup on unmount
5. `TopRightNav` included for navigation
