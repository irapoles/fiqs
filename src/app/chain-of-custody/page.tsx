import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card, RowList } from "@/components/marketing/page-shell";
import { CustodyStages } from "@/components/marketing/custody-stages";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Chain of custody",
  description:
    "Track the supply chain from mine source through supplier onboarding, purchase, transport, refining and sale, with each custody event linked to its record.",
};

const OBJECTS = [
  { term: "Mine & site records", detail: "The source, its licence and its verified location." },
  { term: "Supplier approvals", detail: "Who was onboarded, by whom, and on what evidence." },
  { term: "Due diligence documents", detail: "The checks performed and the files relied on." },
  { term: "Gold transactions", detail: "Purchases, sales and the counterparties to each." },
  { term: "Inventory movement", detail: "What moved, when, and under whose signature." },
  { term: "Financial records", detail: "Settlement against the transaction it belongs to." },
] as const;

export default function ChainOfCustodyPage() {
  return (
    <>
      <PageHero
        eyebrow="Chain of custody"
        title="Traceability that follows the gold"
        lead="FIQS tracks the supply chain from mine source through supplier onboarding, purchase, transport, refining and sale. Each custody event links to the relevant mine, supplier, documentation, approval history, risk status and transaction record."
      />

      <CustodyStages />

      <Section
        tone="recessed"
        eyebrow="Ledger references"
        title="What the blockchain component actually does"
        lead="Selected custody and transaction references are recorded through Polygon, creating a tamper-resistant audit trail. Once written, the reference provides a durable point of comparison for due diligence, audit and counterparty review."
      >
        <CardGrid columns={2}>
          <Card
            title="What is written"
            body="A reference to selected custody and transaction events — enough to prove a record existed in a given state at a given time."
          />
          <Card
            title="What is not"
            body="Not all platform data is held on-chain. Supplier files, documents and personal data stay in the platform, under its access controls and retention rules."
          />
        </CardGrid>
      </Section>

      <Section
        eyebrow="Single source of truth"
        title="One record, joined to everything it touches"
      >
        <RowList rows={OBJECTS} />
      </Section>

      <FinalCta />
    </>
  );
}
