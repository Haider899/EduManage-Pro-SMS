'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowLeft, FiTrash2, FiClock } from 'react-icons/fi';
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
            className="h-12 w-12 rounded-2xl border border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white transition-all hover:scale-105"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">Notice Board</h1>
            <p className="text-slate-500 dark:text-slate-400 font-inter">Create and manage school announcements</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Create Notice Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <FiPlus size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Compose Notice</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="form-label">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-field"
                placeholder="Notice Headline"
              />
            </div>

            <div className="space-y-2">
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-field appearance-none"
              >
                <option value="administrative">Administrative</option>
                <option value="academic">Academic</option>
                <option value="event">Campus Event</option>
                <option value="urgent">Urgent Alert</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="form-label">Message</label>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="form-field resize-none"
                placeholder="Detail the announcement..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-accent py-4 rounded-2xl text-sm font-black tracking-widest uppercase transition-all shadow-xl shadow-blue-500/20 text-white"
            >
              {isLoading ? 'Publishing...' : 'Publish Notice'}
            </button>
          </form>
        </motion.div>

        {/* Live Notices Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Active Notices</h3>
            <span className="badge-pill">Latest</span>
          </div>
          
          {notices.map((notice, index) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={notice.id}
              className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-white/10 relative group hover:border-cyan-500/30 transition-all"
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
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-outfit">{notice.title}</h4>
              <p className="text-sm text-slate-400 font-inter line-clamp-2">{notice.content}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 flex justify-end">
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
