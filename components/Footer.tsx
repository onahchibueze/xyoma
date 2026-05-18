"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: footerRef });

  return (
    <footer 
      ref={footerRef}
      className="bg-black border-t border-white/5 pt-24 pb-12 px-6 md:px-12"
    >
      <div ref={contentRef} className="max-w-screen-2xl mx-auto flex flex-col gap-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link 
              href="/" 
              className="text-3xl font-bold tracking-tighter uppercase hover:opacity-70 transition-opacity"
            >
              Xyoma
            </Link>
            <p className="text-sm text-zinc-500 uppercase tracking-widest max-w-sm leading-relaxed font-light">
              Engineering the intersection of Nigerian soul and futuristic technical streetwear. Defined by purpose, crafted by intent.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-white font-semibold">
              Presence
            </h4>
            <div className="flex flex-col gap-3">
              {["Instagram", "TikTok", "Twitter / X"].map((social) => (
                <Link 
                  key={social}
                  href="#" 
                  className="text-xs text-zinc-500 uppercase tracking-widest hover:text-white transition-colors duration-300 w-fit"
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal / Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-white font-semibold">
              Laboratory
            </h4>
            <div className="flex flex-col gap-3 text-xs text-zinc-500 uppercase tracking-widest leading-loose">
              <p>Lagos, Nigeria</p>
              <p>© {new Date().getFullYear()} XYOMA Studios</p>
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <span className="text-[9px] uppercase tracking-[0.6em] text-zinc-700">
              Designed in Nigeria
            </span>
            <span className="text-[9px] uppercase tracking-[0.6em] text-zinc-700">
              Global Frequency
            </span>
          </div>
          
          <div className="text-[9px] uppercase tracking-[0.4em] text-zinc-800">
            Engineered for the modern nomad.
          </div>
        </div>
      </div>
    </footer>
  );
}
