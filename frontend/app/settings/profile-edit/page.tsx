'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const ProfileEditPage = () => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.patch('/auth/updateMe', formData);
      await refreshUser();
      toast.success('Identity Updated Successfully');
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-4xl font-black text-white font-outfit uppercase tracking-tight mb-2">Editor</h1>
          <p className="text-slate-400 font-inter">Recalibrate your administrative identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Identity Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-400" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-inter placeholder:text-slate-700 font-medium"
                  placeholder="Your Full Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Primary Email Node</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-inter placeholder:text-slate-700 font-medium"
                  placeholder="name@institution.com"
                  required
                />
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
                <FiSave size={20} />
                Commit Changes
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileEditPage;
