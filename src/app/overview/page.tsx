import type { Metadata } from "next";

import { PageHero, Section, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Corporate overview",
  description: "Download the FIQS corporate overview.",
};

export default function OverviewPage() {
  return (
    <>
      <PageHero
        eyebrow="Corporate overview"
        title="The platform, in one document"
        lead="A single overview of what FIQS covers, how the evidence trail is built, and where it stops."
      />
      <Section tone="recessed">
        {/* §15: email-gated, signed URL, CRM event. None of that exists yet. */}
        <PendingNotice>
          The overview document is not published yet. When it is, the download
          is email-gated behind a signed URL rather than a public file, so it
          needs the same delivery path as the demo request.
        </PendingNotice>
      </Section>
    </>
  );
}
