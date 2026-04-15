'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Scene3D from '@/components/Common/Scene3D';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response: any = await api.post('/auth/login', { identifier, password });
      await login(response.token);
      toast.success('Access Granted. Welcome back.');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-950">
      <Scene3D />
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl p-24 opacity-30 pointer-events-none">
        <div className="w-full h-full bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px] glass-effect p-10 md:p-14 rounded-5xl shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-600" />
        
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 mb-8 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-700 shadow-2xl shadow-indigo-500/30">
            <span className="text-3xl font-black text-white font-outfit">S</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-4 font-outfit">Identity</h1>
          <p className="text-slate-400 font-inter text-lg">Secure Access to EduManage SMS</p>
          <div className="mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
             <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
               Offline Mode Active: Use LAZY-404 / SuperAdmin899
             </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
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

          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Pass-key</label>
              <button 
                type="button"
                onClick={() => router.push('/forgot-password')} 
                className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 tracking-wider"
              >
                Forgot Access?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-inter placeholder:text-slate-700"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-accent py-5 rounded-2xl text-base font-black tracking-widest uppercase shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Validating...
              </span>
            ) : 'Authorize Access'}
          </button>
        </form>

        <div className="mt-14 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
            School Management System Pro // Core v1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};


export default LoginPage;
