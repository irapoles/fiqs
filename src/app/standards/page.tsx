import type { Metadata } from "next";
import Image from "next/image";

import { PageHero, Section, CardGrid, Card, RowList, ScopeNote } from "@/components/marketing/page-shell";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Standards & compliance",
  description:
    "How FIQS structures responsible sourcing work around the OECD Due Diligence Guidance, the LBMA ASM Toolkit and the Responsible Minerals Assurance Process.",
};

/** Framework records are CMS-shaped per §7: name, edition, last reviewed, summary, source. */
const FRAMEWORKS = [
  {
    name: "OECD Due Diligence Guidance",
    edition: "Edition [CONFIRM BEFORE LAUNCH]",
    body: "The five-step risk-based framework underpinning responsible mineral sourcing. FIQS structures each step as a workflow with owners, deadlines and evidence.",
  },
  {
    name: "LBMA ASM Toolkit",
    edition: "Edition [CONFIRM BEFORE LAUNCH]",
    body: "The practical framework used to evaluate and engage artisanal and small-scale supply. FIQS digitises checklists, monthly reviews and supporting documentation.",
  },
  {
    name: "Responsible Minerals Assurance Process",
    edition: "Edition [CONFIRM BEFORE LAUNCH]",
    body: "The third-party audit scheme operated by the Responsible Minerals Initiative. FIQS organises the evidence an assessor may request.",
  },
] as const;

const MONTHLY_CHECKS = [
  "Child labour",
  "Forced labour",
  "Human rights",
  "Bribery & corruption",
  "Sanctions exposure",
  "Supplier misconduct",
  "Chain-of-custody gaps",
  "Missing documentation",
] as const;

const ESCALATION = [
  "Issue",
  "Local manager review",
  "Senior approval",
  "Action plan",
  "Retained record",
] as const;

const FINANCIAL = [
  { term: "Counterparty", detail: "Who the check was performed against, linked to the supplier record." },
  { term: "Transaction", detail: "The purchase, sale or movement the check relates to." },
  { term: "Date performed", detail: "When the check ran, and when it is next due." },
  { term: "Reviewer", detail: "The named person who carried it out and signed it off." },
  { term: "Evidence", detail: "The documents relied on, retained against the record." },
] as const;

export default function StandardsPage() {
  return (
    <>
      <PageHero
        eyebrow="Standards & compliance"
        title="Built for responsible gold operators"
        lead="FIQS supports responsible sourcing workflows aligned with the LBMA ASM Toolkit, the OECD Due Diligence Guidance and the expectations of third-party assurance. The platform helps operators maintain structured records, document monthly due diligence, escalate risk and preserve audit-ready evidence."
        aside={
          /* Faceted collage of industrial and artisanal work. Guide §05 asks
             for both to carry equal dignity in the frame, and the three panels
             here do exactly that. Decorative beside a heading that already
             names the subject, so the alt is empty rather than a description
             a screen reader would have to sit through. */
          <Image
            src="/photos/hero-collage.png"
            alt=""
            width={1285}
            height={1418}
            priority
            sizes="(min-width: 1024px) 44vw, 80vw"
            className="mx-auto h-auto w-full max-w-[26rem] lg:max-w-none"
          />
        }
      />

      <Section
        eyebrow="Frameworks"
        title="Structure the work around recognised responsible-sourcing frameworks"
      >
        <CardGrid>
          {FRAMEWORKS.map((f) => (
            <Card key={f.name} meta={f.edition} title={f.name} body={f.body} />
          ))}
        </CardGrid>
      </Section>

      <Section
        tone="recessed"
        eyebrow="Financial controls"
        title="Assessment extends into the money"
        lead="Assessment of gold supply chains extends into financial controls, including KYC procedures, anti-money-laundering and counter-terrorist-financing measures, and sanctions screening. FIQS records these checks against five fields."
      >
        <RowList rows={FINANCIAL} />
      </Section>

      <Section eyebrow="Monthly controls" title="The checks that run every month">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] bg-line sm:grid-cols-2">
            {MONTHLY_CHECKS.map((c) => (
              <li key={c} className="bg-surface-2 px-5 py-4 text-[0.9375rem] text-paper">
                {c}
              </li>
            ))}
          </ul>

          <div className="rounded-[var(--radius-card)] bg-surface-2 p-7">
            <p className="type-label-sm mb-6 text-mist">Escalation</p>
            <ol className="flex flex-col gap-4">
              {ESCALATION.map((step, i) => (
                <li key={step} className="flex items-center gap-3.5">
                  <span className="type-mono w-5 shrink-0 text-[0.6875rem] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.9375rem] text-paper">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* §7 requires the scope statement prominent, not hidden in the footer. */}
      <Section tone="recessed" eyebrow="Scope" title="What FIQS does not do">
        <ScopeNote />
      </Section>

      <FinalCta />
    </>
  );
}
