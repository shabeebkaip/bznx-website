"use client";

import { useLocale, useTranslations } from "next-intl";
import { unescapeHTML } from "@/lib/utils";

// Ordered: Global Enterprise → Saudi Government/Semi-Gov → Saudi Enterprise → Regional/SME
const CLIENT_LOGOS = [
  // Global enterprise
  { src: "/clients/Aramco.png",                    alt: "Aramco" },
  { src: "/clients/Huawei.png",                    alt: "Huawei" },
  { src: "/clients/Philips_logo.png",              alt: "Philips" },
  { src: "/clients/Nokia-Logo.jpg",                alt: "Nokia" },
  { src: "/clients/Red_Hat_Logo_2019.svg.png",     alt: "Red Hat" },
  { src: "/clients/FORD .png",                     alt: "Ford" },
  // Saudi government / semi-gov
  { src: "/clients/Neom-Logo.png",                 alt: "NEOM" },
  { src: "/clients/GACA LOGO 1.png",               alt: "GACA" },
  { src: "/clients/SEC_Logo.png",                  alt: "SEC" },
  { src: "/clients/Nationl Grid .SA .png",         alt: "National Grid SA" },
  { src: "/clients/Leap.jpg",                      alt: "Leap" },
  { src: "/clients/Defence show.png",              alt: "Defence Show" },
  { src: "/clients/SEA-Expo-logo-Master-03.png",   alt: "SEA Expo" },
  // Saudi enterprise
  { src: "/clients/Alfanar Projects_Logo-1.png",   alt: "Alfanar Projects" },
  { src: "/clients/Rawabi_2023_Logo_uniform_11.png", alt: "Rawabi" },
  { src: "/clients/state_grid.png",                alt: "State Grid" },
  { src: "/clients/Mega-Group.png",                alt: "Mega Group" },
  { src: "/clients/AFZCO-LOGO-2020-FINAL.png",     alt: "AFZCO" },
  { src: "/clients/ALJAZIRAH LOGO PNG.png",        alt: "Al Jazirah" },
  { src: "/clients/PDC.png",                       alt: "PDC" },
  { src: "/clients/AlamcoSpaceworks_White_LOGO.svg", alt: "Alamco Spaceworks" },
  { src: "/clients/Mansam logo-bilingual Final.png", alt: "Mansam" },
  { src: "/clients/UNIFIED-LOGO.png",              alt: "Unified" },
  { src: "/clients/UAPM-Logo(Property Management Co).png", alt: "UAPM" },
  { src: "/clients/Rawabi_2023_Logo_uniform_11.png", alt: "Rawabi" },
  // Regional / SME
  { src: "/clients/Dezerta Logo.png",              alt: "Dezerta" },
  { src: "/clients/POLARIS.png",                   alt: "Polaris" },
  { src: "/clients/Autoville.png",                 alt: "Autoville" },
  { src: "/clients/SAM.png",                       alt: "SAM" },
  { src: "/clients/Nahdah FC.png",                 alt: "Nahdah FC" },
  { src: "/clients/riyadh dimond.png",             alt: "Riyadh Diamond" },
  { src: "/clients/Almosa H.jpg",                  alt: "Al Mosa" },
  { src: "/clients/bh_logo_black_onwhite.png",     alt: "BH" },
  { src: "/clients/movico logo color 1.png",       alt: "Movico" },
  { src: "/clients/10X Logo 2.png",                alt: "10X" },
  { src: "/clients/logo.webp",                     alt: "Winventures" },
  { src: "/clients/canteen.jpeg",                  alt: "The Canteen" },
  { src: "/clients/columbus-kitchen-logo.avif",    alt: "Columbus Kitchen" },
  { src: "/clients/APOTHEEK.png",                  alt: "Apotheek" },
  { src: "/clients/glamping_80cm_80cm.png",        alt: "Glamping" },
  { src: "/clients/one mic.png",                   alt: "One Mic" },
  { src: "/clients/Modn-ANnan.png",                alt: "Modn Annan" },
  { src: "/clients/all jerry logo 02.png",         alt: "All Jerry" },
];

interface LogoItem {
  src: string;
  alt: string;
}

interface TrustedByContent {
  title?: string | Record<string, string>;
  logos?: any[];
}

export default function TrustedBy({ data }: { data?: TrustedByContent }) {
  const t = useTranslations("clients");
  const locale = useLocale();
  const isArabic = locale === "ar";


  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };

  const title = getVal(data?.title) || t("title");

  const logos: LogoItem[] = (() => {
    const cmsLogos = data?.logos || [];
    if (cmsLogos.length > 0) {
      return cmsLogos.map((l: any) => {
        const imageSrc = typeof l.image === 'string' ? l.image : (l.image?.url || l.image?.en || l.src);
        return {
          src: imageSrc,
          alt: l.imageAlt || l.alt || ""
        };
      });
    }
    return CLIENT_LOGOS;
  })();

  const direction = isArabic ? "marquee-rtl" : "marquee-ltr";

  return (
    <section className="relative overflow-hidden bg-white border-y border-gray-100 py-5">
      <div className="flex items-stretch">

        {/* Fixed title on left */}
        <div className="shrink-0 px-4 md:px-8 lg:px-12 border-r border-gray-100 flex items-center w-[48%] md:w-auto md:min-w-[220px]" style={{ boxSizing: "border-box" }}>
          <p className="text-[#00C4B4] font-bold text-sm md:text-base leading-snug"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(title) }}
          />
        </div>

        {/* Marquee track */}
        <div className="relative flex-1 overflow-hidden" dir="ltr">
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className={`flex items-center w-max py-3 ${direction}`}>
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center h-14 mx-8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-[44px] max-w-[130px] w-auto h-auto object-contain opacity-75 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-ltr {
          animation: marquee-scroll-ltr 120s linear infinite;
        }
        .marquee-rtl {
          animation: marquee-scroll-rtl 120s linear infinite;
        }
        @keyframes marquee-scroll-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll-rtl {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-ltr:hover,
        .marquee-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
