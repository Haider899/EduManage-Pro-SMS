"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiDollarSign,
  FiFileText,
  FiMessageSquare,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getRoleMenu, roleProfiles } from '@/lib/rbac';
import { MeetingModal, NoticeModal } from './QuickActionModals';
import CircularProgress from '../Common/CircularProgress';

const roleStats = {
  superadmin: [
    { label: 'Institution Reach', value: '12 Campuses', icon: FiShield, tone: 'from-cyan-400 to-blue-600' },
    { label: 'Open Workflows', value: '28 Active', icon: FiClipboard, tone: 'from-orange-400 to-amber-500' },
    { label: 'Collection Health', value: '91.6%', icon: FiDollarSign, tone: 'from-emerald-400 to-teal-500' },
    { label: 'Security Index', value: '94.3%', icon: FiActivity, tone: 'from-fuchsia-400 to-violet-500' },
  ],
  admin: [
    { label: 'Active Students', value: '1,284', icon: FiUsers, tone: 'from-cyan-400 to-blue-600' },
    { label: 'Faculty Strength', value: '87', icon: FiBookOpen, tone: 'from-orange-400 to-amber-500' },
    { label: 'Attendance Trend', value: '98.2%', icon: FiActivity, tone: 'from-emerald-400 to-teal-500' },
    { label: 'Monthly Fees', value: '82%', icon: FiDollarSign, tone: 'from-fuchsia-400 to-violet-500' },
  ],
  hr: [
    { label: 'Pending Admissions', value: '36', icon: FiUsers, tone: 'from-cyan-400 to-blue-600' },
    { label: 'Leave Requests', value: '8', icon: FiCalendar, tone: 'from-orange-400 to-amber-500' },
    { label: 'Attendance Cases', value: '12', icon: FiActivity, tone: 'from-emerald-400 to-teal-500' },
    { label: 'Staff Onboarding', value: '5', icon: FiShield, tone: 'from-fuchsia-400 to-violet-500' },
  ],
  teacher: [
    { label: 'Classes Today', value: '6', icon: FiCalendar, tone: 'from-cyan-400 to-blue-600' },
    { label: 'Pending Grading', value: '42', icon: FiBookOpen, tone: 'from-orange-400 to-amber-500' },
    { label: 'Attendance Due', value: '2 Sections', icon: FiClipboard, tone: 'from-emerald-400 to-teal-500' },
    { label: 'Shared Material', value: '18 Files', icon: FiFileText, tone: 'from-fuchsia-400 to-violet-500' },
  ],
  student: [
    { label: 'Attendance Score', value: '96%', icon: FiActivity, tone: 'from-cyan-400 to-blue-600' },
    { label: 'Current GPA', value: '3.8', icon: FiTrendingUp, tone: 'from-orange-400 to-amber-500' },
    { label: 'Assignments', value: '4 Due', icon: FiClipboard, tone: 'from-emerald-400 to-teal-500' },
    { label: 'Notices', value: '3 New', icon: FiMessageSquare, tone: 'from-fuchsia-400 to-violet-500' },
  ],
} as const;

type QuickAction = { label: string; href: string } | { label: string; action: 'notice' | 'meeting' };

const isLinkAction = (item: QuickAction): item is { label: string; href: string } => 'href' in item;

