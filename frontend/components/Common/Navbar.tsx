'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FiBell, FiClock, FiCompass, FiSearch, FiSettings } from 'react-icons/fi';
import SettingsDropdown from '../Navbar/SettingsDropdown';
import { useAuth } from '@/context/AuthContext';
import { roleProfiles } from '@/lib/rbac';

const Navbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const profile = user ? roleProfiles[user.role] : null;
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-950/25 px-6 backdrop-blur-2xl transition-colors duration-300">
      <div className="flex min-h-24 items-center justify-between gap-6">
        <div className="relative w-full max-w-md group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" size={18} />
          <input
            type="text"
            placeholder="Search people, schedules, records, and reports"
            className="w-full rounded-[1.4rem] border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 py-3 pl-12 pr-4 text-sm text-slate-900 dark:text-slate-200 transition-all placeholder:text-slate-400 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 shadow-sm"
          />
        </div>

        <div className="hidden items-center gap-3 rounded-[1.4rem] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-5 py-3 text-slate-600 dark:text-slate-300 shadow-sm xl:flex">
          <FiClock className="text-cyan-600 dark:text-cyan-400" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500 font-bold">Live Date</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-[1.4rem] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-1.5 shadow-sm">
            <button className="rounded-xl p-2.5 text-slate-400 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white">
              <FiCompass size={18} />
            </button>
            <button className="rounded-xl p-2.5 text-slate-400 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white">
              <FiBell size={18} />
            </button>

            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`rounded-xl p-2.5 transition-all duration-300 ${isSettingsOpen ? 'bg-cyan-500/10 text-cyan-600' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <FiSettings size={18} className={isSettingsOpen ? 'animate-spin-slow' : ''} />
              </button>
              <SettingsDropdown isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            </div>
          </div>

          <button className="group flex items-center gap-3 rounded-[1.6rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-2 pr-5 py-2 transition-all hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm active:scale-95">
            <div className={`flex h-11 w-11 items-center justify-center rounded-[1rem] bg-gradient-to-br ${profile?.accent || 'from-cyan-500 to-blue-700'} text-xs font-bold text-white shadow-md`}>
              {user?.name?.slice(0, 2).toUpperCase() || 'SM'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-[13px] font-black leading-none tracking-tight text-slate-900 dark:text-white">{profile?.title || 'School Workspace'}</p>
              <p className="mt-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400/70">{profile?.badge || 'Secure Session'}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
