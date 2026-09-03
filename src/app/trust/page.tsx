import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card, PendingNotice } from "@/components/marketing/page-shell";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Trust Centre",
  description:
    "How FIQS manages access, evidence integrity, retention, data portability and escalation.",
};

/** §13 splits these deliberately: confirmed controls render, unconfirmed do not. */
const CONFIRMED = [
  { title: "Access", body: "Role-based permissions, single sign-on and enforced two-factor authentication for administrators." },
  { title: "Evidence integrity", body: "Audit logs on records, with ledger references for selected custody and transaction events." },
  { title: "Retention", body: "Retention schedules configured by record class and enforced automatically." },
  { title: "Data portability", body: "Full export in open formats." },
] as const;

const UNCONFIRMED = ["Data residency", "Encryption standards", "Security certifications"] as const;

export default function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust Centre"
        title="Security, data and accountability"
        lead="Give procurement, compliance and operational teams a clear view of how FIQS manages access, evidence, retention and escalation."
      />

      <Section eyebrow="Confirmed controls" title="What is in place today">
        <CardGrid>
          {CONFIRMED.map((c) => (
            <Card key={c.title} title={c.title} body={c.body} />
          ))}
        </CardGrid>
      </Section>

      <Section tone="recessed" eyebrow="Not yet published" title="What we are not claiming">
        <PendingNotice>
          {UNCONFIRMED.join(", ")} are not published as active controls. §13
          requires unconfirmed items to be withheld rather than described, so
          they are listed here as outstanding instead of appearing in the
          controls above.
        </PendingNotice>
      </Section>

      <Section eyebrow="Escalation" title="A route for concerns">
        <CardGrid columns={2}>
          <Card
            title="Grievance workflow"
            body="Anyone connected to the supply chain can raise a concern without giving their name. The report opens a case, routes to an assigned officer and moves through a controlled review with named decisions, timestamps and retained records."
          />
          <Card
            title="Status lookup"
            body="A reference code is issued on submission and remains valid for checking progress, without an account and without exposing internal case data."
          />
        </CardGrid>
      </Section>

      <FinalCta />
    </>
  );
}
