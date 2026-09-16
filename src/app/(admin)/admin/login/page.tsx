'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFillDemo = () => {
    setEmail('admin@currycraft.com');
    setPassword('Admin@12345');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      });

      if (res?.error) {
        setErrorMessage('Invalid credentials. Please check your admin email and password.');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#FFB088] hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to Storefront
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5E00] to-[#E04800] flex items-center justify-center shadow-lg shadow-[#FF5E00]/30 text-white">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-white">
            CurryCraft Admin
          </h1>
          <p className="text-xs text-white/60 font-medium">
            Culinary Operations &amp; Menu Control
          </p>
        </div>
      </div>

      <p className="text-sm text-white/70 mb-6 mt-3 leading-relaxed">
        Sign in with your executive chef administrator credentials to manage Indian cuisine items,
        track stock, and control orders.
      </p>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/75 mb-2">
            Admin Email
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@currycraft.com"
              className="w-full pl-10 pr-4 py-3 bg-white/[0.06] border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/75 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-3 bg-white/[0.06] border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF5E00] to-[#E04800] hover:from-[#FF7324] hover:to-[#EB5505] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#FF5E00]/25 transition active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Authenticating...
            </>
          ) : (
            'Access Admin Dashboard'
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={handleFillDemo}
          className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/80 hover:text-white text-xs font-medium transition flex items-center justify-center gap-2"
        >
          <Sparkles size={15} className="text-[#FFB088]" />
          Auto-fill Demo Admin Credentials
        </button>
        <p className="text-[11px] text-center text-white/40 mt-2">
          Demo: <span className="text-white/60">admin@currycraft.com</span> /{' '}
          <span className="text-white/60">Admin@12345</span>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120B08] via-[#1F120C] to-[#2B1408] text-[#FFF7EE] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#FF5E00]/15 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="p-8 text-center text-white/60 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#FF5E00]" size={24} />
            <span>Loading admin portal...</span>
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
