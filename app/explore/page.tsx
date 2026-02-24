import Link from 'next/link';
import TopRightNav from '@/components/TopRightNav';

const exploreLinks = [
  { href: '/guinea-pig-garden', label: '🐹 Guinea Pig Garden' },
  { href: '/garden-guardians', label: '⚔️ Garden Guardians' },
  { href: '/garden-habitats', label: '🏡 Garden Habitats' },
  { href: '/coloring-pages', label: '🖍️ Coloring Pages' },
];

export default function ExplorePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-100 p-8 pb-20 sm:p-20 dark:from-amber-900 dark:via-amber-900/70 dark:to-rose-900">
      <TopRightNav buttonClassName="dark:bg-amber-800/80 dark:hover:bg-amber-700" />

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100">
            Explore Garden
          </h1>
          <p className="mt-3 text-lg text-amber-700 dark:text-amber-200">
            Stories, learning pages, and creative activities.
          </p>
        </header>

        <section className="grid gap-4">
          {exploreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-amber-200/80 bg-white/90 px-6 py-5 text-lg font-semibold text-amber-900 shadow transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-amber-700/40 dark:bg-amber-900/60 dark:text-amber-100 dark:hover:bg-amber-900/80"
            >
              {link.label}
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
