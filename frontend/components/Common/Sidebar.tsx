'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { getRoleMenu, roleProfiles } from '@/lib/rbac';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredMenuItems = useMemo(() => getRoleMenu(user?.role), [user]);
  const profile = user ? roleProfiles[user.role] : null;

  return (
    <>
      <aside
        className={`glass-panel fixed inset-y-0 left-0 z-50 w-80 border-r border-slate-200 dark:border-slate-800 transition-transform duration-500 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.06),transparent_30%)]" />

          <div className="relative mb-8 flex items-center gap-4 px-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-700 shadow-[0_15px_40px_rgba(14,165,233,0.2)]">
              <span className="text-xl font-black text-white font-outfit uppercase">S</span>
            </div>
            <div>
              <h1 className="font-outfit text-xl font-bold tracking-tight text-slate-900 dark:text-white">EduNexus</h1>
              <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400/80 font-black">Adaptive School OS</p>
            </div>
          </div>

          {profile && (
            <div className="relative mb-6 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6 shadow-sm backdrop-blur-md">
              <div className={`mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r ${profile.accent}`} />
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{profile.badge}</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{profile.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{profile.summary}</p>
            </div>
          )}

          <nav className="relative flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {filteredMenuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center gap-4 rounded-[1.4rem] px-4 py-3.5 transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-900/5 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-900/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isActive ? 'border-slate-300 dark:border-white/15 bg-white dark:bg-white/10 shadow-sm' : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/30'} transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                    <item.icon size={18} className={isActive ? 'text-cyan-600 dark:text-cyan-400' : ''} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className={`block text-sm font-bold ${isActive ? 'text-slate-900 dark:text-white' : ''}`}>{item.label}</span>
                    <span className="block truncate text-[11px] font-medium text-slate-500 dark:text-slate-500">{item.description}</span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-lg shadow-cyan-500/50"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="relative mt-auto border-t border-slate-200 dark:border-white/10 pt-6">
            <div className="mb-4 px-2">
              <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Authenticated As</p>
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/10 text-xs font-black uppercase text-cyan-600 dark:text-cyan-300 shadow-sm">
                  {user?.role[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-200/70">{user?.role}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-4 rounded-[1.4rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3.5 text-slate-600 dark:text-slate-300 transition-all hover:border-red-400/30 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 shadow-sm"
            >
              <FiLogOut size={20} className="transition-transform group-hover:translate-x-1" />
              <span className="text-sm font-bold tracking-wide">Logout Session</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-panel rounded-2xl p-3 text-slate-200 transition hover:bg-white/10"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {isOpen && <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;
