"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiBook,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiShield,
  FiCheckCircle,
  FiArrowUpRight,
  FiActivity,
  FiSettings,
  FiFileText,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { NoticeModal, MeetingModal } from './QuickActionModals';

const StatCard = ({ icon: Icon, label, value, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="glass-effect rounded-3xl p-12 card-hover border border-white/5 group relative overflow-hidden"
  >
    <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${color} shadow-lg`}>
      <Icon size={20} />
    </div>

    <div className="mt-4">
      <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-4xl lg:text-5xl font-black text-white">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user, loading } = useAuth();
  const isStudent = user?.role === 'student';
  const isHR = user?.role === 'hr';
  const isTeacher = user?.role === 'teacher';

  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);

  const handleExportLedger = () => toast.success('Preparing export...');
  const handleAuditSecurity = () => toast.error('Audit triggered');

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="h-60 glass-effect rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 glass-effect rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const overviewStats = [
    { icon: FiUsers, label: 'Students', value: '1,234', color: 'bg-indigo-500/10 text-indigo-400', delay: 0.1 },
    { icon: FiBook, label: 'Staff', value: '84', color: 'bg-emerald-500/10 text-emerald-400', delay: 0.2 },
    { icon: FiActivity, label: 'Attendance', value: '98.2%', color: 'bg-violet-500/10 text-violet-400', delay: 0.3 },
    { icon: FiDollarSign, label: 'Revenue', value: '+12.5%', color: 'bg-amber-500/10 text-amber-400', delay: 0.4 },
  ];

  const feedFor = () => {
    if (isHR) {
      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">HR Feed</h2>
              <p className="text-slate-400 text-sm mt-1">Pending HR tasks</p>
            </div>
            <Link href="/hr" className="text-sm text-indigo-400">Go to HR</Link>
          </div>

          <div className="space-y-4">
            {[{ time: '09:10 AM', title: 'Leave Request', desc: '3 days - John Doe' }].map((it, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center">HR</div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{it.time}</span>
                    <h4 className="text-white font-bold">{it.title}</h4>
                  </div>
                  <p className="text-slate-400 text-sm">{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (isTeacher) {
      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Teacher Tasks</h2>
              <p className="text-slate-400 text-sm mt-1">Classes & grading</p>
            </div>
            <Link href="/teachers" className="text-sm text-indigo-400">Open</Link>
          </div>

          <div className="space-y-4">
            {[{ time: '08:00 AM', title: 'Math - 10A', desc: 'Room 204' }].map((it, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center">T</div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{it.time}</span>
                    <h4 className="text-white font-bold">{it.title}</h4>
                  </div>
                  <p className="text-slate-400 text-sm">{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (isStudent) {
      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Upcoming Events</h2>
              <p className="text-slate-400 text-sm mt-1">Events relevant to students</p>
            </div>
            <Link href="/events" className="text-sm text-indigo-400">View All</Link>
          </div>

          <div className="space-y-4">
            {[{ date: 'Apr 18', title: 'Inter-House Tournament', desc: 'Stadium - 10:00 AM' }].map((ev, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center">{ev.date.split(' ')[0]}</div>
                <div>
                  <h4 className="text-white font-bold">{ev.title}</h4>
                  <p className="text-slate-400 text-sm">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">System Events</h2>
            <p className="text-slate-400 text-sm mt-1">Administrative logs</p>
          </div>
        </div>

        <div className="space-y-4">
          {[{ time: '12:45 PM', title: 'New Enrollment', desc: 'Sarah Connor joined Grade 12' }].map((it, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center">S</div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{it.time}</span>
                  <h4 className="text-white font-bold">{it.title}</h4>
                </div>
                <p className="text-slate-400 text-sm">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8 pb-20 px-4 md:px-0">
      <NoticeModal isOpen={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} />
      <MeetingModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-effect rounded-4xl p-12 lg:p-20 min-h-[460px] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase text-indigo-400 font-black"></p>
            <h1 className="leading-tight">
              <span className="block text-3xl md:text-4xl lg:text-5xl font-black gradient-text">Welcome,</span>
              <span className="block text-7xl md:text-7xl lg:text-8xl font-black gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-slate-400 mt-3">Role: {user?.role || '—'}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {isHR ? (
                <>
                  <Link href="/hr/staff" className="btn-accent btn-pill">Manage Staff</Link>
                  <Link href="/hr/payroll" className="btn-ghost btn-pill">Payroll</Link>
                </>
              ) : isTeacher ? (
                <>
                  <Link href="/teachers/classes" className="btn-accent btn-pill">My Classes</Link>
                  <Link href="/teachers/materials" className="btn-ghost btn-pill">Materials</Link>
                  <Link href="/leaves/apply" className="btn-ghost btn-pill">Apply Leave</Link>
                  <Link href="/assignments" className="btn-ghost btn-pill">Assignments</Link>
                </>
              ) : isStudent ? (
                <>
                  <Link href="/profile" className="btn-accent btn-pill">My Profile</Link>
                  <Link href="/reports/transcript" className="btn-ghost btn-pill">Transcript</Link>
                </>
              ) : (
                <>
                  <Link href="/students/add" className="btn-accent btn-pill">New Admission</Link>
                  <Link href="/reports/full" className="btn-ghost btn-pill">Full Report</Link>
                </>
              )}
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-8 w-full lg:w-[460px] self-start">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase text-indigo-400">Performance Engine</p>
                <h3 className="text-2xl font-black text-white">School Pulse</h3>
              </div>
              <div className="p-2 rounded bg-indigo-500/10">
                <FiTrendingUp className="text-indigo-400" />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {/* Attendance */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Attendance Rate</span>
                  <span className="text-sm text-white font-black">98.2%</span>
                </div>
                <div className="pulse-track">
                  <div className="pulse-fill-green" style={{ width: '98%' }} />
                </div>
              </div>

              {/* Fees */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Fee Collection</span>
                  <span className="text-sm text-white font-black">82%</span>
                </div>
                <div className="pulse-track">
                  <div className="pulse-fill-violet" style={{ width: '82%' }} />
                </div>
              </div>

              {/* Security */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">System Security</span>
                  <span className="text-sm text-white font-black">94%</span>
                </div>
                <div className="pulse-track">
                  <div className="pulse-fill-blue" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Feed + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass-effect rounded-3xl p-8">{feedFor()}</div>

        <div className="glass-effect rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-white">Quick Actions</h3>
            <div className="p-2 rounded bg-indigo-500/10">
              <FiSettings className="text-indigo-400" />
            </div>
          </div>

          <div className="space-y-3">
            {(isHR
              ? [
                  { label: 'Approve Leave', action: () => toast('Open leave approvals') },
                  { label: 'Run Payroll', action: () => toast('Payroll started') },
                ]
              : isTeacher
              ? [
                  { label: 'Upload Grades', action: () => window.location.href = '/grades/submit' },
                  { label: 'Mark Attendance', action: () => window.location.href = '/attendance/mark' },
                  { label: 'Upload Materials', action: () => window.location.href = '/teachers/materials' },
                  { label: 'Create Assignment', action: () => window.location.href = '/assignments' },
                ]
              : isStudent
              ? [
                  { label: 'View Assignments', action: () => window.location.href = '/students/assignments' },
                  { label: 'Request Leave', action: () => setIsMeetingOpen(true) },
                ]
              : [
                  { label: 'Issue Notice', action: () => setIsNoticeOpen(true) },
                  { label: 'Audit Security', action: handleAuditSecurity },
                ]
            ).map((a, i) => (
              <button key={i} onClick={a.action} className="w-full flex items-center justify-between p-3 rounded-2xl border border-white/5">
                <span className="text-sm text-white font-bold">{a.label}</span>
                <FiArrowUpRight className="text-slate-400" />
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded bg-indigo-500/5 border border-indigo-500/10">
            <p className="text-xs text-indigo-400 font-black">Summary</p>
            <p className="text-white font-bold mt-1">{isHR ? '6 pending actions' : isTeacher ? '2 classes today' : isStudent ? 'Next assignment due Apr 17' : 'All systems nominal'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
