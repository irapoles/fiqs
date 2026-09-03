import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card } from "@/components/marketing/page-shell";
import { RouteCards } from "@/components/marketing/route-cards";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Who it is for",
  description:
    "Whether you are already inside an assurance process or starting your first assessment, FIQS provides the structure, records and evidence trail.",
};

const ALSO = [
  { title: "Refiners", body: "Assessing artisanal and small-scale supply, with supplier-level evidence behind every intake." },
  { title: "Aggregators", body: "Preparing for assessment, with the records organised in the shape an assessor asks for." },
  { title: "Institutional buyers", body: "Requiring supplier-level visibility across a chain they do not operate themselves." },
] as const;

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Choose your starting point"
        title="The same platform, a different path in"
        lead="Two routes through the same system. Both end with the same thing: a structured, exportable evidence trail."
      />

      <RouteCards />

      <Section tone="recessed" eyebrow="Also served" title="Beyond the two routes">
        <CardGrid>
          {ALSO.map((a) => (
            <Card key={a.title} title={a.title} body={a.body} />
          ))}
        </CardGrid>
      </Section>

      <FinalCta />
    </>
  );
}
