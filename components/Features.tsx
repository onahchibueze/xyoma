"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "./SectionWrapper";
import Image from "next/image";
import { features } from "@/contents/features";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    gsap.fromTo(
      cardRefs.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <SectionWrapper id="features" className="bg-black border-t border-white/5">
      <div ref={containerRef} className="flex flex-col gap-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-6 max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 font-medium">
              02 / Attributes
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
              Engineering <br />
              <span className="text-zinc-600 italic">Elegance</span>
            </h2>
          </div>
          <p className="text-sm text-zinc-500 uppercase tracking-widest max-w-[200px] leading-loose">
            Defined by purpose. <br /> Crafted by intent.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="group relative h-[450px] bg-zinc-950 border border-white/5 flex flex-col overflow-hidden transition-all duration-700 hover:border-white/10 hover:-translate-y-2 opacity-0"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={feature.imageUrl}
                  alt={feature.imageAlt}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-60"                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Card Decoration */}
              <div className="absolute top-0 right-0 p-6 z-10 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="text-4xl font-bold tracking-tighter italic text-white">{feature.id}</span>
              </div>

              <div className="relative z-10 p-10 mt-auto flex flex-col gap-4">
                <h3 className="text-lg font-semibold uppercase tracking-widest text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Glow */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
