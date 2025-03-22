import Image from 'next/image';
import Link from 'next/link';

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
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-amber-800 dark:text-amber-200">
            <span>⚔️</span> Garden Guardians: Nature's Pest Control{' '}
            <span>⚔️</span>
          </h1>
          <p className="mt-4 text-lg text-center text-amber-700 dark:text-amber-300">
            Welcome to our Garden Guardians page! Here you will discover the
            fascinating creatures that help protect your garden by eating the
            bugs and pests that can harm your plants. Encouraging these natural
            allies into your garden means healthier plants, fewer chemicals, and
            a more vibrant ecosystem.
          </p>
        </div>

        {/* Lizards Section */}
        <section className="w-full bg-white/80 dark:bg-amber-800/60 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <span>🦎</span> 1. Lizards: The Silent Hunters
          </h2>
          <Image
            className="rounded-lg shadow-md"
            src="/lizard-guardian.webp"
            alt="Guinea Pigs"
            width={600}
            height={400}
            priority
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Common Lizards in Gardens:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>Anoles</li>
                <li>Skinks</li>
                <li>Geckos</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Pests They Eat:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>Aphids</li>
                <li>Ants</li>
                <li>Grasshoppers</li>
                <li>Caterpillars</li>
                <li>Beetles</li>
                <li>Moths</li>
              </ul>
            </div>
          </div>

          <p className="text-amber-700 dark:text-amber-300">
            Lizards are excellent at crawling into small spaces where pests
            hide. They use their quick tongues and sharp eyesight to snatch bugs
            from leaves and soil.
          </p>
        </section>

        {/* Frogs and Toads Section */}
        <section className="w-full bg-white/80 dark:bg-amber-800/60 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <span>🐸</span> 2. Frogs and Toads: Nighttime Defenders
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Common Garden Amphibians:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>American Toad</li>
                <li>Tree Frogs</li>
                <li>Bullfrogs</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Pests They Eat:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>Mosquitoes</li>
                <li>Flies</li>
                <li>Slugs</li>
                <li>Beetles</li>
                <li>Grubs</li>
              </ul>
            </div>
          </div>

          <p className="text-amber-700 dark:text-amber-300">
            Frogs and toads are most active at night, making them perfect for
            catching pests that come out after dark. They love damp areas and
            can be invited into your garden with small water features.
          </p>
        </section>

        {/* Birds Section */}
        <section className="w-full bg-white/80 dark:bg-amber-800/60 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <span>🐦</span> 3. Birds: Feathered Protectors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Helpful Birds:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>Wrens</li>
                <li>Swallows</li>
                <li>Chickadees</li>
                <li>Bluebirds</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Pests They Eat:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>Caterpillars</li>
                <li>Beetles</li>
                <li>Grasshoppers</li>
                <li>Aphids</li>
                <li>Spiders</li>
              </ul>
            </div>
          </div>

          <p className="text-amber-700 dark:text-amber-300">
            Birds are constantly on the lookout for snacks. You can attract them
            by planting native shrubs, offering birdhouses, and keeping feeders
            nearby.
          </p>
        </section>

        {/* Remaining sections */}
        <section className="w-full bg-white/80 dark:bg-amber-800/60 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <span>🙏</span> 4. Praying Mantises: The Patient Predators
          </h2>

          <div className="mb-4">
            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Pests They Eat:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>Caterpillars</li>
                <li>Beetles</li>
                <li>Moths</li>
                <li>Grasshoppers</li>
                <li>Flies</li>
                <li>Wasps</li>
              </ul>
            </div>
          </div>

          <p className="text-amber-700 dark:text-amber-300">
            Praying mantises are incredible hunters that wait motionless for
            their prey before striking with lightning speed. They are especially
            good at catching flying insects and large pests.
          </p>
        </section>

        <section className="w-full bg-white/80 dark:bg-amber-800/60 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <span>🕸️</span> 5. Spiders: Web Weavers of Protection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Common Garden Spiders:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>Orb Weavers</li>
                <li>Wolf Spiders</li>
                <li>Jumping Spiders</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Pests They Eat:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>Flies</li>
                <li>Mosquitoes</li>
                <li>Moths</li>
                <li>Beetles</li>
                <li>Aphids</li>
              </ul>
            </div>
          </div>

          <p className="text-amber-700 dark:text-amber-300">
            Spiders may seem scary, but they are among the best natural pest
            controllers. Their webs trap flying insects, and ground spiders hunt
            bugs crawling through your plants.
          </p>
        </section>

        <section className="w-full bg-white/80 dark:bg-amber-800/60 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <span>🐞</span> 6. Ladybugs: Tiny Heroes
          </h2>

          <div className="mb-4">
            <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">
                Pests They Eat:
              </h3>
              <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400">
                <li>Aphids</li>
                <li>Mites</li>
                <li>Mealybugs</li>
                <li>Whiteflies</li>
              </ul>
            </div>
          </div>

          <p className="text-amber-700 dark:text-amber-300">
            Ladybugs and their larvae are voracious eaters of tiny pests that
            suck sap from your plants. They are especially helpful in vegetable
            gardens.
          </p>
        </section>

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
