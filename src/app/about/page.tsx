import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card } from "@/components/marketing/page-shell";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "FIQS was built inside a working mining operation, by the team that took it through responsible sourcing assessment.",
};

const PRINCIPLES = [
  { title: "Evidence over assertion", body: "A record either has its signatures or it does not. The platform shows which, and never scores what it cannot evidence." },
  { title: "One trail, not many", body: "Every check, approval and transaction attaches to the record it belongs to, so the trail is never rebuilt from scratch." },
  { title: "Built for the pressure", body: "Compliance language is read under time pressure, often on a phone, often on site. Plain and exact beats emphatic." },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built by operators who went through it"
        lead="FIQS was built inside a working mining operation. Taking that operation through responsible sourcing assessment meant months of policy writing, supplier engagement, site verification, record building and audit preparation held together through folders and spreadsheets. FIQS is the system the team needed and could not buy."
      />

      <Section eyebrow="Product principles" title="What the platform refuses to do">
        <CardGrid>
          {PRINCIPLES.map((p) => (
            <Card key={p.title} title={p.title} body={p.body} />
          ))}
        </CardGrid>
      </Section>

      <FinalCta />
    </>
  );
}
