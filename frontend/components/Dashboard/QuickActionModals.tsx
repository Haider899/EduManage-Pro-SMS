'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, icon: Icon, color, children }: ModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl glass-panel rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        >
          <div className="p-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/5">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${getAccentClasses(color)}`}>
                <Icon size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">{title}</h3>
              </div>
            </div>
            <button onClick={onClose} className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
              <FiX size={20} />
            </button>
          </div>
          <div className="p-8">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const getAccentClasses = (color: string) => {
  if (color.includes('amber')) {
    return 'bg-amber-500/10 text-amber-400';
  }

  if (color.includes('indigo')) {
    return 'bg-indigo-500/10 text-indigo-400';
  }

  return 'bg-cyan-500/10 text-cyan-400';
};

export const NoticeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({ title: '', content: '', category: 'administrative' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/notices', formData);
      toast.success('Notice published successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to publish notice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Notice" icon={FiSend} color="text-amber-400">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="form-label">Notice Title</label>
          <input 
            required 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-field"
            placeholder="Enter notice title"
          />
        </div>
        <div className="space-y-2">
          <label className="form-label">Message</label>
          <textarea 
            required 
            rows={4}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="form-field resize-none"
            placeholder="Type notice details here"
          />
        </div>
        <button type="submit" disabled={isLoading} className="w-full h-14 btn-accent rounded-2xl text-white font-black uppercase tracking-widest transition-all disabled:opacity-50">
          {isLoading ? 'Publishing...' : 'Publish Notice'}
        </button>
      </form>
    </Modal>
  );
};

export const MeetingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({ title: '', description: '', startTime: '', endTime: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/meetings', formData);
      toast.success('Meeting scheduled successfully');
      onClose();
    } catch (err) {
      toast.error('Session scheduling failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Meeting" icon={FiCalendar} color="text-indigo-400">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="form-label">Meeting Title</label>
          <input 
            required 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-field"
            placeholder="Enter meeting title"
          />
        </div>
        <div className="space-y-2">
          <label className="form-label">Description</label>
          <textarea 
            required 
            rows={3}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-field"
            placeholder="What is this meeting about?"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="form-label">Start Time</label>
            <input 
              type="datetime-local" 
              required 
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="form-field text-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="form-label">End Time</label>
            <input 
              type="datetime-local" 
              required 
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="form-field text-xs"
            />
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="w-full h-14 btn-accent rounded-2xl text-white font-black uppercase tracking-widest transition-all disabled:opacity-50">
          {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
        </button>
      </form>
    </Modal>
  );
};
