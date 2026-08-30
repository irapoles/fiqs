import { Hero } from "@/components/hero/hero";
import { ProofStrip } from "@/components/hero/proof-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      {/* Sections 5.4 onward follow once the hero is signed off. */}
      <div className="h-[40vh]" />
    </>
  );
}
