import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Start guided onboarding",
  description: "Six guided steps, roughly ten minutes, ending in a readiness report showing where your management system stands and what to address first.",
};

const PIECES = [
  { title: "Company & contact", body: "Legal name, country of registration, entity type, and the person we should talk to." },
  { title: "Supply chain", body: "Countries of operation, sourcing model, volume band and supplier count." },
  { title: "Current position", body: "Existing policies, prior assessments, systems in use, and documents you can upload." },
  { title: "Objectives", body: "Target timeline, modules of interest and team size, which shape the recommended sequence." },
  { title: "Review & consent", body: "Everything entered, shown back before submission." },
  { title: "Readiness report", body: "Current state, missing controls and documents, priority gaps and a proposed implementation sequence." },
] as const;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Guided onboarding" title="Start guided onboarding" lead="Six short steps, roughly ten minutes. Progress saves as you type, and a resume link is sent to your email so you can return with your documents to hand." />

      <Section eyebrow="What it will include" title="Planned scope">
        <CardGrid>
          {PIECES.map((p) => (
            <Card key={p.title} title={p.title} body={p.body} />
          ))}
        </CardGrid>
      </Section>

      <Section tone="recessed" eyebrow="Status" title="Phase 2 — not live yet">
        <PendingNotice>The onboarding engine is Phase 2 of the build. It needs autosave, cross-device resume via a 30-day magic link, virus-scanned uploads stored outside the web root, server-side validation and a generated PDF report. None of that is stubbed here: a six-step form that silently discarded a part-finished submission would waste the ten minutes it asked for.</PendingNotice>
      </Section>
    </>
  );
}
