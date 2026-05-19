'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AuthSidebarProps {
  subtitle?: string;
}

export default function AuthSidebar({ subtitle = "The Essence of Luxury" }: AuthSidebarProps) {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-[40%] xl:w-[45%] h-screen bg-black overflow-hidden p-12 xl:p-20 border-r border-white/5">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-zinc-800/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-zinc-800/10 blur-[100px]" />
        
        {/* Subtle texture/pattern */}
        <div className="absolute inset-0 african-pattern opacity-[0.02] pointer-events-none" />
      </div>

      {/* Top Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-medium">
          XYOMA / Authentication
        </span>
      </motion.div>

      {/* Middle Branding Section */}
      <div className="relative z-10">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-[10vw] xl:text-[8vw] font-bold tracking-tighter uppercase leading-[0.85] mb-6"
        >
          <span className="block">Xyoma</span>
          <span className="block text-zinc-700 italic">Essence</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="h-px bg-gradient-to-r from-white/40 to-transparent mb-8"
        />

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xs xl:text-sm tracking-[0.3em] uppercase text-zinc-500 max-w-xs leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Bottom Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="relative z-10 flex items-center gap-6"
      >
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-600">Established</span>
          <span className="text-[10px] font-mono text-zinc-400">© 2026 XYOMA</span>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-600">Location</span>
          <span className="text-[10px] font-mono text-zinc-400">Lagos / Virtual</span>
        </div>
      </motion.div>

      {/* Minimal Scroll/Indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 opacity-20 rotate-180">
        <span className="text-[8px] uppercase tracking-[0.5em] [writing-mode:vertical-rl]">Account</span>
        <div className="w-px h-12 bg-white" />
      </div>
    </div>
  );
}
