"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Oryzo-style custom cursor
 *  · Small teal dot  — snaps to pointer exactly
 *  · Larger ring     — follows with lerp lag (0.10 factor)
 *  · Hover any link/button: ring inflates + fills; dot shrinks
 *  · Hover [data-cursor="gold"]: ring turns gold (for CTA sections)
 *  · On mousedown: both elements compress briefly
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    // Make them visible
    gsap.set([dot, ring], { opacity: 0 });

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let isHovered = false;

    /* ── Tick: ring lerps toward pointer ── */
    const LERP = 0.1;
    const tickFn = () => {
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;
      gsap.set(ring, { x: rx, y: ry });
    };
    gsap.ticker.add(tickFn);
    gsap.ticker.lagSmoothing(0); // no lag smoothing for butter

    /* ── Move ── */
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.set(dot, { x: mx, y: my, opacity: 1 });
      if (!isHovered) gsap.set(ring, { opacity: 1 });
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    /* ── Hover detection via delegation ── */
    const SELECTOR = "a, button, label, input, select, textarea, [data-cursor]";

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(SELECTOR);
      if (!target) return;
      isHovered = true;
      const isGold = (target as HTMLElement).dataset.cursor === "gold";
      const color  = isGold ? "rgba(200,162,74,0.55)" : "rgba(0,196,180,0.22)";
      const border = isGold ? "rgba(200,162,74,0.8)"  : "rgba(0,196,180,0.85)";

      gsap.to(ring, {
        scale: 1.9,
        background: color,
        borderColor: border,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to(dot, { scale: 0.4, duration: 0.3 });
    };

    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest(SELECTOR)) return; // still inside a hover target
      isHovered = false;
      gsap.to(ring, {
        scale: 1,
        background: "transparent",
        borderColor: "rgba(0,196,180,0.65)",
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);

    /* ── Click compress ── */
    const onDown = () => {
      gsap.to([dot, ring], { scale: 0.75, duration: 0.1, ease: "power3.out" });
    };
    const onUp = () => {
      gsap.to(dot,  { scale: isHovered ? 0.4 : 1, duration: 0.25, ease: "elastic.out(1.2,0.4)" });
      gsap.to(ring, { scale: isHovered ? 1.9 : 1, duration: 0.25, ease: "elastic.out(1.2,0.4)" });
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    /* ── Hide when leaving window ── */
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      gsap.ticker.remove(tickFn);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="c-dot"  aria-hidden="true" />
      <div ref={ringRef} className="c-ring" aria-hidden="true" />
    </>
  );
}
