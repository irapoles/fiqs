import type { Metadata } from "next";
import Image from "next/image";

import { PageHero, Section, CardGrid, Card, RowList, ScopeNote } from "@/components/marketing/page-shell";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Standards & compliance",
  description:
    "How FIQS structures responsible sourcing work around the OECD Due Diligence Guidance, the LBMA ASM Toolkit and the Responsible Minerals Assurance Process.",
};

/** Framework records are CMS-shaped per §7: name, last reviewed, summary, source.
 *
 *  The edition line is gone from public copy rather than softened. It was a
 *  note to ourselves — "Edition [CONFIRM BEFORE LAUNCH]" — and §28 is explicit
 *  that a claim which cannot be evidenced comes out instead of being hedged.
 *  When the editions are confirmed they can go back as real values. */
const FRAMEWORKS = [
  {
    name: "OECD Due Diligence Guidance",
    body: "The five-step risk-based framework underpinning responsible mineral sourcing. FIQS structures each step as a workflow with owners, deadlines and evidence.",
  },
  {
    name: "LBMA ASM Toolkit",
    body: "The practical framework used to evaluate and engage artisanal and small-scale supply. FIQS digitises checklists, monthly reviews and supporting documentation.",
  },
  {
    name: "Responsible Minerals Assurance Process",
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
          /* One photograph rather than the faceted collage it replaces. The
             brief asked for a cleaner crop with the focus held on credible
             operators in safety gear, and a three-panel montage was working
             against both.

             Carried in a card so it sits in the same vocabulary as everything
             else on the page — the 16px radius, no shadow. It is cropped to
             4:3 rather than run at its native 16:9, which would letterbox
             into a short strip beside a tall column of copy; the crop is
             held left of centre so the nearest worker keeps his shoulder.

             The image takes no grade, per guide §05: no gold wash and no
             added contrast, so hi-vis colours and skin tones stay true.

             It is described rather than given an empty alt. The collage was
             an abstract composition and reasonably decorative; a photograph
             of people at work carries content a screen reader should get.

             Note what the caption does *not* say. Guide §05 forbids pairing
             a site photograph with a compliance claim that site has not
             earned, so nothing here attributes anything to the operation
             shown. */
          <div className="overflow-hidden rounded-[var(--radius-card)]">
            <Image
              src="/photos/operators.webp"
              alt="Three workers in hard hats and high-visibility vests reviewing a site drawing together, one pointing across the plant behind them"
              width={1672}
              height={941}
              priority
              sizes="(min-width: 1024px) 44vw, 90vw"
              className="h-full w-full object-cover object-[35%_center] aspect-[4/3]"
            />
          </div>
        }
      />

      <Section
        eyebrow="Frameworks"
        title="Structure the work around recognised responsible-sourcing frameworks"
      >
        <CardGrid>
          {FRAMEWORKS.map((f) => (
            <Card key={f.name} title={f.name} body={f.body} />
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

      {/* §7 requires the scope statement prominent, not hidden in the footer.
          Positive heading: it matches the opening sentence, which is what the
          section actually leads with. The boundary itself is unchanged — the
          paragraph still puts certification and accreditation with the
          recognised bodies, which is the §1.3 requirement. */}
      <Section tone="recessed" eyebrow="Scope" title="What FIQS does">
        <ScopeNote />
      </Section>

      <FinalCta />
    </>
  );
}
