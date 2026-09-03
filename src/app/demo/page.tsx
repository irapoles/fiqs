import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card, PendingNotice } from "@/components/marketing/page-shell";
import { DemoForm } from "@/components/forms/demo-form";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Book a 45-minute working session covering mine onboarding, supplier due diligence, sanctions screening, GPS verification, chain of custody, transaction reporting and escalation.",
};

const COVERS = [
  { title: "Onboarding", body: "Mine and supplier records, KYC, ownership and GPS site verification." },
  { title: "Due diligence", body: "Sanctions screening, monthly controls and how evidence attaches to a review." },
  { title: "Custody & finance", body: "Custody events, transaction reporting, escalation and audit pack export." },
] as const;

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a demo"
        title="See FIQS against your own supply chain"
        lead="Book a 45-minute working session covering mine onboarding, supplier due diligence, sanctions screening, GPS verification, chain of custody, transaction reporting and escalation."
      />

      <Section eyebrow="What it covers" title="A working session, not a slideshow">
        <CardGrid>
          {COVERS.map((c) => (
            <Card key={c.title} title={c.title} body={c.body} />
          ))}
        </CardGrid>
      </Section>

      <Section tone="recessed" eyebrow="Request" title="Tell us about your operation">
        <DemoForm />
      </Section>

      <Section eyebrow="Contact routes" title="Response times">
        {/* §15: no SLA until confirmed. */}
        <PendingNotice>
          Response-time commitments are not published yet. Sales, technical
          support and grievance each carry their own target, and none appears
          here until confirmed.
        </PendingNotice>
      </Section>
    </>
  );
}
