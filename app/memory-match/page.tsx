"use client";

import { useEffect, useRef, useState } from 'react';
import TopRightNav from '@/components/TopRightNav';

type Card = {
  id: number;
  icon: string;
  matched: boolean;
};

const ICONS = ['🐹', '⚔️', '🏡', '🦋', '🐸', '🪰', '🍅', '🥬'];

const createShuffledDeck = (): Card[] => {
  const deck = ICONS.flatMap((icon, index) => [
    { id: index * 2, icon, matched: false },
    { id: index * 2 + 1, icon, matched: false },
  ]);

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

export default function MemoryMatchGarden() {
  const [cards, setCards] = useState<Card[]>(() => createShuffledDeck());
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [won, setWon] = useState(false);
  const [interactionLocked, setInteractionLocked] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const clearFlipTimeout = () => {
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleFlip = (cardIndex: number) => {
    if (interactionLocked) return;

    const card = cards[cardIndex];
    if (card.matched || flippedIndexes.includes(cardIndex)) return;

    const newFlipped = [...flippedIndexes, cardIndex];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setInteractionLocked(true);
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        setCards((prevCards) =>
          prevCards.map((c, index) =>
            index === firstIndex || index === secondIndex
              ? { ...c, matched: true }
              : c,
          ),
        );
        setFlippedIndexes([]);
        setInteractionLocked(false);
        setMatchedPairs((prev) => {
          const next = prev + 1;
          if (next === ICONS.length) {
            setWon(true);
          }
          return next;
        });
      } else {
        timeoutRef.current = window.setTimeout(() => {
          setFlippedIndexes([]);
          setInteractionLocked(false);
          timeoutRef.current = undefined;
        }, 900);
      }
    }
  };

  const resetGame = () => {
    clearFlipTimeout();
    setCards(createShuffledDeck());
    setFlippedIndexes([]);
    setMoves(0);
    setMatchedPairs(0);
    setWon(false);
    setInteractionLocked(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900 dark:from-green-900 dark:to-green-800 dark:text-green-100">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
        <TopRightNav />
        <div className="rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur dark:bg-green-800/80">
          <h1 className="text-center text-4xl font-bold text-green-700 dark:text-green-100">
            Garden Memory Match
          </h1>
          <p className="mt-3 text-center text-lg text-green-700/80 dark:text-green-100/80">
            Flip the cards to find matching garden friends and treats from the home page.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <div className="rounded-lg bg-green-100 px-4 py-2 text-green-800 dark:bg-green-700 dark:text-green-100">
              Moves: {moves}
            </div>
            <div className="rounded-lg bg-green-100 px-4 py-2 text-green-800 dark:bg-green-700 dark:text-green-100">
              Matches: {matchedPairs} / {ICONS.length}
            </div>
            <button
              className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:bg-green-600 dark:hover:bg-green-500 dark:focus:ring-green-300 dark:focus:ring-offset-green-900"
              onClick={resetGame}
              type="button"
            >
              Start a new round
            </button>
          </div>

          {won ? (
            <div className="mt-4 rounded-lg bg-green-200/80 p-3 text-center text-green-800 dark:bg-green-700/70 dark:text-green-100">
              You matched every garden friend! 🌟
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {cards.map((card, index) => {
              const isFlipped = card.matched || flippedIndexes.includes(index);
              const disableCard = card.matched || (interactionLocked && !flippedIndexes.includes(index));

              return (
                <button
                  key={card.id}
                  aria-label={isFlipped ? `Card showing ${card.icon}` : 'Hidden garden card'}
                  className={`flex h-24 items-center justify-center rounded-xl border-2 border-green-200 text-5xl transition-transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:border-green-600 dark:focus:ring-green-300 dark:focus:ring-offset-green-900 ${
                    isFlipped
                      ? 'bg-white shadow-inner dark:bg-green-900'
                      : 'bg-green-200 hover:-translate-y-1 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600'
                  }`}
                  disabled={disableCard}
                  onClick={() => handleFlip(index)}
                  type="button"
                >
                  <span
                    className={`transition-transform duration-200 ${
                      isFlipped ? '' : 'text-green-600 dark:text-green-200'
                    }`}
                  >
                    {isFlipped ? card.icon : '🌱'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
