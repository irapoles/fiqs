import type { Metadata } from "next";

import { PageHero, Section, PendingNotice } from "@/components/marketing/page-shell";
import { GrievanceFlow } from "@/components/marketing/grievance-flow";

export const metadata: Metadata = {
  title: "Grievance channel",
  description:
    "Raise a concern about the supply chain, anonymously if you prefer. Every report opens a case with a reference code and a controlled review process.",
};

export default function GrievancePage() {
  return (
    <>
      <PageHero
        eyebrow="Grievance channel"
        title="A route for concerns, and a record of what happened next"
        lead="Anyone connected to the supply chain can raise a concern without giving their name. The report opens a case, routes to an assigned officer and moves through a controlled review process with named decisions, timestamps, action plans and retained records."
      />

      <GrievanceFlow />

      <Section tone="recessed" eyebrow="Submission" title="The form is not live yet">
        {/* §14 requires rate limiting, abuse prevention, anonymous submission
            and a status lookup — all server-side. Shipping a form that posts
            nowhere would be worse than none: someone raising a real concern
            would believe it had been filed. */}
        <PendingNotice>
          The submission form is not connected yet. It requires anonymous
          intake, reference-code issue, status lookup and abuse prevention, all
          server-side. A form that accepted a report and did nothing with it
          would leave someone believing a real concern had been filed, so it
          stays offline until the case workflow is live.
        </PendingNotice>
      </Section>
    </>
  );
}
