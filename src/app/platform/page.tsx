import type { Metadata } from "next";

import { PageHero, Section, ScopeNote } from "@/components/marketing/page-shell";
import { PlatformModules } from "@/components/marketing/platform-modules";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "One operating layer from exploration data to final transaction: mine data, supplier onboarding, chain of custody, due diligence, transactions and finance in one secure record.",
};

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="One operating layer from exploration data to final transaction"
        lead="FIQS functions as the operating system for responsible gold operators. It replaces fragmented files and manual approvals with a secure digital record across mine data, supplier onboarding, chain of custody, due diligence, transactions and finance."
      />

      <PlatformModules />

      <Section tone="recessed">
        <ScopeNote />
      </Section>

      <FinalCta />
    </>
  );
}
