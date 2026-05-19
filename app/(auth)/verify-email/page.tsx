'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthSidebar from '@/components/AuthSidebar';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please check your link.');
        return;
      }

      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus('error');
          setMessage(data.error || 'Verification failed. The token may be invalid or expired.');
        } else {
          setStatus('success');
          setMessage(data.message || 'Account verified successfully.');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage('An unexpected error occurred during account verification.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-black overflow-hidden relative">
      {/* LEFT SIDE: Premium Sidebar */}
      <AuthSidebar subtitle="Verifying your account." />

      {/* RIGHT SIDE: Verification Status */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-20 bg-black relative">
        {/* Subtle Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-zinc-900/10 blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10 text-center"
        >
          {/* Logo for mobile */}
          <Link href="/" className="lg:hidden block mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter uppercase">Xyoma</h2>
          </Link>

          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                <Loader2 className="text-white animate-spin" size={32} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase mb-4">
                Verifying Account
              </h2>
              <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em] animate-pulse">
                Please wait...
              </p>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase mb-4">
                Account Verified
              </h2>
              <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em] leading-relaxed mb-10">
                {message} <br /> Your access to the XYOMA community is now fully active.
              </p>
              <Link 
                href="/login"
                className="inline-block bg-white py-4 px-10 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:bg-zinc-200 transition-all rounded-none shadow-lg shadow-white/5"
              >
                Login
              </Link>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-500/5 border border-red-500/10 flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase mb-4">
                Verification Failed
              </h2>
              <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em] leading-relaxed mb-10">
                {message}
              </p>
              <div className="flex flex-col gap-4">
                <Link 
                  href="/signup"
                  className="inline-block bg-white py-4 px-10 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:bg-zinc-200 transition-all rounded-none"
                >
                  Create New Account
                </Link>
                <Link 
                  href="/"
                  className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] hover:text-white transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-[10px] uppercase tracking-[0.5em] animate-pulse">Verifying Your Email...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

