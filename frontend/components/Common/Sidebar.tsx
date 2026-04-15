'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart,
  FiDollarSign,
  FiCalendar,
  FiBookOpen,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const allMenuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/', roles: ['admin', 'hr', 'teacher', 'student'] },
    { icon: FiUsers, label: 'Staff Portal', href: '/staff/add', roles: ['admin'] },
    { icon: FiUsers, label: 'Enroll Students', href: '/students/add', roles: ['hr'] },
    { icon: FiUsers, label: 'Student Directory', href: '/students', roles: ['admin', 'hr', 'teacher'] },
    { icon: FiBook, label: 'Teacher Directory', href: '/teachers', roles: ['admin', 'hr'] },
    { icon: FiBarChart, label: 'Attendance', href: '/attendance', roles: ['admin', 'hr', 'teacher', 'student'] },
    { icon: FiBookOpen, label: 'Grades', href: '/grades', roles: ['admin', 'teacher', 'student'] },
    { icon: FiBarChart, label: 'Notice Board', href: '/notices/manage', roles: ['admin', 'hr'] },
    { icon: FiCalendar, label: 'Leave Requests', href: '/leaves/manage', roles: ['admin', 'hr'] },
    { icon: FiDollarSign, label: 'Fees', href: '/fees', roles: ['admin', 'hr'] },
    // Timetable should be visible to roles that manage or consume timetables.
    // Keep it available to SuperAdmin as requested.
    { icon: FiCalendar, label: 'Timetable', href: '/timetable', roles: ['admin', 'teacher', 'student', 'superadmin'] },
  ];

  const filteredMenuItems = useMemo(() => {
    if (!user) return [];
    return allMenuItems.filter((item) => item.roles.includes(user.role));
  }, [user]);

  return (
    <>
      <aside
        className={`glass-effect fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-500 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Logo Section */}
          <div className="mb-10 flex items-center gap-4 px-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
              <span className="text-xl font-black text-white font-outfit">S</span>
            </div>
            <div>
              <h1 className="font-outfit text-xl font-bold tracking-tight text-white">EduManage</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Smart SMS Suite</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            {filteredMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} size={20} />
                  <span className={`text-sm font-semibold font-inter ${isActive ? 'text-indigo-300' : ''}`}>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-glow"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section / Logout */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="mb-4 px-2">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 mb-2">Authenticated As</p>
              <div className="flex items-center gap-3 px-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs border border-indigo-500/10 uppercase">
                  {user?.role[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[9px] font-black text-indigo-400/70 uppercase tracking-wider">{user?.role}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 shadow-inner"
            >
              <FiLogOut size={20} className="transition-transform group-hover:translate-x-1" />
              <span className="text-sm font-bold font-inter tracking-wide">Logout Session</span>
            </button>
          </div>
        </div>
      </aside>




      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-effect rounded-2xl p-3 bg-slate-900/90 border border-slate-700/70 text-slate-200 hover:bg-slate-800 transition"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {isOpen && <div className="md:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;
