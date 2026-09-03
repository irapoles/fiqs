import type { Metadata } from "next";

import { PageHero, Section, PendingNotice, CardGrid, Card } from "@/components/marketing/page-shell";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Pricing",
  description: "How FIQS is priced, and what a working session covers before you commit.",
};

const FACTORS = [
  { title: "Scale of the chain", body: "How many mines, suppliers and counterparties the record has to cover." },
  { title: "Modules in use", body: "Whether you need the full operating layer or a subset of it." },
  { title: "Implementation", body: "How much existing evidence has to be imported, and in what shape it arrives." },
] as const;

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Priced against the chain you actually run"
        lead="Three things drive what FIQS costs. A working session covers all three against your operation, which is a more useful answer than a table of tiers."
      />

      <Section eyebrow="What drives it" title="The three variables">
        <CardGrid>
          {FACTORS.map((f) => (
            <Card key={f.title} title={f.title} body={f.body} />
          ))}
        </CardGrid>
      </Section>

      <Section tone="recessed" eyebrow="Published pricing" title="Not yet confirmed">
        {/* §28 lists the pricing model and deployment tiers as unconfirmed. */}
        <PendingNotice>
          The pricing model and deployment tiers are not confirmed, so no
          figures or tiers appear here. Publishing indicative numbers that later
          move would be worse than publishing none.
        </PendingNotice>
      </Section>

      <FinalCta />
    </>
  );
}
