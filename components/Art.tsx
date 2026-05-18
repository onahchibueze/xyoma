"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Art() {
  const container = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const initialContentRef = useRef<HTMLDivElement>(null);
  const newContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Set initial states
    gsap.set(newContentRef.current, { opacity: 0, y: 50 });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top ",
        end: "+=150%", 
        pin: true,
        scrub: true,
        anticipatePin: 1,
      },
    });

    // Phase 1: Fade out initial content
    tl.to(initialContentRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
    })
    
    // Phase 2: Animate the mask and scale image
    .fromTo(mainImageRef.current, 
      { 
        maskSize: "50%", 
        WebkitMaskSize: "50%",
        scale: 1.1 
      },
      {
        maskSize: "3000%",
        WebkitMaskSize: "3000%",
        scale: 1, 
        duration: 3,
        ease: "none",
      }, 
      "-=0.5"
    )

    // Phase 3: Fade in new content
    .to(newContentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
    }, "-=1");

  }, { scope: container });

  return (
    <div ref={container} className="bg-black">
      <section 
        ref={triggerRef}
        className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden py-20"
      >
        {/* Initial Overlay Content */}
        <div 
          ref={initialContentRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-12 mt-40 ">
            <div className="flex flex-col gap-4 text-left order-2 md:order-1">
              <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500">Precision</span>
              <h3 className="text-xl md:text-2xl font-light uppercase tracking-widest text-white">The Lab</h3>
            </div>
            
            <div className="text-center order-1 md:order-2">
              <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-500 block mb-4">02 / Artistry</span>
              <h2 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-none">
                The <span className="italic text-zinc-600">Soul</span> <br /> of Craft
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-right order-3">
              <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500">Heritage</span>
              <h3 className="text-xl md:text-2xl font-light uppercase tracking-widest text-white">Technique</h3>
            </div>
          </div>
        </div>

        {/* Central Masked Image Container */}
        <div className="relative w-full max-w-4xl flex flex-col items-center gap-20 px-6 z-20">
          <div 
            ref={mainImageRef}
            className="w-full aspect-video bg-cover bg-center rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl mb-4"
            style={{
              backgroundImage: "url('/images/designer-at-work.jpeg')",
              maskImage: "url('/images/scissors.png')",
              WebkitMaskImage: "url('/images/scissors.png')",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskSize: "50%",
              WebkitMaskSize: "50%",
            }}
          />

          {/* New Content (Now positioned below the image) */}
          <div 
            ref={newContentRef}
            className="flex flex-col items-center text-center max-w-2xl opacity-0"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 mb-6 block">Est. 2026</span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-6">
              Engineering <br /> Elegance
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 uppercase tracking-[0.4em] leading-relaxed max-w-xl">
              Every stitch is a blueprint. Every garment is an architectural statement. 
              Discover the intersection of technical precision and human soul.
            </p>
          </div>
        </div>

        {/* Background Grain/Noise Effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-10" />
      </section>
    </div>
  );
}
