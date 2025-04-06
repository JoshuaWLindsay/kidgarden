import Image from 'next/image';
import Link from 'next/link';
import Carousel from '@/components/Carousel';

const guardianItems = [
  {
    title: '🦎 Lizards: The Silent Hunters',
    imageSrc: '/lizard-guardian.webp',
    imageAlt: 'Lizard guardian hunting insects',
    description:
      'Lizards are excellent at crawling into small spaces where pests hide. They use their quick tongues and sharp eyesight to snatch bugs from leaves and soil.',
    bgColorClass: 'bg-white/80 dark:bg-amber-800/60',
    textColorClass: 'text-amber-700 dark:text-amber-300',
    headingColorClass: 'text-amber-800 dark:text-amber-200',
  },
  {
    title: '🐸 Frogs and Toads: Nighttime Defenders',
    imageSrc: '/frog-guardian.webp',
    imageAlt: 'Frog guardian catching insects',
    description:
      'Frogs and toads are most active at night, making them perfect for catching pests that come out after dark. They love damp areas and can be invited into your garden with small water features.',
    bgColorClass: 'bg-white/80 dark:bg-amber-800/60',
    textColorClass: 'text-amber-700 dark:text-amber-300',
    headingColorClass: 'text-amber-800 dark:text-amber-200',
  },
  {
    title: '🐦 Birds: Feathered Protectors',
    imageSrc: '/bird-guardian.webp',
    imageAlt: 'Bird guardian eating pests',
    description:
      'Birds are constantly on the lookout for snacks. You can attract them by planting native shrubs, offering birdhouses, and keeping feeders nearby.',
    bgColorClass: 'bg-white/80 dark:bg-amber-800/60',
    textColorClass: 'text-amber-700 dark:text-amber-300',
    headingColorClass: 'text-amber-800 dark:text-amber-200',
  },
  {
    title: '🙏 Praying Mantises: The Patient Predators',
    imageSrc: '/mantis-guardian.webp',
    imageAlt: 'Praying mantis hunting',
    description:
      'Praying mantises are incredible hunters that wait motionless for their prey before striking with lightning speed. They are especially good at catching flying insects and large pests.',
    bgColorClass: 'bg-white/80 dark:bg-amber-800/60',
    textColorClass: 'text-amber-700 dark:text-amber-300',
    headingColorClass: 'text-amber-800 dark:text-amber-200',
  },
  {
    title: '🕸️ Spiders: Web Weavers of Protection',
    imageSrc: '/spider-guardian.webp',
    imageAlt: 'Spider with its web',
    description:
      'Spiders may seem scary, but they are among the best natural pest controllers. Their webs trap flying insects, and ground spiders hunt bugs crawling through your plants.',
    bgColorClass: 'bg-white/80 dark:bg-amber-800/60',
    textColorClass: 'text-amber-700 dark:text-amber-300',
    headingColorClass: 'text-amber-800 dark:text-amber-200',
  },
  {
    title: '🐞 Ladybugs: Tiny Heroes',
    imageSrc: '/ladybug-guardian.webp',
    imageAlt: 'Ladybug eating aphids',
    description:
      'Ladybugs and their larvae are voracious eaters of tiny pests that suck sap from your plants. They are especially helpful in vegetable gardens.',
    bgColorClass: 'bg-white/80 dark:bg-amber-800/60',
    textColorClass: 'text-amber-700 dark:text-amber-300',
    headingColorClass: 'text-amber-800 dark:text-amber-200',
  },
];

export default function GardenGuardians() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 relative bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800">
      {/* Home icon link in top right corner */}
      <Link
        href="/"
        className="absolute top-4 right-4 sm:top-8 sm:right-8 rounded-full bg-white/80 dark:bg-amber-800/80 border border-black/10 dark:border-white/20 w-12 h-12 flex items-center justify-center text-2xl shadow-md hover:bg-white dark:hover:bg-amber-700 transition-colors"
        aria-label="Go back to home page"
      >
        🏠
      </Link>

      <main className="flex flex-col gap-[32px] row-start-2 items-center max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-amber-800 dark:text-amber-200">
          <span>⚔️</span> Garden Guardians: Nature's Pest Control{' '}
          <span>⚔️</span>
        </h1>
        <Image
          className="rounded-lg shadow-md"
          src="/garden-guardians.webp"
          alt="Garden Guardians"
          width={600}
          height={400}
          priority
        />
        <p className="mt-4 text-lg text-center text-amber-700 dark:text-amber-300">
          Welcome to our Garden Guardians page! Here you will discover the
          fascinating creatures that help protect your garden by eating the bugs
          and pests that can harm your plants. Encouraging these natural allies
          into your garden means healthier plants, fewer chemicals, and a more
          vibrant ecosystem.
        </p>

        {/* Carousel Component */}
        <Carousel items={guardianItems} />

        <div className="bg-white/90 dark:bg-amber-900/60 p-5 rounded-lg border-t-2 border-amber-300 dark:border-amber-700 w-full">
          <p className="text-center text-amber-700 dark:text-amber-300 text-lg">
            By welcoming these amazing creatures into your garden, you create a
            healthy, balanced environment that thrives naturally. Let your kids
            explore and observe these Garden Guardians as they keep your garden
            safe and beautiful!
          </p>
        </div>
      </main>
    </div>
  );
}
