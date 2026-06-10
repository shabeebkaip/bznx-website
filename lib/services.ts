import {
  Building2,
  FileText,
  SearchCheck,
  BarChart3,
  Scale,
  BookOpen,
  Monitor,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceStep {
  number: string;
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  fullDescription: string;
  features: ServiceFeature[];
  process: ServiceStep[];
  timeline: string;
  deliverables: string[];
  whyBznx: { title: string; description: string }[];
}

export const SERVICES: Service[] = [
  {
    slug: "company-formation",
    icon: Building2,
    tag: "Setup",
    title: "Company Formation",
    description:
      "End-to-end commercial registration — MISA license, name reservation, Articles of Association, and CR. 45–50 working days inclusive of all government fees.",
    bullets: ["MISA / SAGIA License", "Commercial Registration (CR)", "100% Foreign Ownership", "MCI Approvals"],
    fullDescription:
      "Setting up a business in Saudi Arabia involves multiple government bodies, regulatory frameworks, and documentation requirements. BZNX manages every step from pre-incorporation strategy through to a fully registered, operational entity — so you can focus on business while we handle the Kingdom's bureaucracy.",
    features: [
      { title: "MISA / SAGIA License", description: "Full application management for the Ministry of Investment license, enabling 100% foreign ownership with no local sponsor required." },
      { title: "Commercial Registration (CR)", description: "Ministry of Commerce name reservation, CR issuance, and stamped Articles of Association in both Arabic and English." },
      { title: "Corporate Structuring", description: "Expert advice on the optimal legal entity type — LLC, branch office, representative office, or joint venture — for your specific business model." },
      { title: "MCI Approvals", description: "Ministry of Commerce and Industry approvals for regulated activities including commercial agents, industrial, and professional services." },
      { title: "Municipal Licensing", description: "Coordination of municipality licenses for physical premises across all Saudi cities and regions." },
      { title: "Bank Account Coordination", description: "Introduction and coordination with Saudi banks for corporate account opening with all required documentation." },
    ],
    process: [
      { number: "01", title: "Structure & Strategy", description: "We assess your business model and goals to recommend the optimal legal entity, ownership structure, and activity classification under Saudi regulations." },
      { number: "02", title: "MISA Application", description: "We prepare and file the MISA Investor License application with all required supporting documents, liaising with the Ministry throughout the approval process." },
      { number: "03", title: "CR & Articles of Association", description: "Upon MISA approval, we file for name reservation, draft bilingual Articles of Association, and complete the Commercial Registration with the Ministry of Commerce." },
      { number: "04", title: "Post-Incorporation Activation", description: "We register your entity on all required government portals — Chamber of Commerce, ZATCA, GOSI, HRSD, Qiwa, and Mudad — and coordinate your bank account opening." },
    ],
    timeline: "45–50 Working Days",
    deliverables: [
      "MISA Investor License",
      "Commercial Registration (CR)",
      "Articles of Association (Bilingual)",
      "Chamber of Commerce Registration",
      "ZATCA Tax Registration",
      "GOSI Registration",
      "National Address Registration",
      "Qiwa, Mudad & Muqeem Setup",
    ],
    whyBznx: [
      { title: "Parallel Processing", description: "We run applications concurrently wherever possible, cutting standard timelines by up to 60% versus sequential filing." },
      { title: "All Government Fees Included", description: "No surprise costs — our fixed-fee package covers all government fees from MISA through to post-incorporation portal setup." },
      { title: "Dedicated PRO Team", description: "Your setup is handled by our full-time PRO team who physically attend government offices on your behalf — no remote-only handling." },
    ],
  },
  {
    slug: "pro-services",
    icon: FileText,
    tag: "Government",
    title: "PRO Services",
    description:
      "Full government liaison handling — so you never have to walk into a Saudi government office. We manage all portals and visa processing on your behalf.",
    bullets: ["HRSD & MOL Processing", "GOSI & GAZT Registration", "Muqeem, Mudad, Qiwa Portals", "Visa & Iqama Processing"],
    fullDescription:
      "Saudi Arabia's government ecosystem spans dozens of portals, ministries, and approval workflows. BZNX's PRO team serves as your permanent liaison — managing all ongoing government interactions, visa processing, and portal compliance so your team never has to navigate Saudi bureaucracy alone.",
    features: [
      { title: "Visa Processing", description: "End-to-end management of work visa applications including block visa acquisition, medical tests, biometrics, and entry stamping." },
      { title: "Iqama (Residency Permit)", description: "First-time issuance and annual renewal of Iqama for all sponsored employees, including profession changes and upgrades." },
      { title: "Muqeem Portal Management", description: "Ongoing management of the Muqeem immigration portal for all sponsored employees — entry, exit, and status changes." },
      { title: "Qiwa & Mudad Compliance", description: "Monthly Qiwa compliance monitoring, Mudad payroll protection filings, and Nitaqat Saudization score management." },
      { title: "GOSI Administration", description: "Monthly GOSI contribution filing for Saudi and expatriate employees, including new registrations and termination processing." },
      { title: "HRSD / MOL Processing", description: "Ministry of Human Resources and Social Development filings including labor contracts, work permits, and dispute handling." },
    ],
    process: [
      { number: "01", title: "Mandate & Portal Access", description: "We take over management of all your government portals and are granted Power of Attorney to act on your behalf with all relevant authorities." },
      { number: "02", title: "Employee Onboarding", description: "We handle visa blocks, individual visa applications, medical screening coordination, and Iqama issuance for each employee." },
      { number: "03", title: "Ongoing Compliance", description: "Monthly Qiwa, GOSI, and Mudad filings are managed proactively — we flag issues before they become penalties." },
      { number: "04", title: "Renewals & Changes", description: "Iqama renewals, profession changes, dependent visas, and exit/re-entry permits are all handled without requiring your involvement." },
    ],
    timeline: "Ongoing Retainer",
    deliverables: [
      "Visa Block Acquisition",
      "Work Visa Applications",
      "Iqama Issuance & Renewal",
      "Muqeem Portal Management",
      "Qiwa Compliance Filing",
      "GOSI Monthly Contributions",
      "Mudad Payroll Protection",
      "HRSD Labor Contracts",
    ],
    whyBznx: [
      { title: "In-Person Government Attendance", description: "Our PRO team physically attend government offices — not just online portals — ensuring nothing falls through the cracks." },
      { title: "Zero Penalty Track Record", description: "Proactive deadline management means our clients have never received a compliance penalty under our watch." },
      { title: "Unlimited Employee Coverage", description: "Our retainer covers your entire headcount — no per-employee fees that grow as your team scales." },
    ],
  },
  {
    slug: "financial-due-diligence",
    icon: SearchCheck,
    tag: "Finance",
    title: "Financial Due Diligence",
    description:
      "Historical financials, working capital accuracy, and cash-flow analysis — enabling informed M&A decisions and true value assessment before acquisition or partnership.",
    bullets: ["Historical Financial Review", "Working Capital Analysis", "Cash-Flow Modelling", "Risk Assessment"],
    fullDescription:
      "Before any acquisition, investment, or partnership in Saudi Arabia, understanding the true financial position of a target business is essential. BZNX's due diligence practice uncovers what the numbers actually mean — beyond what audited statements show — giving decision-makers the confidence to act or walk away.",
    features: [
      { title: "Historical Financial Review", description: "3–5 year trend analysis of P&L, balance sheets, and cash flows — identifying anomalies, one-offs, and true underlying performance." },
      { title: "Working Capital Analysis", description: "Assessment of receivables quality, payables terms, inventory valuation, and normalized working capital requirements for the business." },
      { title: "Cash-Flow Modelling", description: "Independent cash flow projections stress-tested against market scenarios, contract exposure, and operational assumptions." },
      { title: "ZATCA Compliance Review", description: "Verification of VAT filing history, zakat obligations, and corporate tax exposure under Saudi tax regulations." },
      { title: "Risk Assessment", description: "Identification of contingent liabilities, off-balance-sheet exposure, related-party transactions, and regulatory compliance gaps." },
      { title: "Management Accounts Review", description: "Assessment of internal reporting quality, accounting policies, and alignment between management accounts and statutory filings." },
    ],
    process: [
      { number: "01", title: "Scope Definition", description: "We agree the scope, materiality thresholds, and key risk areas based on transaction type, deal size, and industry-specific considerations." },
      { number: "02", title: "Data Room Review", description: "Systematic review of all financial documents — statutory accounts, management accounts, contracts, and tax filings — through a structured request list." },
      { number: "03", title: "Analysis & Modelling", description: "Independent financial modelling, normalisation of EBITDA, and identification of quality-of-earnings adjustments that affect deal valuation." },
      { number: "04", title: "Report & Advisory", description: "Delivery of a structured due diligence report with findings, red flags, deal adjustment recommendations, and post-acquisition priorities." },
    ],
    timeline: "2–4 Weeks",
    deliverables: [
      "Financial Due Diligence Report",
      "Normalised EBITDA Analysis",
      "Working Capital Assessment",
      "Cash Flow Model",
      "ZATCA Compliance Summary",
      "Risk & Red Flag Register",
      "Deal Price Adjustment Recommendations",
      "Post-Acquisition Action Plan",
    ],
    whyBznx: [
      { title: "Saudi Market Expertise", description: "We understand ZATCA, zakat, and Saudi-specific accounting practices that international due diligence firms routinely miss." },
      { title: "Independent & Objective", description: "We have no relationship with the target — our findings are objective and presented in the investor's interest alone." },
      { title: "Actionable Findings", description: "Our reports don't just list risks — they quantify the deal impact and provide specific recommendations for negotiation or structuring." },
    ],
  },
  {
    slug: "audit-tax-compliance",
    icon: BarChart3,
    tag: "Compliance",
    title: "Audit, Tax & Compliance",
    description:
      "Internal, external, and special-purpose audits. Corporate tax planning, VAT / zakat compliance, and representation in financial and business disputes.",
    bullets: ["Internal & External Audit", "Corporate Tax Planning", "VAT / Zakat Compliance", "Dispute Representation"],
    fullDescription:
      "Saudi Arabia's tax and compliance landscape has changed dramatically with ZATCA's e-invoicing mandate, corporate income tax, and zakat obligations. BZNX provides comprehensive audit, tax planning, and compliance services — ensuring your business meets every obligation while minimising your tax burden legally.",
    features: [
      { title: "External Statutory Audit", description: "Independent audit of annual financial statements in accordance with Saudi Standards on Auditing, required for CR renewal and regulatory filings." },
      { title: "Internal Audit", description: "Risk-based internal audit programs assessing controls, processes, and operational efficiency across your Saudi operations." },
      { title: "Corporate Tax Planning", description: "Strategic tax planning for the 20% corporate income tax applying to foreign-owned entities, including deduction optimisation and structuring advice." },
      { title: "VAT Compliance", description: "Quarterly VAT return preparation and filing with ZATCA, including reconciliation, input tax recovery maximisation, and FATOORAH e-invoicing compliance." },
      { title: "Zakat Assessment", description: "Annual zakat calculation and filing for Saudi-owned entities and mixed-ownership companies, with representation in ZATCA assessments." },
      { title: "Dispute Representation", description: "Representation before ZATCA's Dispute Resolution Committee for tax and VAT objections, assessments, and penalties." },
    ],
    process: [
      { number: "01", title: "Compliance Assessment", description: "We review your current tax position, filing history, and identify any gaps or risks in your ZATCA compliance framework." },
      { number: "02", title: "Planning & Structuring", description: "We develop a tax-efficient structure and calendar for all filing obligations — VAT, corporate tax, zakat, and withholding tax." },
      { number: "03", title: "Audit & Filing", description: "We conduct audit fieldwork, prepare all required statutory accounts, and file all returns on time with ZATCA and the relevant authorities." },
      { number: "04", title: "Monitoring & Advisory", description: "Ongoing monitoring of regulatory changes, proactive advisory on new obligations, and representation if ZATCA raises any queries." },
    ],
    timeline: "Annual Engagement",
    deliverables: [
      "Statutory Audit Report",
      "Corporate Tax Return",
      "VAT Returns (Quarterly)",
      "Zakat Declaration",
      "FATOORAH E-Invoicing Setup",
      "Tax Planning Memorandum",
      "ZATCA Dispute Representation",
      "Compliance Calendar",
    ],
    whyBznx: [
      { title: "ZATCA Registered Auditors", description: "Our audit team is fully registered with ZATCA and the Saudi Organisation for Chartered and Professional Accountants (SOCPA)." },
      { title: "Proactive Not Reactive", description: "We flag upcoming obligations and regulatory changes before they become deadlines — never leaving clients scrambling to catch up." },
      { title: "Dispute Track Record", description: "We have successfully reduced ZATCA assessments by an average of 35% for clients through structured objection and negotiation." },
    ],
  },
  {
    slug: "legal-advisory",
    icon: Scale,
    tag: "Legal",
    title: "Legal Advisory",
    description:
      "Commercial and corporate law support for business setup, contracts, disputes, and ongoing compliance — with bilingual Arabic-English legal expertise.",
    bullets: ["Contract Drafting & Review", "Corporate Structuring", "Joint Venture Agreements", "Dispute Resolution"],
    fullDescription:
      "Operating in Saudi Arabia requires navigating a legal system with distinct rules around commercial contracts, corporate governance, employment law, and dispute resolution. BZNX's legal advisory practice provides bilingual Arabic-English legal expertise — from first contract through to commercial dispute.",
    features: [
      { title: "Contract Drafting & Review", description: "Preparation and review of commercial contracts, supply agreements, agency agreements, and service contracts under Saudi commercial law." },
      { title: "Corporate Structuring", description: "Legal structure design for LLCs, joint ventures, branches, and holding companies — balancing liability, tax, and governance requirements." },
      { title: "Joint Venture Agreements", description: "SHA, MOU, and JV documentation for partnerships between Saudi and international parties, including IP protection arrangements." },
      { title: "Employment Law", description: "Saudi Labor Law compliance, employment contract templates, termination procedures, and end-of-service benefit calculations." },
      { title: "Commercial Dispute Resolution", description: "Representation before the Saudi Commercial Court, arbitration proceedings, and the Saudi Centre for Commercial Arbitration (SCCA)." },
      { title: "Regulatory Compliance", description: "Ongoing legal compliance advisory covering governance obligations, board resolutions, and statutory filing requirements under Saudi company law." },
    ],
    process: [
      { number: "01", title: "Legal Needs Assessment", description: "We identify your immediate legal requirements and ongoing exposure — contracts, employment, governance, and regulatory obligations." },
      { number: "02", title: "Documentation & Structuring", description: "We draft all required legal documents in bilingual Arabic-English format, reviewed by Saudi-qualified legal professionals." },
      { number: "03", title: "Review & Negotiation Support", description: "We review counterparty documents, advise on risks and negotiation positions, and represent your interests in commercial discussions." },
      { number: "04", title: "Ongoing Legal Retainer", description: "Continuous legal support on new contracts, employment matters, and regulatory updates — available on-call as issues arise." },
    ],
    timeline: "Varies by Scope",
    deliverables: [
      "Commercial Contracts (Bilingual)",
      "Shareholders' Agreement",
      "Employment Contract Templates",
      "Board Resolutions",
      "JV / MOU Documentation",
      "Legal Compliance Review",
      "Dispute Filing & Representation",
      "Corporate Governance Framework",
    ],
    whyBznx: [
      { title: "Bilingual Legal Team", description: "All documents are prepared in both Arabic and English — critical for enforceability in Saudi courts and smooth counterparty relations." },
      { title: "Saudi & International Law", description: "Our team brings together Saudi-qualified lawyers and internationally trained corporate counsel for cross-border matters." },
      { title: "Commercial, Not Just Legal", description: "We give advice that makes business sense — not just what's legally correct — so you can move forward with confidence." },
    ],
  },
  {
    slug: "bookkeeping-payroll",
    icon: BookOpen,
    tag: "Accounting",
    title: "Bookkeeping & Payroll",
    description:
      "Timely bookkeeping, payroll management, and VAT preparation per ZATCA standards. Resolves reconciliation issues and delivers clear management reports.",
    bullets: ["Monthly Bookkeeping", "Payroll Processing", "ZATCA VAT Filing", "Management Reports"],
    fullDescription:
      "Accurate, timely financial records are the foundation of any compliant Saudi business. BZNX provides outsourced bookkeeping and payroll services that meet ZATCA's exacting standards — giving management clear visibility into their business while eliminating the overhead of an in-house finance team.",
    features: [
      { title: "Monthly Bookkeeping", description: "Complete monthly recording of transactions, bank reconciliations, and chart-of-accounts maintenance in your preferred accounting system." },
      { title: "Payroll Processing", description: "Monthly payroll calculation including basic salary, allowances, overtime, deductions, and end-of-service accruals in ZATCA-compliant format." },
      { title: "WPS / Mudad Compliance", description: "Payroll disbursement through the Wage Protection System (Mudad) to ensure full Nitaqat and Ministry of Labour compliance." },
      { title: "ZATCA VAT Returns", description: "Quarterly VAT return preparation and filing with full input/output reconciliation and FATOORAH e-invoicing compliance." },
      { title: "Management Reporting", description: "Monthly P&L, balance sheet, and cash flow reports with variance analysis — formatted for management decision-making." },
      { title: "Accounts Payable & Receivable", description: "Invoice processing, supplier payments, client invoicing, and aging report management to optimise your working capital." },
    ],
    process: [
      { number: "01", title: "System Setup", description: "We onboard your chart of accounts, configure your accounting system, and establish the monthly data-collection workflow with your team." },
      { number: "02", title: "Monthly Bookkeeping", description: "All transactions are recorded, categorised, and reconciled against bank statements by the 5th of each following month." },
      { number: "03", title: "Payroll & VAT", description: "Payroll is processed and disbursed via WPS by your payroll date. VAT returns are filed quarterly with full supporting schedules." },
      { number: "04", title: "Reporting & Review", description: "Monthly management pack is delivered with a brief review call — keeping management informed and audit-ready at all times." },
    ],
    timeline: "Monthly Retainer",
    deliverables: [
      "Monthly Trial Balance",
      "Bank Reconciliation",
      "Monthly Payroll Ledger",
      "WPS / Mudad Disbursement",
      "Quarterly VAT Return",
      "Monthly Management Reports",
      "GOSI Contribution Schedule",
      "Year-End Audit Pack",
    ],
    whyBznx: [
      { title: "ZATCA Compliant from Day One", description: "Our bookkeeping is structured around ZATCA requirements — VAT coding, e-invoicing, and audit trail — so you're always audit-ready." },
      { title: "Saudi Payroll Expertise", description: "We understand Saudi-specific complexities: end-of-service calculations, Saudization impacts on payroll, and WPS requirements." },
      { title: "Fixed Monthly Fee", description: "Transparent pricing with no per-transaction fees — you know exactly what you're paying as your transaction volume grows." },
    ],
  },
  {
    slug: "erp-implementation",
    icon: Monitor,
    tag: "Technology",
    title: "ERP Implementation",
    description:
      "Gap analysis, ERP system selection, customisation, data migration, and change management training — optimised for Saudi business environments.",
    bullets: ["Gap Analysis", "System Selection", "Data Migration", "Change Management Training"],
    fullDescription:
      "Implementing an ERP system in Saudi Arabia requires more than software expertise — it requires understanding ZATCA e-invoicing, Arabic localisation, WPS payroll integration, and Saudization reporting requirements. BZNX manages the full ERP lifecycle from selection through to post-go-live optimisation.",
    features: [
      { title: "Gap Analysis", description: "Assessment of current systems, workflows, and reporting requirements to identify gaps that the ERP must address for your Saudi operations." },
      { title: "System Selection", description: "Vendor-neutral ERP evaluation and recommendation across Oracle, SAP, Microsoft Dynamics, Odoo, and other systems — matched to your size and budget." },
      { title: "Saudi Localisation", description: "Configuration of Arabic language support, ZATCA e-invoicing (FATOORAH Phase 1 & 2), WPS payroll, and zakat/VAT reporting modules." },
      { title: "Data Migration", description: "Clean, structured migration of historical data from legacy systems with validation, reconciliation, and rollback contingency planning." },
      { title: "User Training", description: "Role-based training programs for all user groups — finance, HR, operations, and management — in both Arabic and English." },
      { title: "Post Go-Live Support", description: "3–6 month hypercare period with dedicated support for issues, optimisation, and module expansion as the team gets up to speed." },
    ],
    process: [
      { number: "01", title: "Discovery & Gap Analysis", description: "We map your current processes, data flows, and reporting needs — producing a formal gap analysis that drives the ERP specification." },
      { number: "02", title: "Selection & Planning", description: "We run a structured vendor selection process, negotiate contracts on your behalf, and develop a detailed implementation project plan." },
      { number: "03", title: "Configuration & Migration", description: "System configuration, Saudi localisation, integration setup, and parallel data migration — with weekly milestone reporting." },
      { number: "04", title: "Training, Go-Live & Hypercare", description: "User acceptance testing, phased go-live, cutover planning, and 3–6 months of post-go-live support and optimisation." },
    ],
    timeline: "3–6 Months",
    deliverables: [
      "Gap Analysis Report",
      "ERP Selection Recommendation",
      "Implementation Project Plan",
      "Saudi Localisation (ZATCA/WPS)",
      "Data Migration & Validation",
      "User Training Programme",
      "Go-Live Cutover Plan",
      "Post Go-Live Support (3–6 months)",
    ],
    whyBznx: [
      { title: "Saudi-First Localisation", description: "We configure ZATCA FATOORAH compliance, Arabic localisation, and WPS integration from day one — not as an afterthought." },
      { title: "Vendor-Neutral Advice", description: "We're not resellers — we recommend the system that's right for your business, not the one with the best commission margin." },
      { title: "Change Management Focus", description: "Most ERP failures are people problems, not technology problems. Our change management program drives adoption, not just implementation." },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
