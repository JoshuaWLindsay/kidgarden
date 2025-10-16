import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const coloringPages = [
  {
    title: 'Bear Digging in the Garden',
    imageSrc: '/bear-digging-in-garden-coloring-page.png',
    imageAlt: 'Bear digging up soil in a garden coloring page',
  },
  {
    title: 'Chicken Hoeing in the Garden',
    imageSrc: '/chicken-hoeing-in-garden-coloring-page.png',
    imageAlt: 'Chicken using a hoe in a garden coloring page',
  },
  {
    title: 'Cow Harvesting in the Garden',
    imageSrc: '/cow-harvesting-in-garden-coloring-page.png',
    imageAlt: 'Cow harvesting vegetables in a garden coloring page',
  },
  {
    title: 'Deer Planting in the Garden',
    imageSrc: '/deer-planting-in-garden-coloring-page.png',
    imageAlt: 'Deer planting seeds in a garden coloring page',
  },
  {
    title: 'Goat Watering in the Garden',
    imageSrc: '/goat-watering-in-garden-coloring-page.png',
    imageAlt: 'Goat watering plants in a garden coloring page',
  },
  {
    title: 'Guinea Pig Farm Stand',
    imageSrc: '/guinea-pig-farm-coloring-page.png',
    imageAlt: 'Guinea pig farm stand coloring page',
  },
  {
    title: 'Guinea Pigs Selling Cold Brew',
    imageSrc: '/guinea-pigs-selling-cold-brew-and-plants-coloring-page.png',
    imageAlt: 'Guinea pigs selling cold brew and plants coloring page',
  },
  {
    title: 'Horse Weeding in the Garden',
    imageSrc: '/horse-weeding-in-garden-coloring-page.png',
    imageAlt: 'Horse weeding a garden coloring page',
  },
  {
    title: 'Plant Starters for Sale',
    imageSrc: '/plant-starters-for-sale-coloring-page.png',
    imageAlt: 'Plant starters for sale coloring page',
  },
];

export default function ColoringPages() {
  return (
    <div className="relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 bg-gradient-to-b from-orange-50 via-amber-50 to-amber-100 p-8 pb-20 sm:p-20 dark:from-amber-900 dark:via-amber-900/60 dark:to-amber-800">
      <Link
        href="/"
        className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-2xl shadow-md transition-colors hover:bg-white sm:right-8 sm:top-8 dark:border-white/20 dark:bg-amber-800/80 dark:hover:bg-amber-700"
        aria-label="Go back to home page"
      >
        🏠
      </Link>

      <main className="row-start-2 flex w-full max-w-6xl flex-col gap-12">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-amber-900 md:text-4xl dark:text-amber-100">
            <span>🎨</span>
            Garden Friends Coloring Pages
            <span>🖍️</span>
          </h1>
          <p className="mt-4 text-lg text-amber-700 dark:text-amber-200">
            Print or download any of the pages below and start coloring! Each
            page is a high-resolution PNG ready for home printers or digital
            coloring apps.
          </p>
        </section>

        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {coloringPages.map((page) => (
            <article
              key={page.imageSrc}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-amber-200/70 bg-white/90 shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-amber-700/40 dark:bg-amber-900/60"
            >
              <div className="relative bg-amber-50/60 dark:bg-amber-950/40">
                <div className="relative aspect-[8.5/11] w-full">
                  <Image
                    src={page.imageSrc}
                    alt={page.imageAlt}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                  {page.title}
                </h2>
                <Button asChild className="mt-auto w-full">
                  <a href={page.imageSrc} download>
                    Download PNG
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