const roleFeeds = {
  superadmin: [
    { title: 'Access review cycle', detail: '3 privileged accounts need verification before Friday.', meta: 'Governance' },
    { title: 'Academic variance', detail: 'Grade 10 science dipped 4.2% this week versus target.', meta: 'Analytics' },
    { title: 'Fee anomaly alert', detail: 'Campus B collected 11% below rolling forecast.', meta: 'Finance' },
  ],
  admin: [
    { title: 'Enrollment approvals', detail: '14 student files are ready for final admission clearance.', meta: 'Admissions' },
    { title: 'Notice cadence', detail: 'Assembly memo drafted for Monday opening session.', meta: 'Comms' },
    { title: 'Report snapshot', detail: 'Operations report is ready for export and circulation.', meta: 'Reporting' },
  ],
  hr: [
    { title: 'Leave balancing', detail: 'Two overlapping teacher leave requests need rescheduling.', meta: 'HR' },
    { title: 'New intake', detail: 'Six applications require parent verification and class mapping.', meta: 'Admissions' },
    { title: 'Attendance follow-up', detail: 'Chronic absence cases need counselor handoff.', meta: 'Care' },
  ],
  teacher: [
    { title: 'Assessment queue', detail: 'Math quiz marks for Grade 9-B are pending submission.', meta: 'Grades' },
    { title: 'Material update', detail: 'Upload chapter slides before the afternoon lab session.', meta: 'Resources' },
    { title: 'Leave reminder', detail: 'Submit next week invigilation constraints by end of day.', meta: 'Faculty' },
  ],
  student: [
    { title: 'Assignment deadline', detail: 'Science worksheet closes tomorrow at 5:00 PM.', meta: 'Coursework' },
    { title: 'Timetable change', detail: 'Friday lab moved to Block C, Room 204.', meta: 'Schedule' },
    { title: 'Progress pulse', detail: 'Your attendance improved by 2% over the last two weeks.', meta: 'Growth' },
  ],
} as const;

const roleQuickActions = {
  superadmin: [
    { label: 'Broadcast Notice', action: 'notice' },
    { label: 'Schedule Governance Review', action: 'meeting' },
    { label: 'Open Full Report', href: '/reports/full' },
    { label: 'Manage Staff Access', href: '/staff/add' },
  ],
  admin: [
    { label: 'Admit Student', href: '/students/add' },
    { label: 'Open Reports', href: '/reports/full' },
    { label: 'Create Notice', action: 'notice' },
    { label: 'Review Fees', href: '/fees' },
  ],
  hr: [
    { label: 'Enroll Student', href: '/students/add' },
    { label: 'Process Leave Desk', href: '/leaves/manage' },
    { label: 'Check Fees', href: '/fees' },
    { label: 'Open Notices', href: '/notices/manage' },
  ],
  teacher: [
    { label: 'Mark Attendance', href: '/attendance/mark' },
    { label: 'Update Grades', href: '/grades' },
    { label: 'Upload Material', href: '/teachers/materials' },
    { label: 'Create Assignment', href: '/assignments' },
  ],
  student: [
    { label: 'View Grades', href: '/grades' },
    { label: 'Open Timetable', href: '/timetable' },
    { label: 'My Profile', href: '/profile' },
    { label: 'Attendance Log', href: '/attendance' },
  ],
} as const;

const statMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55 },
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);

  const profile = user ? roleProfiles[user.role] : null;
  const menu = useMemo(() => getRoleMenu(user?.role), [user]);

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="h-72 rounded-[2rem] glass-panel" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-[2rem] glass-panel" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const stats = roleStats[user.role];
  const feed = roleFeeds[user.role];
  const quickActions = roleQuickActions[user.role] as readonly QuickAction[];

  return (
    <div className="space-y-8 pb-20">
      <NoticeModal isOpen={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} />
      <MeetingModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="glass-panel relative overflow-hidden rounded-[2.5rem] px-8 py-10 lg:px-12 lg:py-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent_28%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="badge-pill">{profile.badge}</span>
            <div className="mt-5 space-y-4">
              <p className="text-sm font-black uppercase tracking-[0.34em] text-cyan-600 dark:text-cyan-200/65">School Management System</p>
              <h1 className="text-balance text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
                <span className="gradient-text">Welcome back,</span>
                <br />
                {user.name}
              </h1>
              <p className="max-w-2xl text-base font-medium leading-7 text-slate-600 dark:text-slate-300 lg:text-lg">{profile.strapline}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {quickActions.slice(0, 2).map((item) =>
                isLinkAction(item) ? (
                  <Link key={item.label} href={item.href} className="btn-accent btn-pill">
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => (item.action === 'notice' ? setIsNoticeOpen(true) : setIsMeetingOpen(true))}
                    className="btn-accent btn-pill"
                  >
                    {item.label}
                  </button>
                )
              )}
              <button
                onClick={() => toast.success(`Role scope: ${user.role}`)}
                className="btn-ghost btn-pill"
              >
                View Access Scope
              </button>
            </div>
          </div>

          <div className="surface-highlight p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-200/70">Operational Pulse</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Performance Surface</h3>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${profile.accent} shadow-lg`}>
                <FiStar className="text-xl text-white" />
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center gap-4 flex-wrap">
              {[
                { label: 'Readiness', value: 96, color: '#0ea5e9' },
                { label: 'Engagement', value: user.role === 'student' ? 88 : 92, color: '#f59e0b' },
                { label: 'Confidence', value: 94, color: '#d946ef' },
              ].map((item) => (
                <CircularProgress
                  key={item.label}
                  percentage={item.value}
                  size={80}
                  strokeWidth={8}
                  color={item.color}
                  label={item.label}
                />
              ))}
            </div>

            <div className="mt-8 rounded-[1.7rem] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-950/35 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Session Summary</p>
              <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white leading-relaxed">{profile.summary}</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.article
            key={stat.label}
            {...statMotion}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className="glass-panel rounded-[2rem] p-7 group hover:translate-y-[-4px] transition-all shadow-sm hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500 group-hover:text-cyan-600 transition-colors">{stat.label}</p>
                <h3 className="mt-4 text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.tone} shadow-lg`}>
                <stat.icon className="text-xl text-white" />
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Overall Attendance", sub: "Institution Wide", val: 92, col: "#0ea5e9" },
          { label: "Fee Collection", sub: "Monthly Target", val: 85, col: "#f59e0b" },
          { label: "Course Completion", sub: "Academic Year", val: 78, col: "#d946ef" }
        ].map((item, i) => (
          <motion.article 
            key={item.label}
            {...statMotion} 
            transition={{ delay: i * 0.1 }}
            className="glass-panel rounded-[2.5rem] p-8 flex flex-col items-center shadow-sm hover:shadow-xl transition-all"
          >
            <CircularProgress
              percentage={item.val}
              size={160}
              strokeWidth={14}
              color={item.col}
              label={item.label}
              subLabel={item.sub}
            />
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.article {...statMotion} className="glass-panel rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Priority Feed</p>
              <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">Role Dashboard Stream</h3>
            </div>
            <div className="badge-pill shadow-sm">
              <FiCheckCircle className="text-cyan-600 dark:text-cyan-400" />
              Active
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {feed.map((item) => (
              <div key={item.title} className="surface-highlight p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-200/70">{item.meta}</p>
                    <h4 className="mt-2 text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300 font-medium">{item.detail}</p>
                  </div>
                  <FiArrowUpRight className="mt-1 text-slate-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article {...statMotion} transition={{ duration: 0.55, delay: 0.15 }} className="glass-panel rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Quick Actions</p>
              <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">Fast Operations</h3>
            </div>
            <FiTrendingUp className="text-xl text-cyan-600 dark:text-cyan-300" />
          </div>

          <div className="mt-8 space-y-3">
            {quickActions.map((item) =>
              isLinkAction(item) ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-5 py-4 text-slate-700 dark:text-white transition hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm font-bold"
                >
                  <span className="text-sm">{item.label}</span>
                  <FiArrowUpRight className="text-slate-400" />
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => (item.action === 'notice' ? setIsNoticeOpen(true) : setIsMeetingOpen(true))}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-5 py-4 text-slate-700 dark:text-white transition hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm font-bold"
                >
                  <span className="text-sm">{item.label}</span>
                  <FiArrowUpRight className="text-slate-400" />
                </button>
              )
            )}
          </div>

          <div className="mt-8 rounded-[2rem] border border-dashed border-cyan-500/30 bg-cyan-500/5 p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-200/70">Accessible Modules</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {menu.slice(0, 8).map((item) => (
                <span key={item.href} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-200 shadow-sm">
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      </section>
    </div>
  );
};

export default Dashboard;
