import Link from 'next/link';
import TopRightNav from '@/components/TopRightNav';

const gameLinks = [
  { href: '/coloring-game', label: '🎨 Simple Coloring Game' },
  { href: '/garden-game', label: '🐸 Garden Game' },
  { href: '/pollinator-path', label: '🐝 Pollinator Path (Maze)' },
  { href: '/memory-match', label: '🐹 Garden Memory Match' },
  { href: '/tic-tac-toe', label: '🍅 Garden Tic-Tac-Toe' },
  { href: '/hawk-garden', label: '🦅 Hawk Garden' },
];

export default function GamesPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50 via-lime-50 to-green-100 p-8 pb-20 sm:p-20 dark:from-emerald-900 dark:via-emerald-900/70 dark:to-green-900">
      <TopRightNav buttonClassName="dark:bg-emerald-800/80 dark:hover:bg-emerald-700" />

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-100">
            Games
          </h1>
          <p className="mt-3 text-lg text-emerald-700 dark:text-emerald-200">
            Pick a game to play.
          </p>
        </header>

        <section className="grid gap-4">
          {gameLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-emerald-200/80 bg-white/90 px-6 py-5 text-lg font-semibold text-emerald-800 shadow transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-emerald-700/40 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-900/80"
            >
              {link.label}
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
