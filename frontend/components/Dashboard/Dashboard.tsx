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
        className="glass-panel relative overflow-hidden rounded-[2.5rem] border border-white/10 px-8 py-10 lg:px-12 lg:py-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_28%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="badge-pill">{profile.badge}</span>
            <div className="mt-5 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan-200/65">School Management System</p>
              <h1 className="text-balance text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
                <span className="gradient-text">Welcome back,</span>
                <br />
                {user.name}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 lg:text-lg">{profile.strapline}</p>
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
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/70">Operational Pulse</p>
                <h3 className="mt-2 text-2xl font-black text-white">Performance Surface</h3>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${profile.accent}`}>
                <FiStar className="text-xl text-white" />
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {[
                { label: 'Execution Readiness', value: '96%', width: '96%', tone: 'from-cyan-400 to-blue-600' },
                { label: 'Engagement Rhythm', value: user.role === 'student' ? '88%' : '92%', width: user.role === 'student' ? '88%' : '92%', tone: 'from-orange-400 to-amber-500' },
                { label: 'System Confidence', value: '94%', width: '94%', tone: 'from-fuchsia-400 to-violet-600' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</span>
                    <span className="text-sm font-black text-white">{item.value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full bg-gradient-to-r ${item.tone}`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-slate-950/35 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Session Summary</p>
              <p className="mt-3 text-lg font-bold text-white">{profile.summary}</p>
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
            className="glass-panel rounded-[2rem] p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">{stat.label}</p>
                <h3 className="mt-4 text-3xl font-black text-white">{stat.value}</h3>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.tone}`}>
                <stat.icon className="text-xl text-white" />
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.article {...statMotion} className="glass-panel rounded-[2rem] p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Priority Feed</p>
              <h3 className="mt-2 text-2xl font-black text-white">Role Dashboard Stream</h3>
            </div>
            <div className="badge-pill">
              <FiCheckCircle />
              Active
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {feed.map((item) => (
              <div key={item.title} className="surface-highlight p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200/70">{item.meta}</p>
                    <h4 className="mt-2 text-lg font-bold text-white">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                  </div>
                  <FiArrowUpRight className="mt-1 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article {...statMotion} transition={{ duration: 0.55, delay: 0.15 }} className="glass-panel rounded-[2rem] p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Quick Actions</p>
              <h3 className="mt-2 text-2xl font-black text-white">Fast Operations</h3>
            </div>
            <FiTrendingUp className="text-xl text-cyan-300" />
          </div>

          <div className="mt-7 space-y-3">
            {quickActions.map((item) =>
              isLinkAction(item) ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white transition hover:bg-white/10"
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  <FiArrowUpRight className="text-slate-400" />
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => (item.action === 'notice' ? setIsNoticeOpen(true) : setIsMeetingOpen(true))}
                  className="flex w-full items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white transition hover:bg-white/10"
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  <FiArrowUpRight className="text-slate-400" />
                </button>
              )
            )}
          </div>

          <div className="mt-7 rounded-[1.7rem] border border-dashed border-cyan-300/20 bg-cyan-400/5 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200/70">Accessible Modules</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {menu.slice(0, 8).map((item) => (
                <span key={item.href} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200">
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
