import Link from 'next/link';

type TopRightNavProps = {
  buttonClassName?: string;
};

export default function TopRightNav({ buttonClassName }: TopRightNavProps) {
  const baseButtonClassName =
    'flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-2xl shadow-md transition-colors hover:bg-white dark:border-white/20 dark:bg-green-800/80 dark:hover:bg-green-700';
  const mergedButtonClassName = buttonClassName
    ? `${baseButtonClassName} ${buttonClassName}`
    : baseButtonClassName;

  return (
    <div className="fixed right-4 top-4 z-10 flex items-center gap-2 sm:right-8 sm:top-8">
      <Link
        href="/games"
        className={mergedButtonClassName}
        aria-label="Go to games"
      >
        🎮
      </Link>
      <Link
        href="/explore"
        className={mergedButtonClassName}
        aria-label="Go to garden"
      >
        🌱
      </Link>
      <Link
        href="/"
        className={mergedButtonClassName}
        aria-label="Go back to home page"
      >
        🏠
      </Link>
    </div>
  );
}
