import Image from 'next/image';
import Link from 'next/link';

export default function GuineaPigGarden() {
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 relative">
        {/* Home icon link in top right corner */}
        <Link
          href="/"
          className="absolute top-4 right-4 sm:top-8 sm:right-8 rounded-full bg-white/80 dark:bg-green-800/80 border border-black/10 dark:border-white/20 w-12 h-12 flex items-center justify-center text-2xl shadow-md hover:bg-white dark:hover:bg-green-700 transition-colors"
          aria-label="Go back to home page"
        >
          🏠
        </Link>

        <main className="flex flex-col gap-[32px] row-start-2 items-center">
          <h1 className="text-3xl font-bold">Guinea Pig Garden!</h1>
          <p className="text-lg">
            🐹 Welcome to our adorable guinea pig garden! 🐹
          </p>

          <Image
            className="rounded-lg shadow-md"
            src="/guinea-pig-garden.png"
            alt="Guinea Pigs"
            width={600}
            height={400}
            priority
          />

          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4">
              Guinea Pig Eating Parsley
            </h2>
            <div className="bg-green-50 dark:bg-green-800 p-4 rounded-lg">
              <Image
                className="rounded-lg shadow-md mx-auto"
                src="/guinea-pig-eating-parsley.webp"
                alt="Guinea Pig Eating Parsley"
                width={500}
                height={350}
              />
              <p className="mt-4 text-center text-green-700 dark:text-green-200">
                Our guinea pigs love to munch on fresh parsley! It's rich in
                vitamin C, which is essential for guinea pigs.
              </p>
            </div>
          </div>

          {/* New image gallery section */}
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First row of images */}
              <div className="bg-amber-50 dark:bg-amber-900/40 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-amber-800 dark:text-amber-100">
                  Guinea Pig Eating Dandelion
                </h2>
                <Image
                  className="rounded-lg shadow-md mx-auto"
                  src="/guinea-pig-eating-dandelion.webp"
                  alt="Guinea Pig Eating Dandelion"
                  width={400}
                  height={300}
                />
                <p className="mt-3 text-center text-amber-700 dark:text-amber-200">
                  Our guinea pigs love to munch on fresh dandelion leaves!
                  They're rich in vitamins A and K, which are beneficial for
                  guinea pigs.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/40 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-100">
                  Guinea Pig Eating Mint
                </h2>
                <Image
                  className="rounded-lg shadow-md mx-auto"
                  src="/guinea-pig-eating-mint.webp"
                  alt="Guinea Pig Eating Mint"
                  width={400}
                  height={300}
                />
                <p className="mt-3 text-center text-blue-700 dark:text-blue-200">
                  Our guinea pigs love to nibble on fresh mint leaves! Mint
                  contains menthol, which is great for their digestion system.
                </p>
              </div>

              {/* Second row of images */}
              <div className="bg-purple-50 dark:bg-purple-900/40 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-100">
                  Guinea Pig Eating Lettuce
                </h2>
                <Image
                  className="rounded-lg shadow-md mx-auto"
                  src="/guinea-pig-eating-lettuce.webp"
                  alt="Guinea Pig Eating Lettuce"
                  width={400}
                  height={300}
                />
                <p className="mt-3 text-center text-purple-700 dark:text-purple-200">
                  Our guinea pigs love to chew on crisp lettuce! It has high
                  water content, which helps keep our guinea pigs hydrated.
                </p>
              </div>

              <div className="bg-rose-50 dark:bg-rose-900/40 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-rose-800 dark:text-rose-100">
                  Guinea Pig Eating Bell Pepper
                </h2>
                <Image
                  className="rounded-lg shadow-md mx-auto"
                  src="/guinea-pig-eating-bell-pepper.webp"
                  alt="Guinea Pig Eating Bell Pepper"
                  width={400}
                  height={300}
                />
                <p className="mt-3 text-center text-rose-700 dark:text-rose-200">
                  Our guinea pigs love to feast on colorful bell peppers!
                  They're packed with vitamin C, which is essential for guinea
                  pigs.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
