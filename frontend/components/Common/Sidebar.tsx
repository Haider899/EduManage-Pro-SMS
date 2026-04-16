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
        className={`glass-panel fixed inset-y-0 left-0 z-50 w-80 transition-transform duration-500 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.14),transparent_30%)]" />

          <div className="relative mb-8 flex items-center gap-4 px-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-700 shadow-[0_22px_60px_rgba(14,165,233,0.25)]">
              <span className="text-xl font-black text-white font-outfit">S</span>
            </div>
            <div>
              <h1 className="font-outfit text-xl font-bold tracking-tight text-white">EduNexus</h1>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-200/60 font-bold">Adaptive School OS</p>
            </div>
          </div>

          {profile && (
            <div className="relative mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-inner">
              <div className={`mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r ${profile.accent}`} />
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">{profile.badge}</p>
              <h2 className="mt-3 text-2xl font-black text-white">{profile.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{profile.summary}</p>
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
                      ? 'bg-white/10 text-white border border-white/15 shadow-[0_18px_45px_rgba(59,130,246,0.18)]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isActive ? 'border-white/15 bg-white/10' : 'border-white/5 bg-slate-950/30'} transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                    <item.icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className={`block text-sm font-semibold ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                    <span className="block truncate text-[11px] text-slate-500">{item.description}</span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(103,232,249,0.9)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="relative mt-auto border-t border-white/10 pt-6">
            <div className="mb-4 px-2">
              <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Authenticated As</p>
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-xs font-black uppercase text-cyan-300">
                  {user?.role[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-bold text-white">{user?.name}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-200/70">{user?.role}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-4 rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3.5 text-slate-300 transition-all hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300"
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
