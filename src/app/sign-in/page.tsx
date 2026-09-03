import type { Metadata } from "next";

import { PageHero, Section, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the FIQS platform.",
  robots: { index: false },
};

export default function SignInPage() {
  return (
    <>
      <PageHero
        eyebrow="Sign in"
        title="Sign in to FIQS"
        lead="Access to the platform is by invitation through your organisation's administrator."
      />
      <Section tone="recessed">
        {/* Never build a credential form that posts nowhere — it trains people
            to type real passwords into an unverified surface. */}
        <PendingNotice>
          Authentication is not wired up on this site. No sign-in form is shown
          here on purpose: a credential field that posts nowhere teaches people
          to enter real passwords into an unverified page. The application login
          lives on its own authenticated domain.
        </PendingNotice>
      </Section>
    </>
  );
}
