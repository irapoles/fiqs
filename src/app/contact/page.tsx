import type { Metadata } from "next";

import { PageHero, Section, CardGrid, Card, PendingNotice } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Sales, technical support and the grievance channel — three separate routes.",
};

/** §15 keeps these distinct so a concern never lands in a sales queue. */
const ROUTES = [
  { title: "Sales", body: "Evaluating the platform, pricing or an implementation.", href: "/demo", cta: "Book a working session" },
  { title: "Technical support", body: "For operators already using FIQS, and for integration questions.", href: "/developers", cta: "Developer resources" },
  { title: "Grievance channel", body: "To raise a concern about the supply chain, anonymously if you prefer.", href: "/grievance", cta: "Raise a concern" },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Three routes, kept separate"
        lead="A concern about a supply chain should never arrive in a sales queue. Each route below is handled by a different team, with its own record and its own response target."
      />

      <Section>
        <CardGrid>
          {ROUTES.map((r) => (
            <Card key={r.title} title={r.title} body={r.body}>
              <a
                href={r.href}
                className="pressable mt-6 inline-block border-b border-[rgba(255,255,255,0.28)] pb-1 text-[0.875rem] font-medium text-paper hover:border-gold hover:text-gold"
              >
                {r.cta}
              </a>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section tone="recessed" eyebrow="Company details" title="Pending approval">
        <PendingNotice>
          The operating entity, jurisdiction, registered address and published
          response times are not confirmed yet, so they are omitted rather than
          approximated.
        </PendingNotice>
      </Section>
    </>
  );
}
