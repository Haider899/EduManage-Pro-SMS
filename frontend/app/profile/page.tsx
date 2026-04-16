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
        className="glass-effect rounded-5xl border border-white/5 p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-500">
              <div className="h-full w-full rounded-[1.4rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                <span className="text-4xl font-black text-white font-outfit uppercase">
                  {user?.name?.[0] || 'A'}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-emerald-500 border-4 border-slate-950 flex items-center justify-center text-white">
              <FiActivity size={12} />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-black text-white font-outfit tracking-tight mb-2 uppercase">
                {user?.name}
              </h1>
              <p className="text-slate-400 font-inter font-medium tracking-wide">
                Identity Verified // Sector: {user?.role?.toUpperCase()}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-300">
                Active Session
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Public ID: {user?.id?.slice(0, 8)}...
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
            className="glass-effect rounded-3xl p-6 border border-white/5 flex items-center gap-6 hover:border-white/10 transition-colors group"
          >
            <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 font-inter">
                {item.label}
              </p>
              <p className={`text-lg font-bold ${item.highlight ? 'text-indigo-400 capitalize' : 'text-slate-100'}`}>
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
        className="text-center pt-8 border-t border-white/5"
      >
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
          Identity Protocol v4.0.1 // Secured by EduManage Core
        </p>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
