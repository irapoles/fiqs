/**
 * The ten platform modules — copy from spec §6.
 *
 * Kept as data rather than markup so it can move to a CMS intact (§30.6), and
 * so the ids stay the single source for the anchor URLs §24 asks to keep
 * stable. Changing an id breaks a public link; add rather than rename.
 */

export const MODULES = [
  {
    id: "mine-data",
    title: "Mine & exploration data",
    body: "Centralised storage for drilling data, technical surveys, geological reports, mine documentation and production records.",
  },
  {
    id: "onboarding",
    title: "Supplier & mine onboarding",
    body: "Digital onboarding covering KYC, ownership, site records, approvals and document collection.",
  },
  {
    id: "site-verification",
    title: "GPS site verification",
    body: "Location-backed onboarding connecting mine records and supplier activity to the correct physical site.",
  },
  {
    id: "screening",
    title: "Sanctions & risk screening",
    body: "Screening at onboarding and during ongoing supplier review, identifying restricted parties and higher-risk counterparties.",
  },
  {
    id: "due-diligence",
    title: "Due diligence workflow",
    body: "Structured workflows aligned with the LBMA ASM Toolkit, including monthly checks, evidence capture and supporting documentation.",
  },
  {
    id: "oecd-controls",
    title: "OECD-aligned controls",
    body: "Structured controls supporting OECD due diligence expectations and preparation for third-party assessment.",
  },
  {
    id: "chain-of-custody",
    title: "Blockchain chain of custody",
    body: "Selected custody and transaction events referenced through Polygon to support tamper-resistant traceability.",
  },
  {
    id: "grievance",
    title: "Grievance, escalation & sign-off",
    body: "Anonymous reporting, routed investigation, management review, digital sign-off and long-term retention.",
  },
  {
    id: "transactions",
    title: "Transactions & financial controls",
    body: "Gold purchases, sales, refining activity, inventory, cash movement and financial reporting in one environment.",
  },
  {
    id: "audit-packs",
    title: "Reporting & audit packs",
    body: "Export evidence for a chosen period, supplier or shipment in a structured assessor-ready format.",
  },
] as const;
