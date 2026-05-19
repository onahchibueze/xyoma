'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BackButtonProps {
  fallback?: string;
  className?: string;
}

export default function BackButton({ fallback = '/collection', className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history, otherwise use fallback
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        "group flex items-center gap-2 text-zinc-500 hover:text-white transition-all duration-300 ease-out",
        className
      )}
    >
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/5 bg-white/5 group-hover:bg-white group-hover:border-white transition-all duration-300">
        <ArrowLeft size={16} className="group-hover:text-black transition-colors duration-300" />
      </div>
      <span className="text-[10px] uppercase tracking-[0.4em] font-medium opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 ease-out">
        Back
      </span>
    </button>
  );
}
