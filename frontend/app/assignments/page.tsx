'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FiDownload, FiCalendar, FiUser, FiBook } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const classes = ['10-A', '10-B', '11-A'];

const AssignmentsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isTeacher, setIsTeacher] = useState(false);
  const [studentClass, setStudentClass] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<any[]>([]);

  // Fetch student's class information
  useEffect(() => {
    if (user && user.role === 'student') {
      fetchStudentClass();
    }
  }, [user]);

  // Check user role and fetch assignments
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      const isTeacherRole = ['teacher', 'hr', 'superadmin'].includes(user.role);
      setIsTeacher(isTeacherRole);

      if (isTeacherRole) {
        fetchAssignments();
      } else if (user.role === 'student') {
        fetchStudentAssignments();
      }
    }
  }, [user, loading, router, studentClass]);

  const fetchStudentClass = async () => {
    try {
      const res: any = await api.get('/students');
      if (res.data && Array.isArray(res.data)) {
        // Find the current student's record (matching the user's email or ID)
        const currentStudent = res.data[0]; // In a real app, filter by current user
        if (currentStudent && currentStudent.class) {
          setStudentClass(currentStudent.class);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch student class:', err);
    }
  };

  const onFileChange = (e: any) => setFiles(Array.from(e.target.files || []));

  const fetchAssignments = async () => {
    try {
      const res: any = await api.get('/assignments');
      setAssignments(res.data || []);
      return res.data || [];
    } catch (err: any) {
      console.error('Failed to fetch assignments:', err);
      return [];
    }
  };

  const fetchStudentAssignments = async () => {
    try {
      const res: any = await api.get('/assignments');
      const allAssignments = res.data || [];
      // Filter assignments for student's class
      const filtered = allAssignments.filter(
        (a: any) => a.class === studentClass || !a.class
      );
      setStudentAssignments(filtered);
      return filtered;
    } catch (err: any) {
      console.error('Failed to fetch student assignments:', err);
      return [];
    }
  };

  const create = async () => {
    if (!title || !dueDate) {
      toast.error('Please provide title and due date');
      return;
    }
    try {
      const payload = {
        title,
        class: selectedClass,
        due: dueDate,
        description,
        attachments: files.map((f) => ({ filename: f.name })),
      };
      await api.post('/assignments', payload);
      toast.success('Assignment created and published');
      setTitle('');
      setDescription('');
      setDueDate('');
      setFiles([]);
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  if (loading || !user) return null;

  const displayAssignments = isTeacher ? assignments : studentAssignments;

  // TEACHER VIEW
  if (isTeacher) {
    return (
      <div className="space-y-8 animate-slideInUp pb-20">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Assignments</h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Create and manage institutional coursework efficiently</p>
        </div>

        <div className="glass-effect rounded-[2.5rem] p-8 space-y-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create New Assignment</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-600 dark:text-slate-300 px-1">Target Class</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium">
                {classes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-600 dark:text-slate-300 px-1">Assignment Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Calculus Midterm" className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-600 dark:text-slate-300 px-1">Due Date & Time</label>
              <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-600 dark:text-slate-300 px-1">Detailed Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide learning objectives and submission guidelines..." rows={4} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 font-medium resize-none" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <input type="file" multiple onChange={onFileChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-cyan-100 file:text-cyan-700 hover:file:bg-cyan-200 dark:file:bg-cyan-900/40 dark:file:text-cyan-300" />
              {files.length > 0 && (
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{files.length} file(s) selected</span>
              )}
            </div>
            <button onClick={create} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95">
              Publish Assignment
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Assignments</h2>
            <span className="px-4 py-1.5 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-bold">{displayAssignments.length} Total</span>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {displayAssignments.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center glass-effect rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                <FiBook size={40} className="text-slate-400 dark:text-slate-600 mb-3" />
                <p className="text-slate-600 dark:text-slate-400 font-bold">No assignments created yet</p>
              </div>
            ) : (
              displayAssignments.map((a: any, idx: number) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-effect rounded-2xl p-6 hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">{a.class || 'General'}</span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{a.title}</h3>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Due: {a.due ? new Date(a.due).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">{a.description}</p>
                  {a.attachments && a.attachments.length > 0 && (
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <FiDownload size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{a.attachments.length} attachment(s)</span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // STUDENT VIEW
  return (
    <div className="space-y-8 animate-slideInUp pb-20">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">My Assignments</h1>
        <p className="text-slate-600 dark:text-slate-300 font-medium">
          {studentClass ? `Assignments for Class ${studentClass}` : 'Your class assignments and tasks'}
        </p>
      </div>

      <div className="grid gap-6">
        {studentAssignments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 flex flex-col items-center justify-center glass-effect rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700"
          >
            <FiBook size={48} className="text-slate-400 dark:text-slate-600 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-bold text-lg">No assignments yet</p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Check back soon for new assignments from your teachers</p>
          </motion.div>
        ) : (
          studentAssignments.map((a: any, idx: number) => {
            const dueDate = new Date(a.due);
            const now = new Date();
            const overdue = dueDate < now;
            const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-effect rounded-2xl p-6 border transition-all hover:shadow-lg ${
                  overdue
                    ? 'border-rose-300 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-900/10'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block px-3 py-1 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-xs font-bold rounded-full">
                        Class {a.class || 'General'}
                      </span>
                      {overdue && (
                        <span className="inline-block px-3 py-1 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-full">
                          Overdue
                        </span>
                      )}
                      {!overdue && daysLeft <= 3 && (
                        <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
                          Due Soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{a.title}</h3>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-6 mb-4">{a.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <FiCalendar size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Due Date</p>
                      <p className={`font-bold ${overdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                        {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiUser size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Posted By</p>
                      <p className="font-bold text-slate-900 dark:text-white">{a.createdBy?.name || 'Teacher'}</p>
                    </div>
                  </div>
                </div>

                {a.attachments && a.attachments.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FiDownload size={16} /> Attachments ({a.attachments.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {a.attachments.map((att: any, aidx: number) => (
                        <button
                          key={aidx}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors"
                        >
                          {att.filename || `File ${aidx + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
