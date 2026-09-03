/**
 * FAQ seed set — spec §16.
 *
 * Data, not markup: the page renders these and the structured-data block is
 * generated from the same array, so the two can never disagree. Moves to a CMS
 * unchanged.
 */
export const FAQS = [
  {
    id: "does-fiqs-certify",
    q: "Does FIQS certify our gold or our operation?",
    a: "No. FIQS supports responsible sourcing workflows and produces audit-ready records. Certification of gold and accreditation under any assurance scheme remain with the recognised bodies and their approved assessors.",
  },
  {
    id: "frameworks",
    q: "Which frameworks does FIQS follow?",
    a: "The platform structures work around the OECD Due Diligence Guidance, the LBMA ASM Toolkit and the Responsible Minerals Assurance Process. It organises evidence in the shape those frameworks expect; it does not represent them.",
  },
  {
    id: "import-records",
    q: "Can our existing records be imported?",
    a: "Yes. Existing policies, documents, monthly reviews, approvals and evidence can be moved into the platform, where they gain versioning, retention state and export.",
  },
  {
    id: "blockchain",
    q: "What does the blockchain component actually do?",
    a: "Selected custody and transaction events carry a reference recorded through Polygon, which provides a durable point of comparison for due diligence and audit. Not all platform data is held on-chain — documents and personal data stay in the platform under its access controls.",
  },
  {
    id: "integrations",
    q: "Can FIQS integrate with our existing systems?",
    a: "The platform is designed to expose suppliers, custody events, transactions, screening results and documents through a REST API, with webhooks for event-driven integration. Published endpoint documentation is in progress.",
  },
  {
    id: "data-access",
    q: "Who can see our data?",
    a: "Access is role-based, with single sign-on and enforced two-factor authentication for administrators. Records carry audit logs showing who saw and changed what.",
  },
  {
    id: "implementation-time",
    q: "How long does implementation take?",
    a: "It depends on how much evidence already exists and what shape it is in. The guided onboarding produces a readiness report with a proposed sequence, which is the honest way to answer this for a specific operation.",
  },
  {
    id: "grievance-protection",
    q: "How is the anonymous reporting channel protected?",
    a: "A report can be filed without an account and without giving a name. Submission issues a reference code for checking status later, and internal case data is never exposed through that lookup.",
  },
] as const;
