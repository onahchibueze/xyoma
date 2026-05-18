'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthSidebar from '@/components/AuthSidebar';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black overflow-hidden relative">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="absolute top-8 left-8 z-[110] flex items-center gap-3 text-white/50 hover:text-white transition-all group"
      >
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back</span>
      </button>

      {/* LEFT SIDE: Premium Sidebar */}
      <AuthSidebar subtitle="Recover your access to the future of fashion." />

      {/* RIGHT SIDE: Authentication Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-20 bg-black relative">
        {/* Subtle Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-zinc-900/10 blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo for mobile */}
          <Link href="/" className="lg:hidden block mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter uppercase">Xyoma</h2>
          </Link>

          {!isSubmitted ? (
            <>
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white uppercase mb-2">
                  Reset Key
                </h2>
                <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em]">
                  Enter your email to receive recovery instructions
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-[10px] uppercase tracking-widest text-red-500 font-bold"
                  >
                    {error}
                  </motion.div>
                )}
                
                <div className="space-y-5">
                  <div className="group relative">
                    <label className="block text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-2 group-focus-within:text-white transition-colors">
                      Identity (Email)
                    </label>
                    <input
                      type="email"
                      required
                      className="block w-full bg-zinc-950 border border-white/5 py-4 px-5 text-white text-xs tracking-wide placeholder:text-zinc-800 focus:outline-none focus:border-white/20 transition-all rounded-none"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full justify-center bg-white py-4 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:bg-zinc-200 transition-all disabled:opacity-50 rounded-none shadow-lg shadow-white/5"
                  >
                    {loading ? 'Transmitting...' : 'Send Recovery Link'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase mb-4">
                Transmission Sent
              </h2>
              <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em] leading-relaxed mb-10">
                If an account exists with <span className="text-white">{email}</span>, 
                a recovery link has been dispatched to your terminal.
              </p>
              <Link 
                href="/login"
                className="inline-block bg-white py-4 px-10 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:bg-zinc-200 transition-all rounded-none shadow-lg shadow-white/5"
              >
                Return to Login
              </Link>
            </motion.div>
          )}

          <p className="mt-12 text-center text-[9px] uppercase tracking-[0.3em] text-zinc-600">
            Remembered your key?{' '}
            <Link href="/login" className="font-bold text-white hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
