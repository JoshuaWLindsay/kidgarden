import Image from 'next/image';
import TopRightNav from '@/components/TopRightNav';
import Carousel from '@/components/Carousel';

const habitatItems = [
  {
    title: '1. Ponds or Water Features',
    imageSrc: '/pond-habitat.png',
    imageAlt: 'Garden Pond with Wildlife',
    description:
      'Home to frogs, newts, dragonflies, water beetles, and a drinking spot for birds.',
    bgColorClass: 'bg-blue-50 dark:bg-blue-900/40',
    textColorClass: 'text-blue-700 dark:text-blue-200',
    headingColorClass: 'text-blue-800 dark:text-blue-100',
  },
  {
    title: '2. Woodpiles and Log Stacks',
    imageSrc: '/wood-pile-habitat.png',
    imageAlt: 'Garden Woodpile Habitat',
    description:
      'Perfect shelter for hedgehogs, insects, amphibians, spiders, and small mammals.',
    bgColorClass: 'bg-amber-50 dark:bg-amber-900/40',
    textColorClass: 'text-amber-700 dark:text-amber-200',
    headingColorClass: 'text-amber-800 dark:text-amber-100',
  },
  {
    title: '3. Compost Heaps',
    imageSrc: '/compost-heap-habitat.png',
    imageAlt: 'Compost Heap Habitat',
    description:
      'A thriving ecosystem for worms, beetles, snails, hedgehogs, and reptiles.',
    bgColorClass: 'bg-green-50 dark:bg-green-800',
    textColorClass: 'text-green-700 dark:text-green-200',
    headingColorClass: 'text-green-800 dark:text-green-100',
  },
  {
    title: '4. Flower Beds and Wildflower Meadows',
    imageSrc: '/flower-bed-habitat.png',
    imageAlt: 'Wildflower Meadow Habitat',
    description:
      'Vital for bees, butterflies, ladybugs, spiders, and small mammals.',
    bgColorClass: 'bg-purple-50 dark:bg-purple-900/40',
    textColorClass: 'text-purple-700 dark:text-purple-200',
    headingColorClass: 'text-purple-800 dark:text-purple-100',
  },
  {
    title: '5. Shrubs and Bushes',
    imageSrc: '/shrub-habitat.png',
    imageAlt: 'Garden Shrubs Habitat',
    description:
      'Shelter and nesting sites for birds, small mammals, and various insects.',
    bgColorClass: 'bg-rose-50 dark:bg-rose-900/40',
    textColorClass: 'text-rose-700 dark:text-rose-200',
    headingColorClass: 'text-rose-800 dark:text-rose-100',
  },
  {
    title: '6. Trees',
    imageSrc: '/tree-habitat.png',
    imageAlt: 'Garden Trees Habitat',
    description:
      'Home to birds, squirrels, insects, and bats. The canopy provides shelter and food.',
    bgColorClass: 'bg-emerald-50 dark:bg-emerald-900/40',
    textColorClass: 'text-emerald-700 dark:text-emerald-200',
    headingColorClass: 'text-emerald-800 dark:text-emerald-100',
  },
  {
    title: '7. Rock Gardens and Stone Walls',
    imageSrc: '/rock-garden-habitat.png',
    imageAlt: 'Rock Garden Habitat',
    description:
      'Excellent habitat for lizards, insects, spiders, and small mammals.',
    bgColorClass: 'bg-stone-50 dark:bg-stone-800/50',
    textColorClass: 'text-stone-700 dark:text-stone-200',
    headingColorClass: 'text-stone-800 dark:text-stone-100',
  },
  {
    title: '8. Tall Grass Areas',
    imageSrc: '/tall-grass-habitat.png',
    imageAlt: 'Tall Grass Habitat',
    description:
      'Perfect for grasshoppers, moths, butterflies, rodents, and hedgehogs.',
    bgColorClass: 'bg-yellow-50 dark:bg-yellow-900/30',
    textColorClass: 'text-yellow-700 dark:text-yellow-200',
    headingColorClass: 'text-yellow-800 dark:text-yellow-100',
  },
  {
    title: '9. Bird Boxes and Feeders',
    imageSrc: '/bird-box-habitat.png',
    imageAlt: 'Bird Boxes Habitat',
    description: 'Nesting and feeding sites for various bird species.',
    bgColorClass: 'bg-sky-50 dark:bg-sky-900/40',
    textColorClass: 'text-sky-700 dark:text-sky-200',
    headingColorClass: 'text-sky-800 dark:text-sky-100',
  },
  {
    title: '10. Insect Hotels or Bug Houses',
    imageSrc: '/bug-hotel-habitat.png',
    imageAlt: 'Insect Hotel Habitat',
    description:
      'Shelter for bees, ladybugs, spiders, and other beneficial insects.',
    bgColorClass: 'bg-orange-50 dark:bg-orange-900/40',
    textColorClass: 'text-orange-700 dark:text-orange-200',
    headingColorClass: 'text-orange-800 dark:text-orange-100',
  },
];

export default function GardenHabitats() {
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 relative">
        <TopRightNav />

        <main className="flex flex-col gap-[32px] row-start-2 items-center">
          <h1 className="text-3xl font-bold">Garden Habitats</h1>
          <p className="text-lg">
            🌱 Discover the wonderful homes for wildlife in our gardens! 🐞
          </p>

          {/* Carousel Component */}
          <Carousel items={habitatItems} autoSlide={true} />
        </main>
      </div>
    </>
  );
}
