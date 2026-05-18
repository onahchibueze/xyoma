"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "./SectionWrapper";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const itemRefs = useRef<(HTMLDivElement | HTMLButtonElement)[]>([]);
  const needleLeftRef = useRef<HTMLDivElement>(null);
  const needleRightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Entrance animation for content
    gsap.fromTo(
      itemRefs.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Static entrance animation for the needles
    gsap.fromTo(
      needleLeftRef.current,
      { x: -50, opacity: 0, rotate: -30 },
      {
        x: 0,
        opacity: 0.4,
        rotate: 15,
        duration: 1.5,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(
      needleRightRef.current,
      { x: 50, opacity: 0, rotate: 30 },
      {
        x: 0,
        opacity: 0.4,
        rotate: -15,
        duration: 1.5,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );
  }, { scope: containerRef });

  const addToRefs = (el: HTMLDivElement | HTMLButtonElement | null) => {
    if (el && !itemRefs.current.includes(el)) {
      itemRefs.current.push(el);
    }
  };

  return (
    <SectionWrapper id="contact" className="bg-black border-t border-white/5 overflow-hidden">
      <div ref={containerRef} className="max-w-4xl mx-auto flex flex-col gap-20 relative">

        {/* Decorative Needles - Both Sides */}
        <div 
          ref={needleLeftRef}
          className="absolute -left-[30%] top-0 w-32 h-64 z-0 pointer-events-none hidden lg:block"
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
          className="absolute -right-[30%] bottom-0 w-32 h-64 z-0 pointer-events-none hidden lg:block"
        >
          <Image
            src="/images/needle-thread.png"
            alt="Decorative needle"
            fill
            className="object-contain"
          />
        </div>
        {/* Header */}
        <div 
          ref={(el) => { if (el) itemRefs.current[0] = el; }}
          className="relative z-10 flex flex-col items-center text-center gap-6"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-medium">
            Stay Notified
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
            The Next <br />
            <span className="text-zinc-600 italic text-3xl md:text-5xl">Collection Drop</span>
          </h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest max-w-[320px] leading-relaxed font-light mt-2">
            Join the inner circle to receive exclusive early access and release updates.
          </p>
          <div className="w-12 h-px bg-white/20 mt-4" />
        </div>

        {/* Signup Form */}
        <form 
          ref={formRef}
          className="relative z-10 flex flex-col gap-12 max-w-xl mx-auto w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-12">
            {/* Email Field */}
            <div ref={addToRefs} className="group relative flex flex-col gap-4">
              <label htmlFor="email" className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="bg-transparent border-b border-white/10 py-6 px-1 text-base md:text-lg outline-none transition-all duration-500 focus:border-white placeholder:text-zinc-800 focus:placeholder:text-zinc-700 text-center"
              />
              <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-700 group-focus-within:w-full" />
            </div>
          </div>

          {/* Submit Button */}
          <div ref={addToRefs} className="flex justify-center pt-4">
            <button
              type="submit"
              className="group relative px-16 py-5 bg-white text-black text-[11px] uppercase tracking-[0.4em] font-bold overflow-hidden transition-all duration-500 hover:bg-zinc-200 w-full md:w-auto"
            >
              <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-px">
                Join Waitlist
              </span>
              
              {/* Soft Glow */}
              <div className="absolute -inset-8 bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {/* Luxury Lift Overlay */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
            </button>
          </div>
        </form>

        {/* Brand Sign-off */}
        <div 
          ref={addToRefs}
          className="relative z-10 flex flex-col items-center gap-4 mt-8 opacity-40 hover:opacity-100 transition-opacity duration-700"
        >
          <p className="text-[9px] uppercase tracking-[0.6em] text-zinc-400">
            No spam. Only high-frequency updates.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
