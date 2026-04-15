import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiBell, FiSettings, FiMenu } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SettingsDropdown from '../Navbar/SettingsDropdown';

const Navbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between px-6 backdrop-blur-xl bg-slate-950/40 border-b border-white/5">
      <div className="flex flex-1 items-center gap-6">
        {/* Search Bar - Professional Logic */}
        <div className="relative w-full max-w-md group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-400" size={18} />
          <input
            type="text"
            placeholder="Search students, teachers, documents..."
            className="w-full rounded-2xl bg-slate-900/50 border border-slate-800 py-2.5 pl-12 pr-4 text-sm text-slate-200 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all font-inter placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Action Controls */}
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900/50 border border-slate-800 p-1.5 shadow-inner">
          <button className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300">
            <FiBell size={18} />
          </button>
          
          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`rounded-xl p-2.5 transition-all duration-300 ${isSettingsOpen ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <FiSettings size={18} className={isSettingsOpen ? 'animate-spin-slow' : ''} />
            </button>
            <SettingsDropdown isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          </div>
        </div>

        <div className="h-8 w-px bg-slate-800 mx-1" />

        {/* User Badge */}
        <button className="flex items-center gap-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 pl-2 pr-4 py-1.5 transition-all hover:bg-indigo-500/10 group active:scale-95">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/10 group-hover:shadow-indigo-500/20 transition-all">
            AD
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-[13px] font-bold text-white font-inter tracking-tight leading-none group-hover:text-indigo-200 transition-colors">Admin Portal</p>
            <p className="text-[9px] text-indigo-400/70 font-black uppercase mt-1 tracking-widest leading-none">Status: Online</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
