import type { Metadata } from "next";

import { PageHero, Section, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What changed in the platform and the API, and when.",
};

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="What changed, and when"
        lead="Platform and API releases, with version, date and the tags needed to filter them."
      />
      <Section tone="recessed">
        <PendingNotice>
          No public releases yet. Entries appear here — title, date, version,
          body and tags — once the platform ships publicly.
        </PendingNotice>
      </Section>
    </>
  );
}
