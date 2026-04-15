'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiPlus, FiArrowLeft, FiTrash2, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const NoticeManagement = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'administrative',
    targetRoles: ['all']
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for UI demonstration
  const [notices, setNotices] = useState([
    { id: 1, title: 'Annual Sports Day 2026', content: 'Preparation for the upcoming sports week...', category: 'event', date: '2026-05-12' },
    { id: 2, title: 'Mid-Term Examination Schedule', content: 'The mid-term exams will commence from...', category: 'academic', date: '2026-06-01' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newNotice = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      setNotices([newNotice, ...notices]);
      toast.success('Notice published successfully!');
      setFormData({ title: '', content: '', category: 'administrative', targetRoles: ['all'] });
      setIsLoading(false);
    }, 1000);
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
            <h1 className="text-4xl font-black font-outfit text-white tracking-tight">Notice Board</h1>
            <p className="text-slate-500 font-inter">Broadcast Communications & Internal Announcements</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Create Notice Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-[2.5rem] p-10 border border-white/5 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FiPlus size={20} />
            </div>
            <h3 className="text-xl font-bold text-white font-outfit">Compose Notice</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-inter"
                placeholder="Notice Headline"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-inter appearance-none"
              >
                <option value="administrative">Administrative</option>
                <option value="academic">Academic</option>
                <option value="event">Campus Event</option>
                <option value="urgent">Urgent Alert</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Content</label>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-inter resize-none"
                placeholder="Detail the announcement..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-sm font-black tracking-widest uppercase transition-all shadow-xl shadow-indigo-500/20 text-white"
            >
              🚀 {isLoading ? 'Publishing...' : 'Broadcast Notice'}
            </button>
          </form>
        </motion.div>

        {/* Live Notices Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-bold text-white font-outfit">Active Feed</h3>
            <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-white/5">Real-time</span>
          </div>
          
          {notices.map((notice, index) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={notice.id}
              className="glass-effect rounded-3xl p-6 border border-white/5 relative group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  notice.category === 'urgent' ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  {notice.category}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <FiClock size={12} />
                  <span className="text-[10px] font-bold">{notice.date}</span>
                </div>
              </div>
              <h4 className="text-lg font-bold text-white mb-2 font-outfit">{notice.title}</h4>
              <p className="text-sm text-slate-400 font-inter line-clamp-2">{notice.content}</p>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                <button className="text-slate-600 hover:text-red-400 transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeManagement;
