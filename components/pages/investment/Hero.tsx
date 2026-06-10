import type { ReactNode } from "react";

export default function InvestmentHeroSection({
  badge,
  title,
  sub,
}: {
  badge: ReactNode;
  title: ReactNode;
  sub: ReactNode;
}) {
  return (
    <section
      className="relative min-h-[55vh] flex items-center overflow-hidden pt-20"
      style={{ background: "linear-gradient(135deg, #05101f 0%, #0d1a38 50%, #1A2B5A 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,196,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,196,180,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,162,74,0.12) 0%, transparent 70%)",
          top: "-20%",
          right: "-10%",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {badge}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto">{sub}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none">
          <path d="M0 50V25C360 0 720 50 1080 25C1260 12 1380 40 1440 25V50H0Z" fill="#F0F4FB" />
        </svg>
      </div>
    </section>
  );
}

