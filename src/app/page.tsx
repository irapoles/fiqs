import { Hero } from "@/components/hero/hero";
import { FrameworkBar } from "@/components/hero/framework-bar";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FrameworkBar />

      {/* Sections 5.4 onward follow once these are signed off. */}
      <div className="h-[20vh]" />
    </>
  );
}
