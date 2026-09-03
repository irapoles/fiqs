import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-shell";
import { FaqList } from "@/components/marketing/faq-list";
import { FAQS } from "@/content/faqs";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about what FIQS does, which frameworks it structures work around, what the blockchain component does, and who can see your data.",
};

export default function FaqPage() {
  return (
    <>
      {/* §24 asks for FAQ structured data. Emitted from the same source the
          page renders, so the two can never disagree. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <PageHero
        eyebrow="FAQ"
        title="Questions we are asked before the first call"
        lead="If the answer you need is not here, the demo session is a working one — bring the question."
      />

      <FaqList />
    </>
  );
}
