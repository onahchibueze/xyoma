'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthSidebar from '@/components/AuthSidebar';
import PasswordField from '@/components/PasswordField';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const router = useRouter();

  const handleResendVerification = async () => {
    setResending(true);
    setResendMessage('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendMessage(data.message);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        const session = await getSession();
        if (session?.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
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
      <AuthSidebar subtitle="Access the future of luxury fashion." />

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

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase mb-2">
              Sign In
            </h2>
            <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em]">
              Welcome back
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
                {error === "Please verify your email first" && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="block mt-2 text-white hover:underline transition-all disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Resend verification email'}
                  </button>
                )}
              </motion.div>
            )}

            {resendMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-[10px] uppercase tracking-widest text-green-500 font-bold"
              >
                {resendMessage}
              </motion.div>
            )}
            
            <div className="space-y-5">
              <div className="group relative">
                <label className="block text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-2 group-focus-within:text-white transition-colors">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="block w-full bg-zinc-950 border border-white/5 py-4 px-5 text-white text-xs tracking-wide placeholder:text-zinc-800 focus:outline-none focus:border-white/20 transition-all rounded-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <PasswordField
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center bg-white py-4 text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:bg-zinc-200 transition-all disabled:opacity-50 rounded-none shadow-lg shadow-white/5"
              >
                {loading ? 'Processing...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[0.5em]">
                <span className="bg-black px-4 text-zinc-600 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() =>
  signIn('google', {
    callbackUrl: '/',
  })
}
                className="flex w-full items-center justify-center gap-4 bg-zinc-950 border border-white/5 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-white hover:bg-zinc-900 transition-all rounded-none group"
              >
                <svg className="h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign In with Google
              </motion.button>
            </div>
          </div>

          <p className="mt-12 text-center text-[9px] uppercase tracking-[0.3em] text-zinc-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-white hover:underline transition-all">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
