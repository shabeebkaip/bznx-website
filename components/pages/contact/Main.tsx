"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Clock,
  Building2,
  ChevronDown,
  Send,
} from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

const SERVICES = [
  "Company Formation & Licensing",
  "PRO / GRO Services",
  "Investment Consultancy",
  "Audit & Tax Services",
  "Virtual CFO",
  "Legal Services",
  "Outsourced Bookkeeping",
  "ERP Consultation",
  "General Inquiry",
];

const DEFAULT_NEXT_STEPS = [
  {
    num: "01",
    title: "We Review Your Request",
    desc: "Our team reviews your submission within 24 hours and assigns a senior consultant.",
  },
  {
    num: "02",
    title: "Discovery Call",
    desc: "A 30-minute consultation to understand your goals and recommend the right structure.",
  },
  {
    num: "03",
    title: "Proposal & Kickoff",
    desc: "We deliver a tailored proposal and begin your setup immediately upon approval.",
  },
];

export default function ContactMainSection({
  locale,
  header,
  steps,
  contactMethods
}: {
  locale: string;
  header?: any;
  steps?: any;
  contactMethods?: any;
}) {
  const t = useTranslations("contact");
  const rtl = locale === "ar";
  const l = locale as 'en' | 'ar';

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const rootRef = useRef<HTMLElement>(null);

  const NEXT_STEPS = steps?.items?.map((s: any, i: number) => ({
    num: String(i + 1).padStart(2, '0'),
    title: s.title?.[l] || s.title,
    desc: s.description?.[l] || s.description
  })) || DEFAULT_NEXT_STEPS;

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ci-panel",
        { x: rtl ? 60 : -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        }
      );
      gsap.fromTo(
        ".cf-panel",
        { x: rtl ? -60 : 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        }
      );
      gsap.fromTo(
        ".step-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".steps-area", start: "top 80%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [rtl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        alert("Something went wrong. Please try again.");
        setStatus("idle");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  const inputBase = `w-full px-4 py-3.5 rounded-xl border-2 text-sm font-medium outline-none transition-all duration-200 bg-white ${rtl ? "text-right" : "text-left"}`;

  const inputStyle = (field: string) => ({
    borderColor: focused === field ? "#26D0CE" : "#E8EDF5",
    color: "#0F172A",
    boxShadow: focused === field ? "0 0 0 4px rgba(38,208,206,0.08)" : "none",
  });

  const contactDetails = [
    { icon: Phone, label: "Phone", value: t("phone"), href: `tel:${t("phone")}` },
    { icon: Mail, label: "Email", value: t("email"), href: `mailto:${t("email")}` },
    { icon: MapPin, label: "Address", value: t("address"), href: null },
  ];

  return (
    <section ref={rootRef} className="relative overflow-hidden" style={{ background: "#F0F4F8" }}>
      <div className="grid lg:grid-cols-[480px_1fr]">
        {/* ── LEFT PANEL: dark info side ── */}
        <div
          className="ci-panel relative flex flex-col justify-between px-6 sm:px-10 py-10 sm:py-16 overflow-hidden min-h-auto lg:min-h-[700px]"
          style={{ background: "linear-gradient(160deg, #091d37 0%, #0e2548 40%, #1A2B5A 100%)" }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Teal glow */}
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(38,208,206,0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">
                {header?.leftBadge?.[l] || (l === 'ar' ? "معلومات التواصل" : "Contact Information")}
              </span>
            </div>

            <h2
              className={`text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-[0.92] mb-3 ${rtl ? "text-right" : ""}`}
              dangerouslySetInnerHTML={{ __html: unescapeHTML(header?.leftTitle?.[l] || (l === 'ar' ? "تواصل معنا <br /><span style='color: #26D0CE'>مباشرة</span>" : "Reach Us <br /><span style='color: #26D0CE'>Directly</span>")) }}
            />

            <div
              className={`text-white/40 text-sm leading-relaxed mb-10 max-w-xs ql-editor-view ${rtl ? "text-right" : ""}`}
              dangerouslySetInnerHTML={{ __html: unescapeHTML(header?.leftDescription?.[l] || (l === 'ar' ? "فريقنا متاح من الأحد إلى الخميس، من 9 صباحاً حتى 6 مساءً (AST)." : "Our team is available from Sunday to Thursday, 9 AM – 6 PM (AST).")) }}
            />

            {/* Contact details */}
            <div className="space-y-4 mb-10">
              {(Array.isArray(contactMethods?.items) && contactMethods.items.length > 0
                ? contactMethods.items
                : [
                  { icon: Phone, label: l === 'ar' ? "الهاتف" : "Phone", value: t("phone"), href: `tel:${t("phone")}` },
                  { icon: Mail, label: l === 'ar' ? "البريد الإلكتروني" : "Email", value: t("email"), href: `mailto:${t("email")}` },
                  { icon: MapPin, label: l === 'ar' ? "العنوان" : "Address", value: t("address"), href: null },
                ]
              ).map((item: any, idx: number) => {
                const Icon = item.icon;
                const img = item.image?.url || item.image;
                const label = item.label?.[l] || item.label?.en || item.label;
                const value = item.value?.[l] || item.value?.en || item.value;
                const href = item.href;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 group"
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-teal/20"
                      style={{ background: "rgba(38,208,206,0.10)" }}
                    >
                      {img ? (
                        <img src={img} alt="" className="w-5 h-5 object-contain" />
                      ) : Icon ? (
                        <Icon className="w-4.5 h-4.5" style={{ color: "#26D0CE" }} size={18} />
                      ) : null}
                    </div>
                    <div className={rtl ? "text-right" : ""}>
                      <p className="text-white/35 text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-white/80 text-sm font-medium hover:text-teal transition-colors duration-200"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-white/80 text-sm font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${t("phone").replace(/\s+/g, "").replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg w-full justify-center mb-10"
              style={{
                background: "linear-gradient(135deg, #25D366 0%, #1DAA54 100%)",
                color: "#fff",
              }}
            >
              <MessageSquare className="w-4 h-4" />
              {l === 'ar' ? "دردشة عبر واتساب" : "Chat on WhatsApp"}
            </a>

            {/* Divider */}
            <div className="border-t border-white/10 mb-10" />

            {/* Working hours */}
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(200,162,74,0.12)" }}
              >
                <Clock size={18} style={{ color: "#C8A24A" }} />
              </div>
              <div className={rtl ? "text-right" : ""}>
                <p className="text-white/35 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                  {l === 'ar' ? "ساعات العمل" : "Business Hours"}
                </p>
                <p className="text-white/80 text-sm font-medium">{l === 'ar' ? "الأحد – الخميس: 9 ص – 6 م" : "Sun – Thu: 9 AM – 6 PM"}</p>
                <p className="text-white/40 text-xs mt-0.5">{l === 'ar' ? "المملكة العربية السعودية (AST)" : "Kingdom of Saudi Arabia (AST)"}</p>
              </div>
            </div>
          </div>

          {/* ── What Happens Next ── */}
          <div className="steps-area relative z-10 mt-10">
            <p className="text-white/35 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
              {steps?.badge?.[l] || (l === 'ar' ? "ماذا يحدث بعد ذلك" : "What Happens Next")}
            </p>
            <div className="space-y-5">
              {NEXT_STEPS.map((step: any, i: number) => (
                <div key={i} className="step-item flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(38,208,206,0.12)", color: "#26D0CE", border: "1px solid rgba(38,208,206,0.25)" }}
                  >
                    {step.num}
                  </div>
                  <div className={rtl ? "text-right" : ""}>
                    <p className="text-white/85 text-sm font-bold mb-0.5">{step.title}</p>
                    <div
                      className="text-white/40 text-xs leading-relaxed ql-editor-view"
                      dangerouslySetInnerHTML={{ __html: unescapeHTML(step.desc) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: form side ── */}
        <div className="cf-panel px-5 sm:px-12 lg:px-16 py-10 sm:py-16 flex flex-col justify-center bg-white">
          {status === "sent" ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: "rgba(38,208,206,0.10)" }}
              >
                <CheckCircle2 className="w-9 h-9" style={{ color: "#26D0CE" }} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-3" style={{ color: "#0A1D37" }}>
                {l === 'ar' ? "تم استلام الرسالة!" : "Message Received!"}
              </h3>
              <p className="text-slate-500 text-base leading-relaxed max-w-sm mb-8">
                {t("success")} {l === 'ar' ? "سيتواصل معك أحد أعضاء فريقنا في غضون 24 ساعة." : "A member of our team will reach out within 24 hours."}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{l === 'ar' ? "الاستجابة النموذجية: في غضون 2-4 ساعات عمل" : "Typical response: within 2–4 business hours"}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">
                    {header?.rightBadge?.[l] || (l === 'ar' ? "استشارة مجانية" : "Free Consultation")}
                  </span>
                </div>
                <h2
                  className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-3"
                  style={{ color: "#0A1D37" }}
                  dangerouslySetInnerHTML={{ __html: unescapeHTML(header?.rightTitle?.[l] || (l === 'ar' ? "ابدأ رحلتك في <br /><span style='color: #26D0CE'>المملكة العربية السعودية</span>" : "Start Your <br /><span style='color: #26D0CE'>Saudi Journey</span>")) }}
                />
                <div
                  className="text-slate-500 text-sm leading-relaxed max-w-sm ql-editor-view"
                  dangerouslySetInnerHTML={{ __html: unescapeHTML(header?.rightDescription?.[l] || (l === 'ar' ? "املأ النموذج وسيرد عليك مستشار أول في غضون 24 ساعة — بدون التزامات." : "Fill in the form and a senior consultant will respond within 24 hours — no obligations, no fluff.")) }}
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wide uppercase" style={{ color: "#6B7280" }}>
                      {l === 'ar' ? 'الاسم الكامل' : 'Full Name'} <span style={{ color: "#26D0CE" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("namePlaceholder")}
                      value={form.name}
                      onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      className={inputBase}
                      style={inputStyle("name")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-wide uppercase" style={{ color: "#6B7280" }}>
                      {l === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} <span style={{ color: "#26D0CE" }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={t("emailPlaceholder")}
                      value={form.email}
                      onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      className={inputBase}
                      style={inputStyle("email")}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold tracking-wide uppercase" style={{ color: "#6B7280" }}>
                    {l === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    placeholder={t("phonePlaceholder")}
                    value={form.phone}
                    onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                    className={inputBase}
                    style={inputStyle("phone")}
                  />
                </div>

                {/* Service dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold tracking-wide uppercase" style={{ color: "#6B7280" }}>
                    {l === 'ar' ? 'الخدمة المهتم بها' : 'Service Interested In'} <span style={{ color: "#26D0CE" }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={form.service}
                      onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}
                      onFocus={() => setFocused("service")}
                      onBlur={() => setFocused(null)}
                      className={`${inputBase} appearance-none pr-10`}
                      style={{ ...inputStyle("service"), color: form.service ? "#0F172A" : "#94A3B8" }}
                    >
                      <option value="" disabled>
                        {l === 'ar' ? 'اختر خدمة...' : 'Select a service...'}
                      </option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s} style={{ color: "#0F172A" }}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "#94A3B8" }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold tracking-wide uppercase" style={{ color: "#6B7280" }}>
                    {l === 'ar' ? 'أخبرنا عن أهدافك' : 'Tell Us About Your Goals'} <span style={{ color: "#26D0CE" }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={t("messagePlaceholder")}
                    value={form.message}
                    onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    className={inputBase}
                    style={{ ...inputStyle("message"), resize: "none" }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.12em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                  style={{
                    background: status === "sending"
                      ? "#94A3B8"
                      : "linear-gradient(135deg, #26D0CE 0%, #00A899 100%)",
                    color: "#0A1D37",
                    boxShadow: status === "sending" ? "none" : "0 8px 30px rgba(38,208,206,0.30)",
                  }}
                >
                  {status === "sending" ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      {l === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("submit")}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Trust line */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
                  {[
                    { icon: Building2, text: l === 'ar' ? "أكثر من 500 شركة تم تأسيسها" : "500+ Companies Setup" },
                    { icon: Clock, text: l === 'ar' ? "ضمان الاستجابة خلال 24 ساعة" : "24h Response Guarantee" },
                  ].map(({ icon: Icon, text }, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
