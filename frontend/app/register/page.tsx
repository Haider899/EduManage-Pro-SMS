'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import Scene3D from '@/components/Common/Scene3D';
import Link from 'next/link';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'student' as 'student' | 'admin'
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/register', formData);
      toast.success('Account created successfully! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-950">
      <Scene3D />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl p-24 opacity-30 pointer-events-none">
        <div className="w-full h-full bg-purple-500/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[520px] glass-effect p-10 md:p-14 rounded-5xl shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-600" />
        
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 mb-8 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-700 shadow-2xl shadow-purple-500/30">
            <span className="text-3xl font-black text-white font-outfit">S</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-4 font-outfit">Enlist</h1>
          <p className="text-slate-400 font-inter text-lg">Join the EduManage Ecosystem</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all font-inter placeholder:text-slate-700"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all font-inter appearance-none cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Username Identifier</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all font-inter placeholder:text-slate-700"
              placeholder="unique_handle"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address (Optional)</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all font-inter placeholder:text-slate-700"
              placeholder="name@institution.com"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Pass-key</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all font-inter placeholder:text-slate-700"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-500 py-5 rounded-2xl text-base font-black tracking-widest uppercase shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/40 transition-all disabled:opacity-50 text-white"
          >
            {isLoading ? 'Processing Authorization...' : 'Create Account'}
          </button>
        </form>


        <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">SignIn</Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
