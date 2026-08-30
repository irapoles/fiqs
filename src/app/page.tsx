import { Hero } from "@/components/hero/hero";
import { FrameworkBar } from "@/components/hero/framework-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Testimonials } from "@/components/marketing/testimonials";
import { FinalCta } from "@/components/marketing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FrameworkBar />
      <HowItWorks />
      <Testimonials />
      <FinalCta />
    </>
  );
}
