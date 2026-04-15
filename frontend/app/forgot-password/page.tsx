'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';
import Scene3D from '@/components/Common/Scene3D';

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/forgotPassword', { identifier });
      setIsSent(true);
      toast.success('Reset link sent to your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-950">
      <Scene3D />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl p-24 opacity-30 pointer-events-none">
        <div className="w-full h-full bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px] glass-effect p-10 md:p-14 rounded-5xl shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-600" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight text-white mb-4 font-outfit">Reset Access</h1>
          <p className="text-slate-400 font-inter">Enter your email or username to receive a security link</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Identity Identifier</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-inter placeholder:text-slate-700"
                placeholder="Username or Email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-accent py-5 rounded-2xl text-base font-black tracking-widest uppercase shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
              <p className="text-indigo-300 font-inter">Check your inbox. If an account matches, you will receive a reset link shortly.</p>
            </div>
            <Link href="/login" className="block text-sm font-bold text-slate-400 hover:text-white transition-colors">
              Return to Login
            </Link>
          </div>
        )}

        <div className="mt-14 pt-8 border-t border-slate-800 text-center">
          <Link href="/login" className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-400 transition-colors">
            Back to Identity Gate
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
