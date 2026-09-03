import type { Metadata } from "next";

import { PageHero, Section, RowList, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Acceptable use policy",
  description: "What the FIQS platform may and may not be used for.",
};

const OUTLINE = [
  { term: "Permitted use", detail: "Operating a responsible sourcing programme and maintaining its evidence." },
  { term: "Prohibited use", detail: "Falsifying records, misrepresenting provenance, or using the platform to give an unearned appearance of compliance." },
  { term: "Content standards", detail: "What may be uploaded, including obligations around personal data belonging to third parties." },
  { term: "Enforcement", detail: "How breaches are handled, including suspension, and how a decision can be challenged." },
] as const;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Acceptable use policy" lead="What the FIQS platform may and may not be used for." />

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
