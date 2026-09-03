import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Learn the process from operators who completed it",
  description: "Structured video training covering policy, supplier engagement, site visits, records, risk assessment and audit preparation.",
};

const PIECES = [
  { title: "Why responsible sourcing exists", body: "The obligations behind the work, and who is actually asking for what." },
  { title: "Policy & supply chain mapping", body: "Writing a supply chain policy, then mapping the chain it describes." },
  { title: "Supplier due diligence in practice", body: "What a real review looks like, and what evidence it should leave behind." },
  { title: "Site visits and evidence", body: "What to capture on site, and what makes a record hold up later." },
  { title: "Risk assessment & grievance", body: "Assessing and mitigating risk, and running a grievance mechanism properly." },
  { title: "Preparing for assessment", body: "Records, retention and reporting, in the shape an assessor asks for." },
] as const;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="FIQS Academy" title="Learn the process from operators who completed it" lead="Nine modules built from taking a working operation through assessment, not from a syllabus." />

      <Section eyebrow="What it will include" title="Planned scope">
        <CardGrid>
          {PIECES.map((p) => (
            <Card key={p.title} title={p.title} body={p.body} />
          ))}
        </CardGrid>
      </Section>

      <Section tone="recessed" eyebrow="Status" title="Phase 4 — not live yet">
        <PendingNotice>The course player is Phase 4. It needs signed video URLs, per-user progress, resume across devices, quiz scoring and certificate generation. Module pages become individually indexable with summaries and transcripts once the content is recorded.</PendingNotice>
      </Section>
    </>
  );
}
