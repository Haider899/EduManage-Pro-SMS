'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const [isMock, setIsMock] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    api
      .get('/health')
      .then((res: any) => {
        if (!mounted) return;
        setIsMock(!!res.isMockMode);
      })
      .catch(() => {
        if (!mounted) return;
        setIsMock(true);
      });
    return () => { mounted = false; };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response: any = await api.post('/auth/login', { identifier, password });
      await login(response.token);
      toast.success('Login successful. Welcome back.');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[520px] glass-effect p-10 md:p-16 rounded-[3rem] shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700" />
        
        <div className="text-center mb-12">
          <div className="inline-flex h-20 w-20 mb-8 items-center justify-center rounded-[2rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-xl shadow-blue-500/20">
            <span className="text-4xl font-black text-white font-outfit">S</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-outfit">Sign In</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg tracking-tight uppercase">School Management System</p>
          
          {isMock && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 px-4 py-3 bg-cyan-500/5 dark:bg-white/5 border border-cyan-500/20 dark:border-white/10 rounded-2xl"
            >
               <p className="text-[10px] text-cyan-700 dark:text-cyan-400 font-black uppercase tracking-[0.2em]">
                 Offline Mode Active: Use lazy-404 / SuperAdmin899
               </p>
            </motion.div>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="form-field"
              placeholder="Username or Email"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
              <label className="form-label mb-0">Password</label>
              <button 
                type="button"
                onClick={() => router.push('/forgot-password')} 
                className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 hover:underline tracking-widest"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-accent btn-pill py-5 text-base font-black tracking-[0.2em] uppercase shadow-xl shadow-blue-500/20 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-14 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
          <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
            School Management System Pro // Core v1.1
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
