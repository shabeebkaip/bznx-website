"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MarqueeProps {
  /** Text items to display, separated by the accent dot */
  items: string[];
  /** Scroll direction */
  direction?: "left" | "right";
  /** px per second */
  speed?: number;
  accent?: string;
  textColor?: string;
  className?: string;
}

/**
 * Oryzo-style infinite marquee strip.
 * Triplicated so there's always content visible at any scroll width.
 * GSAP `modifiers` gives a seamless infinite loop.
 */
export default function Marquee({
  items,
  direction = "left",
  speed = 55,
  accent = "#00C4B4",
  textColor = "rgba(255,255,255,0.55)",
  className = "",
}: MarqueeProps) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    // Width of one copy of the content
    const unit = track.scrollWidth / 3;

    // Start position
    const startX = direction === "left" ? 0 : -unit;

    gsap.set(track, { x: startX });

    const anim = gsap.to(track, {
      x: direction === "left" ? -unit : 0,
      ease: "none",
      duration: unit / speed,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          const mod = ((x % unit) + unit) % unit;
          return direction === "left" ? -(mod) : mod - unit;
        }),
      },
    });

    // Slow down when hovered
    const onEnter = () => gsap.to(anim, { timeScale: 0.25, duration: 0.5 });
    const onLeave = () => gsap.to(anim, { timeScale: 1,    duration: 0.6 });
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      anim.kill();
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [direction, speed]);

  // Triple the items so the loop is seamless
  const tripled = [...items, ...items, ...items];

  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden select-none ${className}`}
      style={{ whiteSpace: "nowrap" }}
    >
      <div ref={trackRef} className="inline-flex" style={{ willChange: "transform" }}>
        {tripled.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center text-sm font-semibold tracking-widest uppercase"
            style={{ paddingRight: "3.5rem", color: textColor }}
          >
            {text}
            <span
              style={{
                display: "inline-block",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: accent,
                marginLeft: "3.5rem",
                boxShadow: `0 0 8px ${accent}`,
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
