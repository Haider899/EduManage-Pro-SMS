'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiEdit3, FiLock, FiShield, FiLogOut, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDropdown = ({ isOpen, onClose }: SettingsDropdownProps) => {
  const { logout } = useAuth();

  const menuItems = [
    {
      label: 'View Profile',
      icon: FiUser,
      href: '/profile',
      desc: 'Check your personal dashboard',
      color: 'text-blue-400'
    },
    {
      label: 'Update Profile',
      icon: FiEdit3,
      href: '/settings/profile-edit',
      desc: 'Edit your information',
      color: 'text-indigo-400'
    },
    {
      label: 'Update Password',
      icon: FiLock,
      href: '/settings/security',
      desc: 'Enhance account security',
      color: 'text-amber-400'
    },
    {
      label: 'Access Controls',
      icon: FiShield,
      href: '/settings/access',
      desc: 'Manage administrative permissions',
      color: 'text-emerald-400'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay to catch clicks outside - handled by parent but this is extra safety */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-4 w-80 z-50 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">Administrative Unit</p>
              <h3 className="text-lg font-black text-slate-800 font-outfit">Control Center</h3>
            </div>

            {/* Menu List */}
            <div className="p-3">
              {menuItems.map((item, idx) => (
                <Link key={idx} href={item.href} onClick={onClose}>
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center ${item.color.replace('-400', '-600')} group-hover:scale-110 transition-transform`}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.label}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <FiChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Logout Footer */}
            <div className="p-3 bg-red-500/5 border-t border-slate-100">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <FiLogOut size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-red-600">Terminate Session</p>
                  <p className="text-[10px] text-red-500/55 font-medium">Log out of the system</p>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsDropdown;
