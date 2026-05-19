"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "./SectionWrapper";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 1.2 },
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, delay: 0.2 }
    )
    .fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.5 },
      "-=0.8"
    )
    .fromTo(
      textRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1 },
      "-=1"
    );
  }, { scope: container });

  return (
    <SectionWrapper id="about" className="bg-black text-white">
      <div ref={container} className="flex flex-col items-center text-center">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-6">
            The Origin
          </span>
          <h2 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase opacity-0"
          >
            XYOMA <span className="text-zinc-500">Studios</span>
          </h2>
          <div 
            ref={lineRef}
            className="w-24 h-px bg-white/20 mt-8 origin-center" 
          />
        </div>

        {/* Brand Content */}
        <div 
          ref={textRef}
          className="max-w-3xl flex flex-col gap-10 opacity-0"
        >
          <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-300">
            Rooted in Nigeria, XYOMA is a premium streetwear laboratory 
            architecting the future of African fashion. We merge cultural 
            heritage with futuristic minimalism to create pieces that resonate 
            on a global frequency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-white/5 pt-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-semibold text-white">
                Core: The T-Shirt Collection
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">
                Our T-shirts are more than garments; they are canvases of 
                engineering. Each piece features precision-cut silhouettes and 
                premium textiles designed for the modern urban landscape.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-semibold text-white">
                The Drops
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">
                From limited seasonal drops to avant-garde streetwear essentials, 
                our collections represent a continuous evolution of form and
                style in the digital age.
                </p>            </div>
          </div>

          <div className="pt-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 italic">
              Culturally Rooted. Globally Minded.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
