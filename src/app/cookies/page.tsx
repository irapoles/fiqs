import type { Metadata } from "next";

import { PageHero, Section, RowList, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "What is stored on your device when you use this site, and how to control it.",
};

const OUTLINE = [
  { term: "Strictly necessary", detail: "What the site cannot function without, and why each item qualifies." },
  { term: "Analytics", detail: "What is measured, in what form, and how it is separated from personal data." },
  { term: "Preferences", detail: "Choices remembered between visits, including any audience route selected on the site." },
  { term: "Your controls", detail: "How to change or withdraw consent, and what changes when you do." },
] as const;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Cookie policy" lead="What is stored on your device when you use this site, and how to control it." />

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
