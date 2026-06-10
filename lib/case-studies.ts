export interface CaseStudyResult {
  value: string;
  label: string;
}

export interface CaseStudyStep {
  number: string;
  title: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  id: string;
  tag: string;
  industry: string;
  title: string;
  clientType: string;
  location: string;
  duration: string;
  image: string;
  outcome: string;
  description: string;
  challenge: string;
  approach: CaseStudyStep[];
  results: CaseStudyResult[];
  deliverables: string[];
  services: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "european-tech-market-entry",
    id: "01",
    tag: "Market Entry",
    industry: "Technology / SaaS",
    title: "Market Entry for European Tech Firm",
    clientType: "European SaaS Company",
    location: "Riyadh, Saudi Arabia",
    duration: "8 weeks",
    image: "/whySaudi/Saudi-Western-Business-Partnership-Handshake-in-Riyadh.webp",
    outcome: "60% faster go-live",
    description:
      "Guided a European SaaS company through full Saudi market entry — CR registration, ZATCA tax setup, and Saudization compliance — cutting their go-live timeline by 60%.",
    challenge:
      "The client had estimated 6 months to achieve operational status in Saudi Arabia based on prior experiences in other GCC markets. They faced overlapping regulatory requirements across MISA, MCI, and ZATCA with no local expertise, while their product launch deadline was fixed and non-negotiable.",
    approach: [
      {
        number: "01",
        title: "Regulatory Mapping",
        description:
          "Conducted a full scope assessment across MISA, MCI, ZATCA, and HRSD requirements. Identified parallel processing opportunities that the client's internal team had treated as sequential.",
      },
      {
        number: "02",
        title: "MISA License Fast-Track",
        description:
          "Filed MISA application with a pre-cleared activity list and supporting documentation package. Engaged our government liaison to expedite approval within the first 10 days.",
      },
      {
        number: "03",
        title: "Parallel CR & ZATCA Registration",
        description:
          "While awaiting MISA approval, prepared all Commercial Registration and ZATCA tax registration documents. Both were filed the same day MISA approval was received.",
      },
      {
        number: "04",
        title: "Workforce & Visa Setup",
        description:
          "Managed Muqeem, Qiwa, and GOSI portal onboarding simultaneously. Sponsored initial visa block for 6 employees, enabling the team to be on the ground within week 7.",
      },
    ],
    results: [
      { value: "60%", label: "Timeline Reduction" },
      { value: "8 wks", label: "Fully Operational" },
      { value: "6", label: "Visas Sponsored" },
      { value: "Wk 9", label: "First Invoice Issued" },
    ],
    deliverables: [
      "MISA License",
      "Commercial Registration (CR)",
      "ZATCA Tax Registration",
      "GOSI Registration",
      "Muqeem / Qiwa Portal Setup",
      "6 Employee Visas & Iqamas",
      "VAT Registration",
      "Bank Account Coordination",
    ],
    services: ["Company Formation", "PRO Services", "Tax & Compliance"],
    testimonial: {
      quote:
        "BZNX compressed what we thought was a 6-month process into 8 weeks. They handled everything — we just showed up to open our offices.",
      author: "Chief Operating Officer",
      role: "European SaaS Company",
    },
  },
  {
    slug: "uae-logistics-multi-branch",
    id: "02",
    tag: "Business Setup",
    industry: "Logistics & Supply Chain",
    title: "LLC Formation & Multi-Branch Registration",
    clientType: "UAE-Based Logistics Group",
    location: "Riyadh, Jeddah & Dammam",
    duration: "6 weeks",
    image: "/whySaudi/business-setup-in-Saudi.jpg",
    outcome: "3 branches in 6 weeks",
    description:
      "End-to-end commercial registration for a UAE-based logistics group expanding into the Kingdom, including MCI approvals and municipal licensing across three cities.",
    challenge:
      "The client needed a physical presence in three Saudi cities simultaneously to fulfil a major government logistics contract. Each branch required separate municipal licensing, and the parent company's UAE ownership structure needed to be validated against Saudi foreign ownership regulations.",
    approach: [
      {
        number: "01",
        title: "Structure Assessment",
        description:
          "Reviewed the UAE parent company structure against Saudi foreign ownership rules. Confirmed 100% foreign ownership eligibility under the client's industry classification and designed an LLC holding structure.",
      },
      {
        number: "02",
        title: "MISA & Headquarters CR",
        description:
          "Filed MISA license and Riyadh headquarters CR simultaneously. Articles of Association drafted bilingually and notarised within 72 hours of approval.",
      },
      {
        number: "03",
        title: "Staggered Branch Licensing",
        description:
          "Initiated Jeddah and Dammam branch registrations under the HQ CR immediately upon issuance. Coordinated separate municipality files in both cities in parallel.",
      },
      {
        number: "04",
        title: "GOSI, Qiwa & PRO Handover",
        description:
          "Registered all three locations under a single GOSI account, configured Qiwa for workforce tracking, and transitioned ongoing PRO management to our retainer team.",
      },
    ],
    results: [
      { value: "3", label: "Branches Registered" },
      { value: "6 wks", label: "Total Duration" },
      { value: "100%", label: "Foreign Ownership" },
      { value: "1", label: "Unified GOSI Account" },
    ],
    deliverables: [
      "MISA License",
      "Headquarters CR (Riyadh)",
      "Branch CR — Jeddah",
      "Branch CR — Dammam",
      "Municipal Licensing × 3",
      "Articles of Association (Bilingual)",
      "GOSI Registration",
      "Qiwa & Mudad Setup",
    ],
    services: ["Company Formation", "Legal Advisory", "PRO Services"],
  },
  {
    slug: "kafd-financial-services-setup",
    id: "03",
    tag: "Legal & Licensing",
    industry: "Financial Services",
    title: "KAFD Operations & FSC Licensing",
    clientType: "Global Financial Services Firm",
    location: "KAFD, Riyadh",
    duration: "90 days",
    image: "/home/kafd.webp",
    outcome: "FSC licensed in 90 days",
    description:
      "Assisted a global financial services firm in securing KAFD licensing, FSC permits, and establishing their Riyadh HQ under Vision 2030 targets.",
    challenge:
      "The KAFD regulatory environment operates under a parallel jurisdiction to standard Saudi commercial law — requiring simultaneous engagement with the KAFD Authority, the Financial Sector Conference (FSC) licensing body, and SAMA compliance obligations. The client's legal team had no prior experience navigating this dual-framework environment.",
    approach: [
      {
        number: "01",
        title: "Dual-Jurisdiction Mapping",
        description:
          "Mapped all applicable regulations across KAFD Authority, FSC, and SAMA. Identified that the client's activity set required a Financial Business License (FBL) rather than a standard MISA license.",
      },
      {
        number: "02",
        title: "KAFD Entity Registration",
        description:
          "Completed the KAFD entity registration including name reservation, activity approval, and the KAFD-specific Articles of Association. Coordinated directly with the KAFD Admin team through our existing liaison.",
      },
      {
        number: "03",
        title: "FSC License Application",
        description:
          "Prepared the FSC license application dossier including AML/CFT policies, organisational structure, fit-and-proper assessments for directors, and financial projections. Filed within week 3.",
      },
      {
        number: "04",
        title: "Office & Visa Activation",
        description:
          "Secured the KAFD office unit assignment, coordinated fit-out approvals, and initiated visa sponsorship for 12 staff including the country manager.",
      },
    ],
    results: [
      { value: "90", label: "Days to FSC License" },
      { value: "12", label: "Staff Sponsored" },
      { value: "2", label: "Regulatory Bodies Navigated" },
      { value: "Wk 3", label: "FSC Application Filed" },
    ],
    deliverables: [
      "KAFD Entity Registration",
      "Financial Business License (FBL)",
      "FSC License",
      "AML/CFT Policy Documentation",
      "Director Fit-and-Proper Assessment",
      "Articles of Association (KAFD Format)",
      "12 Visa & Iqama Sponsorships",
      "SAMA Compliance Framework",
    ],
    services: ["Legal Advisory", "Company Formation", "Audit, Tax & Compliance"],
    testimonial: {
      quote:
        "Navigating KAFD's dual-regulatory environment looked impossible from the outside. BZNX made it look routine — 90 days from decision to licensed.",
      author: "Regional Director",
      role: "Global Financial Services Firm",
    },
  },
  {
    slug: "retail-saudization-strategy",
    id: "04",
    tag: "HR Compliance",
    industry: "Retail",
    title: "Saudization Strategy for 12-Branch Retail Chain",
    clientType: "International Retail Chain",
    location: "Nationwide, Saudi Arabia",
    duration: "18 months",
    image: "/whySaudi/saudi-operations-manager-delivering-successful-presentation-about-lucrative-business_995029-357.avif",
    outcome: "Yellow → Platinum Nitaqat",
    description:
      "Designed a Nitaqat-compliant Saudization roadmap for a 12-branch retail chain, raising their Nitaqat rating from Yellow to Platinum in 18 months.",
    challenge:
      "The client's 12 Saudi branches were rated Yellow under the Nitaqat Saudization program — one level from Red, which would trigger a complete hiring freeze and block visa renewals. With over 200 expatriate employees, the risk of operational disruption was severe. Previous attempts to hire Saudi nationals had seen high attrition within 90 days.",
    approach: [
      {
        number: "01",
        title: "Workforce Audit",
        description:
          "Conducted a full headcount audit across all 12 branches, mapping current Nitaqat scores per location, identifying roles eligible for Saudization, and calculating the delta to reach Green rating.",
      },
      {
        number: "02",
        title: "Role Redesign & Compensation Review",
        description:
          "Identified roles where Saudi retention was low and restructured job descriptions, commission structures, and career pathways to make positions more competitive versus government employment alternatives.",
      },
      {
        number: "03",
        title: "HRSD Engagement & Subsidy Access",
        description:
          "Registered the client for HRDF wage subsidies for new Saudi hires, reducing the net payroll cost of Saudization by 40% in year one. Engaged HRSD directly to confirm compliance strategy.",
      },
      {
        number: "04",
        title: "Phased Hiring & Monitoring",
        description:
          "Managed a phased Saudi hiring plan with monthly Nitaqat score tracking. Provided quarterly HRSD compliance reports and managed all Qiwa and Mudad filings throughout.",
      },
    ],
    results: [
      { value: "Platinum", label: "Final Nitaqat Rating" },
      { value: "40%", label: "Saudi Workforce Achieved" },
      { value: "40%", label: "Payroll Cost Offset via HRDF" },
      { value: "0", label: "Visa Renewals Blocked" },
    ],
    deliverables: [
      "Nitaqat Compliance Roadmap",
      "Workforce Audit Report (12 branches)",
      "Role Redesign Documentation",
      "HRDF Subsidy Registration",
      "Monthly Nitaqat Score Tracking",
      "HRSD Engagement & Reporting",
      "Qiwa & Mudad Ongoing Management",
      "Saudization KPI Dashboard",
    ],
    services: ["PRO Services", "Bookkeeping & Payroll", "Legal Advisory"],
    testimonial: {
      quote:
        "We went from Yellow to Platinum in 18 months without a single visa renewal disruption. BZNX's strategy saved us from a crisis we didn't know how to solve.",
      author: "VP Human Resources",
      role: "International Retail Chain",
    },
  },
  {
    slug: "joint-venture-structuring",
    id: "05",
    tag: "Corporate Law",
    title: "Joint Venture Structuring & Legal Framework",
    industry: "Engineering & Construction",
    clientType: "Saudi Family Office + International Engineering Firm",
    location: "Riyadh, Saudi Arabia",
    duration: "45 days",
    image: "/whySaudi/1149336-482084725.jpg",
    outcome: "JV operational in 45 days",
    description:
      "Structured a JV between a Saudi family office and an international engineering firm, drafting the SHA, MOU, and all supporting legal agreements from term sheet to operational.",
    challenge:
      "Both parties had agreed in principle on a JV but had no agreed legal framework, incompatible expectations on profit distribution, IP ownership, and governance, and a 60-day window before a major infrastructure tender closed — which the JV was being formed to bid on.",
    approach: [
      {
        number: "01",
        title: "Term Sheet Alignment",
        description:
          "Facilitated a structured term sheet negotiation covering equity split, profit waterfall, IP licensing arrangements, management rights, and exit provisions. Reached full agreement within week 1.",
      },
      {
        number: "02",
        title: "Legal Structure Design",
        description:
          "Designed a two-tier structure: a Saudi LLC (51% Saudi family office, 49% international firm) with a separate IP holding arrangement outside Saudi jurisdiction to protect the engineering firm's proprietary technology.",
      },
      {
        number: "03",
        title: "Document Drafting",
        description:
          "Drafted the Shareholders' Agreement (SHA), Memorandum of Understanding (MOU), IP licensing agreement, management services agreement, and the LLC's Articles of Association — all bilingual Arabic-English.",
      },
      {
        number: "04",
        title: "Registration & Activation",
        description:
          "Filed the LLC registration with MCI, notarised all agreements, and completed MISA licensing for the foreign partner's share. JV was fully registered and operational on day 45.",
      },
    ],
    results: [
      { value: "45", label: "Days to Operational" },
      { value: "5", label: "Legal Documents Drafted" },
      { value: "2", label: "Jurisdictions Navigated" },
      { value: "✓", label: "Tender Submitted On Time" },
    ],
    deliverables: [
      "Shareholders' Agreement (SHA)",
      "Memorandum of Understanding (MOU)",
      "IP Licensing Agreement",
      "Management Services Agreement",
      "Articles of Association (Bilingual)",
      "MISA License (Foreign Partner)",
      "LLC Commercial Registration",
      "MCI Corporate Filing",
    ],
    services: ["Legal Advisory", "Company Formation", "Financial Due Diligence"],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}
