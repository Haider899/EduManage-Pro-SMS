'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiUsers, FiDollarSign, FiFileText, FiTrendingUp, FiArrowLeft, FiPieChart } from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import api from '@/lib/api';
import Link from 'next/link';

const FullReportPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res: any = await api.get('/reports/full');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch report data');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
    </div>
  );

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
  
  const stats = [
    { label: 'Total Students', value: data?.overview.totalStudents, icon: FiUsers, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Staff Strength', value: data?.overview.totalTeachers, icon: FiActivity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Announcements', value: data?.overview.totalNotices, icon: FiFileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'System Health', value: '100%', icon: FiTrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  // Formatting revenue data for charts
  const revenueData = data?.trends.revenue.map((val: number, i: number) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: val
  }));

  const admissionData = data?.trends.admissions.map((val: number, i: number) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    count: val
  }));

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/"
            className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <FiArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">Intelligence Report</h1>
            <p className="text-slate-500 text-sm font-inter tracking-widest">REAL-TIME SYSTEM ANALYTICS // ID: {new Date().getTime().toString(16).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-effect rounded-3xl p-6 border border-white/5 relative overflow-hidden group"
          >
            <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white font-outfit">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Revenue Trend */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-[2.5rem] border border-white/5 p-8 h-[450px] flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black font-outfit text-white uppercase tracking-wider flex items-center gap-3">
              <FiDollarSign className="text-indigo-400" />
              Financial Trend
            </h3>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Gross Revenue</span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Admission Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-[2.5rem] border border-white/5 p-8 h-[450px] flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black font-outfit text-white uppercase tracking-wider flex items-center gap-3">
              <FiUsers className="text-emerald-400" />
              Admission Velocity
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase tracking-widest">New Entities</span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={admissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Distribution Pie Chart Placeholder */}
      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-effect rounded-[2rem] border border-white/5 p-8 flex items-center justify-between shadow-xl"
        >
          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-2">Institutional Balance</h4>
            <p className="text-slate-500 text-xs">Sector-wise distribution of active members</p>
          </div>
          <div className="h-32 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Students', value: data?.overview.totalStudents || 0 },
                    { name: 'Teachers', value: data?.overview.totalTeachers || 0 },
                  ]}
                  innerRadius={25}
                  outerRadius={35}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#10b981" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        <div className="glass-effect rounded-[2rem] border border-white/5 p-8 flex flex-col items-center justify-center text-center shadow-xl group">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
            <FiPieChart size={24} />
          </div>
          <p className="text-white font-black uppercase text-sm mb-1 tracking-widest">Global Audit</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Integrated Data Lake Synchronization: Active</p>
        </div>
      </div>
    </div>
  );
};

export default FullReportPage;
