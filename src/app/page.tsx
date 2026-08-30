import { Hero } from "@/components/hero/hero";
import { FrameworkBar } from "@/components/hero/framework-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FinalCta } from "@/components/marketing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FrameworkBar />
      <HowItWorks />
      <FinalCta />
    </>
  );
}
