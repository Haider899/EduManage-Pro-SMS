'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiXCircle, FiArrowLeft, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const LeaveManagement = () => {
  // Mock leave data
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'Alice Smith', role: 'Teacher', type: 'Sick', dates: 'May 14 - May 16', status: 'pending', reason: 'Flu symptoms' },
    { id: 2, name: 'Bob Johnson', role: 'Student', type: 'Casual', dates: 'May 20 - May 21', status: 'pending', reason: 'Family event' },
    { id: 3, name: 'Charlie Brown', role: 'Teacher', type: 'Vacation', dates: 'Jun 01 - Jun 10', status: 'approved', reason: 'Summer trip' },
  ]);

  const handleAction = (id: number, status: 'approved' | 'rejected') => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status } : leave
    ));
    toast.success(`Request ${status} successfully.`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-105"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-black font-outfit text-cyan-400 tracking-tight">Leave Management</h1>
            <p className="text-slate-500 font-inter">Audit & Governance: Absences, Vacations & Medical Leaves</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <div className="col-span-4">Applicant</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-3">Duration</div>
          <div className="col-span-3 text-right">Actions / Status</div>
        </div>

        {/* Leave Items */}
        {leaves.map((leave, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={leave.id}
            className="glass-effect rounded-3xl border border-white/5 p-6 hover:border-indigo-500/20 transition-all items-center"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <FiUser size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-cyan-300 font-inter">{leave.name}</h4>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{leave.role}</p>
                </div>
              </div>

              <div className="col-span-2">
                <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 uppercase">
                  {leave.type}
                </span>
              </div>

              <div className="col-span-3 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <FiCalendar size={14} className="text-indigo-400" />
                <span className="text-xs font-semibold">{leave.dates}</span>
              </div>

              <div className="col-span-3 flex justify-end gap-3">
                {leave.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleAction(leave.id, 'rejected')}
                      className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                    >
                      <FiXCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleAction(leave.id, 'approved')}
                      className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center border border-emerald-500/20"
                    >
                      <FiCheckCircle size={18} />
                    </button>
                  </>
                ) : (
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    leave.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {leave.status}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeaveManagement;
