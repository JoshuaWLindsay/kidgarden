/* eslint-disable max-lines-per-function */
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-300">
          Kid Garden
        </h1>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/guinea-pig-garden"
        >
          🐹 Guinea Pig Garden 🐹
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/garden-guardians"
        >
          ⚔️ Garden Guardians! ⚔️
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/garden-habitats"
        >
          🏡 Garden Habitats 🦋
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/coloring-pages"
        >
          🏡 Coloring Pages! 🦋
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/garden-game"
        >
          👾 Garden Game! 👾
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/tic-tac-toe"
        >
          🍅🥬 Garden Tic‑Tac‑Toe 🥬🍅
        </Link>
        <div className="text-center">
          <p className="mt-4 text-lg text-green-700 dark:text-green-200">
            A special place where young ideas grow and bloom
          </p>
        </div>

        <div className="bg-white/80 dark:bg-green-800/80 p-6 rounded-lg max-w-2xl w-full text-center">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            What's Growing Here?
          </h2>
          <ul className="list-none space-y-4 text-green-800 dark:text-green-100">
            <li className="flex items-center gap-2 justify-center">
              <span className="text-xl">🌱</span> Creative stories from young
              minds
            </li>
            <li className="flex items-center gap-2 justify-center">
              <span className="text-xl">🌻</span> Artwork and imagination
              projects
            </li>
            <li className="flex items-center gap-2 justify-center">
              <span className="text-xl">🍃</span> Ideas that deserve to be
              shared
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
