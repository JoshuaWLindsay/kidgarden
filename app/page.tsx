import Image from 'next/image';
import Link from 'next/link';

const homePaths = [
  {
    title: 'Games',
    href: '/games',
    icon: '🎮',
    description: 'Play garden games, puzzles, and challenges.',
    imageSrc: '/frog-guardian.webp',
    imageAlt: 'Frog guardian looking ready for a game',
  },
  {
    title: 'Explore Garden',
    href: '/explore',
    icon: '🌱',
    description: 'Discover stories, habitats, and creative activities.',
    imageSrc: '/guinea-pig-garden.png',
    imageAlt: 'Guinea pigs exploring a garden',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-lime-50 to-emerald-100 p-8 pb-20 sm:p-20 dark:from-green-900 dark:via-green-900/80 dark:to-emerald-900 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-green-700 md:text-5xl dark:text-green-200">
            Kid Garden
          </h1>
          <p className="mt-4 text-lg text-green-700 dark:text-green-100">
            Choose your path
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          {homePaths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group overflow-hidden rounded-3xl border border-green-200/70 bg-white/90 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-green-700/40 dark:bg-green-900/60"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={path.imageSrc}
                  alt={path.imageAlt}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-2 p-6">
                <h2 className="text-2xl font-semibold text-green-800 dark:text-green-100">
                  <span className="mr-2">{path.icon}</span>
                  {path.title}
                </h2>
                <p className="text-green-700 dark:text-green-200">
                  {path.description}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
