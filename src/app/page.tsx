import { Hero } from "@/components/hero/hero";
import { FrameworkBar } from "@/components/hero/framework-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FrameworkBar />
      <HowItWorks />

      {/* Sections 5.6 onward follow once these are signed off. */}
      <div className="h-[20vh]" />
    </>
  );
}
