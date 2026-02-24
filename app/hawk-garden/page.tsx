import HawkGardenGame from "@/components/HawkGardenGame";
import TopRightNav from "@/components/TopRightNav";

export const metadata = {
  title: "Hawk Garden – Protect the Carrots!",
  description: "Fly your hawk to scare and catch rabbits before they eat the carrot patch.",
};

export default function HawkGardenPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
      <TopRightNav />
      <main className="flex flex-col items-center py-12 px-4">
        <HawkGardenGame />
      </main>
    </div>
  );
}
