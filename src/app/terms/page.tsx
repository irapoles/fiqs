import type { Metadata } from "next";

import { PageHero, Section, RowList, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The agreement governing use of the FIQS platform.",
};

const OUTLINE = [
  { term: "The service", detail: "What the platform provides, and the boundary of what it does not — FIQS does not certify gold or issue accreditation." },
  { term: "Your account", detail: "Administrator responsibilities, user provisioning and the security obligations attached to access." },
  { term: "Your data", detail: "You retain ownership of records you upload. What we may do with them, and what we may not." },
  { term: "Availability", detail: "Service commitments, maintenance windows and what happens when they are not met." },
  { term: "Fees & term", detail: "Charges, renewal, and how either party ends the agreement." },
  { term: "Liability", detail: "Limitations, exclusions and the allocation of risk between the parties." },
] as const;

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of service" lead="The agreement governing use of the FIQS platform." />

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
