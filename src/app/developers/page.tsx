import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card, PendingNotice } from "@/components/marketing/page-shell";
import { ParticleMark } from "@/components/hero/particle-mark";

export const metadata: Metadata = {
  title: "Build directly against FIQS",
  description: "A REST API over suppliers, custody events, transactions, screening results and documents, with webhooks for event-driven integration.",
};

const PIECES = [
  { title: "Authentication & environments", body: "Sandbox and production keys, with seeded data to work against before you talk to sales." },
  { title: "Core resources", body: "Suppliers, custody events, transactions, screening results and documents." },
  { title: "Webhooks", body: "Supported events pushed to connected systems as they happen." },
  { title: "Errors & limits", body: "Documented failure modes and rate limits, not just the happy path." },
  { title: "Changelog & status", body: "What changed, when, and whether the API is up right now." },
  { title: "Code examples", body: "cURL, Node, Python and Go, generated from the specification rather than written by hand." },
] as const;

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Developers"
        title="Build directly against FIQS"
        lead="FIQS is designed to expose suppliers, custody events, transactions, screening results and documents through a REST API, with webhooks for event-driven integration."
        aside={
          <ParticleMark className="relative mx-auto aspect-square w-full max-w-[26rem] lg:max-w-none" />
        }
      />

      <Section eyebrow="What it will include" title="Planned scope">
        <CardGrid>
          {PIECES.map((p) => (
            <Card key={p.title} title={p.title} body={p.body} />
          ))}
        </CardGrid>
      </Section>

      <Section tone="recessed" eyebrow="Status" title="Documentation coming soon">
        <PendingNotice>Endpoint reference is not published yet. The spec is explicit that invented endpoints must never be presented as production-ready, so this page describes the intended architecture and nothing more. Request sandbox access and we will tell you when the reference is live.</PendingNotice>
      </Section>
    </>
  );
}
