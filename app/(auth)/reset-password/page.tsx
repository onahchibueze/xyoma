'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthSidebar from '@/components/AuthSidebar';
import PasswordField from '@/components/PasswordField';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing security token. Please request a new recovery link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Security token is missing.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during processing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black overflow-hidden relative">
      {/* Back Button */}
      <button 
        onClick={() => router.push('/login')}
        className="absolute top-8 left-8 z-[110] flex items-center gap-3 text-white/50 hover:text-white transition-all group"
      >
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Cancel</span>
      </button>

      {/* LEFT SIDE: Premium Sidebar */}
      <AuthSidebar subtitle="Access your account." />

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
                  Update Password
                </h2>
                <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em]">
                  Set your new password
                </p>
              </div>

              {!token && error ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-8 bg-zinc-900/50 border border-white/5"
                >
                  <AlertCircle className="text-red-500 mx-auto mb-4" size={32} />
                  <p className="text-zinc-400 text-xs tracking-wider leading-relaxed mb-8">
                    {error}
                  </p>
                  <Link 
                    href="/forgot-password"
                    className="inline-block bg-white py-4 px-10 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:bg-zinc-200 transition-all rounded-none"
                  >
                    Request New Link
                  </Link>
                </motion.div>
              ) : (
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
                    <PasswordField
                      label="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                    />

                    <PasswordField
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading || !token}
                      className="group relative flex w-full justify-center bg-white py-4 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:bg-zinc-200 transition-all disabled:opacity-50 rounded-none shadow-lg shadow-white/5"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}
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
                Password Updated
              </h2>
              <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em] leading-relaxed mb-10">
                Your password has been successfully updated. 
                You can now sign in with your new credentials.
              </p>
              <Link 
                href="/login"
                className="inline-block bg-white py-4 px-10 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:bg-zinc-200 transition-all rounded-none shadow-lg shadow-white/5"
              >
                Login
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-[10px] uppercase tracking-[0.5em] animate-pulse">Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

