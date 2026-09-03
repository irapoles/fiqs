import type { Metadata } from "next";

import { PageHero, Section, RowList, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Security disclosure",
  description: "How to report a security vulnerability in FIQS, and what happens next.",
};

const OUTLINE = [
  { term: "Scope", detail: "Which systems and domains are in scope for testing, and which are explicitly out." },
  { term: "How to report", detail: "The reporting channel, what to include, and how to send anything sensitive securely." },
  { term: "Safe harbour", detail: "The commitment not to pursue action against good-faith research conducted within scope." },
  { term: "What happens next", detail: "Acknowledgement, triage, remediation and the disclosure timeline we work to." },
] as const;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Security disclosure" lead="How to report a security vulnerability in FIQS, and what happens next." />

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
