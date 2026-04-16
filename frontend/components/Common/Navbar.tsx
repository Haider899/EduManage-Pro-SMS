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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/25 px-6 backdrop-blur-2xl">
      <div className="flex min-h-24 items-center justify-between gap-6">
        <div className="relative w-full max-w-md group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-300" size={18} />
          <input
            type="text"
            placeholder="Search people, schedules, records, and reports"
            className="w-full rounded-[1.4rem] border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-slate-200 transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/20"
          />
        </div>

        <div className="hidden items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3 text-slate-300 shadow-inner xl:flex">
          <FiClock className="text-cyan-300" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Live Date</p>
            <p className="text-sm font-semibold text-white">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-[1.4rem] border border-white/10 bg-white/5 p-1.5 shadow-inner">
            <button className="rounded-xl p-2.5 text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-white">
              <FiCompass size={18} />
            </button>
            <button className="rounded-xl p-2.5 text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-white">
              <FiBell size={18} />
            </button>

            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`rounded-xl p-2.5 transition-all duration-300 ${isSettingsOpen ? 'bg-cyan-400/15 text-cyan-300' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
              >
                <FiSettings size={18} className={isSettingsOpen ? 'animate-spin-slow' : ''} />
              </button>
              <SettingsDropdown isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            </div>
          </div>

          <button className="group flex items-center gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 pl-2 pr-4 py-2 transition-all hover:bg-white/10 active:scale-95">
            <div className={`flex h-11 w-11 items-center justify-center rounded-[1rem] bg-gradient-to-br ${profile?.accent || 'from-cyan-400 to-blue-600'} text-xs font-bold text-white shadow-lg`}>
              {user?.name?.slice(0, 2).toUpperCase() || 'SM'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-[13px] font-bold leading-none tracking-tight text-white">{profile?.title || 'School Workspace'}</p>
              <p className="mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-cyan-200/70">{profile?.badge || 'Secure Session'}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
