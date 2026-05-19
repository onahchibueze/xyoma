'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionWrapper from '@/components/SectionWrapper';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setMessage('No transaction reference found.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage('Order successful. Your order is being processed.');
          clearCart();
          
          // Clear DB cart too if logged in
          await fetch('/api/cart', { method: 'DELETE' });
          
          setTimeout(() => {
            router.push('/orders?success=true');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage(data.error || 'Payment verification failed.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('failed');
        setMessage('An error occurred during verification.');
      }
    };

    verifyPayment();
  }, [reference, clearCart, router]);

  return (
    <div className="max-w-md w-full text-center space-y-8">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-zinc-500" size={48} />
          <p className="text-xs uppercase tracking-[0.4em] font-medium text-zinc-400">
            {message}
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <CheckCircle className="text-[#c5a059]" size={64} />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold uppercase tracking-tighter">Order Successful</h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500 leading-relaxed">
              {message}
            </p>
          </div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest animate-pulse">
            Redirecting to your history...
          </p>
        </div>
      )}

      {status === 'failed' && (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <XCircle className="text-red-500" size={64} />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold uppercase tracking-tighter">Order Failed</h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500 leading-relaxed">
              {message}
            </p>
          </div>
          <button 
            onClick={() => router.push('/checkout')}
            className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all"
          >
            Return to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <SectionWrapper className="pt-40 pb-24 min-h-[70vh] flex items-center justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="animate-spin text-zinc-500" size={48} />
            <p className="text-xs uppercase tracking-[0.4em] font-medium text-zinc-400">
              Loading...
            </p>
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </SectionWrapper>
      <Footer />
    </div>
  );
}
