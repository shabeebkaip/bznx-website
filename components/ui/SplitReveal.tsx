"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SplitRevealProps {
  /** The text to split and reveal word-by-word */
  children: string;
  /** Wrapping HTML tag */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
  /** Extra delay (seconds) before the stagger starts */
  delay?: number;
  /** Seconds between each word reveal */
  stagger?: number;
  /** ScrollTrigger start position */
  start?: string;
}

/**
 * Oryzo-style word-by-word scroll reveal.
 *
 * Each word is wrapped in an `overflow:hidden` clip,
 * and the inner span translates from y:110% → 0 with
 * `power4.out` easing.
 *
 * Automatically triggers via ScrollTrigger when the
 * element enters the viewport.
 */
export default function SplitReveal({
  children,
  as: Tag = "h2",
  className = "",
  style,
  delay = 0,
  stagger = 0.04,
  start = "top 82%",
}: SplitRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const wordRefs     = useRef<(HTMLSpanElement | null)[]>([]);

  const words = children.split(" ");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const els = wordRefs.current.filter(Boolean);
    if (els.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.9,
          stagger,
          ease: "power4.out",
          delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay, stagger, start]);

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement>}
      className={className}
      style={style}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
          }}
        >
          <span
            ref={(el) => { wordRefs.current[i] = el; }}
            style={{ display: "inline-block" }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
