"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t        = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const navRef     = useRef<HTMLElement>(null);

  const links = [
    { href: `/${locale}`,               label: t("home") },
    { href: `/${locale}/about`,         label: t("about") },
    { href: `/${locale}/services`,      label: t("services") },
    { href: `/${locale}/blogs`,         label: t("blogs") },
    { href: `/${locale}/case-studies`,  label: t("caseStudies") },
    { href: `/${locale}/contact`,       label: t("contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === `/${locale}` : pathname.startsWith(href);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[#05101F]/92 backdrop-blur-xl border-b border-white/[0.06]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center shrink-0">
            <Image
              src="/bznxlogo.png"
              alt="BZNX"
              width={110}
              height={48}
              priority
              style={{
                filter: scrolled
                  ? "brightness(0) invert(1)"
                  : "brightness(0) invert(1)",
                objectFit: "contain",
                height: "auto",
              }}
            />
          </Link>

          {/* Pill Menu */}
          <div className="hidden lg:flex items-center bg-white/95 backdrop-blur-sm rounded-full px-2 py-1.5 shadow-2xl shadow-black/20">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive(link.href)
                    ? "bg-[#05101F] text-white shadow-lg"
                    : "text-slate-600 hover:text-[#05101F]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Language Switcher */}
            <Link
              href={pathname.replace(`/${locale}`, `/${locale === 'en' ? 'ar' : 'en'}`)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-[11px] font-bold tracking-widest uppercase"
            >
              {locale === "en" ? "عربي" : "English"}
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="px-7 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 hover:scale-[1.04] hover:brightness-110 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #26D0CE 0%, #1ab8b5 100%)",
                color: "#05101F",
                boxShadow: "0 6px 24px rgba(38,208,206,0.38)",
              }}
            >
              {t("getStarted")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-0.5 w-6 rounded bg-white transition-all"
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile drawer simplified */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-screen" : "max-h-0"}`}>
        <div className="bg-navy p-6 flex flex-col gap-4 border-t border-white/5 mt-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white font-bold text-lg"
            >
              {link.label}
            </Link>
          ))}
          
          {/* Language Switcher Mobile */}
          <Link
            href={pathname.replace(`/${locale}`, `/${locale === 'en' ? 'ar' : 'en'}`)}
            onClick={() => setMobileOpen(false)}
            className="mt-4 pt-4 border-t border-white/10 text-teal font-bold text-lg uppercase tracking-widest"
          >
            {locale === "en" ? "عربي" : "English"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
