import type { Metadata } from "next";

import { PageHero, Section, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Status",
  description: "Platform and API availability.",
};

export default function StatusPage() {
  return (
    <>
      <PageHero
        eyebrow="Status"
        title="Platform and API availability"
        lead="Live availability, incident history and scheduled maintenance for the platform and the API."
      />
      <Section tone="recessed">
        {/* A hard-coded "all systems operational" is a claim about live state
            that nothing is checking — the worst kind of thing to fake. */}
        <PendingNotice>
          The status feed is not connected yet. Rather than render a static
          &ldquo;all systems operational&rdquo; that nothing is actually checking, this
          page stays empty until it reports real availability.
        </PendingNotice>
      </Section>
    </>
  );
}
