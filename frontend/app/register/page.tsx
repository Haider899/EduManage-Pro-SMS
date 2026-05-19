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
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-50 dark:bg-slate-950">
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700" />
        
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 mb-8 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/20">
            <span className="text-3xl font-black text-white font-outfit">S</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-outfit">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 font-inter text-lg">Register for the school portal</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="form-label">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="form-field appearance-none cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="form-field"
              placeholder="unique_handle"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="form-label">Email Address (Optional)</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-field"
              placeholder="name@institution.com"
            />
          </div>

          <div className="space-y-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-accent py-5 rounded-2xl text-base font-black tracking-widest uppercase shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 text-white"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>


        <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-cyan-600 dark:text-cyan-400 font-bold hover:text-cyan-500 transition-colors">Sign in</Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
