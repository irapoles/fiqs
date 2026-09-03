import type { Metadata } from "next";

import { PageHero, Section, RowList, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What personal data FIQS collects, why, how long it is kept and what rights you have over it.",
};

const OUTLINE = [
  { term: "What we collect", detail: "Account and contact data, records you upload, and the operational data the platform is used to keep." },
  { term: "Why we process it", detail: "The lawful bases relied on for each category, including contract, legitimate interests and legal obligation." },
  { term: "Retention", detail: "How long each record class is held, and what triggers deletion. Retention periods are configured by class and enforced automatically." },
  { term: "Sub-processors", detail: "Who else processes data on our behalf, for what, and where." },
  { term: "Your rights", detail: "Access, correction, erasure, portability and objection, and how to exercise each." },
  { term: "Transfers", detail: "Where data is stored and the safeguards applied to any transfer." },
] as const;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" lead="What personal data FIQS collects, why, how long it is kept and what rights you have over it." />

      <Section eyebrow="Outline" title="What this document will cover">
        <RowList rows={OUTLINE} />
      </Section>

      <Section tone="recessed" eyebrow="Status" title="Awaiting legal review">
        <PendingNotice>
          This is the agreed outline, not the executed document. The operative
          text has to be drafted and reviewed against the confirmed operating
          entity and jurisdiction — neither of which is settled — so no clause
          here should be relied on. Publishing plausible-sounding legal text
          would be worse than publishing the outline honestly.
        </PendingNotice>
      </Section>
    </>
  );
}
