export type ContentBlock =
  | { type: "paragraph"; text: string | { en: string; ar: string } }
  | { type: "heading"; text: string | { en: string; ar: string } }
  | { type: "subheading"; text: string | { en: string; ar: string } }
  | { type: "bullets"; items: string[] | { en: string[]; ar: string[] } }
  | { type: "numbered"; items: string[] | { en: string[]; ar: string[] } }
  | { type: "quote"; text: string | { en: string; ar: string }; author?: string | { en: string; ar: string } }
  | { type: "callout"; title: string | { en: string; ar: string }; text: string | { en: string; ar: string } };

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  featured?: boolean;
  image: string;
  gradient: string;
  content: ContentBlock[];
  ctaSection?: {
    badge: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    ctaText2?: string;
    ctaLink2?: string;
  };
}

// export const BLOG_POSTS: BlogPost[] = [
//   {
//     slug: "neom-investment-opportunities-2025",
//     category: "Business News",
//     categoryColor: "#26D0CE",
//     title: "NEOM Accelerates Foreign Investment: New Incentives Announced for 2025",
//     excerpt:
//       "Saudi Arabia's landmark NEOM project unveils new investment frameworks offering foreign businesses streamlined licensing and unparalleled return potential in a giga-city unlike anything the world has seen.",
//     date: "May 2, 2025",
//     readTime: "5 min read",
//     featured: true,
//     image: "/home/kafd.webp",
//     gradient: "linear-gradient(135deg, #0A1D37 0%, #1A2B5A 50%, #243370 100%)",
//     content: [
//       {
//         type: "paragraph",
//         text: "NEOM, Saudi Arabia's futuristic mega-city project spanning 26,500 km² in the Tabuk province, has announced a sweeping new package of investment incentives designed to attract international capital at an unprecedented scale. The announcement, made at the Riyadh Business Forum, signals a significant acceleration in the Kingdom's Vision 2030 agenda.",
//       },
//       {
//         type: "heading",
//         text: "What's New in the 2025 Investment Framework",
//       },
//       {
//         type: "paragraph",
//         text: "The updated framework introduces several critical changes for foreign investors looking to participate in NEOM's development ecosystem:",
//       },
//       {
//         type: "bullets",
//         items: [
//           "100% foreign ownership permitted across all NEOM zones without a local partner requirement",
//           "Expedited licensing: MISA approvals within 5 business days (down from 30)",
//           "Tax holidays of up to 50 years for qualifying NEOM-based entities",
//           "Dedicated fast-track residency visas for NEOM investors and their teams",
//           "Custom regulatory environment separate from Saudi mainland regulations",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Key NEOM Projects Open for Foreign Investment",
//       },
//       {
//         type: "callout",
//         title: "THE LINE",
//         text: "The world's most ambitious linear city — 170km long, zero carbon, zero cars. Foreign investment in construction, tech, and services sectors is now open with guaranteed government procurement contracts.",
//       },
//       {
//         type: "paragraph",
//         text: "Beyond THE LINE, projects including SINDALAH (luxury yacht island), OXAGON (floating industrial complex), and TROJENA (mountain tourism) are now accepting foreign equity participation through structured SPVs.",
//       },
//       {
//         type: "heading",
//         text: "Implications for Business Owners",
//       },
//       {
//         type: "paragraph",
//         text: "For foreign businesses, the NEOM framework represents the most liberal investment environment in the GCC. Unlike the mainland Saudi market, NEOM operates under its own regulatory authority — the NEOM Authority — which has been granted extraordinary powers to create bespoke commercial laws.",
//       },
//       {
//         type: "quote",
//         text: "NEOM isn't just a project — it's a jurisdiction. The commercial laws here will be designed for 21st-century business, not inherited from legacy frameworks.",
//         author: "NEOM CEO Briefing, 2025",
//       },
//       {
//         type: "subheading",
//         text: "Action Steps for Interested Investors",
//       },
//       {
//         type: "numbered",
//         items: [
//           "Register your interest through the NEOM Business Gateway portal",
//           "Obtain your MISA Investor License (BZNX can handle this end-to-end in 45–50 days)",
//           "Structure your NEOM entity as an LLC or branch under the NEOM Authority",
//           "Apply for NEOM-specific tax status before the Q3 2025 deadline",
//           "Engage a local consultant for government liaison and compliance",
//         ],
//       },
//       {
//         type: "paragraph",
//         text: "The window for early-mover advantage in NEOM is narrowing rapidly. With Phase 1 construction hitting full speed, the companies that establish their presence now will command the supply chain relationships that define competitive advantage for decades to come.",
//       },
//     ],
//   },
//   {
//     slug: "company-formation-saudi-arabia-guide",
//     category: "How-to Guide",
//     categoryColor: "#10B981",
//     title: "Complete Guide to Company Formation in Saudi Arabia (2025 Update)",
//     excerpt:
//       "Everything you need to know about setting up a business in the Kingdom — from MISA licensing to Commercial Registration — with a realistic timeline under 50 business days.",
//     date: "Apr 28, 2025",
//     readTime: "8 min read",
//     featured: false,
//     image: "/whySaudi/business-setup-in-Saudi.jpg",
//     gradient: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)",
//     content: [
//       {
//         type: "paragraph",
//         text: "Setting up a company in Saudi Arabia as a foreign investor has never been more streamlined — but it still requires navigating a specific sequence of government portals, legal requirements, and approval processes. This guide provides a realistic, step-by-step breakdown of the entire process as it stands in 2025.",
//       },
//       {
//         type: "callout",
//         title: "Key Numbers to Know",
//         text: "Total timeline: 45–50 business days. Total government fees: SAR 8,000–15,000 depending on activity. Minimum capital: Varies by sector (SAR 500,000+ for commercial activities).",
//       },
//       {
//         type: "heading",
//         text: "Phase 1: Pre-Incorporation (7–10 Business Days)",
//       },
//       {
//         type: "paragraph",
//         text: "Before any government application begins, you need to complete your groundwork. This phase is often overlooked by foreign investors and causes the most delays when not done correctly.",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Determine your legal structure: LLC, JSC, Branch Office, or Representative Office",
//           "Select your business activities (ISIC codes) — critical for licensing approval",
//           "Prepare your Memorandum of Association (MoA) in Arabic",
//           "Apostille all foreign documents (incorporations, passports, board resolutions)",
//           "Arrange Power of Attorney for your Saudi-based representative",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Phase 2: MISA Investor License (7–10 Business Days)",
//       },
//       {
//         type: "paragraph",
//         text: "The MISA (Ministry of Investment Saudi Arabia) license is your primary gateway as a foreign investor. Without it, no other government registration can proceed.",
//       },
//       {
//         type: "subheading",
//         text: "MISA Application Requirements",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Completed MISA online application via the Misa.gov.sa investor portal",
//           "Authenticated copy of parent company's commercial registration",
//           "Board resolution approving Saudi entity establishment",
//           "Proposed business plan (1–2 pages is sufficient)",
//           "Passport copies of all shareholders",
//         ],
//       },
//       {
//         type: "callout",
//         title: "Pro Tip",
//         text: "MISA now offers a Fast Track service for activities aligned with Vision 2030 sectors (tech, healthcare, renewable energy, tourism). Processing time drops to 3–5 days.",
//       },
//       {
//         type: "heading",
//         text: "Phase 3: Ministry of Commerce (2–5 Business Days)",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Trade name reservation via the ESERVICES portal",
//           "Drafting of Articles of Association by a certified notary",
//           "Commercial Registration (CR) issuance — this is your Saudi company's birth certificate",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Phase 4: Post-Incorporation Portals (4–5 Business Days)",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Chamber of Commerce membership",
//           "HRSD (Human Resources and Social Development) — labour quota registration",
//           "GOSI (General Organization for Social Insurance) — mandatory for employee insurance",
//           "GAZT/ZATCA — VAT registration if annual turnover will exceed SAR 375,000",
//           "Muqeem, Qiwa, and Mudad portals for expatriate workforce management",
//           "National Address registration (Wasel)",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Common Mistakes That Cause Delays",
//       },
//       {
//         type: "numbered",
//         items: [
//           "Incorrectly apostilled documents — use only certified Saudi embassy channels",
//           "Wrong ISIC activity codes — these must exactly match your intended business",
//           "Insufficient capital deposit — many banks require proof of SAR 500,000+ for account opening",
//           "Missing Arabic translations — all MoA documents must be in Arabic",
//           "Not appointing a General Manager resident in Saudi Arabia",
//         ],
//       },
//       {
//         type: "quote",
//         text: "The process is straightforward if you know the sequence. The mistakes happen when investors try to do steps out of order, or use uncertified translations.",
//         author: "BZNX Operations Team",
//       },
//     ],
//   },
//   {
//     slug: "misa-regulations-update-2025",
//     category: "Law Updates",
//     categoryColor: "#C8A24A",
//     title: "New MISA Regulations 2025: Critical Changes for Foreign Investors",
//     excerpt:
//       "The Ministry of Investment Saudi Arabia has released sweeping regulatory updates affecting licensing, ownership structures, and compliance requirements. Here's what changes and what you must do now.",
//     date: "Apr 20, 2025",
//     readTime: "6 min read",
//     featured: false,
//     image: "/whySaudi/1149336-482084725.jpg",
//     gradient: "linear-gradient(135deg, #78350F 0%, #92400E 50%, #B45309 100%)",
//     content: [
//       {
//         type: "paragraph",
//         text: "The Ministry of Investment Saudi Arabia (MISA) has published its 2025 regulatory update, the most comprehensive revision of foreign investment rules in five years. The changes affect licensing categories, minimum capital requirements, Saudization percentages, and compliance reporting obligations.",
//       },
//       {
//         type: "callout",
//         title: "Effective Date",
//         text: "All new regulations are effective from July 1, 2025. Existing licenses must be updated by December 31, 2025 to remain compliant.",
//       },
//       {
//         type: "heading",
//         text: "Key Regulatory Changes",
//       },
//       {
//         type: "subheading",
//         text: "1. Expanded 100% Foreign Ownership Sectors",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Logistics and supply chain management",
//           "Cloud computing and SaaS services",
//           "Private education (K-12 and vocational)",
//           "Medical clinics and diagnostic centers",
//           "Architecture and engineering consultancies",
//           "Environmental services and waste management",
//         ],
//       },
//       {
//         type: "subheading",
//         text: "2. Revised Minimum Capital Requirements",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Trading companies: SAR 7 million (increased from SAR 5 million)",
//           "Service companies: SAR 500,000 (unchanged)",
//           "Industrial: SAR 1 million (decreased from SAR 1.5 million to attract manufacturing)",
//           "Tech startups: SAR 50,000 (new exemption category)",
//         ],
//       },
//       {
//         type: "subheading",
//         text: "3. Updated Saudization (Nitaqat) Requirements",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Micro (1–4 employees): 0% Saudi requirement, but points-based system applies",
//           "Small (5–49 employees): 10–15% Saudi minimum (previously 5%)",
//           "Medium (50–499 employees): 15–25% Saudi minimum (sector-dependent)",
//           "Large (500+ employees): 25–35% with Vision 2030 alignment bonuses available",
//         ],
//       },
//       {
//         type: "heading",
//         text: "New Compliance Reporting Obligations",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Active employee headcount with nationality breakdown",
//           "Saudization percentage (updated monthly)",
//           "VAT registration status and filing confirmation",
//           "Office/facility lease confirmation (no virtual offices for certain categories)",
//           "General Manager residency confirmation",
//         ],
//       },
//       {
//         type: "quote",
//         text: "Non-compliance with the new reporting obligations can result in license suspension within 30 days of missed filings. Act now — don't wait until December.",
//         author: "BZNX Legal Advisory Team",
//       },
//       {
//         type: "numbered",
//         items: [
//           "Log into the MISA portal and review your license category against the new classifications",
//           "Verify your current capital meets new minimums (if applicable)",
//           "Calculate your Saudization percentage under the new Nitaqat formula",
//           "Register for the new quarterly compliance reporting module before October 2025",
//           "Consult a qualified business setup advisor to assess impact on your specific license",
//         ],
//       },
//     ],
//   },
//   {
//     slug: "how-to-renew-iqama",
//     category: "How-to Guide",
//     categoryColor: "#10B981",
//     title: "How to Renew Your Iqama in Saudi Arabia: Step-by-Step 2025 Guide",
//     excerpt:
//       "A complete, actionable guide to renewing your Iqama (residence permit) — deadlines, fees, the Absher portal, and the common pitfalls that cause expensive daily fines.",
//     date: "Apr 15, 2025",
//     readTime: "7 min read",
//     featured: false,
//     image: "/whySaudi/saudi-operations-manager-delivering-successful-presentation-about-lucrative-business_995029-357.avif",
//     gradient: "linear-gradient(135deg, #1E3A5F 0%, #0F4C75 50%, #1B6CA8 100%)",
//     content: [
//       {
//         type: "paragraph",
//         text: "The Iqama (إقامة) is your residence permit as an expatriate in Saudi Arabia. Renewing it on time is non-negotiable — overstaying an expired Iqama results in daily fines of SAR 100, deportation risk, and a potential travel ban. This guide walks you through the complete renewal process as of 2025.",
//       },
//       {
//         type: "callout",
//         title: "Critical Deadline",
//         text: "Start your renewal process at least 30 days before your Iqama expiry date. Renewals can be initiated up to 90 days in advance through the Absher portal.",
//       },
//       {
//         type: "heading",
//         text: "Option A: Self-Renewal via Absher (Most Common)",
//       },
//       {
//         type: "numbered",
//         items: [
//           "Login to Absher.sa with your Iqama number and password",
//           "Navigate to 'My Services' → 'Residency Services' → 'Renew Residence Permit'",
//           "Select renewal period: 1 year (SAR 650) or 2 years (SAR 1,300)",
//           "Confirm your biometric data is registered (fingerprints must be valid)",
//           "Pay via SADAD, Mada card, or credit card",
//           "Receive digital confirmation — physical card delivered within 7–10 days",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Option B: Employer-Sponsored Renewal via Qiwa",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Your PRO or HR manager initiates the renewal through Qiwa.com.sa",
//           "Employee receives SMS to approve the request via Absher",
//           "Payment is made by the employer (per Saudi Labor Law, Iqama fees are employer-paid)",
//           "Status updates appear in your Absher app within 24–48 hours",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Required Documents Checklist",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Valid passport (at least 6 months validity beyond Iqama expiry)",
//           "Current Iqama (even if expired — renewal still processes)",
//           "Updated CCHI-approved health insurance certificate",
//           "For dependents: updated Iqama for sponsor + dependency documents",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Health Insurance: The Most Overlooked Requirement",
//       },
//       {
//         type: "paragraph",
//         text: "Since 2022, active health insurance is mandatory for Iqama renewal. Your policy must be CCHI (Council of Cooperative Health Insurance) approved and electronically linked to your Iqama number.",
//       },
//       {
//         type: "heading",
//         text: "Fees (2025 Schedule)",
//       },
//       {
//         type: "bullets",
//         items: [
//           "1-year renewal: SAR 650 per person",
//           "2-year renewal: SAR 1,300 per person",
//           "Dependent surcharge: SAR 400/year per dependent",
//           "Late penalty: SAR 100/day (capped at SAR 10,000)",
//           "Re-entry visa (if traveling during renewal): SAR 200–800",
//         ],
//       },
//       {
//         type: "quote",
//         text: "The most expensive mistake expatriates make is waiting until the Iqama expires. Fines accumulate daily and the deportation risk is real. Set a calendar reminder 45 days before expiry.",
//         author: "BZNX PRO Services Team",
//       },
//     ],
//   },
//   {
//     slug: "start-foreign-investment-saudi-arabia",
//     category: "Investment",
//     categoryColor: "#8B5CF6",
//     title: "How to Start Foreign Investment in Saudi Arabia: The Definitive 2025 Guide",
//     excerpt:
//       "From choosing your sector to structuring your SPV — a comprehensive roadmap for international investors looking to deploy capital in the Kingdom, with realistic return expectations.",
//     date: "Apr 10, 2025",
//     readTime: "10 min read",
//     featured: false,
//     image: "/whySaudi/Saudi-Western-Business-Partnership-Handshake-in-Riyadh.webp",
//     gradient: "linear-gradient(135deg, #2D1B69 0%, #3B1F8C 50%, #4C1D95 100%)",
//     content: [
//       {
//         type: "paragraph",
//         text: "Saudi Arabia has emerged as one of the world's most compelling investment destinations. Under Vision 2030, the Kingdom is actively dismantling the barriers that previously kept foreign capital out — replacing them with incentives designed to attract exactly the kind of strategic investment that builds long-term relationships.",
//       },
//       {
//         type: "callout",
//         title: "Market Snapshot 2025",
//         text: "Saudi GDP: SAR 3.4 trillion. FDI inflows 2024: $29.4 billion. Target FDI by 2030: SAR 388 billion annually. Foreign ownership permitted: 100% in most sectors.",
//       },
//       {
//         type: "heading",
//         text: "Step 1: Choose Your Investment Vehicle",
//       },
//       {
//         type: "subheading",
//         text: "Option A: Direct Company Establishment (LLC or JSC)",
//       },
//       {
//         type: "paragraph",
//         text: "Best for operating businesses, long-term market presence, and employee-hiring entities. Requires MISA Investor License + full incorporation (45–50 days).",
//       },
//       {
//         type: "subheading",
//         text: "Option B: Special Purpose Vehicle (SPV)",
//       },
//       {
//         type: "paragraph",
//         text: "Best for project-specific investments, real estate deals, and joint ventures. Allows ring-fencing of liability and optimized tax structure for each project.",
//       },
//       {
//         type: "subheading",
//         text: "Option C: Branch Office",
//       },
//       {
//         type: "paragraph",
//         text: "Best for foreign companies wanting a Saudi presence without incorporating a separate entity. Linked to parent company — profits repatriated directly.",
//       },
//       {
//         type: "heading",
//         text: "Step 2: Select Your Investment Sector",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Real Estate: Highest demand, clear exit options via REITs and IPO. Riyadh commanding 18–22% IRR on development projects",
//           "Private Healthcare: Government inviting private sector to fill a 30% capacity gap. Clinics and diagnostics offer stable recurring revenue",
//           "Education: 6.5M school-age population, government targeting 30% private enrollment by 2030. STEM highest in demand",
//           "Technology & SaaS: Fast-track MISA licensing, 0% corporate tax for qualifying tech companies",
//           "Tourism: 150M tourist target by 2030. Hotel development and F&B chains show strong growth",
//           "Logistics: SAR 100B+ in infrastructure investment creates massive service gaps for 3PL operators",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Step 3: Structure Your Deal",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Foreign investors can repatriate 100% of profits with no currency controls",
//           "Corporate income tax: 20% on foreign shareholder profit",
//           "Withholding tax on dividends: 5–20% depending on tax treaty status",
//           "Capital gains: 20% for foreign shareholders, exempt for Saudi entities",
//           "Double taxation treaties with 57 countries — check your home country's treaty status",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Step 4: Due Diligence Requirements",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Title deed verification via the Real Estate General Authority (Watheeq portal)",
//           "Financial audit by SOCPA-accredited auditor (Saudi CPA equivalent)",
//           "MISA license verification for any acquisition target",
//           "GOSI and ZATCA compliance certificates from the seller",
//           "Nitaqat (Saudization) status check — non-compliant companies face license suspension",
//         ],
//       },
//       {
//         type: "quote",
//         text: "The biggest mistake international investors make in Saudi Arabia is underestimating how important local relationships are. Regulatory approvals can take days with the right introduction — or months without.",
//         author: "Mohammed Al-Anzi, Co-Founder WINVENTURES",
//       },
//     ],
//   },
//   {
//     slug: "saudi-real-estate-market-2025",
//     category: "Real Estate",
//     categoryColor: "#3B82F6",
//     title: "Saudi Real Estate Boom: Where Smart International Investors Are Looking in 2025",
//     excerpt:
//       "Riyadh, Jeddah, and emerging Tier-2 cities are seeing unprecedented growth. A data-driven analysis of where the highest-ROI real estate opportunities lie for foreign capital.",
//     date: "Apr 5, 2025",
//     readTime: "6 min read",
//     featured: false,
//     image: "/home/kafd.webp",
//     gradient: "linear-gradient(135deg, #1E3A5F 0%, #1E4D7B 50%, #2563EB 100%)",
//     content: [
//       {
//         type: "paragraph",
//         text: "Saudi Arabia's real estate market is experiencing a generational transformation. With over SAR 1 trillion in active mega-project construction, a domestic population that has urbanized at historic speed, and a new class of high-net-worth expatriates settling in the Kingdom, demand fundamentals have never been stronger.",
//       },
//       {
//         type: "callout",
//         title: "Market Data 2025",
//         text: "Riyadh residential prices: +18% YoY. Office space vacancy in Grade A buildings: <5%. Hotel room supply gap: 50,000+ rooms needed by 2030. Foreign real estate ownership: Now permitted in most Saudi cities.",
//       },
//       {
//         type: "heading",
//         text: "Riyadh: The Primary Investment Market",
//       },
//       {
//         type: "subheading",
//         text: "KAFD (King Abdullah Financial District)",
//       },
//       {
//         type: "paragraph",
//         text: "Saudi Arabia's answer to Canary Wharf — a 1.6M sqm mixed-use development targeting multinationals required to have Saudi HQs. Office space here commands SAR 2,500–4,000/sqm annually, with 95%+ occupancy. Residential units in KAFD towers starting at SAR 1.5 million are appreciating at 15–20% annually.",
//       },
//       {
//         type: "heading",
//         text: "Jeddah: The Commercial Gateway",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Jeddah Central development: 5.7 sqkm regeneration with hotel, retail, and residential components",
//           "Red Sea coastline: 9 luxury hotel brands committed to Jeddah projects",
//           "Industrial and logistics parks near King Abdulaziz Port (largest port in the Red Sea)",
//           "Private school and healthcare facility development in North Jeddah's growing residential zones",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Emerging Markets: Tier-2 Cities",
//       },
//       {
//         type: "bullets",
//         items: [
//           "AlUla: Tourism infrastructure — government offering 50% subsidized land",
//           "NEOM region (Tabuk): Industrial and logistics facilities for NEOM construction phase — SAR 500B+ in procurement",
//           "Madinah: Religious tourism infrastructure (250M visitors by 2030 target) — hospitality gap of 80,000 rooms",
//           "Dammam/Eastern Province: Industrial real estate serving Saudi Aramco supply chain",
//         ],
//       },
//       {
//         type: "heading",
//         text: "How Foreign Investors Can Own Saudi Real Estate",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Foreign ownership permitted in all major cities except Makkah and Madinah",
//           "Ownership via a Saudi-incorporated LLC is the cleanest structure for foreign investors",
//           "Rental income: No withholding tax for Saudi entities",
//           "Capital gains on real estate: 5% RETT — one of the lowest in the world",
//           "Repatriation of proceeds: Fully unrestricted in foreign currency",
//         ],
//       },
//       {
//         type: "quote",
//         text: "Saudi real estate is at the inflection point we saw in Dubai in 2002–2005. The fundamentals are stronger, the government commitment is longer-term, and the liquidity exits are clearer.",
//         author: "WINVENTURES Real Estate Division",
//       },
//     ],
//   },
//   {
//     slug: "vat-zakat-compliance-guide",
//     category: "Law Updates",
//     categoryColor: "#C8A24A",
//     title: "VAT & Zakat Compliance for Foreign Companies: 2025 ZATCA Updates",
//     excerpt:
//       "ZATCA has released significant updates to VAT and Zakat rules affecting foreign-owned entities. A practical compliance guide with filing deadlines and the new penalty schedule.",
//     date: "Mar 28, 2025",
//     readTime: "7 min read",
//     featured: false,
//     image: "/whySaudi/1149336-482084725.jpg",
//     gradient: "linear-gradient(135deg, #451A03 0%, #6B2D0E 50%, #92400E 100%)",
//     content: [
//       {
//         type: "paragraph",
//         text: "The Zakat, Tax and Customs Authority (ZATCA) has issued its 2025 compliance circular, introducing significant changes to VAT filing obligations, e-invoicing requirements, and Zakat assessment methodology for foreign-owned entities. Non-compliance penalties have also been substantially increased.",
//       },
//       {
//         type: "callout",
//         title: "Compliance Alert",
//         text: "E-invoicing Phase 3 (FATOORA integration) is now mandatory for all VAT-registered entities with annual turnover above SAR 3 million. Deadline: October 1, 2025.",
//       },
//       {
//         type: "heading",
//         text: "VAT Update: Key Changes for 2025",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Newly zero-rated: Healthcare equipment imports, renewable energy components, STEM education materials",
//           "Newly exempt: Digital services provided exclusively to government entities",
//           "Reclassified as standard (15%): Certain financial services previously treated as exempt",
//           "New input tax credit rules: Full credit allowed for EV company cars (previously 50%)",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Mandatory E-Invoicing (FATOORA) — Phase 3",
//       },
//       {
//         type: "bullets",
//         items: [
//           "All B2B invoices must be generated through ZATCA-certified software and transmitted in real-time",
//           "Invoice format: JSON or XML with QR code, buyer/seller TIN, and UUID",
//           "Non-compliant invoices: Void for tax purposes + SAR 1,000 per invoice penalty",
//           "Certified software list available at zatca.gov.sa/en/eInvoicing",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Zakat for Foreign-Owned Entities: 2025 Changes",
//       },
//       {
//         type: "callout",
//         title: "For 100% Foreign-Owned Companies",
//         text: "No Zakat applies — only 20% corporate income tax on taxable profit. Annual tax return due June 30. ZATCA now conducts automated risk scoring of all returns.",
//       },
//       {
//         type: "heading",
//         text: "Updated Penalty Schedule (2025)",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Late VAT filing: 5% of tax due per month (was 2% previously)",
//           "E-invoicing non-compliance: SAR 1,000 per non-compliant invoice",
//           "Failure to register for VAT: 10% of taxable revenue for the uncovered period",
//           "False declarations: Up to 100% of evaded tax + criminal referral",
//           "Late Zakat filing: SAR 1,000 per month delay",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Practical Action Plan",
//       },
//       {
//         type: "numbered",
//         items: [
//           "Audit your invoice software: Is it FATOORA Phase 3 certified? Switch if not",
//           "Review your VAT filing schedule: Monthly filing mandatory if annual turnover > SAR 40M",
//           "Verify your Zakat base calculation using the new digital self-assessment tool on zatca.gov.sa",
//           "Ensure your General Ledger is maintained in Arabic (ZATCA audit requirement)",
//           "Engage a SOCPA-certified auditor for your annual tax return",
//         ],
//       },
//       {
//         type: "quote",
//         text: "ZATCA's enforcement capacity has been massively enhanced with AI-driven audit targeting. Companies that relied on 'no one will notice' are now getting automated assessment notices. Get compliant proactively.",
//         author: "BZNX Audit & Tax Team",
//       },
//     ],
//   },
//   {
//     slug: "vision-2030-milestones-report",
//     category: "Business News",
//     categoryColor: "#26D0CE",
//     title: "Vision 2030 at the Halfway Mark: Achievements Reshaping Business in the Kingdom",
//     excerpt:
//       "Saudi Arabia's Vision 2030 transformation is exceeding expectations across tourism, entertainment, and foreign investment. The business implications for international operators are massive.",
//     date: "Mar 20, 2025",
//     readTime: "5 min read",
//     featured: false,
//     image: "/whySaudi/Saudi-Western-Business-Partnership-Handshake-in-Riyadh.webp",
//     gradient: "linear-gradient(135deg, #0A1D37 0%, #122A4A 50%, #1A3F6F 100%)",
//     content: [
//       {
//         type: "paragraph",
//         text: "As Vision 2030 passes its halfway point, the numbers are in — and they tell a story of transformation that has outpaced even optimistic projections. For international businesses, these milestones are not just headline statistics: they represent concrete market opportunities available today.",
//       },
//       {
//         type: "callout",
//         title: "By the Numbers",
//         text: "Non-oil GDP contribution: 50% (target met ✓). Tourism arrivals 2024: 100M. FDI: SAR 108 billion. Private sector jobs for Saudis: 1.7M+ new positions created.",
//       },
//       {
//         type: "heading",
//         text: "Tourism: The Fastest-Moving Sector",
//       },
//       {
//         type: "bullets",
//         items: [
//           "AlUla attracted 700,000+ visitors in 2024 (from near-zero in 2018)",
//           "Riyadh Season drew 20M+ participants with SAR 40 billion in direct spend",
//           "Red Sea Project: 16 luxury hotels open, 50 more under construction",
//           "E-visa on arrival from 56 countries — eliminating the prior application barrier",
//         ],
//       },
//       {
//         type: "heading",
//         text: "Foreign Direct Investment: The Growing Opportunity",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Regional Headquarters Program: 200+ multinationals now have their MENA HQ in Riyadh",
//           "Special Economic Zones: 4 zones offering 0% corporate tax, 0% customs duties",
//           "Giga-projects: SAR 1.5 trillion in confirmed project spending",
//           "Government Procurement: Foreign companies now eligible for direct contracts up to SAR 50M without local partner",
//         ],
//       },
//       {
//         type: "heading",
//         text: "What's Coming Next: 2025–2030 Business Opportunities",
//       },
//       {
//         type: "bullets",
//         items: [
//           "Sports Economy: Saudi Pro League, F1, Golf — SAR 50B+ in sports infrastructure spending",
//           "Logistics: King Salman Port (1M container capacity) coming online in 2026",
//           "Smart Cities: NEOM Phase 1 and Diriyah Gate both begin commercial operations",
//           "Healthcare Privatization: 60% of remaining public hospitals transferred to private sector by 2030",
//         ],
//       },
//       {
//         type: "quote",
//         text: "Vision 2030 created a category that didn't exist before: the Saudi market as a global business destination. Companies that aren't here yet are already behind.",
//         author: "Fahad Al Anzie, Co-Founder BZNX",
//       },
//     ],
//   },
// ];

export const CATEGORIES = [
  { id: "All", en: "All", ar: "الكل" },
  { id: "Business News", en: "Business News", ar: "أخبار الأعمال" },
  { id: "Law Updates", en: "Law Updates", ar: "تحديثات الأنظمة" },
  { id: "How-to Guide", en: "How-to Guide", ar: "دليل إرشادي" },
  { id: "Investment", en: "Investment", ar: "استثمار" },
  { id: "Real Estate", en: "Real Estate", ar: "عقارات" },
];
