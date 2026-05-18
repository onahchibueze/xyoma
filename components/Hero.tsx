"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const titleLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const needleRightRef = useRef<HTMLDivElement>(null);
  const needleLeftRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      titleLinesRef.current,
      { 
        y: 150, 
        opacity: 0,
        rotateX: -20,
        skewY: 5
      },
      { 
        y: 0, 
        opacity: 1, 
        rotateX: 0,
        skewY: 0,
        duration: 2, 
        stagger: 0.15,
        delay: 0.5 
      }
    )
    .fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      "-=1.2"
    )
    .fromTo(
      buttonRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8"
    )
    .fromTo(
      needleLeftRef.current,
      { x: -50, opacity: 0, rotate: 45 },
      { x: 0, opacity: 0.4, rotate: 30, duration: 2 },
      "-=1.5"
    )
    .fromTo(
      needleRightRef.current,
      { x: 50, opacity: 0, rotate: -45 },
      { x: 0, opacity: 0.4, rotate: -30, duration: 2 },
      "-=1.8"
    );
  }, { scope: container });

  return (
    <section 
      id="home"
      ref={container}
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background Decorative Element (Subtle) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-b from-zinc-800/20 to-transparent blur-3xl" />
      </div>

      {/* Decorative Needles - Offset Positions */}
      <div 
        ref={needleLeftRef}
        className="absolute left-[2%] top-[10%] w-24 h-48 z-20 pointer-events-none opacity-0 hidden md:block"
      >
        <Image
          src="/images/needle-thread.png"
          alt="Decorative needle"
          fill
          className="object-contain -scale-x-100"
        />
      </div>

      <div 
        ref={needleRightRef}
        className="absolute right-[2%] bottom-[10%] w-24 h-48 z-20 pointer-events-none opacity-0 hidden md:block"
      >
        <Image
          src="/images/needle-thread.png"
          alt="Decorative needle"
          fill
          className="object-contain"
        />
      </div>

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-12 text-center">
        <h1 
          className="text-[clamp(3.5rem,18vw,12rem)] font-bold tracking-tighter uppercase leading-[0.8] mb-12"
        >
          <span className="block overflow-hidden pb-4">
            <span 
              ref={(el) => { titleLinesRef.current[0] = el; }}
              className="block opacity-0"
            >
              Xyoma
            </span>
          </span>
          <span className="block overflow-hidden">
            <span 
              ref={(el) => { titleLinesRef.current[1] = el; }}
              className="block text-zinc-600 italic opacity-0"
            >
              Essence
            </span>
          </span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-sm md:text-lg tracking-[0.3em] uppercase text-zinc-400 mb-12 max-w-2xl mx-auto opacity-0"
        >
          Redefining luxury through minimalist architecture and premium textiles.
        </p>
        
        <Link 
          href="/collection"
          ref={buttonRef as any}
          className="group relative px-12 py-5 bg-white text-black text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-zinc-200 transition-colors opacity-0 inline-block"
        >
          Explore Collection
          <span className="absolute -bottom-2 -right-2 w-full h-full border border-white/20 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300" />
        </Link>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <span className="text-[9px] uppercase tracking-[0.5em] vertical-rl">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
