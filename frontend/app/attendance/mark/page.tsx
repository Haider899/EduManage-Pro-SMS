'use client';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const MarkAttendance = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(new Date());
  const [students, setStudents] = useState<any[]>([
    { id: 's1', name: 'Alice', present: true },
    { id: 's2', name: 'Bob', present: false },
    { id: 's3', name: 'Charlie', present: true },
  ]);
  const [editPast, setEditPast] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || !['teacher', 'hr', 'superadmin'].includes(user.role)) {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const toggle = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  const save = async () => {
    try {
      const entries = students.map(s => ({ student: s.id, present: !!s.present }));
      await api.post('/attendance/bulk', { date: date?.toISOString(), entries });
      toast.success('Attendance saved');
    } catch (err: any) {
      toast.error(err.response?.message || 'Failed to save attendance');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-slideInUp">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Mark Attendance</h1>
        <p className="text-slate-500 dark:text-slate-400">Select a date and mark each student present or absent</p>
      </div>

      <div className="form-card">
        <div className="flex flex-wrap items-center gap-4">
          <DatePicker selected={date} onChange={(d: Date | null) => setDate(d)} className="form-field" />
          <button className="btn-ghost btn-pill" onClick={() => setDate(new Date())}>Today</button>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={editPast} onChange={() => setEditPast(p => !p)} />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Edit past records</span>
          </label>
          <button className="btn-accent btn-pill" onClick={save}>Save</button>
        </div>

        <div className="mt-6 space-y-3">
          {students.map(s => (
            <div key={s.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/60 px-5 py-4 dark:border-white/10 dark:bg-white/5">
              <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
              <div>
                <label className="swap">
                  <input type="checkbox" checked={s.present} onChange={() => toggle(s.id)} />
                  <span className="swap-on">Present</span>
                  <span className="swap-off">Absent</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
