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
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-slate-400">Select date and mark students present/absent</p>
      </div>

      <div className="glass-effect p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <DatePicker selected={date} onChange={(d: Date | null) => setDate(d)} />
          <button className="btn-ghost btn-pill" onClick={() => setDate(new Date())}>Today</button>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={editPast} onChange={() => setEditPast(p => !p)} />
            <span className="text-slate-400">Edit past</span>
          </label>
          <button className="btn-accent btn-pill" onClick={save}>Save</button>
        </div>

        <div className="mt-4 space-y-2">
          {students.map(s => (
            <div key={s.id} className="flex items-center justify-between">
              <div>{s.name}</div>
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
