'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiShield, FiTag, FiActivity } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  const details = [
    { label: 'Full Name', value: user?.name, icon: FiUser, color: 'text-indigo-400' },
    { label: 'Username', value: user?.username || user?.email?.split('@')[0], icon: FiTag, color: 'text-sky-400' },
    { label: 'Email Address', value: user?.email || 'N/A', icon: FiMail, color: 'text-purple-400' },
    { label: 'Assigned Role', value: user?.role, icon: FiShield, color: 'text-emerald-400', highlight: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[2rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden dark:border-white/10"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-1 shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
              <div className="h-full w-full rounded-[1.4rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                <span className="text-4xl font-black text-white font-outfit uppercase">
                  {user?.name?.[0] || 'A'}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-emerald-500 border-4 border-white dark:border-slate-950 flex items-center justify-center text-white">
              <FiActivity size={12} />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="page-title mb-2">
                {user?.name}
              </h1>
              <p className="page-subtitle">
                Verified {user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'User'} account
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
              <span className="badge-pill">
                Active Session
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {details.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-white/10 flex items-center gap-6 hover:border-cyan-500/30 transition-colors group"
          >
            <div className={`h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="eyebrow-label mb-1">
                {item.label}
              </p>
              <p className={`data-value ${item.highlight ? 'text-cyan-700 dark:text-cyan-300 capitalize' : ''}`}>
                {item.value || 'Not Configured'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-8 border-t border-slate-200 dark:border-white/5"
      >
        <p className="eyebrow-label">
          School Management System
        </p>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
