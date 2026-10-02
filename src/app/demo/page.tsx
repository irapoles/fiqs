import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card } from "@/components/marketing/page-shell";
import { BookingRoutes } from "@/components/marketing/booking-routes";
import { DemoForm } from "@/components/forms/demo-form";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Book a 15-minute working session to see how FIQS can support your supply chain, from onboarding and due diligence to traceability and reporting.",
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
        lead="Book a 15-minute working session to see how FIQS can support your supply chain, from onboarding and due diligence to traceability and reporting."
      />

      <Section eyebrow="What it covers" title="A working session, not a slideshow">
        <CardGrid>
          {COVERS.map((c) => (
            <Card key={c.title} title={c.title} body={c.body} />
          ))}
        </CardGrid>
      </Section>

      <Section eyebrow="How to arrange it" title="Two ways to get a session">
        <BookingRoutes />
      </Section>

      {/* Anchored so route 01 can land on it. */}
      <Section
        id="request"
        tone="recessed"
        eyebrow="Request"
        title="Tell us about your operation"
      >
        <DemoForm />
      </Section>
    </>
  );
}
