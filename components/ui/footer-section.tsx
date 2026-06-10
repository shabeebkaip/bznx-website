'use client';

import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { unescapeHTML } from '@/lib/utils';

const NAV_LINKS = [
  { title: 'Home',          href: '/' },
  { title: 'About Us',      href: '/about' },
  { title: 'Services',      href: '/services' },
  { title: 'Blog',          href: '/blogs' },
  { title: 'Investment',    href: '/investment' },
  { title: 'Case Studies',  href: '/case-studies' },
  { title: 'Contact',       href: '/contact' },
];

const SERVICE_LINKS = [
  { title: 'Company Formation',     href: '/services' },
  { title: 'PRO / GRO Services',   href: '/services' },
  { title: 'Investment Advisory',   href: '/investment' },
  { title: 'Audit & Tax',          href: '/services' },
  { title: 'Virtual CFO',          href: '/services' },
  { title: 'Legal Services',        href: '/services' },
];

const SOCIAL = [
  {
    platform: 'LinkedIn', url: '#', icon: 'linkedin',
    svg: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  },
  {
    platform: 'Instagram', url: '#', icon: 'instagram',
    svg: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
  },
  {
    platform: 'Twitter / X', url: '#', icon: 'twitter',
    svg: <path d="M4 4l16 16M4 20L20 4" strokeWidth="2.5" strokeLinecap="round" />,
  },
  {
    platform: 'Facebook', url: '#', icon: 'facebook',
    svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
];

const STATS = [
  { value: '500+',    label: 'Companies Launched' },
  { value: '45–50',   label: 'Days to Register' },
  { value: '100%',    label: 'Compliance Rate' },
  { value: '8+',      label: 'Years in Saudi Market' },
];

interface BznxFooterProps {
  locale: string;
  data?: any;
}

export function BznxFooter({ locale, data }: BznxFooterProps) {
  const year = new Date().getFullYear();
  const isArabic = locale === "ar";

  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };



  const prefixed = (href: string) =>
    href === '/' ? `/${locale}` : `/${locale}${href}`;

  const footerMain = data?.footerMain || {};
  const footerStats = Array.isArray(data?.footerStats) ? data.footerStats : (Array.isArray(data?.footerStats?.items) ? data.footerStats.items : STATS);
  const footerSocials = Array.isArray(data?.footerSocials) ? data.footerSocials : (Array.isArray(data?.footerSocials?.items) ? data.footerSocials.items : SOCIAL);
  const footerNavigate = Array.isArray(data?.footerNavigate) ? data.footerNavigate : (Array.isArray(data?.footerNavigate?.items) ? data.footerNavigate.items : NAV_LINKS);
  const footerServices = Array.isArray(data?.footerServices) ? data.footerServices : (Array.isArray(data?.footerServices?.items) ? data.footerServices.items : SERVICE_LINKS);

  const stats = footerStats;
  const description = getVal(footerMain.brandDescription) || "Saudi Arabia's premier business setup and investment consultancy — turning global ambition into Kingdom-ready reality.";
  const phone = footerMain.phone || "+966 59 895 8838";
  const email = footerMain.email || "adl@wvksa.com";
  const address = getVal(footerMain.address) || "Riyadh, Kingdom of Saudi Arabia";
  const socials = footerSocials;
  const navigateLinks = footerNavigate;
  const serviceLinks = footerServices;

  const iconMap: Record<string, ReactNode> = {
    linkedin: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    twitter: <path d="M4 4l16 16M4 20L20 4" strokeWidth="2.5" strokeLinecap="round" />,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  };

  const phoneStr = (typeof phone === 'string' ? phone : (phone?.en || phone?.ar || "")).replace(/\s+/g, '');

  return (
    <footer className="relative w-full bg-[#091d37] overflow-hidden">

      {/* ── TOP GLOW LINE ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent" />

      {/* ── STATS STRIP ── */}
      <AnimatedContainer delay={0.1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/6 border border-white/6 rounded-2xl overflow-hidden">
            {stats.map((stat: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center py-6 gap-1">
                <span className="text-2xl sm:text-3xl font-black" style={{ color: '#26D0CE' }}>
                  {getVal(stat.value)}
                </span>
                <span className="text-white/35 text-[10px] font-bold tracking-[0.2em] uppercase text-center">
                  {getVal(stat.label)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedContainer>

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8">

          {/* Brand column */}
          <AnimatedContainer delay={0.15} className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-6">
            <Link href={prefixed('/')}>
              <Image
                src="/bznxlogo.png"
                alt="BZNX"
                width={160}
                height={56}
                className="brightness-0 invert h-32 w-auto object-contain"
              />
            </Link>

            <div 
              className="text-white/40 text-sm leading-relaxed max-w-xs prose prose-sm prose-invert prose-p:my-0"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(description) }}
            />

            {/* Contact details */}
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${phoneStr}`}
                className="inline-flex items-center gap-2.5 text-white/50 hover:text-teal transition-colors duration-200 text-sm group"
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors duration-200"
                  style={{ background: 'rgba(38,208,206,0.10)' }}
                >
                  <Phone size={13} style={{ color: '#26D0CE' }} />
                </span>
                {getVal(phone)}
              </a>
              <a
                href={`mailto:${typeof email === 'string' ? email : (email?.en || email?.ar || "")}`}
                className="inline-flex items-center gap-2.5 text-white/50 hover:text-teal transition-colors duration-200 text-sm group"
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors duration-200"
                  style={{ background: 'rgba(38,208,206,0.10)' }}
                >
                  <Mail size={13} style={{ color: '#26D0CE' }} />
                </span>
                {getVal(email)}
              </a>
              <span className="inline-flex items-center gap-2.5 text-white/30 text-sm">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(38,208,206,0.06)' }}
                >
                  <MapPin size={13} style={{ color: '#26D0CE' }} />
                </span>
                {address}
              </span>
            </div>

            {/* Vision 2030 logo */}
            {/* <Image
              src="/Saudi_Vision_2030_logo.svg.png"
              alt="Saudi Vision 2030"
              width={140}
              height={56}
              className="h-14 w-auto object-contain mt-2"
            /> */}
          </AnimatedContainer>

          {/* Navigate */}
          <AnimatedContainer delay={0.2}>
            <h3 className="text-white text-[10px] font-black tracking-[0.28em] uppercase mb-6">
              {isArabic ? "التنقل" : "Navigate"}
            </h3>
            <ul className="space-y-3.5">
              {navigateLinks.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link
                    href={prefixed(link.href)}
                    className={`text-white/40 hover:text-teal text-sm transition-colors duration-200 inline-block ${isArabic ? 'hover:-translate-x-0.5' : 'hover:translate-x-0.5'}`}
                  >
                    {getVal(link.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedContainer>

          {/* Services */}
          <AnimatedContainer delay={0.25}>
            <h3 className="text-white text-[10px] font-black tracking-[0.28em] uppercase mb-6">
              {isArabic ? "الخدمات" : "Services"}
            </h3>
            <ul className="space-y-3.5">
              {serviceLinks.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link
                    href={prefixed(link.href)}
                    className={`text-white/40 hover:text-teal text-sm transition-colors duration-200 inline-block ${isArabic ? 'hover:-translate-x-0.5' : 'hover:translate-x-0.5'}`}
                  >
                    {getVal(link.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedContainer>

          {/* Connect */}
          <AnimatedContainer delay={0.3} className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="text-white text-[10px] font-black tracking-[0.28em] uppercase mb-6">
              {isArabic ? "تواصل معنا" : "Connect"}
            </h3>
            <ul className="space-y-3.5">
              {socials.map((social: any, idx: number) => (
                <li key={idx}>
                  <a
                    href={social.url || social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-white/40 hover:text-teal text-sm transition-all duration-200 group"
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal/15 transition-colors duration-200 overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      {social.image ? (
                        <div 
                          className="w-4 h-4 bg-white/40 group-hover:bg-teal transition-colors duration-200"
                          style={{ 
                            WebkitMaskImage: `url(${typeof social.image === 'string' ? social.image : (social.image?.url || "")})`,
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: 'contain',
                            maskImage: `url(${typeof social.image === 'string' ? social.image : (social.image?.url || "")})`,
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: 'contain'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 rounded flex items-center justify-center">
                          <span className="text-[8px] font-black opacity-30">ICON</span>
                        </div>
                      )}
                    </span>
                    {getVal(social.platform) || getVal(social.title)}
                  </a>
                </li>
              ))}
            </ul>

            {/* MISA badge */}
            <div
              className="mt-8 rounded-xl p-4 border"
              style={{ background: 'rgba(38,208,206,0.05)', borderColor: 'rgba(38,208,206,0.15)' }}
            >
              <p className="text-[9px] font-black tracking-[0.2em] uppercase mb-1" style={{ color: '#26D0CE' }}>
                {isArabic ? 'مسجل' : 'Registered'}
              </p>
              <p className="text-white/40 text-xs leading-relaxed">
                {isArabic ? 'مرخص من MISA • السجل التجاري: KSA' : 'MISA Licensed • Commercial Registration: KSA'}
              </p>
            </div>
          </AnimatedContainer>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <AnimatedContainer delay={0.35}>
        <div className="border-t border-white/6 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/Saudi_Vision_2030_logo.svg.png"
                alt="Saudi Vision 2030"
                width={80}
                height={32}
                className="h-8 w-auto object-contain opacity-50"
              />
            </div>
            <p className="text-white/20 text-xs tracking-wider text-center">
              © {year} BZNX. {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
          </div>
        </div>
      </AnimatedContainer>

    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: 12, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.65, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
