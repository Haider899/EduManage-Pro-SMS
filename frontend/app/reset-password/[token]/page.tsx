'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import Scene3D from '@/components/Common/Scene3D';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      const response: any = await api.patch(`/auth/resetPassword/${token}`, { password });
      localStorage.setItem('token', response.token);
      toast.success('Password updated successfully.');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Scene3D />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl p-24 opacity-30 pointer-events-none">
        <div className="w-full h-full bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px] glass-effect p-10 md:p-14 rounded-5xl shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-outfit">New Password</h1>
          <p className="text-slate-500 dark:text-slate-400 font-inter">Set a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-field"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-accent py-5 rounded-2xl text-base font-black tracking-widest uppercase shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Updating password...' : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
