'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
        <div className="space-y-6 text-center max-w-md mx-auto px-6">
          <h1 className="text-4xl font-bold uppercase tracking-tighter">System Malfunction</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest leading-relaxed">
            A critical error occurred within the application framework. Our engineers have been notified.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-colors"
            >
              Attempt Reboot
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-white/20 text-[10px] uppercase tracking-widest font-bold hover:border-white transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
