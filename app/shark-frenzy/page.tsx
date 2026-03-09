import SharkFrenzyGame from "@/components/SharkFrenzyGame";
import TopRightNav from "@/components/TopRightNav";

export const metadata = {
  title: "Shark Frenzy – Eat All the Fish!",
  description: "Control a hungry shark and eat all 28 fish before they escape to the rainbow house.",
};

export default function SharkFrenzyPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900">
      <TopRightNav />
      <main className="flex flex-col items-center py-12 px-4">
        <SharkFrenzyGame />
      </main>
    </div>
  );
}
