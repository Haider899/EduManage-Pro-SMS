'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiShield, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

const SecurityPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.patch('/auth/updatePassword', formData);
      toast.success('Pass-key Updated Successfully');
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
        >
          <FiArrowLeft size={16} />
          Back
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-5xl border border-white/5 p-10 md:p-14 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white font-outfit uppercase tracking-tight mb-2">Security</h1>
          <p className="text-slate-400 font-inter">Update your secure access pass-key</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Current Password */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Current Pass-key</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-400" size={18} />
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.passwordCurrent}
                  onChange={(e) => setFormData({ ...formData, passwordCurrent: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-12 pr-14 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-inter placeholder:text-slate-700 font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('current')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPasswords.current ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-white/5 my-4" />

            {/* New Password */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">New Pass-key</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-400" size={18} />
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-12 pr-14 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-inter placeholder:text-slate-700 font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('new')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPasswords.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm New Pass-key</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-400" size={18} />
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-12 pr-14 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-inter placeholder:text-slate-700 font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('confirm')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPasswords.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-accent py-5 rounded-2xl text-base font-black tracking-widest uppercase shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <FiShield size={20} />
                Update Pass-key
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SecurityPage;
